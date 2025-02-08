class SearchFriendEntity {
  int id;
  dynamic avatar;
  String firstName;
  String lastName;
  String email;

  SearchFriendEntity({
    required this.id,
    required this.avatar,
    required this.firstName,
    required this.lastName,
    required this.email,
  });

  factory SearchFriendEntity.fromJson(Map<String, dynamic> json) =>
      SearchFriendEntity(
        id: json["id"],
        avatar: json["avatar"],
        firstName: json["firstName"],
        lastName: json["lastName"],
        email: json["email"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "avatar": avatar,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
      };
}
