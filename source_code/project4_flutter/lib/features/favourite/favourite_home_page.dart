import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/favourite/favourite.dart';
import 'package:project4_flutter/shared/widgets/bold_text.dart';

import '../../home_screen.dart';
import '../../shared/bloc/user_cubit/user_cubit.dart';
import '../../shared/bloc/user_cubit/user_state.dart';
import '../../shared/widgets/loading_icon.dart';
import '../authentication/authentication.dart';

class FavouriteHomePage extends StatelessWidget {
  const FavouriteHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<UserCubit, UserState>(
      builder: (context, state) {
        if (state is UserNotLogin) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const BoldText(
                  text: "Please login to see your own favourite",
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

        if (state is UserSuccess) {
          return const Favourite();
        }

        return const Text("Loading....");
      },
      listener: (context, state) {
        if (state is UserError) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const HomeScreen()),
            (route) => false, // Removes all previous routes
          );

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
      },
    );
  }
}
