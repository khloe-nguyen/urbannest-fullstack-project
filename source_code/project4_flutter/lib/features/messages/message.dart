import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/app.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/message_cubit.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_cubit.dart';
import 'package:project4_flutter/features/messages/widgets/messages_body.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';
import 'package:provider/provider.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

import '../../shared/bloc/user_cubit/user_cubit.dart';
import '../../shared/bloc/user_cubit/user_state.dart';
import '../../shared/widgets/bold_text.dart';
import '../authentication/authentication.dart';
import 'bloc/message_cubit/add_friend_cubit.dart';
import 'bloc/message_cubit/search_friend_cubit.dart';

class Message extends StatefulWidget {
  const Message({super.key});

  @override
  State<Message> createState() => _MessageState();
}

class _MessageState extends State<Message> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserCubit, UserState>(
      builder: (context, state) {
        if (state is UserSuccess) {
          return MultiBlocProvider(providers: [
            BlocProvider(
              create: (_) => SearchFriendCubit(state.user.id.toString()),
            ),
            BlocProvider(
              create: (_) => AddFriendCubit(),
            )
          ], child: const MessagesBody());
        }

        if (state is UserLoading) {
          return const LoadingIcon(size: 50);
        }

        if (state is UserNotLogin) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const BoldText(
                  text: "Please login to see your own messages",
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
        return const Text("Loading...");
      },
    );
  }
}
