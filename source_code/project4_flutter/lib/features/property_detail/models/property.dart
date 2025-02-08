import 'package:json_annotation/json_annotation.dart';
import 'package:project4_flutter/features/property_detail/models/amenity.dart';
import 'package:project4_flutter/features/property_detail/models/book_date_detail.dart';
import 'package:project4_flutter/features/property_detail/models/exception_date.dart';
import 'package:project4_flutter/features/property_detail/models/property_not_available_date.dart';
import 'package:project4_flutter/features/property_detail/models/user.dart';

part 'property.g.dart';

@JsonSerializable()
class Property {
  final int id;
  final String propertyType;
  final String propertyTitle;
  final int maximumMonthPreBook;
  final String bookingType;
  final double basePrice;
  final int weeklyDiscount;
  final int monthlyDiscount;
  final String addressCode;
  final String addressDetail;
  final String checkInAfter;
  final String checkOutBefore;
  final int maximumGuest;
  final int numberOfBathRoom;
  final int numberOfBedRoom;
  final int numberOfBed;
  final bool petAllowed;
  final String? additionalRules;
  final int? maximumStay;
  final int? minimumStay;
  final String aboutProperty;
  final String? guestAccess;
  final String? detailToNote;
  final bool selfCheckIn;
  final String coordinatesX;
  final String coordinatesY;
  final String status;
  final int? managedCityId;
  final int? refundPolicyId;
  final int userId;
  final User? user;
  final int propertyCategoryID;
  final int? instantBookRequirementID;
  final List<String> propertyImages;
  final List<int> propertyAmenities;
  final List<Amenity> amenity;
  final List<BookDateDetail>? bookDateDetails;
  final List<PropertyNotAvailableDate>? notAvailableDates;
  final List<ExceptionDate>? exceptionDates;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int cleanlinessScore;
  final int accuracyScore;
  final int checkinScore;
  final int communicationScore;
  final int userBadgeId;

  Property(
      {required this.id,
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
      required this.petAllowed,
      this.additionalRules,
      this.maximumStay,
      this.minimumStay,
      required this.aboutProperty,
      this.guestAccess,
      this.detailToNote,
      required this.selfCheckIn,
      required this.coordinatesX,
      required this.coordinatesY,
      required this.status,
      this.managedCityId,
      this.refundPolicyId,
      required this.userId,
      this.user,
      required this.propertyCategoryID,
      this.instantBookRequirementID,
      required this.propertyImages,
      required this.propertyAmenities,
      required this.amenity,
      this.bookDateDetails,
      this.notAvailableDates,
      this.exceptionDates,
      required this.createdAt,
      required this.updatedAt,
      required this.checkinScore,
      required this.accuracyScore,
      required this.cleanlinessScore,
      required this.userBadgeId,
      required this.communicationScore});

  factory Property.fromJson(Map<String, dynamic> json) =>
      _$PropertyFromJson(json);

  Map<String, dynamic> toJson() => _$PropertyToJson(this);
}
