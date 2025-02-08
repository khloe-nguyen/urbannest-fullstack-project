import 'package:json_annotation/json_annotation.dart';

part 'category.g.dart';

@JsonSerializable()
class Category {
  int id;
  String categoryName;
  String? description;
  String categoryImage;
  bool status;

  Category({
    required this.id,
    required this.categoryName,
    this.description,
    required this.categoryImage,
    required this.status,
  });

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}
