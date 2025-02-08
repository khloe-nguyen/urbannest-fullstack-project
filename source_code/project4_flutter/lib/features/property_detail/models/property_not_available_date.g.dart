// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_not_available_date.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PropertyNotAvailableDate _$PropertyNotAvailableDateFromJson(
        Map<String, dynamic> json) =>
    PropertyNotAvailableDate(
      id: (json['id'] as num).toInt(),
      date: DateTime.parse(json['date'] as String),
    );

Map<String, dynamic> _$PropertyNotAvailableDateToJson(
        PropertyNotAvailableDate instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
    };
