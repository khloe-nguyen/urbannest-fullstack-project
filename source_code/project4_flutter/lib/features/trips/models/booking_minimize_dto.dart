import 'package:intl/intl.dart';

DateFormat dateFormat = DateFormat("yyyy-MM-dd HH:mm:ss");

class BookingMinimizeDto {
  int id;
  DateTime checkInDay;
  DateTime checkOutDay;
  int totalPerson;
  int adult;
  int children;
  String bookingType;
  bool selfCheckIn;
  String? selfCheckInType;
  String? selfCheckInInstruction;
  DateTime createdAt;
  DateTime updatedAt;
  String status;
  PropertyMinimizeDto property;
  RefundPolicy refundPolicy;
  Review? hostReview;
  Review? userReview;
  Customer host;
  double amount;
  String bookingCode;
  Customer customer;
  List<Transaction> transactions;
  List<BookDateDetail> bookDateDetails;
  double websiteFee;
  double hostFee;

  BookingMinimizeDto({
    required this.id,
    required this.checkInDay,
    required this.checkOutDay,
    required this.totalPerson,
    required this.adult,
    required this.children,
    required this.bookingType,
    required this.selfCheckIn,
    required this.selfCheckInType,
    required this.selfCheckInInstruction,
    required this.createdAt,
    required this.updatedAt,
    required this.status,
    required this.property,
    required this.refundPolicy,
    required this.hostReview,
    required this.userReview,
    required this.host,
    required this.amount,
    required this.websiteFee,
    required this.hostFee,
    required this.bookingCode,
    required this.customer,
    required this.transactions,
    required this.bookDateDetails,
  });

  factory BookingMinimizeDto.fromJson(Map<String, dynamic> json) =>
      BookingMinimizeDto(
        id: json["id"],
        checkInDay: DateTime.parse(json["checkInDay"]).toLocal(),
        checkOutDay: DateTime.parse(json["checkOutDay"]).toLocal(),
        totalPerson: json["totalPerson"],
        adult: json["adult"],
        children: json["children"],
        bookingType: json["bookingType"],
        selfCheckInInstruction: json["selfCheckInInstruction"],
        selfCheckIn: json["selfCheckIn"],
        selfCheckInType: json["selfCheckInType"],
        createdAt: DateTime.parse(json["createdAt"]).toLocal(),
        updatedAt: DateTime.parse(json["updatedAt"]).toLocal(),
        status: json["status"],
        property: PropertyMinimizeDto.fromJson(json["property"]),
        refundPolicy: RefundPolicy.fromJson(json["refundPolicy"]),
        hostReview: json["hostReview"] != null
            ? Review.fromJson(json["hostReview"])
            : null,
        userReview: json["userReview"] != null
            ? Review.fromJson(json["userReview"])
            : null,
        host: Customer.fromJson(json["host"]),
        amount: json["amount"],
        websiteFee: json["websiteFee"],
        hostFee: json["hostFee"],
        bookingCode: json["bookingCode"],
        customer: Customer.fromJson(json["customer"]),
        transactions: List<Transaction>.from(
            json["transactions"].map((x) => Transaction.fromJson(x))),
        bookDateDetails: List<BookDateDetail>.from(
            json["bookDateDetails"].map((x) => BookDateDetail.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "checkInDay": checkInDay.toIso8601String(),
        "checkOutDay": checkOutDay.toIso8601String(),
        "totalPerson": totalPerson,
        "adult": adult,
        "children": children,
        "bookingType": bookingType,
        "selfCheckInInstruction": selfCheckInInstruction,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "status": status,
        "property": property.toJson(),
        "refundPolicy": refundPolicy.toJson(),
        "hostReview": hostReview?.toJson(),
        "userReview": userReview?.toJson(),
        "host": host.toJson(),
        "amount": amount,
        "bookingCode": bookingCode,
        "customer": customer.toJson(),
        "transactions": List<dynamic>.from(transactions.map((x) => x.toJson())),
        "bookDateDetails":
            List<dynamic>.from(bookDateDetails.map((x) => x.toJson())),
      };
}

class BookDateDetail {
  int id;
  DateTime night;
  double price;

  BookDateDetail({
    required this.id,
    required this.night,
    required this.price,
  });

  factory BookDateDetail.fromJson(Map<String, dynamic> json) => BookDateDetail(
        id: json["id"],
        night: DateTime.parse(json["night"]),
        price: json["price"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "night": night.toIso8601String(),
        "price": price,
      };
}

class Customer {
  int id;
  String email;
  String firstName;
  String lastName;
  dynamic address;
  String? phoneNumber;
  String? avatar;
  DateTime dob;

  Customer({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.address,
    required this.phoneNumber,
    required this.avatar,
    required this.dob,
  });

  factory Customer.fromJson(Map<String, dynamic> json) => Customer(
        id: json["id"],
        email: json["email"],
        firstName: json["firstName"],
        lastName: json["lastName"],
        address: json["address"],
        phoneNumber: json["phoneNumber"],
        avatar: json["avatar"],
        dob: DateTime.parse(json["dob"]),
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
      };
}

class Review {
  int id;
  dynamic totalScore;
  dynamic cleanlinessScore;
  dynamic accuracyScore;
  dynamic checkinScore;
  dynamic communicationScore;
  Customer user;
  dynamic toUser;
  dynamic review;

  Review({
    required this.id,
    required this.totalScore,
    required this.cleanlinessScore,
    required this.accuracyScore,
    required this.checkinScore,
    required this.communicationScore,
    required this.user,
    required this.toUser,
    required this.review,
  });

  factory Review.fromJson(Map<String, dynamic> json) => Review(
        id: json["id"],
        totalScore: json["totalScore"],
        cleanlinessScore: json["cleanlinessScore"],
        accuracyScore: json["accuracyScore"],
        checkinScore: json["checkinScore"],
        communicationScore: json["communicationScore"],
        user: Customer.fromJson(json["user"]),
        toUser: json["toUser"],
        review: json["review"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "totalScore": totalScore,
        "cleanlinessScore": cleanlinessScore,
        "accuracyScore": accuracyScore,
        "checkinScore": checkinScore,
        "communicationScore": communicationScore,
        "user": user.toJson(),
        "toUser": toUser,
        "review": review,
      };
}

class PropertyMinimizeDto {
  int id;
  String propertyType;
  String propertyTitle;
  int maximumMonthPreBook;
  String bookingType;
  double basePrice;
  int weeklyDiscount;
  int monthlyDiscount;
  String addressCode;
  String addressDetail;
  String checkInAfter;
  String checkOutBefore;
  int maximumGuest;
  int numberOfBathRoom;
  int numberOfBedRoom;
  int numberOfBed;
  dynamic additionalRules;
  dynamic maximumStay;
  dynamic minimumStay;
  String aboutProperty;
  String guestAccess;
  String detailToNote;
  dynamic selfCheckInType;
  dynamic selfCheckInInstruction;
  String coordinatesX;
  String coordinatesY;
  dynamic suggestion;
  String status;
  DateTime createdAt;
  DateTime updatedAt;
  ManagedCity managedCity;
  RefundPolicy refundPolicy;
  User user;
  PropertyCategory propertyCategory;
  dynamic instantBookRequirement;
  List<String> propertyImages;
  List<PropertyNotAvailableDate> propertyNotAvailableDates;
  List<PropertyExceptionDate> propertyExceptionDates;
  List<PropertyAmenity> propertyAmenities;
  bool smokingAllowed;
  bool petAllowed;
  bool selfCheckIn;

  PropertyMinimizeDto({
    required this.id,
    required this.propertyType,
    required this.propertyTitle,
    required this.maximumMonthPreBook,
    required this.bookingType,
    required this.basePrice,
    required this.weeklyDiscount,
    required this.monthlyDiscount,
    required this.addressCode,
    required this.addressDetail,
    required this.checkInAfter,
    required this.checkOutBefore,
    required this.maximumGuest,
    required this.numberOfBathRoom,
    required this.numberOfBedRoom,
    required this.numberOfBed,
    required this.additionalRules,
    required this.maximumStay,
    required this.minimumStay,
    required this.aboutProperty,
    required this.guestAccess,
    required this.detailToNote,
    required this.selfCheckInType,
    required this.selfCheckInInstruction,
    required this.coordinatesX,
    required this.coordinatesY,
    required this.suggestion,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.managedCity,
    required this.refundPolicy,
    required this.user,
    required this.propertyCategory,
    required this.instantBookRequirement,
    required this.propertyImages,
    required this.propertyNotAvailableDates,
    required this.propertyExceptionDates,
    required this.propertyAmenities,
    required this.smokingAllowed,
    required this.petAllowed,
    required this.selfCheckIn,
  });

  factory PropertyMinimizeDto.fromJson(Map<String, dynamic> json) =>
      PropertyMinimizeDto(
        id: json["id"],
        propertyType: json["propertyType"],
        propertyTitle: json["propertyTitle"],
        maximumMonthPreBook: json["maximumMonthPreBook"],
        bookingType: json["bookingType"],
        basePrice: json["basePrice"],
        weeklyDiscount: json["weeklyDiscount"],
        monthlyDiscount: json["monthlyDiscount"],
        addressCode: json["addressCode"],
        addressDetail: json["addressDetail"],
        checkInAfter: json["checkInAfter"],
        checkOutBefore: json["checkOutBefore"],
        maximumGuest: json["maximumGuest"],
        numberOfBathRoom: json["numberOfBathRoom"],
        numberOfBedRoom: json["numberOfBedRoom"],
        numberOfBed: json["numberOfBed"],
        additionalRules: json["additionalRules"],
        maximumStay: json["maximumStay"],
        minimumStay: json["minimumStay"],
        aboutProperty: json["aboutProperty"],
        guestAccess: json["guestAccess"],
        detailToNote: json["detailToNote"],
        selfCheckInType: json["selfCheckInType"],
        selfCheckInInstruction: json["selfCheckInInstruction"],
        coordinatesX: json["coordinatesX"],
        coordinatesY: json["coordinatesY"],
        suggestion: json["suggestion"],
        status: json["status"],
        createdAt: DateTime.parse(json["createdAt"]),
        updatedAt: DateTime.parse(json["updatedAt"]),
        managedCity: ManagedCity.fromJson(json["managedCity"]),
        refundPolicy: RefundPolicy.fromJson(json["refundPolicy"]),
        user: User.fromJson(json["user"]),
        propertyCategory: PropertyCategory.fromJson(json["propertyCategory"]),
        instantBookRequirement: json["instantBookRequirement"],
        propertyImages: List<String>.from(json["propertyImages"].map((x) => x)),
        propertyNotAvailableDates: List<PropertyNotAvailableDate>.from(
            json["propertyNotAvailableDates"]
                .map((x) => PropertyNotAvailableDate.fromJson(x))),
        propertyExceptionDates: List<PropertyExceptionDate>.from(
            json["propertyExceptionDates"]
                .map((x) => PropertyExceptionDate.fromJson(x))),
        propertyAmenities: List<PropertyAmenity>.from(
            json["propertyAmenities"].map((x) => PropertyAmenity.fromJson(x))),
        smokingAllowed: json["smokingAllowed"],
        petAllowed: json["petAllowed"],
        selfCheckIn: json["selfCheckIn"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "propertyType": propertyType,
        "propertyTitle": propertyTitle,
        "maximumMonthPreBook": maximumMonthPreBook,
        "bookingType": bookingType,
        "basePrice": basePrice,
        "weeklyDiscount": weeklyDiscount,
        "monthlyDiscount": monthlyDiscount,
        "addressCode": addressCode,
        "addressDetail": addressDetail,
        "checkInAfter": checkInAfter,
        "checkOutBefore": checkOutBefore,
        "maximumGuest": maximumGuest,
        "numberOfBathRoom": numberOfBathRoom,
        "numberOfBedRoom": numberOfBedRoom,
        "numberOfBed": numberOfBed,
        "additionalRules": additionalRules,
        "maximumStay": maximumStay,
        "minimumStay": minimumStay,
        "aboutProperty": aboutProperty,
        "guestAccess": guestAccess,
        "detailToNote": detailToNote,
        "selfCheckInType": selfCheckInType,
        "selfCheckInInstruction": selfCheckInInstruction,
        "coordinatesX": coordinatesX,
        "coordinatesY": coordinatesY,
        "suggestion": suggestion,
        "status": status,
        "createdAt": createdAt.toIso8601String(),
        "updatedAt": updatedAt.toIso8601String(),
        "managedCity": managedCity.toJson(),
        "refundPolicy": refundPolicy.toJson(),
        "user": user.toJson(),
        "propertyCategory": propertyCategory.toJson(),
        "instantBookRequirement": instantBookRequirement,
        "propertyImages": List<dynamic>.from(propertyImages.map((x) => x)),
        "propertyNotAvailableDates":
            List<dynamic>.from(propertyNotAvailableDates.map((x) => x)),
        "propertyExceptionDates":
            List<dynamic>.from(propertyExceptionDates.map((x) => x)),
        "propertyAmenities":
            List<dynamic>.from(propertyAmenities.map((x) => x.toJson())),
        "smokingAllowed": smokingAllowed,
        "petAllowed": petAllowed,
        "selfCheckIn": selfCheckIn,
      };
}

class PropertyExceptionDate {
  int id;
  DateTime date;
  double basePrice;

  PropertyExceptionDate({
    required this.id,
    required this.date,
    required this.basePrice,
  });

  factory PropertyExceptionDate.fromJson(Map<String, dynamic> json) =>
      PropertyExceptionDate(
        id: json["id"],
        date: DateTime.parse(json["date"]).toLocal(),
        basePrice: json["basePrice"],
      );
}

class PropertyNotAvailableDate {
  int id;
  DateTime date;
  int? propertyId;

  PropertyNotAvailableDate({
    required this.id,
    required this.date,
    this.propertyId,
  });

  factory PropertyNotAvailableDate.fromJson(Map<String, dynamic> json) =>
      PropertyNotAvailableDate(
        id: json["id"],
        date: DateTime.parse(json["date"]).toLocal(),
        propertyId: json["propertyId"],
      );
}

class ManagedCity {
  int id;
  String cityName;
  dynamic propertyCount;
  bool managed;

  ManagedCity({
    required this.id,
    required this.cityName,
    required this.propertyCount,
    required this.managed,
  });

  factory ManagedCity.fromJson(Map<String, dynamic> json) => ManagedCity(
        id: json["id"],
        cityName: json["cityName"],
        propertyCount: json["propertyCount"],
        managed: json["managed"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "cityName": cityName,
        "propertyCount": propertyCount,
        "managed": managed,
      };
}

class PropertyAmenity {
  int id;
  String name;
  String? description;
  String image;
  String type;
  bool status;

  PropertyAmenity({
    required this.id,
    required this.name,
    required this.description,
    required this.image,
    required this.type,
    required this.status,
  });

  factory PropertyAmenity.fromJson(Map<String, dynamic> json) =>
      PropertyAmenity(
        id: json["id"],
        name: json["name"],
        description: json["description"],
        image: json["image"],
        type: json["type"]!,
        status: json["status"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
        "description": description,
        "image": image,
        "type": type,
        "status": status,
      };
}

class PropertyCategory {
  int id;
  String categoryName;
  dynamic description;
  String categoryImage;
  bool status;
  dynamic propertyCount;

  PropertyCategory({
    required this.id,
    required this.categoryName,
    required this.description,
    required this.categoryImage,
    required this.status,
    required this.propertyCount,
  });

  factory PropertyCategory.fromJson(Map<String, dynamic> json) =>
      PropertyCategory(
        id: json["id"],
        categoryName: json["categoryName"],
        description: json["description"],
        categoryImage: json["categoryImage"],
        status: json["status"],
        propertyCount: json["propertyCount"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "categoryName": categoryName,
        "description": description,
        "categoryImage": categoryImage,
        "status": status,
        "propertyCount": propertyCount,
      };
}

class RefundPolicy {
  int id;
  String policyName;
  String policyDescription;

  RefundPolicy({
    required this.id,
    required this.policyName,
    required this.policyDescription,
  });

  factory RefundPolicy.fromJson(Map<String, dynamic> json) => RefundPolicy(
        id: json["id"],
        policyName: json["policyName"],
        policyDescription: json["policyDescription"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "policyName": policyName,
        "policyDescription": policyDescription,
      };
}

class User {
  int id;
  String email;
  String firstName;
  String lastName;
  dynamic address;
  String? phoneNumber;
  String? avatar;
  DateTime dob;
  dynamic badgeList;
  DateTime createdAt;
  dynamic preferredName;
  dynamic identityCardCountry;
  dynamic identityCardFrontUrl;
  dynamic identityCardBackUrl;
  dynamic driverLicenseCountry;
  dynamic driverLicenseFrontUrl;
  dynamic driverLicenseBackUrl;
  dynamic newPassword;
  dynamic propertyFavouriteIds;
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
        badgeList: json["badgeList"],
        createdAt: DateTime.parse(json["createdAt"]),
        preferredName: json["preferredName"],
        identityCardCountry: json["identityCardCountry"],
        identityCardFrontUrl: json["identityCardFrontUrl"],
        identityCardBackUrl: json["identityCardBackUrl"],
        driverLicenseCountry: json["driverLicenseCountry"],
        driverLicenseFrontUrl: json["driverLicenseFrontUrl"],
        driverLicenseBackUrl: json["driverLicenseBackUrl"],
        newPassword: json["newPassword"],
        propertyFavouriteIds: json["propertyFavouriteIds"],
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
        "badgeList": badgeList,
        "createdAt": createdAt.toIso8601String(),
        "preferredName": preferredName,
        "identityCardCountry": identityCardCountry,
        "identityCardFrontUrl": identityCardFrontUrl,
        "identityCardBackUrl": identityCardBackUrl,
        "driverLicenseCountry": driverLicenseCountry,
        "driverLicenseFrontUrl": driverLicenseFrontUrl,
        "driverLicenseBackUrl": driverLicenseBackUrl,
        "newPassword": newPassword,
        "propertyFavouriteIds": propertyFavouriteIds,
        "host": host,
        "otp": otp,
      };
}

class Transaction {
  int id;
  double amount;
  String transactionType;
  DateTime transferOn;

  Transaction({
    required this.id,
    required this.amount,
    required this.transactionType,
    required this.transferOn,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
        id: json["id"],
        amount: json["amount"],
        transactionType: json["transactionType"],
        transferOn: DateTime.parse(json["transferOn"]),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "amount": amount,
        "transactionType": transactionType,
        "transferOn": transferOn.toIso8601String(),
      };
}
