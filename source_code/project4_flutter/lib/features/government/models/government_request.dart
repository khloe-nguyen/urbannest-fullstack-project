class GovernmentRequest {
  int idType;
  String governmentCountry;
  String frontImageUri;
  String backImageUri;

  GovernmentRequest(
      {required this.idType,
      required this.governmentCountry,
      required this.frontImageUri,
      required this.backImageUri});

  Map<String, dynamic> toJson() {
    return {"IdType": idType, "governmentCountry": governmentCountry};
  }
}
