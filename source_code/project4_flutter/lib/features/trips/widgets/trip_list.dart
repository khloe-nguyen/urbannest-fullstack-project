import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';

import 'package:project4_flutter/features/trips/models/trip_count.dart';
import 'package:project4_flutter/features/trips/widgets/booking_detail.dart';
import 'package:project4_flutter/shared/widgets/bold_text.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

import '../../../shared/bloc/trip_cubit/trip_cubit.dart';
import '../../../shared/bloc/trip_cubit/trip_state.dart';

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class TripList extends StatefulWidget {
  const TripList(this.selectedDateRange, {super.key});

  final DateTimeRange selectedDateRange;

  @override
  State<TripList> createState() => TripListState();
}

class TripListState extends State<TripList> {
  List<BookingMinimizeDto> _bookingList = [];
  final _myController = ScrollController();

  TripCubit getTripCubit() {
    return context.read<TripCubit>();
  }

  WidgetStateProperty<Color?> trackColor =
      const WidgetStateProperty<Color?>.fromMap(
    <WidgetStatesConstraint, Color>{
      WidgetState.selected: Colors.amber,
    },
  );
  // This object sets the track color based on two WidgetState attributes.
  // If neither state applies, it resolves to null.
  final WidgetStateProperty<Color?> overlayColor =
      WidgetStateProperty<Color?>.fromMap(
    <WidgetState, Color>{
      WidgetState.selected: Colors.amber.withOpacity(0.54),
      WidgetState.disabled: Colors.grey.shade400,
    },
  );

  void _myScrollListener() {
    if (_myController.offset >= _myController.position.maxScrollExtent &&
        !_myController.position.outOfRange &&
        getTripCubit().isLoading == false) {
      getTripCubit().getBookingList();
    }
  }

  List<Map<String, String>> listStatus = [
    {'label': 'Upcoming', 'value': 'upcoming'},
    {'label': 'Checking out', 'value': 'checkout'},
    {'label': 'Currently Stay-in', 'value': 'stayin'},
    {'label': 'Pending review', 'value': 'pending'},
    {'label': 'Stay-in history', 'value': 'history'}
  ];

  @override
  void initState() {
    super.initState();
    _myController.addListener(_myScrollListener);
    if (getTripCubit().state is TripNotAvailable) {
      getTripCubit().getBookingCount();
      getTripCubit().getBookingList();
    }
  }

  String returnNothing(status) {
    if (status == "checkout") {
      return "You don’t have any stay-in currently checkout.";
    }
    if (status == "stayin") {
      return "You don’t have stay-in today.";
    }
    if (status == "upcoming") {
      return "You don’t have upcoming stay-in";
    }
    if (status == "pending") {
      return "You don’t have any stay-in pending review.";
    }
    if (status == "history") {
      return "You currently don’t have any stay-in history.";
    }

    return "";
  }

  Future refresh() async {
    await getTripCubit().updateStatus(getTripCubit().currentStatus!);
    await getTripCubit().getBookingCount();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () {
        return getTripCubit().refresh();
      },
      child: BlocBuilder<TripCubit, TripState>(
        builder: (context, tripState) {
          _bookingList = context.read<TripCubit>().bookingList;

          var tripCount = context.read<TripCubit>().tripCount;

          List<List<int>> groupDate =
              _bookingList.fold<List<List<int>>>([], (previousValue, booking) {
            DateTime checkInDate = booking.checkInDay;

            int month = checkInDate.month;
            int year = checkInDate.year;

            bool isExist = previousValue
                .any((item) => item[0] == month && item[1] == year);

            // If not, add it
            if (!isExist) {
              previousValue.add([month, year]);
            }

            return previousValue;
          });

          bool isLoading = tripState is TripLoading;
          return buildBodyScaffold(groupDate, isLoading, tripCount);
        },
      ),
    );
  }

  Scaffold buildBodyScaffold(
      List<List<int>> groupDate, bool isLoading, TripCount? tripCount) {
    return Scaffold(
      body: Stack(
        children: [
          // Main content of the body
          (_bookingList.isNotEmpty)
              ? Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        const SizedBox(
                          width: 20,
                        ),
                        Switch(
                          // This bool value toggles the switch.
                          value: getTripCubit().groupDate,
                          overlayColor: overlayColor,
                          trackColor: trackColor,
                          thumbColor:
                              const WidgetStatePropertyAll<Color>(Colors.black),
                          onChanged: (bool value) {
                            // This is called when the user toggles the switch.
                            getTripCubit().updateGroupDate();
                          },
                        ),
                        const BoldText(text: "Group date", fontSize: 15),
                      ],
                    ),
                    if (getTripCubit().groupDate)
                      Expanded(
                        child: ListView.builder(
                          physics: const AlwaysScrollableScrollPhysics(),
                          controller: _myController,
                          itemCount: groupDate.length,
                          itemBuilder: (context, index) {
                            var [month, year] = groupDate[index];
                            List<BookingMinimizeDto> selectedBooking =
                                _bookingList.where(
                              (element) {
                                DateTime checkInDate = element.checkInDay;

                                int bookingMonth = checkInDate.month;
                                int bookingYear = checkInDate.year;

                                if (bookingMonth == month &&
                                    bookingYear == year) {
                                  return true;
                                }
                                return false;
                              },
                            ).toList();
                            return Padding(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 20, vertical: 10),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 10),
                                    decoration: const BoxDecoration(
                                      border: Border(
                                        bottom: BorderSide(
                                          color: Color.fromARGB(25, 0, 0, 0),
                                          width: 1,
                                        ),
                                      ),
                                    ),
                                    child: Text(
                                      "${months[month - 1]}, $year",
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 20,
                                      ),
                                    ),
                                  ),
                                  ...selectedBooking.map(
                                    (e) {
                                      return InkWell(
                                        onTap: () {
                                          Navigator.push(context,
                                              MaterialPageRoute(
                                            builder: (context) {
                                              return BookingDetail(e);
                                            },
                                          ));
                                        },
                                        splashColor:
                                            Colors.blue.withOpacity(0.3),
                                        highlightColor:
                                            Colors.blue.withOpacity(0.1),
                                        child: Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Row(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                AdvancedAvatar(
                                                  name: "room",
                                                  foregroundDecoration:
                                                      BoxDecoration(
                                                          border: Border.all(
                                                              color: Colors.red,
                                                              width: 2),
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      10)),
                                                  decoration: BoxDecoration(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              10)),
                                                  statusAlignment:
                                                      Alignment.topRight,
                                                  image: NetworkImage(e.property
                                                      .propertyImages[0]),
                                                  size: 100,
                                                ),
                                                const SizedBox(width: 20),
                                                ConstrainedBox(
                                                  constraints:
                                                      const BoxConstraints(
                                                          maxWidth: 170),
                                                  child: Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                        e.property
                                                            .propertyTitle,
                                                        style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          fontSize: 18,
                                                        ),
                                                      ),
                                                      Text(
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                        "Hosted by ${e.property.user.firstName}",
                                                        style: const TextStyle(
                                                          fontSize: 15,
                                                        ),
                                                      ),
                                                      Text(
                                                          softWrap: true,
                                                          "${e.checkInDay.day} ${months[e.checkInDay.month - 1].substring(0, 3)} ${e.checkInDay.year} - ${e.checkOutDay.day} ${months[e.checkOutDay.month - 1].substring(0, 3)} ${e.checkOutDay.year}")
                                                    ],
                                                  ),
                                                )
                                              ]),
                                        ),
                                      );
                                    },
                                  )
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    if (getTripCubit().groupDate == false)
                      Expanded(
                        child: ListView.builder(
                          physics: const AlwaysScrollableScrollPhysics(),
                          controller: _myController,
                          itemCount: getTripCubit().bookingList.length,
                          itemBuilder: (context, index) {
                            var e = getTripCubit().bookingList[index];
                            return InkWell(
                              onTap: () {
                                Navigator.push(context, MaterialPageRoute(
                                  builder: (context) {
                                    return BookingDetail(e);
                                  },
                                ));
                              },
                              splashColor: Colors.blue.withOpacity(0.3),
                              highlightColor: Colors.blue.withOpacity(0.1),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 8.0, horizontal: 25),
                                child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      AdvancedAvatar(
                                        name: "room",
                                        foregroundDecoration: BoxDecoration(
                                            border: Border.all(
                                                color: Colors.red, width: 2),
                                            borderRadius:
                                                BorderRadius.circular(10)),
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(10)),
                                        statusAlignment: Alignment.topRight,
                                        image: NetworkImage(
                                            e.property.propertyImages[0]),
                                        size: 100,
                                      ),
                                      const SizedBox(width: 20),
                                      ConstrainedBox(
                                        constraints:
                                            const BoxConstraints(maxWidth: 170),
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              overflow: TextOverflow.ellipsis,
                                              e.property.propertyTitle,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 18,
                                              ),
                                            ),
                                            Text(
                                              overflow: TextOverflow.ellipsis,
                                              "Hosted by ${e.property.user.firstName}",
                                              style: const TextStyle(
                                                fontSize: 15,
                                              ),
                                            ),
                                            Text(
                                                softWrap: true,
                                                "${e.checkInDay.day} ${months[e.checkInDay.month - 1].substring(0, 3)} ${e.checkInDay.year} - ${e.checkOutDay.day} ${months[e.checkOutDay.month - 1].substring(0, 3)} ${e.checkOutDay.year}")
                                          ],
                                        ),
                                      )
                                    ]),
                              ),
                            );
                          },
                        ),
                      ),
                  ],
                )
              : !isLoading
                  ? Center(
                      child: Container(
                        height: 200,
                        width: MediaQuery.of(context).size.width * 0.8,
                        padding: const EdgeInsets.all(20),
                        decoration: const BoxDecoration(
                            color: Color.fromARGB(10, 0, 0, 0)),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const HugeIcon(
                              icon: HugeIcons.strokeRoundedAlertCircle,
                              color: Colors.black,
                              size: 34.0,
                            ),
                            Text(
                              returnNothing(getTripCubit().currentStatus),
                              textAlign: TextAlign.center,
                              softWrap: true,
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(
                              height: 20,
                            ),
                            ElevatedButton(
                              style: ButtonStyle(
                                backgroundColor:
                                    WidgetStateProperty.all(Colors.black),
                                elevation: WidgetStateProperty.all(
                                    5), // Adjust elevation to create shadow
                                shadowColor: WidgetStateProperty.all(
                                    Colors.black.withValues(
                                        alpha:
                                            0.5)), // Shadow color and opacity
                              ),
                              onPressed: () {
                                getTripCubit().refresh();
                              },
                              child: const Padding(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 24.0, vertical: 12.0),
                                child: Text(
                                  'Refresh',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    )
                  : const LoadingIcon(size: 50), // Empty space when not loading
          // Loading Icon at the bottom
          if (isLoading && getTripCubit().currentPage != 0)
            const Positioned(
              bottom: 20,
              left: 0,
              right: 0,
              child: LoadingIcon(size: 40),
            ),
        ],
      ),
      bottomNavigationBar: buildBottomContainer(tripCount),
    );
  }

  Container buildBottomContainer(TripCount? tripCount) {
    return Container(
      decoration: const BoxDecoration(
          border: Border(
              top: BorderSide(color: Color.fromARGB(25, 0, 0, 0), width: 1))),
      padding: const EdgeInsets.all(10),
      child: SizedBox(
        height: 50,
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          scrollDirection: Axis.horizontal,
          itemCount: listStatus.length,
          itemBuilder: (context, index) {
            int count(status) {
              if (tripCount != null) {
                if (status == "checkout") {
                  return tripCount.checkoutCount;
                }
                if (status == "stayin") {
                  return tripCount.stayInCount;
                }
                if (status == "upcoming") {
                  return tripCount.upcomingCount;
                }
                if (status == "pending") {
                  return tripCount.pendingCount;
                }
                if (status == "history") {
                  return tripCount.historyCount;
                }
              }
              return 0;
            }

            return Padding(
              padding: const EdgeInsets.all(4.0),
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                    backgroundColor: getTripCubit().currentStatus ==
                            listStatus[index]['value']
                        ? Colors.black
                        : null),
                onPressed: () {
                  getTripCubit().updateStatus(listStatus[index]['value']!);
                },
                child: Text(
                  tripCount == null
                      ? listStatus[index]['label']!
                      : "${listStatus[index]['label']!} (${count(listStatus[index]['value'])})",
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: getTripCubit().currentStatus ==
                              listStatus[index]['value']
                          ? Colors.white
                          : Colors.black),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
