// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'amenity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Amenity _$AmenityFromJson(Map<String, dynamic> json) => Amenity(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      description: json['description'] as String?,
      image: json['image'] as String,
      type: json['type'] as String,
      status: json['status'] as bool,
    );

Map<String, dynamic> _$AmenityToJson(Amenity instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'image': instance.image,
      'type': instance.type,
      'status': instance.status,
    };
