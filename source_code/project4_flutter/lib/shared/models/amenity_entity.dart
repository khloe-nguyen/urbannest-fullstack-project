import 'package:json_annotation/json_annotation.dart';

@JsonSerializable()
class AmenityEntity {
  int id;
  String name;
  String? description;
  String image;
  String type;
  bool status;

  AmenityEntity({
    required this.id,
    required this.name,
    required this.description,
    required this.image,
    required this.type,
    required this.status,
  });

  factory AmenityEntity.fromJson(Map<String, dynamic> json) => AmenityEntity(
        id: json["id"],
        name: json["name"],
        description: json["description"],
        image: json["image"],
        type: json["type"],
        status: json["status"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
        "description": description,
        "image": image,
        "type": type,
        "status": status,
      };
}
