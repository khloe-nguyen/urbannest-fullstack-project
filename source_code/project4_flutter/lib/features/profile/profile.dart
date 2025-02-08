import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:loading_indicator/loading_indicator.dart';
import 'package:project4_flutter/features/profile/widgets/authorize_profile.dart';
import 'package:project4_flutter/features/profile/widgets/unauthorize_profile.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

import '../../home_screen.dart';

class Profile extends StatelessWidget {
  const Profile({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<UserCubit, UserState>(
      builder: (context, state) {
        if (state is UserNotLogin) {
          return const UnauthorizeProfile();
        }

        if (state is UserLoading) {
          return const LoadingIcon(size: 60);
        }

        if (state is UserSuccess) {
          return const AuthorizeProfile();
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
