class Level3 {
  final String level3_id;
  final String name;
  final String type;

  Level3({
    required this.level3_id,
    required this.name,
    required this.type,
  });

  factory Level3.fromJson(Map<String, dynamic> json) {
    return Level3(
      level3_id: json['level3_id'],
      name: json['name'],
      type: json['type'],
    );
  }
}

class Level2 {
  final String level2_id;
  final String name;
  final String type;
  final List<Level3> level3s;

  Level2({
    required this.level2_id,
    required this.name,
    required this.type,
    required this.level3s,
  });

  factory Level2.fromJson(Map<String, dynamic> json) {
    var level3List = (json['level3s'] as List)
        .map((e) => Level3.fromJson(e))
        .toList();
    return Level2(
      level2_id: json['level2_id'],
      name: json['name'],
      type: json['type'],
      level3s: level3List,
    );
  }
}

class Level1 {
  final String level1_id;
  final String name;
  final String type;
  final List<Level2> level2s;

  Level1({
    required this.level1_id,
    required this.name,
    required this.type,
    required this.level2s,
  });

  factory Level1.fromJson(Map<String, dynamic> json) {
    var level2List = (json['level2s'] as List)
        .map((e) => Level2.fromJson(e))
        .toList();
    return Level1(
      level1_id: json['level1_id'],
      name: json['name'],
      type: json['type'],
      level2s: level2List,
    );
  }
}

class AddressData {
  final List<Level1> data;

  AddressData({required this.data});

  factory AddressData.fromJson(Map<String, dynamic> json) {
    var level1List = (json['data'] as List)
        .map((e) => Level1.fromJson(e))
        .toList();
    return AddressData(data: level1List);
  }
}
