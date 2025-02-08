class UserRoom {
  int id;
  String? avatar;
  String firstName;
  String lastName;

  UserRoom({
    required this.id,
    required this.avatar,
    required this.firstName,
    required this.lastName,
  });

  factory UserRoom.fromJson(Map<String, dynamic> json) => UserRoom(
        id: json["id"],
        avatar: json["avatar"],
        firstName: json["firstName"],
        lastName: json["lastName"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "avatar": avatar,
        "firstName": firstName,
        "lastName": lastName,
      };
}
