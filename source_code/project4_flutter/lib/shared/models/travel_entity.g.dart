// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'travel_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TravelEntity _$TravelEntityFromJson(Map<String, dynamic> json) => TravelEntity(
      id: (json['id'] as num).toInt(),
      propertyTitle: json['propertyTitle'] as String,
      basePrice: (json['basePrice'] as num).toDouble(),
      addressCode: json['addressCode'] as String,
      propertyImages: (json['propertyImages'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      averageRating: (json['averageRating'] as num).toDouble(),
    );

Map<String, dynamic> _$TravelEntityToJson(TravelEntity instance) =>
    <String, dynamic>{
      'id': instance.id,
      'propertyTitle': instance.propertyTitle,
      'basePrice': instance.basePrice,
      'addressCode': instance.addressCode,
      'propertyImages': instance.propertyImages,
      'averageRating': instance.averageRating,
    };
