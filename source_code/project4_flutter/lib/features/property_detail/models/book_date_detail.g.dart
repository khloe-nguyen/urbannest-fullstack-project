// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'book_date_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BookDateDetail _$BookDateDetailFromJson(Map<String, dynamic> json) =>
    BookDateDetail(
      id: (json['id'] as num).toInt(),
      night: DateTime.parse(json['night'] as String),
      price: (json['price'] as num).toInt(),
    );

Map<String, dynamic> _$BookDateDetailToJson(BookDateDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'night': instance.night.toIso8601String(),
      'price': instance.price,
    };
