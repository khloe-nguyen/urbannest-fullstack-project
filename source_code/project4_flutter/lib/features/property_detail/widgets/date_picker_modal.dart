import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/models/property.dart';
import 'package:project4_flutter/features/property_detail/widgets/show_popup.dart';
import 'package:project4_flutter/shared/bloc/booking/date_booking.dart';
import 'package:project4_flutter/shared/bloc/booking/guest_booking.dart';
import 'package:project4_flutter/shared/bloc/property_cubit/property_cubit.dart';
import 'package:project4_flutter/shared/bloc/property_cubit/property_state.dart';
import 'package:project4_flutter/shared/widgets/format_date_range.dart';
import 'package:project4_flutter/shared/widgets/format_dolar.dart';
import 'package:table_calendar/table_calendar.dart';

class DatePickerModal extends StatefulWidget {
  final double startArv;

  const DatePickerModal(
      {super.key, required this.startArv, required this.propertyId});

  final int propertyId;

  @override
  State<DatePickerModal> createState() => _DatePickerModalState();
}

class _DatePickerModalState extends State<DatePickerModal> {
  DateTime firstDay = DateTime.now();
  DateTime lastDay = DateTime.now();
  double? startArv;
  DateTime? tempStart;
  DateTime? tempEnd;

  TextEditingController adultController = TextEditingController();
  TextEditingController childrenController = TextEditingController();

  String? guestValidationError;

  @override
  void initState() {
    super.initState();
    startArv = widget.startArv;
    adultController.addListener(_checkAdultNumber);
    childrenController.addListener(_checkChilrenNumber);
  }

  Property getProperty() {
    return context.read<PropertyCubit>().property!;
  }

  List<DateTime> getUnavailableDates() {
    List<DateTime> dates = [];
    if (getProperty().bookDateDetails != null) {
      for (var detail in getProperty().bookDateDetails!) {
        dates.add(detail.night.toLocal());
      }
    }
    if (getProperty().notAvailableDates != null) {
      for (var date in getProperty().notAvailableDates!) {
        dates.add(date.date.toLocal());
      }
    }
    return dates;
  }

  void _checkAdultNumber() {
    String inputText = adultController.text;
    int? enteredNumber = int.tryParse(inputText);
    int? childrenNumber = int.tryParse(childrenController.text);
    childrenNumber ??= 0;
    if (enteredNumber != null && enteredNumber + childrenNumber > 16) {
      adultController.text = '1';
      childrenController.text = '0';

      adultController.selection = TextSelection.collapsed(
          offset: adultController.text.length); // Move cursor to the end
    }
  }

  void _checkChilrenNumber() {
    String inputText = childrenController.text;
    int? enteredNumber = int.tryParse(inputText);
    int? adultsNumber = int.tryParse(adultController.text);
    adultsNumber ??= 0;
    if (enteredNumber != null && enteredNumber + adultsNumber > 16) {
      adultController.text = '1';
      childrenController.text = '0';
      childrenController.selection = TextSelection.collapsed(
          offset: childrenController.text.length); // Move cursor to the end
    }
  }

  @override
  Widget build(BuildContext context) {
    if (getProperty().bookingType == 'reserved') {
      firstDay = DateTime(
          DateTime.now().year, DateTime.now().month, DateTime.now().day + 2);
      while (getUnavailableDates()
          .any((unavailableDate) => isSameDay(firstDay, unavailableDate))) {
        firstDay = firstDay.add(const Duration(days: 1));
      }
      lastDay = DateTime(
          DateTime.now().year,
          DateTime.now().month + getProperty().maximumMonthPreBook,
          DateTime.now().day + 2);
    } else {
      firstDay = DateTime.now();
      while (getUnavailableDates()
          .any((unavailableDate) => isSameDay(firstDay, unavailableDate))) {
        firstDay = firstDay.add(Duration(days: 1));
      }
      lastDay = DateTime(
          DateTime.now().year,
          DateTime.now().month + getProperty().maximumMonthPreBook,
          DateTime.now().day);
    }

    return WillPopScope(
      onWillPop: () async {
        //sua code
        final dates = context.read<DateBookingCubit>();
        if (dates.startDate != null && dates.endDate != null) {
          context
              .read<DateBookingCubit>()
              .updateDates(dates.startDate, dates.endDate);
          Navigator.pop(context);
        } else {
          context.read<DateBookingCubit>().updateDates(tempStart, tempEnd);
          Navigator.pop(context);
        }
        return true;
      },
      child: RefreshIndicator(
        onRefresh: () {
          return context.read<PropertyCubit>().getProperty(widget.propertyId);
        },
        child: BlocBuilder<PropertyCubit, PropertyState>(
            builder: (context, state) {
          return BlocBuilder<DateBookingCubit, DateBookingState>(
              builder: (context, state) {
            final _startDate = context.read<DateBookingCubit>().startDate;
            final _endDate = context.read<DateBookingCubit>().endDate;

            return Scaffold(
              backgroundColor: Colors.white,
              body: SingleChildScrollView(
                physics: AlwaysScrollableScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(10, 30, 10, 30),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back, size: 25),
                            onPressed: () {
                              // sua code
                              if (_startDate != null && _endDate != null) {
                                context
                                    .read<DateBookingCubit>()
                                    .updateDates(_startDate, _endDate);
                                Navigator.pop(context);
                              } else {
                                context
                                    .read<DateBookingCubit>()
                                    .updateDates(tempStart, tempEnd);
                                Navigator.pop(context);
                              }
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Text(
                                  _startDate != null && _endDate != null
                                      ? ' ${_endDate.difference(_startDate).inDays + 1} night(s)'
                                      : 'Select dates',
                                  style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(height: 30),
                            Container(
                              height: 400,
                              child: TableCalendar(
                                headerStyle: const HeaderStyle(
                                  formatButtonVisible: false,
                                  titleCentered: true,
                                ),
                                focusedDay: _startDate ?? firstDay,
                                firstDay: firstDay,
                                lastDay: lastDay,
                                calendarFormat: CalendarFormat.month,
                                enabledDayPredicate: (day) {
                                  return !getUnavailableDates().any(
                                    (date) => isSameDay(date, day),
                                  );
                                },
                                selectedDayPredicate: (day) {
                                  if (_startDate != null && _endDate != null) {
                                    return day.isAfter(_startDate) &&
                                            day.isBefore(_endDate) ||
                                        day.isAtSameMomentAs(_startDate) ||
                                        day.isAtSameMomentAs(_endDate);
                                  } else if (_startDate != null &&
                                      _endDate == null) {
                                    return day.isAtSameMomentAs(_startDate);
                                  }
                                  return false;
                                },
                                onDaySelected: (selectedDay, focusedDay) {
                                  setState(() {
                                    DateTime? tempStartDate = _startDate;
                                    DateTime? tempEndDate = _endDate;

                                    if (tempStartDate != null &&
                                        tempEndDate != null) {
                                      tempStart = tempStartDate;
                                      tempEnd = tempEndDate;
                                    }
                                    if (tempStartDate == null &&
                                        tempEndDate == null) {
                                      tempStartDate = selectedDay;
                                    } else if (tempStartDate != null &&
                                        tempEndDate == null) {
                                      if (selectedDay.isBefore(tempStartDate)) {
                                        tempEndDate = tempStartDate;
                                        tempStartDate = selectedDay;
                                      } else {
                                        tempEndDate = selectedDay;
                                      }
                                    } else if (tempStartDate != null &&
                                        tempEndDate != null) {
                                      tempStartDate = selectedDay;
                                      tempEndDate = null;
                                    }

                                    if (tempStartDate != null &&
                                        tempEndDate != null) {
                                      List<DateTime> dateListBook = [];
                                      DateTime currentDate = tempStartDate;
                                      while (currentDate
                                              .isBefore(tempEndDate) ||
                                          currentDate
                                              .isAtSameMomentAs(tempEndDate)) {
                                        dateListBook.add(currentDate);
                                        currentDate =
                                            currentDate.add(Duration(days: 1));
                                      }

                                      bool isContain = false;
                                      for (var date in dateListBook) {
                                        if (getUnavailableDates().any(
                                            (unavailableDate) => isSameDay(
                                                date, unavailableDate))) {
                                          isContain = true;
                                          break;
                                        }
                                      }

                                      if (isContain) {
                                        showErrorDialog(context,
                                            'Some of the selected dates are not available.');
                                        tempStartDate = null;
                                        tempEndDate = null;
                                      } else {
                                        final stayDuration = tempEndDate
                                                .difference(tempStartDate)
                                                .inDays +
                                            1;
                                        bool violatesStayLimit = false;

                                        if (getProperty().maximumStay != null &&
                                            stayDuration >
                                                getProperty().maximumStay!) {
                                          violatesStayLimit = true;
                                          showErrorDialog(context,
                                              'The stay duration cannot exceed ${getProperty().maximumStay} nights.');
                                        }

                                        if (getProperty().minimumStay != null &&
                                            stayDuration <
                                                getProperty().minimumStay!) {
                                          violatesStayLimit = true;
                                          showErrorDialog(context,
                                              'The stay duration must be at least $getProperty().minimumStay nights.');
                                        }

                                        if (violatesStayLimit) {
                                          tempStartDate = null;
                                          tempEndDate = null;
                                        }
                                      }
                                    }

                                    context
                                        .read<DateBookingCubit>()
                                        .updateDates(
                                            tempStartDate, tempEndDate);
                                  });
                                },
                                headerVisible: true,
                              ),
                            ),
                            BlocBuilder<GuestBookingCubit, GuestBookingState>(
                                builder: (context, state) {
                              final adult =
                                  context.read<GuestBookingCubit>().adult;

                              final children =
                                  context.read<GuestBookingCubit>().children;

                              return Card(
                                elevation: 5,
                                color: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    children: [
                                      Row(
                                        children: [
                                          const Text(
                                            "Adult",
                                            style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold),
                                          ),
                                          const Spacer(),
                                          Row(
                                            children: [
                                              ElevatedButton(
                                                onPressed: adult > 1
                                                    ? () => context
                                                        .read<
                                                            GuestBookingCubit>()
                                                        .updateAdultGuests(
                                                            adult - 1)
                                                    : null, // Disable if adult <= 1
                                                style: TextButton.styleFrom(
                                                  backgroundColor: adult <= 1
                                                      ? Colors.black12
                                                      : Colors.white,
                                                  padding:
                                                      const EdgeInsets.all(0),
                                                  shape: const CircleBorder(),
                                                ),
                                                child: const Icon(Icons.remove,
                                                    size: 15,
                                                    color: Colors.black),
                                              ),
                                              Text(adult.toString(),
                                                  style: const TextStyle(
                                                      fontSize: 16)),
                                              ElevatedButton(
                                                onPressed: (adult + children <
                                                        getProperty()
                                                            .maximumGuest)
                                                    ? () => context
                                                        .read<
                                                            GuestBookingCubit>()
                                                        .updateAdultGuests(
                                                            adult + 1)
                                                    : null,
                                                style: TextButton.styleFrom(
                                                  backgroundColor:
                                                      (adult + children >=
                                                              getProperty()
                                                                  .maximumGuest)
                                                          ? Colors.black12
                                                          : Colors.white,
                                                  padding:
                                                      const EdgeInsets.all(0),
                                                  shape: const CircleBorder(),
                                                ),
                                                child: const Icon(Icons.add,
                                                    size: 15,
                                                    color: Colors.black),
                                              ),
                                            ],
                                          )
                                        ],
                                      ),
                                      Row(
                                        children: [
                                          const Text("Children",
                                              style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.bold)),
                                          const Spacer(),
                                          Row(
                                            children: [
                                              ElevatedButton(
                                                onPressed: children > 0
                                                    ? () => context
                                                        .read<
                                                            GuestBookingCubit>()
                                                        .updateChildrenGuests(
                                                            children - 1)
                                                    : null,
                                                style: TextButton.styleFrom(
                                                  backgroundColor: children < 1
                                                      ? Colors.black12
                                                      : Colors.white,
                                                  padding:
                                                      const EdgeInsets.all(0),
                                                  shape: const CircleBorder(),
                                                ),
                                                child: const Icon(Icons.remove,
                                                    size: 15,
                                                    color: Colors.black),
                                              ),
                                              Text(children.toString(),
                                                  style: const TextStyle(
                                                      fontSize: 16)),
                                              ElevatedButton(
                                                onPressed: (adult + children <=
                                                        getProperty()
                                                                .maximumGuest -
                                                            1)
                                                    ? () => context
                                                        .read<
                                                            GuestBookingCubit>()
                                                        .updateChildrenGuests(
                                                            children + 1)
                                                    : null,
                                                style: TextButton.styleFrom(
                                                  backgroundColor:
                                                      (adult + children >=
                                                              getProperty()
                                                                  .maximumGuest)
                                                          ? Colors.black12
                                                          : Colors.white,
                                                  padding:
                                                      const EdgeInsets.all(0),
                                                  shape: const CircleBorder(),
                                                ),
                                                child: const Icon(Icons.add,
                                                    size: 15,
                                                    color: Colors.black),
                                              ),
                                            ],
                                          )
                                        ],
                                      ),
                                      const SizedBox(height: 10),
                                      if (guestValidationError != null)
                                        Padding(
                                          padding:
                                              const EdgeInsets.only(top: 8.0),
                                          child: Text(
                                            guestValidationError!,
                                            style: const TextStyle(
                                                color: Colors.red),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              );
                            })
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              bottomNavigationBar: Container(
                height: 80,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(
                    top: BorderSide(color: Colors.black12, width: 0.5),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _startDate != null && _endDate != null
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              formatPrice(getProperty().basePrice),
                              formatDateRange(_startDate, _endDate),
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                "Choose dates",
                                style: TextStyle(
                                    fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              startArv! > 0
                                  ? Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: [
                                        const Icon(Icons.star, size: 20),
                                        Text(
                                          startArv.toString(),
                                          style: const TextStyle(
                                            fontSize: 16,
                                          ),
                                        ),
                                      ],
                                    )
                                  : const Text(""),
                            ],
                          ),
                    ElevatedButton(
                      onPressed: () {
                        if (_startDate == null || _endDate == null) {
                          return null;
                        }
                        Navigator.pop(context, {});
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            (_startDate == null || _endDate == null)
                                ? Colors.black12
                                : Color(0xFFFF0000),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        minimumSize: const Size(160, 60),
                      ),
                      child: const Text(
                        "Save",
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          });
        }),
      ),
    );
  }
}
