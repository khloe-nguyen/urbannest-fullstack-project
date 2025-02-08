import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/booking_qr_scan/booking_qr_scan.dart';
import 'package:project4_flutter/features/listing_list/listing_list.dart';
import 'package:project4_flutter/features/login_and_security/login_and_security.dart';
import 'package:project4_flutter/features/login_security/login_security.dart';
import 'package:project4_flutter/features/personal_information/personal_information.dart';
import 'package:project4_flutter/features/qr_scanner/bloc/qr_scanner_cubit.dart';
import 'package:project4_flutter/features/trips/trip.dart';
import 'package:project4_flutter/main.dart';
import 'package:project4_flutter/shared/bloc/booking_qr_cubit/booking_qr_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/models/user.dart';
import 'package:project4_flutter/shared/widgets/bold_text.dart';

import '../../../shared/bloc/listing_list_cubit/listing_list_cubit.dart';
import '../../../shared/bloc/message_room_cubit/message_room_cubit.dart';
import '../../../shared/bloc/reservation_cubit/reservation_cubit.dart';
import '../../../shared/bloc/trip_cubit/trip_cubit.dart';
import '../../government/government.dart';
import '../../user_profile/user_profile.dart';

class AuthorizeProfile extends StatelessWidget {
  const AuthorizeProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserCubit, UserState>(
      builder: (context, state) {
        if (state is UserSuccess) {
          var user = state.user;
          return Scaffold(
            appBar: AppBar(
              forceMaterialTransparency: true,
              title: const Text(
                "Profile",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                ),
              ),
              toolbarHeight: 50,
              actions: [
                IconButton(
                  onPressed: () {},
                  icon: const HugeIcon(
                    icon: HugeIcons.strokeRoundedNotification03,
                    color: Colors.black,
                    size: 24.0,
                  ),
                ),
                const SizedBox(
                  width: 10,
                )
              ],
            ),
            body: Center(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    buildSettings(user, context),
                    const SizedBox(
                      height: 20,
                    ),
                    if (user.host == true) buildHost(user, context),
                    buildLegal(),
                    const SizedBox(
                      height: 20,
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: TextButton(
                        onPressed: () {
                          Map<String, dynamic> body = {
                            'token': fcmToken,
                            'userId': user.id
                          };
                          context.read<MessageRoomCubit>().logout();
                          context.read<ReservationCubit>().logout();
                          context.read<TripCubit>().logout();
                          context.read<ListingListCubit>().logout();
                          context.read<UserCubit>().logout(body);
                        },
                        style: TextButton.styleFrom(
                            padding: const EdgeInsets.all(0)),
                        child: const Text(
                          "Log out",
                          style: TextStyle(
                            fontSize: 20,
                            decoration: TextDecoration.underline,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 40,
                    ),
                  ],
                ),
              ),
            ),
          );
        }
        return const Text("Loading....");
      },
    );
  }

  Column buildSettings(User user, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(20.0),
          child: Container(
            padding: const EdgeInsetsDirectional.symmetric(vertical: 20),
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: Color.fromARGB(50, 0, 0, 0),
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AdvancedAvatar(
                  name: "user name",
                  image: user.avatar != null
                      ? NetworkImage(
                          user.avatar!) // Assuming cardAvatar is a URL
                      : null,
                  statusColor: Colors.green,
                  statusAlignment: Alignment.topRight,
                  size: 60,
                  child: Text(
                    user.firstName[0],
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(
                  width: 20,
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    BoldText(text: user.firstName, fontSize: 15),
                    TextButton(
                      style: TextButton.styleFrom(
                          padding: const EdgeInsets.all(0)),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const UserProfile(),
                          ),
                        );
                      },
                      child: const Text("Show profile"),
                    ),
                  ],
                ),
                const Spacer(),
                const HugeIcon(
                  icon: HugeIcons.strokeRoundedArrowRight01,
                  color: Colors.black,
                  size: 24.0,
                )
              ],
            ),
          ),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            "Settings",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(
          height: 20,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const PersonalInformation(),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedUserCircle,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Personal information",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) {
                return const LoginSecurity();
              },
            ));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedShield01,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Login & security",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const Government(),
                ));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedMoney03,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Government information",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedNotification02,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Notifications",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const Trip(),
                ));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedBackpack03,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Travel",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
    );
  }

  Column buildHost(User user, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            "Host",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(
          height: 20,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) {
                return const ListingList();
              },
            ));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedHome13,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Listing list",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) {
                return BlocProvider(
                    create: (_) => BookingQrCubit(),
                    child: const BookingQrScan());
              },
            ));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedQrCode,
                    color: Colors.black,
                    size: 24.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Scan booking by Qr code",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        // TextButton(
        //   style: TextButton.styleFrom(
        //     padding: EdgeInsets.zero,
        //     shape: const RoundedRectangleBorder(
        //       borderRadius: BorderRadius
        //           .zero, // No rounded corners, sharp rectangle edges
        //     ),
        //   ),
        //   onPressed: () {},
        //   child: Padding(
        //     padding: const EdgeInsets.symmetric(horizontal: 20),
        //     child: Container(
        //       padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
        //       decoration: const BoxDecoration(
        //         border: Border(
        //           bottom:
        //               BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
        //         ),
        //       ),
        //       child: const Row(
        //         children: [
        //           HugeIcon(
        //             icon: HugeIcons.strokeRoundedBookOpen02,
        //             color: Colors.black,
        //             size: 26.0,
        //           ),
        //           SizedBox(
        //             width: 10,
        //           ),
        //           Text(
        //             "Open source licenses",
        //             style: TextStyle(fontSize: 16, color: Colors.black),
        //           ),
        //           Spacer(),
        //           HugeIcon(
        //             icon: HugeIcons.strokeRoundedArrowRight01,
        //             color: Colors.black,
        //             size: 24.0,
        //           ),
        //         ],
        //       ),
        //     ),
        //   ),
        // ),
        // const SizedBox(
        //   height: 20,
        // ),
      ],
    );
  }

  Column buildLegal() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            "Legal",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(
          height: 20,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedBookOpen02,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Term of Service",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedBookOpen02,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Term of Service",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
        const SizedBox(
          height: 10,
        ),
        TextButton(
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius
                  .zero, // No rounded corners, sharp rectangle edges
            ),
          ),
          onPressed: () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
              decoration: const BoxDecoration(
                border: Border(
                  bottom:
                      BorderSide(color: Color.fromARGB(30, 0, 0, 0), width: 1),
                ),
              ),
              child: const Row(
                children: [
                  HugeIcon(
                    icon: HugeIcons.strokeRoundedBookOpen02,
                    color: Colors.black,
                    size: 26.0,
                  ),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    "Open source licenses",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Spacer(),
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
    );
  }
}
