import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/property_detail/models/booking_dto.dart';
import 'package:project4_flutter/features/property_detail/models/exception_date.dart';
import 'package:project4_flutter/features/property_detail/models/property.dart';
import 'package:project4_flutter/features/property_detail/widgets/authentication_for_booking.dart';
import 'package:project4_flutter/features/property_detail/widgets/date_picker_modal.dart';
import 'package:project4_flutter/features/property_detail/widgets/show_popup_transaction.dart';
import 'package:project4_flutter/features/property_detail/widgets/transaction.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/models/user.dart';
import 'package:project4_flutter/shared/utils/is_same_day.dart';
import 'package:project4_flutter/shared/widgets/format_date.dart';
import '../../../shared/bloc/booking/booking.dart';
import '../../../shared/bloc/booking/date_booking.dart';
import '../../../shared/bloc/booking/guest_booking.dart';
import '../../../shared/bloc/property_cubit/property_cubit.dart';
import '../../../shared/widgets/format_date_range.dart';

class CheckoutDetails extends StatefulWidget {
  const CheckoutDetails({super.key, required this.propertyId});
  @override
  State<CheckoutDetails> createState() => _CheckoutDetailsState();

  final int propertyId;
}

class _CheckoutDetailsState extends State<CheckoutDetails> {
  Property getProperty() {
    return context.read<PropertyCubit>().property!;
  }

  late int propertyId;
  @override
  void initState() {
    // TODO: implement initState
    propertyId = widget.propertyId;
  }

  bool awaitBooking = false;
  List<ExceptionDate> showExceptionDates(DateTime? startDate, DateTime? endDate,
      List<ExceptionDate> exceptionDates) {
    List<ExceptionDate> dateListReturn = [];
    List<DateTime> dateList = [];
    while (
        startDate!.isBefore(endDate!) || startDate.isAtSameMomentAs(endDate)) {
      dateList.add(startDate);
      startDate = startDate.add(const Duration(days: 1));
    }
    for (var date in dateList) {
      for (var exDate in exceptionDates) {
        if (isSameDate(date, exDate.date)) {
          dateListReturn.add(exDate);
        }
      }
    }
    dateListReturn.sort((a, b) => a.date.compareTo(b.date));
    return dateListReturn;
  }

  double calculate_total_base_price(DateTime? startDate, DateTime? endDate,
      List<ExceptionDate> exceptionDates) {
    DateTime? tempStart = startDate;
    DateTime? tempEnd = endDate;
    List<DateTime> dateList = [];
    while (
        startDate!.isBefore(endDate!) || startDate.isAtSameMomentAs(endDate)) {
      dateList.add(startDate);
      startDate = startDate.add(const Duration(days: 1));
    }
    int nightBase = dateList.length -
        showExceptionDates(tempStart, tempEnd, exceptionDates).length;
    double basePriceTotal = nightBase * getProperty().basePrice;
    double exceptionPriceTotal = 0;
    for (var date in showExceptionDates(tempStart, tempEnd, exceptionDates)) {
      exceptionPriceTotal += date.basePrice;
    }
    return basePriceTotal + exceptionPriceTotal;
  }

  get startArv =>
      (getProperty().cleanlinessScore +
          getProperty().communicationScore +
          getProperty().accuracyScore +
          getProperty().checkinScore) /
      4;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: BlocBuilder<DateBookingCubit, DateBookingState>(
          builder: (context, state) {
        final startDate = context.read<DateBookingCubit>().startDate;
        final endDate = context.read<DateBookingCubit>().endDate;
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 1,
          minChildSize: 1,
          maxChildSize: 1,
          builder: (BuildContext context, ScrollController scrollController) {
            double totalBasePrice;
            List<ExceptionDate>? exceptionDates = getProperty().exceptionDates;
            if (exceptionDates == null) {
              totalBasePrice = (endDate!.difference(startDate!).inDays + 1) *
                  getProperty().basePrice;
            } else {
              totalBasePrice = calculate_total_base_price(
                  startDate, endDate, exceptionDates);
            }
            double discount = 0;
            if (endDate!.difference(startDate!).inDays + 1 >= 28) {
              discount = totalBasePrice * getProperty().monthlyDiscount / 100;
            } else if (endDate.difference(startDate).inDays + 1 >= 7 &&
                endDate.difference(startDate).inDays + 1 < 28) {
              discount = totalBasePrice * getProperty().weeklyDiscount / 100;
            }
            return SingleChildScrollView(
              controller: scrollController,
              child: Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.clear, size: 25),
                          onPressed: () {
                            Navigator.pop(context);
                          },
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
                      child: DefaultTextStyle(
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black, // Màu chữ
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Check out detail",
                              style: TextStyle(
                                  fontSize: 22, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(
                              height: 14,
                            ),
                            Row(
                              children: [
                                Text(
                                    "${NumberFormat.currency(symbol: "\$").format(getProperty().basePrice)} * ${(endDate.difference(startDate).inDays + 1) - (showExceptionDates(startDate, endDate, exceptionDates!).length)} night(s)"),
                                const Spacer(),
                                Text(NumberFormat.currency(symbol: "\$").format(
                                    ((endDate.difference(startDate).inDays +
                                                1) -
                                            (showExceptionDates(startDate,
                                                    endDate, exceptionDates)
                                                .length)) *
                                        getProperty().basePrice))
                              ],
                            ),
                            const SizedBox(
                              height: 14,
                            ),
                            if (showExceptionDates(
                                    startDate, endDate, exceptionDates)
                                .isNotEmpty)
                              for (var exceptionDate in showExceptionDates(
                                  startDate, endDate, exceptionDates))
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 10),
                                  child: Row(
                                    children: [
                                      formatDate(exceptionDate.date),
                                      const Spacer(),
                                      Text(NumberFormat.currency(symbol: "\$")
                                          .format(exceptionDate.basePrice)),
                                    ],
                                  ),
                                ),
                            if ((endDate.difference(startDate).inDays + 1) >=
                                    7 &&
                                (endDate.difference(startDate).inDays + 1) < 28)
                              Row(
                                children: [
                                  const SizedBox(
                                    height: 14,
                                  ),
                                  const Text("Weekly stay discount"),
                                  const Spacer(),
                                  Text(
                                    NumberFormat.currency(symbol: "\$")
                                        .format(discount),
                                    style: const TextStyle(
                                        color: Colors.lightBlue),
                                  )
                                ],
                              )
                            else if ((endDate.difference(startDate).inDays +
                                    1) >=
                                28)
                              Row(
                                children: [
                                  const Text("Monthly stay discount"),
                                  const Spacer(),
                                  Text(
                                    NumberFormat.currency(symbol: "\$")
                                        .format(discount),
                                    style: const TextStyle(
                                        color: Colors.lightBlue),
                                  )
                                ],
                              ),
                            const SizedBox(
                              height: 14,
                            ),
                            Row(
                              children: [
                                const Text("UrbanNest service fee"),
                                const Spacer(),
                                Text(NumberFormat.currency(symbol: "\$")
                                    .format((totalBasePrice - discount) * 0.05))
                              ],
                            ),
                            const SizedBox(
                              height: 14,
                            ),
                            Row(
                              children: [
                                const SizedBox(
                                  height: 14,
                                ),
                                const Text("Guest"),
                                const Spacer(),
                                BlocBuilder<GuestBookingCubit,
                                        GuestBookingState>(
                                    builder: (context, state) {
                                  final adult =
                                      context.read<GuestBookingCubit>().adult;
                                  final children = context
                                      .read<GuestBookingCubit>()
                                      .children;

                                  return Text((children + adult).toString());
                                })
                              ],
                            ),
                            const SizedBox(
                              height: 14,
                            ),
                            Row(
                              children: [
                                const Text(
                                  "Total before taxes",
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                ),
                                const Spacer(),
                                Text(
                                  NumberFormat.currency(symbol: "\$").format(
                                      (totalBasePrice - discount) * 1.05),
                                  style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            const Divider(thickness: 1, color: Colors.black12),
                            const SizedBox(
                              height: 24,
                            ),
                            Row(
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text("Night",
                                        style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold)),
                                    const SizedBox(
                                      height: 14,
                                    ),
                                    formatDateRange(startDate, endDate)
                                  ],
                                ),
                                const Spacer(),
                                TextButton(
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                DatePickerModal(
                                                    startArv: startArv,
                                                    propertyId:
                                                        widget.propertyId)));
                                  },
                                  style: TextButton.styleFrom(
                                    backgroundColor: Colors.blue, // Màu nền
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16, vertical: 12),
                                    shape: RoundedRectangleBorder(
                                      borderRadius:
                                          BorderRadius.circular(8), // Bo góc
                                    ),
                                  ),
                                  child: const Text(
                                    "Change",
                                    style: TextStyle(
                                      color: Colors.white, // Màu chữ
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold, // Độ đậm chữ
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    Container(
                        padding: const EdgeInsets.fromLTRB(20, 40, 20, 20),
                        width: double.infinity,
                        child: TextButton(
                          // sua code
                          onPressed: () {
                            final userCubit = context.read<UserCubit>().state;
                            if (userCubit is UserSuccess) {
                              if (awaitBooking) {
                                return null;
                              }
                              setState(() {
                                awaitBooking = true;
                              });
                              createBooking(context, discount, totalBasePrice);
                            } else {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          AuthenticationForBooking(
                                              propertyId: propertyId)));
                            }
                            ;
                          },
                          style: TextButton.styleFrom(
                            backgroundColor: const Color(0xFFFF0000),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 55, vertical: 18),
                            // Padding
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8), // Bo góc
                            ),
                          ),
                          child: awaitBooking
                              ? const CircularProgressIndicator()
                              : const Text(
                                  'Booking',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 20,
                                      color: Colors.white),
                                ),
                        ))
                  ],
                ),
              ),
            );
          },
        );
      }),
    );
  }

  Future<void> createBooking(
      BuildContext context, double discount, double totalBasePrice) async {
    final bookingCubit = context.read<BookingCubit>();
    final datesCubit = context.read<DateBookingCubit>();
    final guestBooking = context.read<GuestBookingCubit>();
    final state = context.read<UserCubit>().state;
    User? userBooking;
    if (state is UserSuccess) {
      userBooking = state.user;
    }

    final booking = BookingDto(
      children: guestBooking.children,
      adult: guestBooking.adult,
      hostFee:
          double.parse(((totalBasePrice - discount) * 0.9).toStringAsFixed(2)),
      websiteFee:
          double.parse(((totalBasePrice - discount) * 0.05).toStringAsFixed(2)),
      customerId: userBooking?.id,
      hostId: getProperty().userId,
      propertyId: getProperty().id,
      amount:
          double.parse(((totalBasePrice - discount) * 1.05).toStringAsFixed(2)),
      checkInDay: datesCubit.startDate!,
      checkOutDay: datesCubit.endDate!.add(const Duration(days: 1)),
    );
    if (bookingCubit.state is BookingAwait) {
      const CircularProgressIndicator(
        color: Colors.white,
      );
    }
    var rs = await bookingCubit.initBookingProcess(booking);
    setState(() {
      awaitBooking = false;
    });
    if (context.mounted) {
      final state = context.read<BookingCubit>().state;
      String message = "";
      if (state is BookingFail) {
        message = state.message;
        showErrorDialogTransaction(context, message, "Error");
      }
      if (rs != null) {
        //sua code
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => TransactionModal(booking: rs)));
      } else {
        showErrorDialogTransaction(context, message, "Error");
      }
    }
  }
}
