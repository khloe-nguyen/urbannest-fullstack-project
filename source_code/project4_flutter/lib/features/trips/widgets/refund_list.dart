import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/shared/bloc/refund_list_cubit/refund_list_cubit.dart';
import 'package:project4_flutter/shared/bloc/refund_list_cubit/refund_list_state.dart';

import '../../../shared/widgets/loading_icon.dart';
import '../models/booking_minimize_dto.dart';
import 'booking_detail.dart';

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

class RefundList extends StatefulWidget {
  const RefundList(this.selectedDateRange, {super.key});

  final DateTimeRange selectedDateRange;

  @override
  State<RefundList> createState() => RefundListStateWidget();
}

class RefundListStateWidget extends State<RefundList> {
  List<BookingMinimizeDto> _bookingList = [];
  final _myController = ScrollController();

  RefundListCubit getRefundListCubit() {
    return context.read<RefundListCubit>();
  }

  void _myScrollListener() {
    if (_myController.offset >= _myController.position.maxScrollExtent &&
        !_myController.position.outOfRange &&
        !getRefundListCubit().isLoading) {
      getRefundListCubit().getRefundList();
    }
  }

  List<Map<String, String>> listStatus = [
    {'label': 'Pending', 'value': 'pending'},
    {'label': 'Denied', 'value': 'denied'},
    {'label': 'Cancel', 'value': 'cancel'},
  ];

  @override
  void initState() {
    super.initState();
    _myController.addListener(_myScrollListener);

    if (getRefundListCubit().state is RefundListNotAvailable) {
      getRefundListCubit().getRefundList();
    }
  }

  String returnNothing(status) {
    if (status == "pending") {
      return "You don’t have any reservation stay-in currently pending.";
    }
    if (status == "denied") {
      return "You don’t have any denied stay-in.";
    }
    if (status == "cancel") {
      return "You don’t have any cancel stay-in";
    }

    return "";
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () {
        return getRefundListCubit().refresh();
      },
      child: BlocBuilder<RefundListCubit, RefundListState>(
        builder: (context, tripState) {
          _bookingList = context.read<RefundListCubit>().refundList;

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

          bool isLoading = tripState is RefundListLoading;
          return buildBodyScaffold(groupDate, isLoading);
        },
      ),
    );
  }

  Scaffold buildBodyScaffold(
    List<List<int>> groupDate,
    bool isLoading,
  ) {
    return Scaffold(
      body: Stack(
        children: [
          (_bookingList.isNotEmpty)
              ? Column(
                  children: [
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
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 10),
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
                                      splashColor: Colors.blue.withOpacity(
                                          0.3), // Ripple effect color
                                      highlightColor:
                                          Colors.blue.withOpacity(0.1), // Hold
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
                                                        border:
                                                            Border.all(
                                                                color:
                                                                    Colors.red,
                                                                width: 2),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(10)),
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
                                              const SizedBox(
                                                width: 20,
                                              ),
                                              ConstrainedBox(
                                                constraints:
                                                    const BoxConstraints(
                                                        maxWidth: 170),
                                                child: Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                      e.property.propertyTitle,
                                                      style: const TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontSize: 18,
                                                      ),
                                                    ),
                                                    Text(
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                      "Hosted by ${e.property.user.firstName}",
                                                      style: const TextStyle(
                                                        fontSize: 15,
                                                      ),
                                                    ),
                                                    Text(
                                                        softWrap: true,
                                                        "${e.checkInDay.day} ${months[e.checkInDay.month - 1].substring(0, 3)} ${e.checkOutDay.year} - ${e.checkOutDay.day} ${months[e.checkOutDay.month - 1].substring(0, 3)} ${e.checkOutDay.year}")
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
                    // if (isLoading) const LoadingIcon(size: 40),
                  ],
                )
              : !isLoading
                  ? SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Center(
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
                              const Text(
                                "You don't have any refund",
                                textAlign: TextAlign.center,
                                softWrap: true,
                                style: TextStyle(fontWeight: FontWeight.bold),
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
                                  getRefundListCubit().refresh();
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
                      ),
                    )
                  : const LoadingIcon(size: 50),
          if (isLoading && getRefundListCubit().currentPage != 0)
            const Positioned(
              bottom: 20,
              left: 0,
              right: 0,
              child: LoadingIcon(size: 40),
            ),
        ],
      ),
    );
  }
}
