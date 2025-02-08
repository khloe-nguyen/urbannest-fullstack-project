// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Booking _$BookingFromJson(Map<String, dynamic> json) => Booking(
      id: (json['id'] as num?)?.toInt(),
      checkInDay: json['checkInDay'] == null
          ? null
          : DateTime.parse(json['checkInDay'] as String),
      checkOutDay: json['checkOutDay'] == null
          ? null
          : DateTime.parse(json['checkOutDay'] as String),
      totalPerson: (json['totalPerson'] as num?)?.toInt(),
      children: (json['children'] as num?)?.toInt(),
      adult: (json['adult'] as num?)?.toInt(),
      bookingType: json['bookingType'] as String?,
      selfCheckIn: json['selfCheckIn'] as bool?,
      amount: (json['amount'] as num?)?.toDouble(),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      status: json['status'] as String?,
      bookingCode: json['bookingCode'] as String?,
      websiteFee: (json['websiteFee'] as num?)?.toInt(),
      hostFee: (json['hostFee'] as num?)?.toInt(),
    );

Map<String, dynamic> _$BookingToJson(Booking instance) => <String, dynamic>{
      'id': instance.id,
      'checkInDay': instance.checkInDay?.toIso8601String(),
      'checkOutDay': instance.checkOutDay?.toIso8601String(),
      'totalPerson': instance.totalPerson,
      'children': instance.children,
      'adult': instance.adult,
      'amount': instance.amount,
      'bookingType': instance.bookingType,
      'selfCheckIn': instance.selfCheckIn,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'status': instance.status,
      'bookingCode': instance.bookingCode,
      'websiteFee': instance.websiteFee,
      'hostFee': instance.hostFee,
    };
