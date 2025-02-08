import 'package:carousel_slider/carousel_slider.dart';
import 'package:delightful_toast/delight_toast.dart';
import 'package:delightful_toast/toast/components/toast_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:intl/intl.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../messages/bloc/message_cubit/add_friend_cubit.dart';
import '../../messages/bloc/message_cubit/search_friend_cubit.dart';
import '../../messages/widgets/messages_body.dart';
import '../../property_detail/property_detail.dart';

class HostBookingDetail extends StatelessWidget {
  const HostBookingDetail({required this.booking, super.key});

  final BookingMinimizeDto booking;

  bool checkIfModerateRefundable(String type, DateTime checkIn) {
    if (type == "Moderate") {
      DateTime checkInDate = checkIn;
      DateTime currentDate = DateTime.now();

      // 604800000 ms = 7 days in milliseconds
      if (checkInDate
          .isAfter(currentDate.add(const Duration(milliseconds: 604800000)))) {
        return true;
      }
    }
    return false;
  }

  bool checkIfFlexibleRefundable(String type, DateTime checkIn) {
    if (type == "Flexible") {
      DateTime checkInDate = checkIn;
      DateTime currentDate = DateTime.now();

      // 172800000 ms = 2 days in milliseconds
      if (checkInDate
          .isAfter(currentDate.add(const Duration(milliseconds: 172800000)))) {
        return true;
      }
    }
    return false;
  }

  DateTime returnTimeRefundable(DateTime checkIn, int day) {
    return checkIn.subtract(Duration(days: day)).toLocal();
  }

  String returnModerateRefund(checkInDay) {
    DateTime refundableDate = returnTimeRefundable(checkInDay, 7);

    return "Cancel before ${DateFormat("h:mm a").format(refundableDate)} on ${DateFormat("dd MMM").format(refundableDate)} for a full refund. After that, the reservation is non-refundable";
  }

  String returnFlexibleRefund(checkInDay) {
    DateTime refundable5Date = returnTimeRefundable(checkInDay, 5);
    DateTime refundable2Date = returnTimeRefundable(checkInDay, 2);

    return "Cancel before ${DateFormat("h:mm a").format(refundable5Date)} on ${DateFormat("dd MMM").format(refundable5Date)} for a full refund or before ${DateFormat("h:mm a").format(refundable2Date)} on ${DateFormat("dd MMM").format(refundable2Date)} for a 50% refund. After that, the reservation is non-refundable.";
  }

  bool showCheckInInstruction(DateTime checkInDate) {
    checkInDate =
        DateTime(checkInDate.year, checkInDate.month, checkInDate.day);

    DateTime showInstructionDate =
        checkInDate.subtract(const Duration(milliseconds: 172800000));

    if (DateTime.now().isAfter(showInstructionDate)) {
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        toolbarHeight: 0,
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CarouselSlider(
                options: CarouselOptions(
                  height: 250,
                  aspectRatio: 16 / 9,
                  viewportFraction: 1,
                  initialPage: 0,
                  enableInfiniteScroll: true,
                  reverse: false,
                  autoPlayCurve: Curves.fastOutSlowIn,
                  enlargeFactor: 0.3,
                  scrollDirection: Axis.horizontal,
                ),
                items: booking.property.propertyImages.map((i) {
                  return Builder(
                    builder: (BuildContext context) {
                      return Container(
                        width: MediaQuery.of(context).size.width * 1,
                        decoration: BoxDecoration(
                          image: DecorationImage(
                            image: NetworkImage(
                                i), // Replace with your image URL or AssetImage
                            fit: BoxFit
                                .cover, // Ensures the image covers the entire container
                          ),
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
              buildCheckInCheckOut(),
              Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                child: InkWell(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(
                      builder: (context) {
                        return MultiBlocProvider(
                          providers: [
                            BlocProvider(
                              create: (_) => SearchFriendCubit(
                                  booking.customer.id.toString()),
                            ),
                            BlocProvider(
                              create: (_) => AddFriendCubit(),
                            )
                          ],
                          child: MessagesBody(
                            userId: booking.customer.id,
                          ),
                        );
                      },
                    ));
                  },
                  splashColor:
                      Colors.blue.withOpacity(0.3), // Ripple effect color
                  highlightColor: Colors.blue.withOpacity(0.1), // Ho
                  child: Container(
                    padding: const EdgeInsets.only(top: 20),
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(
                                width: 1,
                                color: Colors.black.withOpacity(0.1)))),
                    child: Row(
                      children: [
                        const HugeIcon(
                          icon: HugeIcons.strokeRoundedBubbleChat,
                          color: Colors.black,
                          size: 40.0,
                        ),
                        const SizedBox(
                          width: 20,
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Message your customer",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            Text(
                              booking.customer.firstName,
                              style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black.withOpacity(0.4)),
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 12, left: 20, right: 20),
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            PropertyDetail(booking.property.id),
                      ),
                    );
                  },
                  splashColor:
                      Colors.blue.withOpacity(0.3), // Ripple effect color
                  highlightColor: Colors.blue.withOpacity(0.1), // Ho
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(
                                width: 1,
                                color: Colors.black.withOpacity(0.1)))),
                    child: Row(
                      children: [
                        const HugeIcon(
                          icon: HugeIcons.strokeRoundedWarehouse,
                          color: Colors.black,
                          size: 40.0,
                        ),
                        const SizedBox(
                          width: 20,
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Your place",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            Text(
                              booking.property.propertyTitle,
                              style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black.withOpacity(0.4)),
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              ),
              if (booking.status == "PENDING")
                Padding(
                  padding:
                      const EdgeInsets.only(bottom: 12, left: 20, right: 20),
                  child: InkWell(
                    onTap: () {},
                    splashColor:
                        Colors.blue.withOpacity(0.3), // Ripple effect color
                    highlightColor: Colors.blue.withOpacity(0.1), // Ho
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                          border: Border(
                              top: BorderSide(
                                  width: 1,
                                  color: Colors.black.withOpacity(0.1)))),
                      child: const Row(
                        children: [
                          HugeIcon(
                            icon: HugeIcons.strokeRoundedCancelCircle,
                            color: Colors.black,
                            size: 40.0,
                          ),
                          SizedBox(
                            width: 20,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Cancel your reservation",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              Container(
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      width: 5,
                      color: Colors.black.withOpacity(0.2),
                    ),
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Reservation details",
                      textAlign: TextAlign.start,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 22,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Container(
                        padding: const EdgeInsets.only(bottom: 20),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              width: 1,
                              color: Colors.black.withOpacity(0.1),
                            ),
                          ),
                        ),
                        child: Row(
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Who's coming",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(
                                  height: 10,
                                ),
                                Text(
                                    "${booking.adult} adults${booking.children != 0 ? ", ${booking.children}  children." : "."}")
                              ],
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        width: 1,
                        color: Colors.black.withOpacity(0.1),
                      ),
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Confirmation code",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 220),
                            child: Text(
                              booking.bookingCode,
                              softWrap: true,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () {
                          Navigator.push(context, MaterialPageRoute(
                            builder: (context) {
                              return MobileScanner(
                                controller: MobileScannerController(
                                    detectionSpeed:
                                        DetectionSpeed.noDuplicates),
                                onDetect: (capture) {
                                  final List<Barcode> barcodes =
                                      capture.barcodes;
                                  if (barcodes.first.rawValue != null) {
                                    if (barcodes.first.rawValue ==
                                        booking.bookingCode) {
                                      Navigator.pop(context, true);
                                    } else {
                                      Navigator.pop(context, false);
                                    }
                                  }
                                },
                              );
                            },
                          )).then(
                            (value) {
                              if (value == true && context.mounted) {
                                return DelightToastBar(
                                  builder: (context) {
                                    return const ToastCard(
                                      leading: Icon(
                                        Icons.house,
                                        size: 28,
                                      ),
                                      title: Text(
                                        "Success",
                                        style: TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 14,
                                        ),
                                      ),
                                    );
                                  },
                                ).show(context);
                              }
                              if (value == false && context.mounted) {
                                return DelightToastBar(
                                  builder: (context) {
                                    return const ToastCard(
                                      leading: Icon(
                                        Icons.house,
                                        size: 28,
                                      ),
                                      title: Text(
                                        "Failed",
                                        style: TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 14,
                                        ),
                                      ),
                                    );
                                  },
                                ).show(context);
                              }
                            },
                          );
                        },
                        icon: const HugeIcon(
                          icon: HugeIcons.strokeRoundedQrCode,
                          color: Colors.black,
                          size: 24.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (booking.status == "ACCEPT")
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    padding: const EdgeInsets.only(bottom: 20, top: 20),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Cancellation policy",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            ConstrainedBox(
                              constraints: BoxConstraints(
                                  maxWidth:
                                      MediaQuery.of(context).size.width * 0.8),
                              child: Text(
                                booking.refundPolicy.policyName == "Flexible"
                                    ? returnFlexibleRefund(booking.checkInDay)
                                    : booking.refundPolicy.policyName ==
                                            "Moderate"
                                        ? returnModerateRefund(
                                            booking.checkInDay)
                                        : "Non refundable",
                                softWrap: true,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              Container(
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      width: 5,
                      color: Colors.black.withOpacity(0.2),
                    ),
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Rules and instructions",
                      textAlign: TextAlign.start,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 22,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Container(
                        padding: const EdgeInsets.only(bottom: 20),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              width: 1,
                              color: Colors.black.withOpacity(0.1),
                            ),
                          ),
                        ),
                        child: Row(
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "House rules",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(
                                  height: 10,
                                ),
                                if (booking.selfCheckIn)
                                  Text(
                                    'Self check in${booking.selfCheckInType != null ? " with ${booking.selfCheckInType}" : "."}',
                                  ),
                                Text(
                                  booking.property.smokingAllowed
                                      ? 'No smoking.'
                                      : 'Smoking allowed.',
                                ),
                                Text(
                                  booking.property.petAllowed
                                      ? 'No pet.'
                                      : 'Pet allowed.',
                                ),
                                Text(
                                  'Maximum guest is ${booking.property.maximumGuest}.',
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
              if (booking.status == "ACCEPT" &&
                  booking.selfCheckInInstruction != null &&
                  showCheckInInstruction(booking.checkInDay))
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    padding: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(
                          width: 1,
                          color: Colors.black.withOpacity(0.1),
                        ),
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Self check-in instruction",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              builder: (context) {
                                return SingleChildScrollView(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 20),
                                    child: Html(
                                      data: booking.selfCheckInInstruction,
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                          icon: const HugeIcon(
                            icon: HugeIcons.strokeRoundedSetup01,
                            color: Colors.black,
                            size: 24.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
                child: InkWell(
                  onTap: () {},
                  splashColor:
                      Colors.blue.withOpacity(0.3), // Ripple effect color
                  highlightColor: Colors.blue.withOpacity(0.1), // Ho
                  child: Container(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const HugeIcon(
                                  icon: HugeIcons.strokeRoundedUser,
                                  color: Colors.black,
                                  size: 24.0,
                                ),
                                const SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Booked by ${booking.customer.firstName}",
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        AdvancedAvatar(
                          name: "room",
                          foregroundDecoration: BoxDecoration(
                              border: Border.all(color: Colors.red, width: 2),
                              borderRadius: BorderRadius.circular(50)),
                          statusAlignment: Alignment.topRight,
                          image: booking.property.user.avatar != null
                              ? NetworkImage(booking.property.user
                                  .avatar!) // Assuming cardAvatar is a URL
                              : null,
                          size: 40,
                          child: Text(
                            booking.property.user.firstName,
                            style: const TextStyle(color: Colors.white),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      width: 5,
                      color: Colors.black.withOpacity(0.2),
                    ),
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Get support anytime",
                      textAlign: TextAlign.start,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 22,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Container(
                        padding: const EdgeInsets.only(bottom: 20),
                        child: Row(
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ConstrainedBox(
                                  constraints: BoxConstraints(
                                      maxWidth:
                                          MediaQuery.of(context).size.width *
                                              0.8),
                                  child: const Text(
                                    "If you need help, we're available 24/7 from anywhere in the world",
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: InkWell(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(
                      builder: (context) {
                        return MultiBlocProvider(
                          providers: [
                            BlocProvider(
                              create: (_) => SearchFriendCubit(
                                  booking.customer.id.toString()),
                            ),
                            BlocProvider(
                              create: (_) => AddFriendCubit(),
                            )
                          ],
                          child: const MessagesBody(
                            userId: 0,
                          ),
                        );
                      },
                    ));
                  },
                  splashColor:
                      Colors.blue.withOpacity(0.3), // Ripple effect color
                  highlightColor: Colors.blue.withOpacity(0.1), // Ho
                  child: Container(
                    padding: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(
                          width: 1,
                          color: Colors.black.withOpacity(0.1),
                        ),
                      ),
                    ),
                    child: const Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                HugeIcon(
                                  icon: HugeIcons.strokeRoundedCustomerSupport,
                                  color: Colors.black,
                                  size: 24.0,
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Contact UrbanNest support",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        HugeIcon(
                          icon: HugeIcons.strokeRoundedArrowRight01,
                          color: Colors.black,
                          size: 24.0,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Padding buildCheckInCheckOut() {
    return Padding(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
      child: SizedBox(
        height: 70,
        child: GridView.count(
          shrinkWrap: true,
          crossAxisCount: 2,
          crossAxisSpacing: 20,
          children: [
            Container(
              decoration: BoxDecoration(
                border: Border(
                  right: BorderSide(
                    width: 1,
                    color: Colors.black.withOpacity(0.1),
                  ),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Check-in",
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  Text(
                    DateFormat("EEEE d, MMM").format(booking.checkInDay),
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 15,
                    ),
                  ),
                  Text(DateFormat("h:mm a").format(booking.checkInDay)),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Checkout",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                Text(
                  DateFormat("EEEE d, MMM").format(booking.checkOutDay),
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                  ),
                ),
                Text(DateFormat("h:mm a").format(booking.checkOutDay)),
              ],
            )
          ],
        ),
      ),
    );
  }
}
