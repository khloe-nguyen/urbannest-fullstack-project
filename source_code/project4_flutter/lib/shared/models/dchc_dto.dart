class DCHCDto {
  List<Level1> data;

  DCHCDto({
    required this.data,
  });

  factory DCHCDto.fromJson(Map<String, dynamic> json) => DCHCDto(
        data: List<Level1>.from(json["data"].map((x) => Level1.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "data": List<dynamic>.from(data.map((x) => x.toJson())),
      };
}

class Level1 {
  String level1Id;
  String name;
  String type;
  List<Level2> level2S;

  Level1({
    required this.level1Id,
    required this.name,
    required this.type,
    required this.level2S,
  });

  factory Level1.fromJson(Map<String, dynamic> json) => Level1(
        level1Id: json["level1_id"],
        name: json["name"],
        type: json["type"],
        level2S:
            List<Level2>.from(json["level2s"].map((x) => Level2.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "level1_id": level1Id,
        "name": name,
        "type": type,
        "level2s": List<dynamic>.from(level2S.map((x) => x.toJson())),
      };
}

class Level2 {
  String level2Id;
  String name;
  String type;
  List<Level3> level3S;

  Level2({
    required this.level2Id,
    required this.name,
    required this.type,
    required this.level3S,
  });

  factory Level2.fromJson(Map<String, dynamic> json) => Level2(
        level2Id: json["level2_id"],
        name: json["name"],
        type: json["type"],
        level3S:
            List<Level3>.from(json["level3s"].map((x) => Level3.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "level2_id": level2Id,
        "name": name,
        "type": type,
        "level3s": List<dynamic>.from(level3S.map((x) => x.toJson())),
      };
}

class Level3 {
  String level3Id;
  String name;
  String type;

  Level3({
    required this.level3Id,
    required this.name,
    required this.type,
  });

  factory Level3.fromJson(Map<String, dynamic> json) => Level3(
        level3Id: json["level3_id"],
        name: json["name"],
        type: json["type"],
      );

  Map<String, dynamic> toJson() => {
        "level3_id": level3Id,
        "name": name,
        "type": type,
      };
}
