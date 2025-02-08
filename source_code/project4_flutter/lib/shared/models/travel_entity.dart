import 'package:json_annotation/json_annotation.dart';

part 'travel_entity.g.dart';

@JsonSerializable()
class TravelEntity {
  int id;

  String propertyTitle;

  double basePrice;

  String addressCode;

  List<String> propertyImages;

  double averageRating;

  TravelEntity({
    required this.id,
    required this.propertyTitle,
    required this.basePrice,
    required this.addressCode,
    required this.propertyImages,
    required this.averageRating,
  });

  factory TravelEntity.fromJson(Map<String, dynamic> json) =>
      _$TravelEntityFromJson(json);

  Map<String, dynamic> toJson() => _$TravelEntityToJson(this);
}
