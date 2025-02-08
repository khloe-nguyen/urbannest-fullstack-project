import 'dart:async';

import 'package:delightful_toast/delight_toast.dart';
import 'package:delightful_toast/toast/components/toast_card.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/favourite/favourite.dart';
import 'package:project4_flutter/features/favourite/favourite_home_page.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:provider/provider.dart';
import 'features/messages/message.dart';
import 'features/profile/profile.dart';
import 'features/travel/travel.dart';
import 'features/trips/trip.dart';
import 'main.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _bottomNavigationIndex = 0;
  late Stream<DatabaseEvent> _dataStream;
  StreamSubscription<DatabaseEvent>? _subscription;

  final PageController _pageController = PageController();

  final List<Widget> _pages = [
    const Travel(),
    const FavouriteHomePage(),
    const Trip(),
    const Message(),
    const Profile()
  ];

  @override
  void initState() {
    // TODO: implement initState

    super.initState();
    context.read<UserCubit>().stream.listen(
      (state) {
        if (state is UserSuccess) {
          // If the user is logged in, create the event listener and start streaming
          var user = state.user;

          _dataStream =
              databaseRef.child("notification_${user.id}_phone").onValue;

          _subscription = _dataStream.listen(
            (DatabaseEvent event) {
              if (event.snapshot.value != null) {
                final data = event.snapshot.value as Map<dynamic, dynamic>;
                final String message = data['message'];
                final String mobile = data['mobile'];

                if (mounted) {
                  if (mobile == "false") {
                    setState(() {
                      databaseRef
                          .child("notification_${user.id}_phone")
                          .set({...data, 'mobile': 'true'});

                      DelightToastBar(
                        builder: (context) => ToastCard(
                          leading: const Icon(
                            Icons.flutter_dash,
                            size: 28,
                          ),
                          title: Text(
                            message,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ).show(context);
                    });
                  }
                }
              }
            },
          );
        } else {
          if (_subscription != null) {
            _subscription!.cancel();
          }
        }
      },
    );
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    if (_subscription != null) {
      _subscription!.cancel();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: _pages,
        onPageChanged: (index) {
          setState(() {
            _bottomNavigationIndex = index;
          });
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomNavigationIndex,
        onTap: (value) {
          setState(() {
            _bottomNavigationIndex = value;
          });
          _pageController.jumpToPage(value);
        },
        unselectedItemColor: Colors.black,
        selectedItemColor: Colors.red,
        type: BottomNavigationBarType.fixed,
        items: [
          const BottomNavigationBarItem(
            activeIcon: HugeIcon(
              icon: HugeIcons.strokeRoundedSearch01,
              color: Colors.red,
              size: 25.0,
            ),
            icon: HugeIcon(
              icon: HugeIcons.strokeRoundedSearch01,
              color: Colors.black,
              size: 25.0,
            ),
            label: "Explore",
          ),
          const BottomNavigationBarItem(
            activeIcon: HugeIcon(
              icon: HugeIcons.strokeRoundedFavourite,
              color: Colors.red,
              size: 25.0,
            ),
            icon: HugeIcon(
              icon: HugeIcons.strokeRoundedFavourite,
              color: Colors.black,
              size: 25.0,
            ),
            label: "Favorites",
          ),
          BottomNavigationBarItem(
            activeIcon: SvgPicture.asset(
              "assets/images/logo.svg",
              height: 25.0,
              color: Colors.red,
            ),
            icon: SvgPicture.asset(
              "assets/images/logo.svg",
              height: 25.0,
            ),
            label: "Trips",
          ),
          const BottomNavigationBarItem(
            activeIcon: HugeIcon(
              icon: HugeIcons.strokeRoundedBubbleChat,
              color: Colors.red,
              size: 25.0,
            ),
            icon: HugeIcon(
              icon: HugeIcons.strokeRoundedBubbleChat,
              color: Colors.black,
              size: 25.0,
            ),
            label: "Message",
          ),
          const BottomNavigationBarItem(
            activeIcon: HugeIcon(
              icon: HugeIcons.strokeRoundedUserCircle,
              color: Colors.red,
              size: 25.0,
            ),
            icon: HugeIcon(
              icon: HugeIcons.strokeRoundedUserCircle,
              color: Colors.black,
              size: 25.0,
            ),
            label: "Profile",
          )
        ],
      ),
    );
  }
}
