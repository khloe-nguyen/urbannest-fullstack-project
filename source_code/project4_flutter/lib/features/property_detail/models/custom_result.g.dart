// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'custom_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CustomResult _$CustomResultFromJson(Map<String, dynamic> json) => CustomResult(
      status: (json['status'] as num).toInt(),
      message: json['message'] as String,
      data: json['data'],
    );

Map<String, dynamic> _$CustomResultToJson(CustomResult instance) =>
    <String, dynamic>{
      'status': instance.status,
      'message': instance.message,
      'data': instance.data,
    };
