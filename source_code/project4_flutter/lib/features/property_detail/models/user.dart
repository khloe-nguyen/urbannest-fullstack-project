import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final int? id;

  final String? email;

  final String? firstName;

  final String? lastName;

  final String? address;

  final String? phoneNumber;

  final String? avatar;

  final DateTime createdAt;

  User(
      {required this.id,
      required this.email,
      required this.firstName,
      required this.lastName,
      required this.address,
      required this.phoneNumber,
      required this.avatar,
      required this.createdAt});

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);
}
