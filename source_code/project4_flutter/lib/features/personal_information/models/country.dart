class Country {
  final String name;
  final String dialCode;
  final String code;

  Country({required this.name, required this.dialCode, required this.code});

  factory Country.fromJson(Map<String, dynamic> json) {
    return Country(
      name: json['name'],
      dialCode: json['dial_code'],
      code: json['code'],
    );
  }
}