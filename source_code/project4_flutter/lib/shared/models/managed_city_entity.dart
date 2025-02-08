class ManagedCityEntity {
  int id;
  String cityName;
  dynamic propertyCount;
  bool managed;

  ManagedCityEntity({
    required this.id,
    required this.cityName,
    required this.propertyCount,
    required this.managed,
  });

  factory ManagedCityEntity.fromJson(Map<String, dynamic> json) =>
      ManagedCityEntity(
        id: json["id"],
        cityName: json["cityName"],
        propertyCount: json["propertyCount"],
        managed: json["managed"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "cityName": cityName,
        "propertyCount": propertyCount,
        "managed": managed,
      };
}
