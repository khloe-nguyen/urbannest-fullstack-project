// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Property _$PropertyFromJson(Map<String, dynamic> json) => Property(
      id: (json['id'] as num).toInt(),
      propertyType: json['propertyType'] as String,
      propertyTitle: json['propertyTitle'] as String,
      maximumMonthPreBook: (json['maximumMonthPreBook'] as num).toInt(),
      bookingType: json['bookingType'] as String,
      basePrice: (json['basePrice'] as num).toDouble(),
      weeklyDiscount: (json['weeklyDiscount'] as num).toInt(),
      monthlyDiscount: (json['monthlyDiscount'] as num).toInt(),
      addressCode: json['addressCode'] as String,
      addressDetail: json['addressDetail'] as String,
      checkInAfter: json['checkInAfter'] as String,
      checkOutBefore: json['checkOutBefore'] as String,
      maximumGuest: (json['maximumGuest'] as num).toInt(),
      numberOfBathRoom: (json['numberOfBathRoom'] as num).toInt(),
      numberOfBedRoom: (json['numberOfBedRoom'] as num).toInt(),
      numberOfBed: (json['numberOfBed'] as num).toInt(),
      petAllowed: json['petAllowed'] as bool,
      additionalRules: json['additionalRules'] as String?,
      maximumStay: (json['maximumStay'] as num?)?.toInt(),
      minimumStay: (json['minimumStay'] as num?)?.toInt(),
      aboutProperty: json['aboutProperty'] as String,
      guestAccess: json['guestAccess'] as String?,
      detailToNote: json['detailToNote'] as String?,
      selfCheckIn: json['selfCheckIn'] as bool,
      coordinatesX: json['coordinatesX'] as String,
      coordinatesY: json['coordinatesY'] as String,
      status: json['status'] as String,
      managedCityId: (json['managedCityId'] as num?)?.toInt(),
      refundPolicyId: (json['refundPolicyId'] as num?)?.toInt(),
      userId: (json['userId'] as num).toInt(),
      user: json['user'] == null
          ? null
          : User.fromJson(json['user'] as Map<String, dynamic>),
      propertyCategoryID: (json['propertyCategoryID'] as num).toInt(),
      instantBookRequirementID:
          (json['instantBookRequirementID'] as num?)?.toInt(),
      propertyImages: (json['propertyImages'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      propertyAmenities: (json['propertyAmenities'] as List<dynamic>)
          .map((e) => (e as num).toInt())
          .toList(),
      amenity: (json['amenity'] as List<dynamic>)
          .map((e) => Amenity.fromJson(e as Map<String, dynamic>))
          .toList(),
      bookDateDetails: (json['bookDateDetails'] as List<dynamic>?)
          ?.map((e) => BookDateDetail.fromJson(e as Map<String, dynamic>))
          .toList(),
      notAvailableDates: (json['notAvailableDates'] as List<dynamic>?)
          ?.map((e) =>
              PropertyNotAvailableDate.fromJson(e as Map<String, dynamic>))
          .toList(),
      exceptionDates: (json['exceptionDates'] as List<dynamic>?)
          ?.map((e) => ExceptionDate.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      checkinScore: (json['checkinScore'] as num).toInt(),
      accuracyScore: (json['accuracyScore'] as num).toInt(),
      cleanlinessScore: (json['cleanlinessScore'] as num).toInt(),
      communicationScore: (json['communicationScore'] as num).toInt(),
      userBadgeId: (json['userBadgeId'] as num).toInt(),
    );

Map<String, dynamic> _$PropertyToJson(Property instance) => <String, dynamic>{
      'id': instance.id,
      'propertyType': instance.propertyType,
      'propertyTitle': instance.propertyTitle,
      'maximumMonthPreBook': instance.maximumMonthPreBook,
      'bookingType': instance.bookingType,
      'basePrice': instance.basePrice,
      'weeklyDiscount': instance.weeklyDiscount,
      'monthlyDiscount': instance.monthlyDiscount,
      'addressCode': instance.addressCode,
      'addressDetail': instance.addressDetail,
      'checkInAfter': instance.checkInAfter,
      'checkOutBefore': instance.checkOutBefore,
      'maximumGuest': instance.maximumGuest,
      'numberOfBathRoom': instance.numberOfBathRoom,
      'numberOfBedRoom': instance.numberOfBedRoom,
      'numberOfBed': instance.numberOfBed,
      'petAllowed': instance.petAllowed,
      'additionalRules': instance.additionalRules,
      'maximumStay': instance.maximumStay,
      'minimumStay': instance.minimumStay,
      'aboutProperty': instance.aboutProperty,
      'guestAccess': instance.guestAccess,
      'detailToNote': instance.detailToNote,
      'selfCheckIn': instance.selfCheckIn,
      'coordinatesX': instance.coordinatesX,
      'coordinatesY': instance.coordinatesY,
      'status': instance.status,
      'managedCityId': instance.managedCityId,
      'refundPolicyId': instance.refundPolicyId,
      'userId': instance.userId,
      'user': instance.user,
      'propertyCategoryID': instance.propertyCategoryID,
      'instantBookRequirementID': instance.instantBookRequirementID,
      'propertyImages': instance.propertyImages,
      'propertyAmenities': instance.propertyAmenities,
      'amenity': instance.amenity,
      'bookDateDetails': instance.bookDateDetails,
      'notAvailableDates': instance.notAvailableDates,
      'exceptionDates': instance.exceptionDates,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'cleanlinessScore': instance.cleanlinessScore,
      'accuracyScore': instance.accuracyScore,
      'checkinScore': instance.checkinScore,
      'communicationScore': instance.communicationScore,
      'userbadgeId': instance.userBadgeId
    };
