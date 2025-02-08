import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_state.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

import '../../../shared/bloc/user_cubit/user_cubit.dart';
import '../../../shared/models/user.dart';

class AddFriend extends StatefulWidget {
  const AddFriend({super.key});

  @override
  State<AddFriend> createState() => _AddFriendState();
}

class _AddFriendState extends State<AddFriend> {
  final TextEditingController _searchController = TextEditingController();
  late User user;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    user = context.read<UserCubit>().loginUser!;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const HugeIcon(
            icon: HugeIcons.strokeRoundedArrowTurnBackward,
            color: Colors.black,
            size: 24.0,
          ),
        ),
        title: const Text(
          "Add new chat",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        toolbarHeight: 100,
        bottom: PreferredSize(
          preferredSize:
              const Size.fromHeight(1.0), // Set the height of the border
          child: Container(
            color: const Color.fromARGB(30, 0, 0, 0), // Border color
            height: 1.0, // Border thickness
          ),
        ),
      ),
      body: BlocConsumer<AddFriendCubit, AddFriendState>(
        builder: (context, addFriendState) {
          return Center(
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                  horizontal: 20, vertical: 20),
              child: Column(
                children: [
                  TextFormField(
                    controller: _searchController,
                    onChanged: (value) {
                      context.read<SearchFriendCubit>().searchFriend(
                          user.id.toString(),
                          search: _searchController.text);
                    },
                    decoration:
                        const InputDecoration(labelText: "Search friend"),
                  ),
                  BlocBuilder<SearchFriendCubit, SearchFriendState>(
                    builder: (context, searchState) {
                      if (searchState is SearchFriendLoading) {
                        return const LoadingIcon(size: 60);
                      }
                      if (searchState is SearchFriendSuccess) {
                        var listFriend = searchState.list;
                        return Expanded(
                          child: ListView.builder(
                              itemCount: listFriend!.length,
                              itemBuilder: (context, index) {
                                return TextButton(
                                  onPressed: () {
                                    Map<String, dynamic> body = {
                                      'userId': user.id,
                                      'friendId': listFriend[index].id
                                    };
                                    context
                                        .read<AddFriendCubit>()
                                        .addFriend(body);
                                  },
                                  child: Align(
                                    alignment: Alignment.topLeft,
                                    child: Row(
                                      children: [
                                        AdvancedAvatar(
                                          name: "room",
                                          foregroundDecoration: BoxDecoration(
                                              border: Border.all(
                                                  color: Colors.red, width: 2),
                                              borderRadius:
                                                  BorderRadius.circular(50)),
                                          statusAlignment: Alignment.topRight,
                                          image: listFriend[index].avatar !=
                                                  null
                                              ? NetworkImage(listFriend[index]
                                                  .avatar!) // Assuming cardAvatar is a URL
                                              : null,
                                          size: 60,
                                          child: Text(
                                            listFriend[index].firstName,
                                            style: const TextStyle(
                                                color: Colors.white),
                                          ),
                                        ),
                                        const SizedBox(
                                          width: 10,
                                        ),
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              "${listFriend[index].firstName} ${listFriend[index].lastName}",
                                              style: const TextStyle(
                                                color: Colors.black,
                                                fontSize: 18,
                                              ),
                                            ),
                                            Text(
                                              listFriend[index].email,
                                              style: const TextStyle(
                                                color: Colors.black,
                                                fontSize: 14,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              }),
                        );
                      }

                      return const Text("Loading...");
                    },
                  )
                ],
              ),
            ),
          );
        },
        listener: (context, addFriendState) {
          if (addFriendState is AddFriendSuccess) {
            Navigator.pop(context, addFriendState.id);
          }
        },
      ),
    );
  }
}
