class MessageEntity {
  String messageId;
  int senderId;
  dynamic senderAvatar;
  String message;
  DateTime date;
  int roomId;
  String type;

  MessageEntity({
    required this.messageId,
    required this.senderId,
    required this.senderAvatar,
    required this.message,
    required this.date,
    required this.roomId,
    required this.type,
  });

  factory MessageEntity.fromJson(Map<String, dynamic> json) => MessageEntity(
        messageId: json["messageId"],
        senderId: json["senderId"],
        senderAvatar: json["senderAvatar"],
        message: json["message"],
        date: DateTime.parse(json["date"]),
        roomId: json["roomId"],
        type: json["type"],
      );

  Map<String, dynamic> toJson() => {
        "messageId": messageId,
        "senderId": senderId,
        "senderAvatar": senderAvatar,
        "message": message,
        "date": date.toIso8601String(),
        "roomId": roomId,
        "type": type,
      };
}
