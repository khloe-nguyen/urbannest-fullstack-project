class LegalNameRequest {
  final String firstName;
  final String lastName;

  LegalNameRequest({required this.firstName, required this.lastName});

  Map<String, dynamic> toJson() {
    return {"firstName": firstName, "lastName": lastName};
  }
}
