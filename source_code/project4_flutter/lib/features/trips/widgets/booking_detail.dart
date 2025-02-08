import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/messages/widgets/messages_body.dart';
import 'package:project4_flutter/features/property_detail/property_detail.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/trip_cubit/trip_cubit.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../messages/bloc/message_cubit/add_friend_cubit.dart';
import '../../messages/bloc/message_cubit/search_friend_cubit.dart';

class BookingDetail extends StatefulWidget {
  const BookingDetail(this.booking, {super.key});

  final BookingMinimizeDto booking;

  @override
  State<BookingDetail> createState() => _BookingDetailState();
}

class _BookingDetailState extends State<BookingDetail> {
  late String status;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    status = widget.booking.status;
  }

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
        physics: const AlwaysScrollableScrollPhysics(),
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
                items: widget.booking.property.propertyImages.map((i) {
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
                    print("sssssvxcvrst");

                    Navigator.push(context, MaterialPageRoute(
                      builder: (context) {
                        return MultiBlocProvider(
                          providers: [
                            BlocProvider(
                              create: (_) => SearchFriendCubit(
                                  widget.booking.customer.id.toString()),
                            ),
                            BlocProvider(
                              create: (_) => AddFriendCubit(),
                            )
                          ],
                          child: MessagesBody(
                            userId: widget.booking.host.id,
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
                              "Message your host",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            Text(
                              widget.booking.property.user.firstName,
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
                            PropertyDetail(widget.booking.property.id),
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
                              widget.booking.property.propertyTitle,
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
              SizedBox(
                height: 250,
                child: FlutterMap(
                  options: MapOptions(
                    initialCenter: LatLng(
                        double.parse(widget.booking.property.coordinatesX),
                        double.parse(widget.booking.property
                            .coordinatesY)), // Center the map over London
                    initialZoom: 15,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                          'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // OSMF's Tile Server
                      userAgentPackageName: 'com.example.app',
                    ),
                    RichAttributionWidget(
                      attributions: [
                        TextSourceAttribution(
                          'OpenStreetMap contributors',
                          onTap: () => launchUrl(Uri.parse(
                              'https://openstreetmap.org/copyright')), // (external)
                        ),
                        // Also add images...
                      ],
                    ),
                    LocationMarkerLayer(
                      style: const LocationMarkerStyle(
                        marker: Image(
                            height: 50,
                            width: 50,
                            image: AssetImage('assets/images/marker.png')),
                      ),
                      position: LocationMarkerPosition(
                        latitude:
                            double.parse(widget.booking.property.coordinatesX),
                        longitude:
                            double.parse(widget.booking.property.coordinatesY),
                        accuracy: 1,
                      ),
                    )
                  ],
                ),
              ),
              if (widget.booking.status == "PENDING ")
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
                                    "${widget.booking.adult} adults${widget.booking.children != 0 ? ", ${widget.booking.children}  children." : "."}")
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
                              widget.booking.bookingCode,
                              softWrap: true,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () {
                          showModalBottomSheet(
                            context: context,
                            builder: (context) {
                              return SizedBox(
                                width: MediaQuery.of(context).size.width,
                                height:
                                    300, // Set a fixed height for the bottom sheet, or you can use constraints
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    QrImageView(
                                      data: widget.booking.bookingCode,
                                      version: QrVersions.auto,
                                      size: 200.0,
                                    ),
                                  ],
                                ),
                              );
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
              if (status == "ACCEPT")
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
                                    MediaQuery.of(context).size.width * 0.8,
                              ),
                              child: Text(
                                widget.booking.refundPolicy.policyName ==
                                        "Flexible"
                                    ? returnFlexibleRefund(
                                        widget.booking.checkInDay)
                                    : widget.booking.refundPolicy.policyName ==
                                            "Moderate"
                                        ? returnModerateRefund(
                                            widget.booking.checkInDay)
                                        : "Non refundable",
                                softWrap: true,
                              ),
                            ),
                            if ((widget.booking.refundPolicy.policyName ==
                                        "Flexible" &&
                                    checkIfFlexibleRefundable("Flexible",
                                        widget.booking.checkInDay)) ||
                                (widget.booking.refundPolicy.policyName ==
                                        "Moderate" &&
                                    checkIfModerateRefundable(
                                        "Moderate", widget.booking.checkInDay)))
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
                                onPressed: () async {
                                  var result = await context
                                      .read<TripCubit>()
                                      .refund({
                                    "bookingId": widget.booking.id.toString()
                                  });

                                  if (result == true) {
                                    setState(() {
                                      status = "REFUND";
                                    });
                                  }
                                },
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 24.0, vertical: 12.0),
                                  child: Text(
                                    'Refund',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
                              )
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
                                if (widget.booking.selfCheckIn)
                                  Text(
                                    'Self check in${widget.booking.selfCheckInType != null ? " with ${widget.booking.selfCheckInType}" : "."}',
                                  ),
                                Text(
                                  widget.booking.property.smokingAllowed
                                      ? 'No smoking.'
                                      : 'Smoking allowed.',
                                ),
                                Text(
                                  widget.booking.property.petAllowed
                                      ? 'No pet.'
                                      : 'Pet allowed.',
                                ),
                                Text(
                                  'Maximum guest is ${widget.booking.property.maximumGuest}.',
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
              if (widget.booking.status == "ACCEPT" &&
                  widget.booking.selfCheckInInstruction != null &&
                  showCheckInInstruction(widget.booking.checkInDay))
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 20),
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
                                      data:
                                          widget.booking.selfCheckInInstruction,
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
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            PropertyDetail(widget.booking.property.id),
                      ),
                    );
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
                                  icon: HugeIcons.strokeRoundedHome03,
                                  color: Colors.black,
                                  size: 24.0,
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  "Show listing",
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
                                  "Hosted by ${widget.booking.property.user.firstName}",
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
                          image: widget.booking.property.user.avatar != null
                              ? NetworkImage(widget.booking.property.user
                                  .avatar!) // Assuming cardAvatar is a URL
                              : null,
                          size: 40,
                          child: Text(
                            widget.booking.property.user.firstName,
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
                                  widget.booking.customer.id.toString()),
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
                    DateFormat("EEEE d, MMM").format(widget.booking.checkInDay),
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 15,
                    ),
                  ),
                  Text(DateFormat("h:mm a").format(widget.booking.checkInDay)),
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
                  DateFormat("EEEE d, MMM").format(widget.booking.checkOutDay),
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                  ),
                ),
                Text(DateFormat("h:mm a").format(widget.booking.checkOutDay)),
              ],
            )
          ],
        ),
      ),
    );
  }
}
