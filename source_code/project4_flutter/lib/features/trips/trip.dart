import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/trips/widgets/user_trip.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

import '../../shared/widgets/bold_text.dart';
import '../authentication/authentication.dart';

class Trip extends StatefulWidget {
  const Trip({super.key});

  @override
  State<Trip> createState() => _TripState();
}

class _TripState extends State<Trip> {
  String dropDownSelectOption = 'Trips';

  final List<String> list = <String>[
    'Trips',
    'Reservation',
    'Refund',
    'Review'
  ];

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserCubit, UserState>(
      builder: (context, state) {
        if (state is UserSuccess) {
          return const UserTrip();
        }

        if (state is UserNotLogin) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const BoldText(
                  text: "Please login to see your own trips",
                  fontSize: 18,
                ),
                const SizedBox(
                  height: 20,
                ),
                ElevatedButton(
                  style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(Colors.black),
                    elevation: WidgetStateProperty.all(
                        5), // Adjust elevation to create shadow
                    shadowColor: WidgetStateProperty.all(Colors.black
                        .withValues(alpha: 0.5)), // Shadow color and opacity
                  ),
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(
                      builder: (context) {
                        return Authentication();
                      },
                    ));
                  },
                  child: const Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                    child: Text(
                      'Login',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                )
              ],
            ),
          );
        }

        if (state is UserLoading) {
          return const LoadingIcon(size: 60);
        }

        return const Text("Loading...");
      },
    );
  }
}
