// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'policy.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Policy _$PolicyFromJson(Map<String, dynamic> json) => Policy(
      id: (json['id'] as num).toInt(),
      policyDescription: json['policyDescription'] as String,
      policyName: json['policyName'] as String,
    );

Map<String, dynamic> _$PolicyToJson(Policy instance) => <String, dynamic>{
      'id': instance.id,
      'policyName': instance.policyName,
      'policyDescription': instance.policyDescription,
    };
