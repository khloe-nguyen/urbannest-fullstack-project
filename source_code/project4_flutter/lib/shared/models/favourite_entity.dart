class FavouriteEntity {
  int propertyId;
  String collectionName;
  String propertyName;
  String propertyImage;

  FavouriteEntity({
    required this.propertyId,
    required this.collectionName,
    required this.propertyName,
    required this.propertyImage,
  });

  factory FavouriteEntity.fromJson(Map<String, dynamic> json) =>
      FavouriteEntity(
        propertyId: json["propertyId"],
        collectionName: json["collectionName"],
        propertyName: json["propertyName"],
        propertyImage: json["propertyImage"],
      );

  Map<String, dynamic> toJson() => {
        "propertyId": propertyId,
        "collectionName": collectionName,
        "propertyName": propertyName,
        "propertyImage": propertyImage,
      };
}
