// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BookingDto _$BookingDtoFromJson(Map<String, dynamic> json) => BookingDto(
      checkInDay: DateTime.parse(json['checkInDay'] as String),
      checkOutDay: DateTime.parse(json['checkOutDay'] as String),
      children: (json['children'] as num).toInt(),
      adult: (json['adult'] as num).toInt(),
      amount: (json['amount'] as num).toDouble(),
      propertyId: (json['propertyId'] as num).toInt(),
      hostId: (json['hostId'] as num?)?.toInt(),
      customerId: (json['customerId'] as num?)?.toInt(),
      hostFee: (json['hostFee'] as num?)?.toDouble(),
      websiteFee: (json['websiteFee'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$BookingDtoToJson(BookingDto instance) =>
    <String, dynamic>{
      'checkInDay': instance.checkInDay.toIso8601String(),
      'checkOutDay': instance.checkOutDay.toIso8601String(),
      'children': instance.children,
      'adult': instance.adult,
      'amount': instance.amount,
      'propertyId': instance.propertyId,
      'hostId': instance.hostId,
      'customerId': instance.customerId,
      'hostFee': instance.hostFee,
      'websiteFee': instance.websiteFee,
    };
