import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/property_calendar/widgets/host_booking_detail.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/listing_list_cubit/listing_list_cubit.dart';
import 'package:project4_flutter/shared/bloc/property_calendar_cubit/property_calendar_cubit.dart';
import 'package:project4_flutter/shared/bloc/property_calendar_cubit/property_calendar_state.dart';
import 'package:project4_flutter/shared/widgets/bold_text.dart';
import 'package:project4_flutter/shared/widgets/custom_input_form.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
// import 'package:syncfusion_flutter_calendar/calendar.dart';

class PropertyCalendar extends StatefulWidget {
  const PropertyCalendar({required this.propertyId, super.key});

  final int propertyId;

  @override
  State<PropertyCalendar> createState() => _PropertyCalendarState();
}

class _PropertyCalendarState extends State<PropertyCalendar> {
  final TextEditingController _prices = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  PropertyCalendarCubit getPropertyCalendarCubit() {
    return context.read<PropertyCalendarCubit>();
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    getPropertyCalendarCubit().fetchBooking(widget.propertyId);
  }

  List<BookingMinimizeDto> _getDataSource() {
    return getPropertyCalendarCubit().bookings;
  }

  String returnPrice(DateTime date) {
    var now = DateTime.now();
    var nowDate = DateTime(now.year, now.month, now.day);
    if (date.isBefore(nowDate)) {
      return "";
    }

    if (getPropertyCalendarCubit().bookings.where(
      (booking) {
        return booking.bookDateDetails.where(
          (bookDate) {
            return bookDate.night.isAtSameMomentAs(date);
          },
        ).isNotEmpty;
      },
    ).isEmpty) {
      PropertyExceptionDate? exceptionDate =
          getPropertyCalendarCubit().property!.propertyExceptionDates.where(
        (exception) {
          return exception.date.isAtSameMomentAs(date);
        },
      ).firstOrNull;

      if (exceptionDate != null) {
        return "${exceptionDate.basePrice}\$";
      }

      return "${getPropertyCalendarCubit().property!.basePrice}\$";
    }

    return "";
  }

  Color getColor(DateTime date) {
    var now = DateTime.now();
    if (date.isBefore(DateTime(now.year, now.month, now.day))) {
      return const Color.fromARGB(255, 235, 235, 235);
    }

    if (getPropertyCalendarCubit().selectedDate.contains(date)) {
      return Colors.black;
    }

    if (getPropertyCalendarCubit()
        .property!
        .propertyNotAvailableDates
        .where(
          (element) => element.date.isAtSameMomentAs(date),
        )
        .isNotEmpty) {
      return const Color.fromARGB(255, 180, 181, 182);
    }

    return Colors.white;
  }

  BookingMinimizeDto? checkIfClickBooking(DateTime date) {
    BookingMinimizeDto? booking = getPropertyCalendarCubit().bookings.where(
      (booking) {
        return booking.bookDateDetails.where(
          (bookDate) {
            return bookDate.night.isAtSameMomentAs(date);
          },
        ).isNotEmpty;
      },
    ).firstOrNull;

    return booking;
  }

  List<double> getMinMax() {
    List<double> priceList =
        getPropertyCalendarCubit().selectedDate.map((date) {
      var exception = getPropertyCalendarCubit()
          .property!
          .propertyExceptionDates
          .where((exception) => exception.date.isAtSameMomentAs(date))
          .firstOrNull;

      if (exception == null) {
        return getPropertyCalendarCubit().property!.basePrice;
      } else {
        return exception.basePrice;
      }
    }).toList();

    priceList.sort();

    if (priceList.length == 1 ||
        priceList[0] == priceList[priceList.length - 1]) {
      return [priceList[0]];
    }

    return [priceList[0], priceList[priceList.length - 1]];
  }

  bool isOpenable() {
    return getPropertyCalendarCubit().selectedDate.where((date) {
      return getPropertyCalendarCubit()
          .property!
          .propertyNotAvailableDates
          .where(
        (element) {
          return element.date.isAtSameMomentAs(date);
        },
      ).isNotEmpty;
    }).isNotEmpty;
  }

  Future onReFetch() async {
    await context.read<ListingListCubit>().reFetch();
    await getPropertyCalendarCubit().fetchBooking(widget.propertyId);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    _prices.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () {
        return getPropertyCalendarCubit().fetchBooking(widget.propertyId);
      },
      child: BlocBuilder<PropertyCalendarCubit, PropertyCalendarState>(
        builder: (context, state) {
          List<BookingMinimizeDto> bookings =
              getPropertyCalendarCubit().bookings;
          bool loading = getPropertyCalendarCubit().isLoading;

          if (loading) {
            return const Scaffold(
              body: LoadingIcon(size: 50),
            );
          }
          if (bookings.isNotEmpty) {
            return Scaffold(
              endDrawer: getPropertyCalendarCubit().selectedDate.isNotEmpty
                  ? buildDrawer()
                  : null,
              appBar: AppBar(
                toolbarHeight: 50,
              ),
              body: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: SizedBox(
                  height: MediaQuery.of(context).size.height - 85,
                  child: SfCalendar(
                    onSelectionChanged: (CalendarSelectionDetails details) {
                      final startDate = details.date;
                      final endDate =
                          details.resource; // If using resource-based selection
                      print('Selected date range: $startDate to $endDate');
                    },
                    onTap: (calendarTapDetails) {
                      var booking =
                          checkIfClickBooking(calendarTapDetails.date!);

                      if (booking != null) {
                        Navigator.push(context, MaterialPageRoute(
                          builder: (context) {
                            return HostBookingDetail(booking: booking);
                          },
                        ));
                      } else {
                        getPropertyCalendarCubit()
                            .onChangeSelectedDate(calendarTapDetails.date);
                      }
                    },
                    monthViewSettings: const MonthViewSettings(
                      appointmentDisplayMode:
                          MonthAppointmentDisplayMode.appointment,
                      appointmentDisplayCount:
                          1, // Maximum appointments displayed
                      monthCellStyle: MonthCellStyle(),
                    ),
                    monthCellBuilder:
                        (BuildContext buildContext, MonthCellDetails details) {
                      return Container(
                        decoration: BoxDecoration(
                            border: Border.all(color: Colors.black, width: 0.1),
                            color: getColor(details.date)),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              details.date.day.toString(),
                              style: TextStyle(
                                  color: !getPropertyCalendarCubit()
                                          .selectedDate
                                          .contains(details.date)
                                      ? Colors.black
                                      : Colors.white,
                                  fontWeight: FontWeight.bold),
                            ),
                            Text(
                              returnPrice(details.date),
                              style: TextStyle(
                                color: !getPropertyCalendarCubit()
                                        .selectedDate
                                        .contains(details.date)
                                    ? Colors.black
                                    : Colors.white,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    appointmentBuilder: (appointmentContext,
                        CalendarAppointmentDetails calendarAppointmentDetails) {
                      Appointment booking =
                          calendarAppointmentDetails.appointments.first;
                      GlobalKey containerKey = GlobalKey();

                      return Container(
                        key: containerKey,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(25),
                          color: booking.color,
                        ),
                        child: Row(
                          children: [
                            AdvancedAvatar(
                              name: "room",
                              foregroundDecoration: BoxDecoration(
                                  border:
                                      Border.all(color: Colors.red, width: 2),
                                  borderRadius: BorderRadius.circular(50)),
                              statusAlignment: Alignment.topRight,
                              image: booking.notes != null
                                  ? NetworkImage(booking
                                      .notes!) // Assuming cardAvatar is a URL
                                  : null,
                              size: 40,
                              child: Text(
                                booking.subject,
                                style: const TextStyle(color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    view: CalendarView.month,
                    dataSource: BookingDataSource(
                      _getDataSource(),
                    ),
                  ),
                ),
              ),
            );
          }

          return const Text("Loading");
        },
      ),
    );
  }

  Drawer buildDrawer() {
    return Drawer(
      child: Builder(
        builder: (context) {
          List<double> minMaxPrices = getMinMax();
          return Container(
            padding: const EdgeInsets.symmetric(
              vertical: 40,
              horizontal: 20,
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    BoldText(
                      text:
                          "${getPropertyCalendarCubit().selectedDate.length} nights",
                      fontSize: 25,
                    ),
                    IconButton(
                      onPressed: () {
                        getPropertyCalendarCubit().clearSelectedDate();
                        Scaffold.of(context).closeEndDrawer();
                      },
                      icon: const Icon(Icons.close),
                    )
                  ],
                ),
                const SizedBox(
                  height: 20,
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 10),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: Colors.black,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    color: const Color.fromARGB(255, 240, 240, 240),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextButton(
                          style: TextButton.styleFrom(
                            backgroundColor: isOpenable() == false
                                ? Colors.black
                                : const Color.fromARGB(255, 240, 240, 240),
                          ),
                          onPressed: () {
                            var body = {
                              'propertyId': widget.propertyId,
                              'dates': getPropertyCalendarCubit()
                                  .selectedDate
                                  .map(
                                    (e) => DateFormat("yyyy-MM-dd").format(e),
                                  )
                                  .toList()
                            };
                            getPropertyCalendarCubit().openDate(body);
                            Scaffold.of(context).closeEndDrawer();
                          },
                          child: Text(
                            "Open",
                            style: TextStyle(
                              color: isOpenable() == false
                                  ? Colors.white
                                  : Colors.black,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(
                        width: 5,
                      ),
                      Expanded(
                        child: TextButton(
                          style: TextButton.styleFrom(
                            backgroundColor: !isOpenable() == false
                                ? Colors.black
                                : const Color.fromARGB(255, 240, 240, 240),
                          ),
                          onPressed: () {
                            var body = {
                              'propertyId': widget.propertyId,
                              'dates': getPropertyCalendarCubit()
                                  .selectedDate
                                  .map(
                                    (e) => DateFormat("yyyy-MM-dd").format(e),
                                  )
                                  .toList()
                            };
                            getPropertyCalendarCubit().blockDate(body);
                            Scaffold.of(context).closeEndDrawer();
                          },
                          child: Text(
                            "Block nights",
                            style: TextStyle(
                              color: !isOpenable() == false
                                  ? Colors.white
                                  : Colors.black,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                InkWell(
                  onTap: () {
                    getPropertyCalendarCubit().onChangeEditPrice();
                  },
                  child: Container(
                    width: MediaQuery.of(context).size.width,
                    decoration: BoxDecoration(
                        border: Border.all(
                            color: Colors.black.withValues(alpha: 0.4),
                            width: 1),
                        borderRadius: BorderRadius.circular(25)),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 20),
                    child: minMaxPrices.length == 1
                        ? BoldText(
                            text: "\$ ${minMaxPrices[0]}",
                            fontSize: 25,
                          )
                        : BoldText(
                            text:
                                "\$ ${minMaxPrices[0]} - \$ ${minMaxPrices[1]}",
                            fontSize: 25,
                          ),
                  ),
                ),
                const SizedBox(
                  height: 50,
                ),
                if (getPropertyCalendarCubit().isEditPrice)
                  Column(
                    children: [
                      Form(
                        key: _formKey,
                        child: CustomInputForm(
                            inputController: _prices,
                            validation: (value) {
                              double? number = double.tryParse(value!);

                              if (number == null) {
                                return "Prices cannot be text";
                              }

                              if (number < 0) {
                                return "Price cannot below 0";
                              }
                              return null;
                            },
                            labelText: "Edit prices",
                            isPassword: false),
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                      RedButton(
                          action: () {
                            if (_formKey.currentState!.validate()) {
                              var body = {
                                'propertyId': widget.propertyId,
                                'price': _prices.text,
                                'dates': getPropertyCalendarCubit()
                                    .selectedDate
                                    .map(
                                      (e) => DateFormat("yyyy-MM-dd").format(e),
                                    )
                                    .toList()
                              };
                              getPropertyCalendarCubit()
                                  .updateExceptionDate(body);
                              Scaffold.of(context).closeEndDrawer();
                            }
                          },
                          text: "Confirm")
                    ],
                  )
              ],
            ),
          );
        },
      ),
    );
  }
}

class BookingDataSource extends CalendarDataSource {
  BookingDataSource(List<BookingMinimizeDto> source) {
    appointments = source.map((booking) {
      return Appointment(
        notes: booking.customer.avatar,
        subject: booking.customer.firstName,
        startTime: booking.checkInDay,
        endTime: booking.checkOutDay.subtract(const Duration(days: 1)),
        color: const Color.fromARGB(255, 50, 153, 158),
        isAllDay: true,
      );
    }).toList();
  }

  @override
  DateTime getStartTime(int index) {
    return appointments![index].from;
  }

  @override
  DateTime getEndTime(int index) {
    return appointments![index].to;
  }

  @override
  String getSubject(int index) {
    return appointments![index].eventName;
  }

  @override
  Color getColor(int index) {
    return appointments![index].background;
  }

  @override
  bool isAllDay(int index) {
    return appointments![index].isAllDay;
  }
}
