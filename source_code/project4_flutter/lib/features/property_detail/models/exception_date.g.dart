// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'exception_date.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExceptionDate _$ExceptionDateFromJson(Map<String, dynamic> json) =>
    ExceptionDate(
      id: (json['id'] as num).toInt(),
      date: DateTime.parse(json['date'] as String),
      basePrice: (json['basePrice'] as num).toInt(),
    );

Map<String, dynamic> _$ExceptionDateToJson(ExceptionDate instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'basePrice': instance.basePrice,
    };
