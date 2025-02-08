import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'amenity.g.dart';

@JsonSerializable()
class Amenity {
  int id;
  String name;
  String? description;
  String image;
  String type;
  bool status;

  Amenity({
    required this.id,
    required this.name,
    this.description,
    required this.image,
    required this.type,
    required this.status,
  });



factory Amenity.fromJson(Map<String, dynamic> json) =>
_$AmenityFromJson(json);

Map<String, dynamic> toJson() => _$AmenityToJson(this);

}
