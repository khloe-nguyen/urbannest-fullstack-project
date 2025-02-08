import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/trips/widgets/refund_list.dart';
import 'package:project4_flutter/features/trips/widgets/reservation_list.dart';
import 'package:project4_flutter/features/trips/widgets/trip_list.dart';
import 'package:project4_flutter/shared/bloc/refund_list_cubit/refund_list_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:provider/provider.dart';

import '../../../main.dart';
import '../../../shared/bloc/reservation_cubit/reservation_cubit.dart';
import '../../../shared/bloc/trip_cubit/trip_cubit.dart';
import '../../../shared/bloc/trip_cubit/trip_state.dart';

class UserTrip extends StatefulWidget {
  const UserTrip({super.key});

  @override
  State<UserTrip> createState() => _UserTripState();
}

class _UserTripState extends State<UserTrip> {
  String dropDownSelectOption = 'Trips';
  final GlobalKey<TripListState> _tripListKey = GlobalKey<TripListState>();
  final GlobalKey<ReservationListState> _reservationListKey =
      GlobalKey<ReservationListState>();
  final GlobalKey<RefundListStateWidget> _refundList =
      GlobalKey<RefundListStateWidget>();

  final List<String> list = <String>[
    'Trips',
    'Reservation',
    'Refund',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: buildAppBar(),
      body: _getBodyForSelectedOption(dropDownSelectOption, selectedDateRange,
          _tripListKey, _reservationListKey, _refundList),
    );
  }

  DateTimeRange? selectedDateRange;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    var format = DateFormat('yyyy-MM-dd');
    var now = DateTime.now();

    if (context.read<TripCubit>().state is TripNotAvailable) {
      selectedDateRange = DateTimeRange(
        start: context.read<UserCubit>().loginUser!.createdAt, // Start date
        end: DateTime(now.year + 1, 1, 1), // End date
      );
      context.read<TripCubit>().updateDateRange(
            DateTimeRange(
              start:
                  context.read<UserCubit>().loginUser!.createdAt, // Start date
              end: DateTime(now.year + 1, 1, 1), // End date
            ),
          );
      context.read<ReservationCubit>().updateDateRange(
            DateTimeRange(
              start:
                  context.read<UserCubit>().loginUser!.createdAt, // Start date
              end: DateTime(now.year + 1, 1, 1), // End date
            ),
          );
      context.read<RefundListCubit>().updateDateRange(
            DateTimeRange(
              start:
                  context.read<UserCubit>().loginUser!.createdAt, // Start date
              end: DateTime(now.year + 1, 1, 1), // End date
            ),
          );
    } else {
      if (context.read<TripCubit>().currentStartDate != null) {
        selectedDateRange = DateTimeRange(
          start: format
              .parse(context.read<TripCubit>().currentStartDate!), // Start date
          end: format
              .parse(context.read<TripCubit>().currentEndDate!), // End date
        );
      }
    }
  }

  DateTimeRange? updateDate(status) {
    if (status == "All") {
      return DateTimeRange(
        start: context.read<UserCubit>().loginUser!.createdAt, // Start date
        end: DateTime(2026, 1, 1), // End date
      );
    }

    if (status == "1m") {
      DateTime now = DateTime.now();
      DateTime firstDayOfCurrentMonth = DateTime(now.year, now.month, 1);
      DateTime lastDayOfCurrentMonth = DateTime(now.year, now.month + 1, 0);

      if (firstDayOfCurrentMonth
          .isBefore(context.read<UserCubit>().loginUser!.createdAt)) {
        return DateTimeRange(
          start: context.read<UserCubit>().loginUser!.createdAt,
          end: lastDayOfCurrentMonth,
        );
      } else {
        return DateTimeRange(
          start: firstDayOfCurrentMonth,
          end: lastDayOfCurrentMonth,
        );
      }
    }

    if (status == "6m") {
      DateTime now = DateTime.now();
      DateTime firstDayOfPrev6Month = DateTime(now.year, now.month - 6, 1);
      DateTime lastDayOfCurrentMonth = DateTime(now.year, now.month + 1, 0);

      if (firstDayOfPrev6Month
          .isBefore(context.read<UserCubit>().loginUser!.createdAt)) {
        return DateTimeRange(
          start: context.read<UserCubit>().loginUser!.createdAt,
          end: lastDayOfCurrentMonth,
        );
      } else {
        return DateTimeRange(
          start: firstDayOfPrev6Month,
          end: lastDayOfCurrentMonth,
        );
      }
    }

    if (status == "1y") {
      DateTime now = DateTime.now();
      DateTime firstDayOfPrev12Month = DateTime(now.year, now.month - 12, 1);
      DateTime lastDayOfCurrentMonth = DateTime(now.year, now.month + 1, 0);

      if (firstDayOfPrev12Month
          .isBefore(context.read<UserCubit>().loginUser!.createdAt)) {
        return DateTimeRange(
          start: context.read<UserCubit>().loginUser!.createdAt,
          end: lastDayOfCurrentMonth,
        );
      } else {
        return DateTimeRange(
          start: firstDayOfPrev12Month,
          end: lastDayOfCurrentMonth,
        );
      }
    }

    return null;
  }

  Future<void> _selectDateRange() async {
    List<String> lists = ["All", "1m", "6m", "1y"];

    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020), // The earliest date that can be selected
      lastDate: DateTime(2030), // The latest date that can be selected
      currentDate: DateTime.now(), // Initial date to display
      initialDateRange: selectedDateRange, // Optionally set an initial range
      builder: (BuildContext context, Widget? child) {
        return Scaffold(
          body: child!,
          bottomNavigationBar: Container(
            decoration: const BoxDecoration(
                border: Border(
                    top: BorderSide(
                        color: Color.fromARGB(25, 0, 0, 0), width: 1))),
            child: SizedBox(
              height: 50,
              child: ListView.builder(
                itemCount: lists.length,
                scrollDirection: Axis.horizontal,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                          backgroundColor: Colors.black),
                      onPressed: () {
                        DateTimeRange newRange = updateDate(lists[index])!;
                        setState(() {
                          selectedDateRange = newRange;
                        });

                        context.read<TripCubit>().updateDateRange(newRange);
                        context
                            .read<ReservationCubit>()
                            .updateDateRange(newRange);

                        Navigator.pop(context);
                      },
                      child: Text(
                        lists[index],
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        );
      },
    );

    if (picked != null && picked != selectedDateRange) {
      setState(() {
        selectedDateRange = picked;
      });
      if (mounted) {
        if (dropDownSelectOption == "Trips") {
          _tripListKey.currentContext!
              .read<TripCubit>()
              .updateDateRange(picked);
        }

        if (dropDownSelectOption == "Reservation") {
          _reservationListKey.currentContext!
              .read<ReservationCubit>()
              .updateDateRange(picked);
        }

        if (dropDownSelectOption == "Refund") {
          _refundList.currentContext!
              .read<RefundListCubit>()
              .updateDateRange(picked);
        }
      }
    }
  }

  AppBar buildAppBar() {
    return AppBar(
      forceMaterialTransparency: true,
      title: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            PopupMenuButton(
              icon: const HugeIcon(
                icon: HugeIcons.strokeRoundedMenu01,
                color: Colors.black,
                size: 24.0,
              ),
              padding: const EdgeInsets.all(20),
              position: PopupMenuPosition.under,
              itemBuilder: (context) {
                return [
                  PopupMenuItem(
                    onTap: () {
                      setState(() {
                        dropDownSelectOption = "Trips";
                      });
                    },
                    child: const Text("Trips"),
                  ),
                  PopupMenuItem(
                    onTap: () {
                      setState(() {
                        dropDownSelectOption = "Reservation";
                      });
                    },
                    child: const Text("Reservation"),
                  ),
                  PopupMenuItem(
                    onTap: () {
                      setState(() {
                        dropDownSelectOption = "Refund";
                      });
                    },
                    child: const Text("Refund"),
                  ),
                ];
              },
            ),
            Column(
              children: [
                Text(
                  dropDownSelectOption,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 22),
                ),
                if (selectedDateRange != null)
                  Text(
                    "${format.format(selectedDateRange!.start)} - ${format.format(selectedDateRange!.end)}",
                    style: const TextStyle(fontSize: 15),
                  )
              ],
            ),
            IconButton(
              onPressed: () {
                _selectDateRange();
              },
              icon: const HugeIcon(
                icon: HugeIcons.strokeRoundedCalendar01,
                color: Colors.black,
                size: 24.0,
              ),
            )
          ],
        ),
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1.0),
        child: Container(
          color: const Color.fromARGB(30, 0, 0, 0),
          height: 1.0, // Border thickness
        ),
      ),
    );
  }
}

Widget _getBodyForSelectedOption(String option, selectedDateRange, tripListKey,
    reservationListKey, refundListKey) {
  switch (option) {
    case 'Trips':
      return TripList(key: tripListKey, selectedDateRange);
    case 'Reservation':
      return ReservationList(key: reservationListKey, selectedDateRange);
    case 'Refund':
      return RefundList(key: refundListKey, selectedDateRange);
    default:
      return const Center(child: Text('Select an option'));
  }
}
