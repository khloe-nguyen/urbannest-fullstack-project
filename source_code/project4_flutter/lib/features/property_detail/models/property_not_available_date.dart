
import 'dart:convert';

import 'package:json_annotation/json_annotation.dart';
part 'property_not_available_date.g.dart';

@JsonSerializable()
class PropertyNotAvailableDate {
  int id;
  DateTime date;

  PropertyNotAvailableDate({
    required this.id,
    required this.date,
  });

  factory PropertyNotAvailableDate.fromJson(Map<String, dynamic> json) => _$PropertyNotAvailableDateFromJson(json);
  Map<String, dynamic> toJson()=> _$PropertyNotAvailableDateToJson(this);
}
