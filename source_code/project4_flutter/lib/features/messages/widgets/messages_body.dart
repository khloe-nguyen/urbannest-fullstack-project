import 'dart:convert';

import 'package:delightful_toast/delight_toast.dart';
import 'package:delightful_toast/toast/components/toast_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_group_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/message_cubit.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_cubit.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_cubit.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_group_cubit.dart';
import 'package:project4_flutter/features/messages/models/message_entity.dart';
import 'package:project4_flutter/features/messages/models/message_room_entity.dart';
import 'package:project4_flutter/features/messages/widgets/add_friend.dart';
import 'package:project4_flutter/features/messages/widgets/add_group.dart';
import 'package:project4_flutter/features/messages/widgets/chat_screen.dart';
import 'package:project4_flutter/features/messages/widgets/room_card.dart';
import 'package:project4_flutter/features/messages/widgets/room_group_card.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';
import 'package:provider/provider.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';
import 'package:uuid/uuid.dart';

import '../../../shared/models/user.dart';
import '../bloc/message_cubit/add_friend_state.dart';
import '../models/room.dart';

class MessagesBody extends StatefulWidget {
  const MessagesBody({super.key, this.userId});

  final int? userId;

  @override
  State<MessagesBody> createState() => _MessagesBodyState();
}

class _MessagesBodyState extends State<MessagesBody> {
  late User user;
  final GlobalKey<ChatScreenState> _globalKey = GlobalKey<ChatScreenState>();
  StompClient? stompClient;
  bool isConnected = false;
  int? chosenRoomId;
  List<Room>? _listRoom = List.empty();
  String? lastMessageId;

  MessageRoomCubit getMessageRoomCubit() {
    return context.read<MessageRoomCubit>();
  }

  void connect(String userId) {
    try {
      stompClient = StompClient(
        config: StompConfig.sockJS(
          url: 'http://${dotenv.env['API_URL']}:8010/ws', // WebSocket endpoint
          onConnect: (StompFrame frame) {
            print("Connected to WebSocket");
            isConnected = true;
            stompClient?.subscribe(
              destination: '/user/$userId/private',
              callback: (StompFrame message) {
                onPrivateMessage(message);
              },
            );
          },
          onStompError: (StompFrame frame) {
            print('Stomp error: ${frame.body}');
            isConnected = false;
          },
          onWebSocketError: (dynamic error) {
            print('WebSocket error: $error');
            isConnected = false;
          },
          onDisconnect: (frame) {
            print("Disconnected from WebSocket");
            isConnected = false;
          },
          onWebSocketDone: () {
            print("WebSocket connection closed");
            isConnected = false;
          },
        ),
      );

      stompClient?.activate(); // Initiate the connection
    } catch (e) {
      isConnected = false;
    }
  }

  void onPrivateMessage(StompFrame message) {
    MessageEntity messageEntity =
        MessageEntity.fromJson(jsonDecode(message.body!));
    if (lastMessageId != messageEntity.messageId) {
      var room = _listRoom!
          .where(
            (element) => element.roomId == messageEntity.roomId,
          )
          .firstOrNull;

      if (room != null) {
        setState(() {
          room.lastMessage = messageEntity.message;
          lastMessageId = messageEntity.messageId;
        });

        if (messageEntity.roomId ==
            _globalKey.currentState!.context.read<MessageCubit>().roomId) {
          MessageRoomEntity messageRoomEntity = MessageRoomEntity(
              id: 0,
              message: messageEntity.message,
              senderId: messageEntity.senderId,
              createdAt: messageEntity.date);

          _globalKey.currentState!.onReRender(messageRoomEntity);
        }
      } else {
        context.read<MessageRoomCubit>().getRooms();
      }
    }

    // Handle the private message
  }

  void disconnect() {
    stompClient?.deactivate();
    isConnected = false;
  }

  @override
  void dispose() {
    // Cleanup logic here
    super.dispose();
    disconnect();
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    user = context.read<UserCubit>().loginUser!;

    getMessageRoomCubit().loadUserRoom(user.id.toString());

    connect(user.id.toString());
  }

  void sendPrivateMessage({
    required String message,
    required String chosenRoom,
  }) {
    const uuid = Uuid();
    final messageId = uuid.v4();

    if (stompClient != null && stompClient!.connected) {
      final chatMessage = {
        "messageId": messageId,
        "senderId": user.id,
        "senderAvatar": user.avatar,
        "message": message,
        "date": DateTime.now().toIso8601String(),
        "roomId": chosenRoom,
      };

      // Send the message through WebSocket
      stompClient!.send(
        destination: "/chatApp/private-message",
        body: json.encode(chatMessage),
      );

      // Scroll to the bottom of the chat
      setState(() {
        lastMessageId = messageId;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
        toolbarHeight: 70,
        title: const Text(
          "Messages",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(
                  builder: (context) {
                    return MultiBlocProvider(providers: [
                      BlocProvider(
                        create: (_) => SearchFriendCubit(user.id.toString()),
                      ),
                      BlocProvider(
                        create: (_) => AddFriendCubit(),
                      )
                    ], child: const AddFriend());
                  },
                )).then((roomId) {
                  if (context.mounted && roomId != null) {
                    if (context.mounted) {
                      setState(() {
                        chosenRoomId = roomId;
                      });
                      context.read<MessageRoomCubit>().getRooms();
                    }
                  }
                });
              },
              icon: const HugeIcon(
                icon: HugeIcons.strokeRoundedAddSquare,
                color: Colors.black,
                size: 24.0,
              )),
          IconButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(
                  builder: (context) {
                    return MultiProvider(providers: [
                      BlocProvider(
                        create: (_) => SearchGroupCubit(user.id.toString()),
                      ),
                      BlocProvider(
                        create: (_) => AddGroupCubit(),
                      )
                    ], child: const AddGroup());
                  },
                )).then((roomId) {
                  if (context.mounted && roomId != null) {
                    if (context.mounted) {
                      setState(() {
                        chosenRoomId = roomId;
                      });
                      context.read<MessageRoomCubit>().getRooms();
                    }
                  }
                });
              },
              icon: const HugeIcon(
                icon: HugeIcons.strokeRoundedAddTeam,
                color: Colors.black,
                size: 24.0,
              )),
          const SizedBox(
            width: 20,
          )
        ],
      ),
      body: BlocConsumer<MessageRoomCubit, MessageRoomState>(
        builder: (context, state) {
          if (state is MessageRoomLoading) {
            return const LoadingIcon(size: 60);
          }

          if (state is MessageRoomSuccess) {
            _listRoom = state.roomList;

            return ListView.builder(
              itemCount: _listRoom!.length,
              itemBuilder: (context, index) {
                var room = _listRoom![index];
                if (room.name == null || room.name!.isEmpty) {
                  return InkWell(
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(
                          builder: (context) {
                            return BlocProvider(
                                create: (_) => MessageCubit(room.roomId),
                                child: ChatScreen(
                                    key: _globalKey,
                                    _listRoom![index],
                                    sendPrivateMessage));
                          },
                        )).then((_) {
                          if (context.mounted) {
                            context.read<MessageRoomCubit>().getRooms();
                          }
                        });
                      },
                      splashColor: Colors.blue
                          .withValues(alpha: 0.3), // Ripple effect color
                      highlightColor: Colors.blue.withValues(alpha: 0.1),
                      child: RoomCard(room, user));
                } else {
                  return InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return BlocProvider(
                                create: (_) => MessageCubit(room.roomId),
                                child: ChatScreen(
                                  key: _globalKey,
                                  _listRoom![index],
                                  sendPrivateMessage,
                                ),
                              );
                            },
                          ),
                        ).then((_) {
                          if (context.mounted) {
                            context.read<MessageRoomCubit>().getRooms();
                          }
                        });
                      },
                      splashColor:
                          Colors.blue.withOpacity(0.3), // Ripple effect color
                      highlightColor: Colors.blue.withOpacity(0.1),
                      child: RoomGroupCard(room, user));
                }
              },
            );
          }

          if (state is MessageRoomError) {
            return Text(state.message);
          }

          return const Text("Loading...");
        },
        listener: (context, state) {
          if (state is MessageRoomSuccess) {
            if (widget.userId != null) {
              var room = state.roomList!
                  .where(
                    (room) =>
                        room.name == null &&
                        room.users
                            .where(
                              (element) => element.id == widget.userId,
                            )
                            .isNotEmpty,
                  )
                  .firstOrNull;
              if (room != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return BlocProvider(
                        create: (_) => MessageCubit(room.roomId),
                        child: ChatScreen(
                          key: _globalKey,
                          state.roomList!.firstWhere(
                            (element) => element.roomId == room.roomId,
                          ),
                          sendPrivateMessage,
                        ),
                      );
                    },
                  ),
                ).then(
                  (_) {
                    if (context.mounted) {
                      Navigator.pop(context);
                    }
                  },
                );
              } else {
                Map<String, dynamic> body = {
                  'userId': context.read<UserCubit>().loginUser!.id,
                  'friendId': widget.userId
                };
                context.read<AddFriendCubit>().addFriend(body).then(
                      (_) => getMessageRoomCubit()
                          .loadUserRoom(user.id.toString()),
                    );
              }
            }
            if (chosenRoomId != null) {
              var room = chosenRoomId;
              setState(() {
                chosenRoomId = null;
              });
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return BlocProvider(
                      create: (_) => MessageCubit(room!),
                      child: ChatScreen(
                        key: _globalKey,
                        state.roomList!.firstWhere(
                          (element) => element.roomId == room,
                        ),
                        sendPrivateMessage,
                      ),
                    );
                  },
                ),
              ).then((_) {
                if (context.mounted) {
                  context.read<MessageRoomCubit>().getRooms();
                }
              });
            }
          }
        },
      ),
    );
  }
}
