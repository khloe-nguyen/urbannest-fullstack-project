class User {
  int id;
  String email;
  String firstName;
  String lastName;
  dynamic address;
  String? phoneNumber;
  String? avatar;
  DateTime dob;
  List<dynamic> badgeList;
  DateTime createdAt;
  dynamic preferredName;
  dynamic identityCardCountry;
  dynamic identityCardFrontUrl;
  dynamic identityCardBackUrl;
  dynamic driverLicenseCountry;
  dynamic driverLicenseFrontUrl;
  dynamic driverLicenseBackUrl;
  dynamic newPassword;
  List<dynamic> propertyFavouriteIds;
  bool host;
  dynamic otp;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.address,
    required this.phoneNumber,
    required this.avatar,
    required this.dob,
    required this.badgeList,
    required this.createdAt,
    required this.preferredName,
    required this.identityCardCountry,
    required this.identityCardFrontUrl,
    required this.identityCardBackUrl,
    required this.driverLicenseCountry,
    required this.driverLicenseFrontUrl,
    required this.driverLicenseBackUrl,
    required this.newPassword,
    required this.propertyFavouriteIds,
    required this.host,
    required this.otp,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json["id"],
        email: json["email"],
        firstName: json["firstName"],
        lastName: json["lastName"],
        address: json["address"],
        phoneNumber: json["phoneNumber"],
        avatar: json["avatar"],
        dob: DateTime.parse(json["dob"]),
        badgeList: List<dynamic>.from(json["badgeList"].map((x) => x)),
        createdAt: DateTime.parse(json["createdAt"]),
        preferredName: json["preferredName"],
        identityCardCountry: json["identityCardCountry"],
        identityCardFrontUrl: json["identityCardFrontUrl"],
        identityCardBackUrl: json["identityCardBackUrl"],
        driverLicenseCountry: json["driverLicenseCountry"],
        driverLicenseFrontUrl: json["driverLicenseFrontUrl"],
        driverLicenseBackUrl: json["driverLicenseBackUrl"],
        newPassword: json["newPassword"],
        propertyFavouriteIds:
            List<dynamic>.from(json["propertyFavouriteIds"].map((x) => x)),
        host: json["host"],
        otp: json["otp"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "email": email,
        "firstName": firstName,
        "lastName": lastName,
        "address": address,
        "phoneNumber": phoneNumber,
        "avatar": avatar,
        "dob": dob.toIso8601String(),
        "badgeList": List<dynamic>.from(badgeList.map((x) => x)),
        "createdAt": createdAt.toIso8601String(),
        "preferredName": preferredName,
        "identityCardCountry": identityCardCountry,
        "identityCardFrontUrl": identityCardFrontUrl,
        "identityCardBackUrl": identityCardBackUrl,
        "driverLicenseCountry": driverLicenseCountry,
        "driverLicenseFrontUrl": driverLicenseFrontUrl,
        "driverLicenseBackUrl": driverLicenseBackUrl,
        "newPassword": newPassword,
        "propertyFavouriteIds":
            List<dynamic>.from(propertyFavouriteIds.map((x) => x)),
        "host": host,
        "otp": otp,
      };
}
