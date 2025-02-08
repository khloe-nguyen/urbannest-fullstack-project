class MessageRoomEntity {
  int id;
  String message;
  int senderId;
  DateTime createdAt;

  MessageRoomEntity({
    required this.id,
    required this.message,
    required this.senderId,
    required this.createdAt,
  });

  factory MessageRoomEntity.fromJson(Map<String, dynamic> json) =>
      MessageRoomEntity(
        id: json["id"],
        message: json["message"],
        senderId: json["senderId"],
        createdAt: DateTime.parse(json["createdAt"]),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "message": message,
        "senderId": senderId,
        "createdAt": createdAt.toIso8601String(),
      };
}
