import 'package:project4_flutter/features/messages/models/user_room.dart';

class Room {
  int roomId;
  String? name;
  List<UserRoom> users;
  String? lastMessage;
  DateTime lastestMessageDate;

  Room({
    required this.roomId,
    required this.name,
    required this.users,
    this.lastMessage,
    required this.lastestMessageDate,
  });

  factory Room.fromJson(Map<String, dynamic> json) => Room(
        roomId: json["roomId"],
        name: json["name"],
        users:
            List<UserRoom>.from(json["users"].map((x) => UserRoom.fromJson(x))),
        lastMessage: json["lastMessage"],
        lastestMessageDate: DateTime.parse(json["lastestMessageDate"]),
      );

  Map<String, dynamic> toJson() => {
        "roomId": roomId,
        "name": name,
        "users": List<dynamic>.from(users.map((x) => x.toJson())),
        "lastMessage": lastMessage,
        "lastestMessageDate": lastestMessageDate.toIso8601String(),
      };
}
