import 'package:json_annotation/json_annotation.dart';

part 'custom_result.g.dart';

@JsonSerializable()
class CustomResult {
  int status;
  String message;
  dynamic data;

  CustomResult(
      {required this.status, required this.message, required this.data});

  factory CustomResult.fromJson(Map<String, dynamic> json) =>
      _$CustomResultFromJson(json);

  Map<String, dynamic> toJson() => _$CustomResultToJson(this);
}
