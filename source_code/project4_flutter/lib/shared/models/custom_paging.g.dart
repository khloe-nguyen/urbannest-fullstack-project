// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'custom_paging.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CustomPaging _$CustomPagingFromJson(Map<String, dynamic> json) => CustomPaging(
      status: (json['status'] as num).toInt(),
      message: json['message'] as String,
      data: json['data'],
      currentPage: (json['currentPage'] as num).toInt(),
      totalPages: (json['totalPages'] as num).toInt(),
      pageSize: (json['pageSize'] as num).toInt(),
      totalCount: (json['totalCount'] as num).toInt(),
      hasPrevious: json['hasPrevious'] as bool,
      hasNext: json['hasNext'] as bool,
    );

Map<String, dynamic> _$CustomPagingToJson(CustomPaging instance) =>
    <String, dynamic>{
      'status': instance.status,
      'currentPage': instance.currentPage,
      'totalPages': instance.totalPages,
      'pageSize': instance.pageSize,
      'totalCount': instance.totalCount,
      'hasPrevious': instance.hasPrevious,
      'hasNext': instance.hasNext,
      'message': instance.message,
      'data': instance.data,
    };
