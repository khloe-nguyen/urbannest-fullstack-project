import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/message_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/message_state.dart';
import 'package:project4_flutter/features/messages/models/message_room_entity.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

import '../../../shared/bloc/user_cubit/user_cubit.dart';
import '../../../shared/models/user.dart';
import '../models/room.dart';
import 'package:project4_flutter/features/messages/models/user_room.dart';

import 'image_container.dart';

final format = DateFormat.yMd();

class ChatScreen extends StatefulWidget {
  const ChatScreen(this.room, this.sendPrivateMessage, {super.key});
  final void Function({
    required String message,
    required String chosenRoom,
  }) sendPrivateMessage;

  final Room room;

  @override
  State<ChatScreen> createState() => ChatScreenState();
}

class ChatScreenState extends State<ChatScreen> {
  late User user;
  List<MessageRoomEntity> _listMessage = List.empty();
  final TextEditingController _chatController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    // Dispose the controller to free up resources
    _scrollController.dispose();
    _chatController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    user = context.read<UserCubit>().loginUser!;

    _scrollController.addListener(() async {
      if (_scrollController.offset <=
              _scrollController.position.minScrollExtent &&
          !_scrollController.position.outOfRange &&
          !context.read<MessageCubit>().isLoading) {
        await context.read<MessageCubit>().fetchMessages(widget.room.roomId);
      }
    });
  }

  void onReRender(MessageRoomEntity messageRoomEntity) {
    context.read<MessageCubit>().messageList.insert(0, messageRoomEntity);

    setState(() {});
  }

  void onSubmitMessage() {
    MessageRoomEntity messageRoomEntity = MessageRoomEntity(
        id: 0,
        message: _chatController.text,
        senderId: user.id!,
        createdAt: DateTime.now());
    context.read<MessageCubit>().messageList.insert(0, messageRoomEntity);

    widget.sendPrivateMessage(
      chosenRoom: context.read<MessageCubit>().roomId.toString(),
      message: _chatController.text,
    );

    _scrollController.jumpTo(_scrollController.position.maxScrollExtent);

    _chatController.text = "";

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    var chatUser = widget.room.users
        .where(
          (element) => element.id != user.id,
        )
        .first;

    return Scaffold(
      appBar: appBar(context, chatUser),
      bottomNavigationBar: Padding(
        padding:
            EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
          height: 65,
          width: MediaQuery.of(context).size.width,
          color: Colors.white,
          padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                color: Colors.red,
                onPressed: () {},
                icon: const HugeIcon(
                  icon: HugeIcons.strokeRoundedImage02,
                  color: Colors.black,
                  size: 24.0,
                ),
                // backgroundColor: ColorConstant.lightBlueA100,
              ),
              const SizedBox(
                width: 15,
              ),
              Expanded(
                child: TextFormField(
                  controller: _chatController,
                  decoration: const InputDecoration(
                    hintText: "Message...",
                    hintStyle: TextStyle(color: Colors.black),
                    border: OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.black),
                        borderRadius: BorderRadius.all(Radius.circular(25))),
                  ),
                ),
              ),
              const SizedBox(
                width: 15,
              ),
              // Send Button
              IconButton(
                color: Colors.red,
                onPressed: onSubmitMessage,
                icon: const HugeIcon(
                  icon: HugeIcons.strokeRoundedSent,
                  color: Colors.black,
                  size: 24.0,
                ),
                // backgroundColor: ColorConstant.lightBlueA100,
              ),
            ],
          ),
        ),
      ),
      body: BlocConsumer<MessageCubit, MessageState>(
        builder: (context, state) {
          _listMessage = context.read<MessageCubit>().messageList;
          return buildListView(chatUser, state);
        },
        listener: (context, state) {
          if (state is MessageSuccessFirstLoad) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              // Scroll to the end of the list
              _scrollController
                  .jumpTo(_scrollController.position.maxScrollExtent);
            });
          }
        },
      ),
    );
  }

  Column buildListView(UserRoom chatUser, state) {
    bool isLoading = state is MessageLoading;

    return Column(
      children: [
        if (isLoading) const LoadingIcon(size: 40),
        Expanded(
          child: ListView.builder(
            physics: const BouncingScrollPhysics(),
            controller: _scrollController,
            itemCount: _listMessage.length,
            itemBuilder: (context, index) {
              var message = _listMessage.reversed.toList()[index];

              var otherUser = widget.room.users
                  .where(
                    (element) => element.id == message.senderId,
                  )
                  .first;

              return message.senderId == user.id
                  ? Padding(
                      padding: const EdgeInsetsDirectional.symmetric(
                          vertical: 20, horizontal: 20),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(
                              color: Colors.black,
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(15.0),
                                bottomRight: Radius.circular(15.0),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                !message.message.contains("#image")
                                    ? ConstrainedBox(
                                        constraints: const BoxConstraints(
                                          maxWidth:
                                              200, // Set the maximum width
                                        ),
                                        child: Text(
                                          textAlign: TextAlign.end,
                                          message.message,
                                          softWrap: true,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 18,
                                          ),
                                        ),
                                      )
                                    : Column(
                                        children: message.message
                                            .substring(
                                                7, message.message.length - 1)
                                            .split(",")
                                            .map(
                                          (e) {
                                            return Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .symmetric(vertical: 1),
                                              child: Image.network(
                                                e,
                                                width:
                                                    200, // Customize width and height as needed
                                                height: 100,
                                                fit: BoxFit.cover,
                                              ),
                                            );
                                          },
                                        ).toList(),
                                      ),
                                const SizedBox(
                                  height: 20,
                                ),
                                Text(
                                  format.format(message.createdAt),
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(
                            width: 5,
                          ),
                          AdvancedAvatar(
                            name: "room",
                            foregroundDecoration: BoxDecoration(
                                border: Border.all(color: Colors.red, width: 2),
                                borderRadius: BorderRadius.circular(50)),
                            statusAlignment: Alignment.topRight,
                            image: user.avatar != null
                                ? NetworkImage(user
                                    .avatar!) // Assuming cardAvatar is a URL
                                : null,
                            size: 30,
                            child: Text(
                              user.firstName!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  : Padding(
                      padding: const EdgeInsetsDirectional.symmetric(
                          vertical: 20, horizontal: 20),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AdvancedAvatar(
                            name: "room",
                            foregroundDecoration: BoxDecoration(
                                border: Border.all(color: Colors.red, width: 2),
                                borderRadius: BorderRadius.circular(50)),
                            statusAlignment: Alignment.topRight,
                            image: otherUser.avatar != null
                                ? NetworkImage(otherUser
                                    .avatar!) // Assuming cardAvatar is a URL
                                : null,
                            size: 30,
                            child: Text(
                              otherUser.firstName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                              ),
                            ),
                          ),
                          const SizedBox(
                            width: 5,
                          ),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(
                              color: Colors.black,
                              borderRadius: BorderRadius.only(
                                topRight: Radius.circular(15.0),
                                bottomLeft: Radius.circular(15.0),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                !message.message.contains("#image")
                                    ? ConstrainedBox(
                                        constraints: const BoxConstraints(
                                          maxWidth:
                                              200, // Set the maximum width
                                        ),
                                        child: Text(
                                          softWrap: true,
                                          message.message,
                                          style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 18),
                                        ),
                                      )
                                    : Column(
                                        children: message.message
                                            .substring(
                                                7, message.message.length - 1)
                                            .split(",")
                                            .map(
                                          (e) {
                                            return Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .symmetric(vertical: 1),
                                              child: Image.network(
                                                e,
                                                width:
                                                    200, // Customize width and height as needed
                                                height: 100,
                                                fit: BoxFit.cover,
                                              ),
                                            );
                                          },
                                        ).toList(),
                                      ),
                                const SizedBox(
                                  height: 20,
                                ),
                                Text(
                                  format.format(message.createdAt),
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(
                            width: 20,
                          ),
                        ],
                      ),
                    );
            },
          ),
        ),
      ],
    );
  }

  AppBar appBar(BuildContext context, UserRoom chatUser) {
    return AppBar(
      forceMaterialTransparency: true,
      leading: IconButton(
        onPressed: () => Navigator.pop(context),
        icon: const HugeIcon(
          icon: HugeIcons.strokeRoundedArrowTurnBackward,
          color: Colors.black,
          size: 24.0,
        ),
      ),
      toolbarHeight: 100,
      title: widget.room.name == null
          ? singleUserChat(chatUser)
          : Column(
              children: [
                Text(
                  widget.room.name!,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
      bottom: PreferredSize(
        preferredSize:
            const Size.fromHeight(1.0), // Set the height of the border
        child: Container(
          color: const Color.fromARGB(30, 0, 0, 0), // Border color
          height: 1.0, // Border thickness
        ),
      ),
    );
  }

  LayoutBuilder singleUserChat(UserRoom chatUser) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Transform.translate(
          offset: Offset(constraints.maxWidth * -0.1, 0),
          child: Center(
            child: Column(
              children: [
                AdvancedAvatar(
                  name: "room",
                  foregroundDecoration: BoxDecoration(
                      border: Border.all(color: Colors.red, width: 2),
                      borderRadius: BorderRadius.circular(50)),
                  statusAlignment: Alignment.topRight,
                  image: chatUser.avatar != null
                      ? NetworkImage(
                          chatUser.avatar!) // Assuming cardAvatar is a URL
                      : null,
                  size: 60,
                  child: Text(
                    chatUser.firstName[0],
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(
                  width: 30,
                ),
                Text(
                  "${chatUser.firstName} ${chatUser.lastName}",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black,
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }
}
