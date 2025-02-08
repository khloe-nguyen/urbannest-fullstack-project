// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Category _$CategoryFromJson(Map<String, dynamic> json) => Category(
      id: (json['id'] as num).toInt(),
      categoryName: json['categoryName'] as String,
      description: json['description'] as String?,
      categoryImage: json['categoryImage'] as String,
      status: json['status'] as bool,
    );

Map<String, dynamic> _$CategoryToJson(Category instance) => <String, dynamic>{
      'id': instance.id,
      'categoryName': instance.categoryName,
      'description': instance.description,
      'categoryImage': instance.categoryImage,
      'status': instance.status,
    };
