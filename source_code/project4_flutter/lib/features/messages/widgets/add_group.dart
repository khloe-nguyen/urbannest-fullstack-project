import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_group_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_group_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_group_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_group_state.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

import '../../../shared/bloc/user_cubit/user_cubit.dart';
import '../../../shared/models/user.dart';
import '../models/search_friend_entity.dart';

class AddGroup extends StatefulWidget {
  const AddGroup({super.key});

  @override
  State<AddGroup> createState() => _AddGroupState();
}

class _AddGroupState extends State<AddGroup> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _groupInput = TextEditingController();

  final List<SearchFriendEntity> groupMemberList = [];
  late User user;

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    _searchController.dispose();
    _groupInput.dispose();
  }

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
          "Add new Group",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        // toolbarHeight: 100,
        bottom: PreferredSize(
          preferredSize:
              const Size.fromHeight(1.0), // Set the height of the border
          child: Container(
            color: const Color.fromARGB(30, 0, 0, 0), // Border color
            height: 1.0, // Border thickness
          ),
        ),
      ),
      body: buildBlocConsumer(),
      bottomNavigationBar: groupMemberList.isNotEmpty
          ? Container(
              padding: const EdgeInsetsDirectional.all(10),
              decoration: const BoxDecoration(
                  border: Border(
                      top: BorderSide(
                          color: Color.fromARGB(25, 0, 0, 0), width: 1))),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  SizedBox(
                    height: 60,
                    width: MediaQuery.of(context).size.width * 0.7,
                    child: ListView.builder(
                      itemCount: groupMemberList.length,
                      scrollDirection: Axis.horizontal,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.all(2.0),
                          child: Stack(
                            children: [
                              AdvancedAvatar(
                                foregroundDecoration: BoxDecoration(
                                    border:
                                        Border.all(color: Colors.red, width: 2),
                                    borderRadius: BorderRadius.circular(50)),
                                name: "room",
                                statusAlignment: Alignment.topRight,
                                image: groupMemberList[index].avatar != null
                                    ? NetworkImage(groupMemberList[index]
                                        .avatar!) // Assuming cardAvatar is a URL
                                    : null,
                                size: 40,
                                child: Text(
                                  groupMemberList[index].firstName,
                                  style: const TextStyle(color: Colors.white),
                                ),
                              ),
                              Positioned(
                                top: 0,
                                right: 0,
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      groupMemberList
                                          .remove(groupMemberList[index]);
                                    });
                                  }, // Call the provided onClose function when clicked
                                  child: const CircleAvatar(
                                    radius: 8,
                                    backgroundColor: Colors.red,
                                    child: Icon(
                                      Icons.close,
                                      color: Colors.white,
                                      size: 7,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                      onPressed: () {
                        if (_groupInput.text.isEmpty) {
                          Fluttertoast.showToast(
                            msg: "Please input your group name",
                            toastLength: Toast
                                .LENGTH_SHORT, // Toast.LENGTH_SHORT or Toast.LENGTH_LONG
                            gravity: ToastGravity
                                .BOTTOM, // ToastGravity.TOP, ToastGravity.CENTER, etc.
                            timeInSecForIosWeb: 1, // Duration for iOS and Web
                            backgroundColor: Colors.black,
                            textColor: Colors.white,
                            fontSize: 16.0,
                          );
                        } else {
                          var memberList = groupMemberList
                              .map(
                                (e) => e.id,
                              )
                              .toList();
                          memberList.add(user.id!);

                          Map<String, dynamic> body = {
                            'groupName': _groupInput.text,
                            'members': memberList
                          };

                          context.read<AddGroupCubit>().addFriend(body);
                        }
                      },
                      icon: const HugeIcon(
                        icon: HugeIcons.strokeRoundedLinkForward,
                        color: Colors.black,
                        size: 24.0,
                      ))
                ],
              ),
            )
          : null,
    );
  }

  BlocConsumer<AddGroupCubit, AddGroupState> buildBlocConsumer() {
    return BlocConsumer<AddGroupCubit, AddGroupState>(
      builder: (context, addFriendState) {
        return Center(
          child: Padding(
            padding: const EdgeInsetsDirectional.symmetric(
                horizontal: 20, vertical: 20),
            child: Column(
              children: [
                TextFormField(
                  controller: _groupInput,
                  decoration: const InputDecoration(labelText: "Group name"),
                ),
                TextFormField(
                  controller: _searchController,
                  onChanged: (value) {
                    context.read<SearchGroupCubit>().searchGroup(
                        user.id.toString(),
                        search: _searchController.text);
                  },
                  decoration: const InputDecoration(labelText: "Search friend"),
                ),
                BlocBuilder<SearchGroupCubit, SearchGroupState>(
                  builder: (context, searchGroupState) {
                    if (searchGroupState is SearchGroupLoading) {
                      return const LoadingIcon(size: 60);
                    }
                    if (searchGroupState is SearchGroupSuccess) {
                      var listFriend = searchGroupState.list;
                      return Expanded(
                        child: ListView.builder(
                            itemCount: listFriend!.length,
                            itemBuilder: (context, index) {
                              return Padding(
                                padding: const EdgeInsets.all(5.0),
                                child: TextButton(
                                  style: TextButton.styleFrom(
                                      backgroundColor: groupMemberList
                                              .contains(listFriend[index])
                                          ? Colors.red
                                          : null),
                                  onPressed: () {
                                    setState(() {
                                      if (groupMemberList
                                          .contains(listFriend[index])) {
                                        groupMemberList
                                            .remove(listFriend[index]);
                                      } else {
                                        groupMemberList.add(listFriend[index]);
                                      }
                                    });
                                  },
                                  child: Align(
                                    alignment: Alignment.topLeft,
                                    child: Row(
                                      children: [
                                        AdvancedAvatar(
                                          foregroundDecoration: BoxDecoration(
                                              border: Border.all(
                                                  color: Colors.red, width: 2),
                                              borderRadius:
                                                  BorderRadius.circular(50)),
                                          name: "room",
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
                                                  fontSize: 14),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
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
      listener: (context, addGroupState) {
        if (addGroupState is AddGroupSuccess) {
          Navigator.pop(context, addGroupState.id);
        }
      },
    );
  }
}
