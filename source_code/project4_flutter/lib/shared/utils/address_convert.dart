import 'dart:convert';
import 'package:flutter/services.dart';

import '../../features/property_detail/models/address.dart';

Future<AddressData> loadAddresses() async {
  String jsonString = await rootBundle.loadString('assets/data/dchc.json');
  final Map<String, dynamic> jsonResponse = json.decode(jsonString);
  return AddressData.fromJson(jsonResponse);
}

Future<String> convertAddressCode(String addressCode) async {
  AddressData addressData = await loadAddresses();
  List<String> addressArr = addressCode.split("_");

  Level1? province = addressData.data.firstWhere(
    (level1) => level1.level1_id == addressArr[0],
    orElse: () => Level1(level1_id: '', name: '', type: '', level2s: []),
  );
  Level2? district = province.level2s.firstWhere(
    (level2) => level2.level2_id == addressArr[1],
    orElse: () => Level2(level2_id: '', name: '', type: '', level3s: []),
  );
  Level3? ward = district.level3s.firstWhere(
    (level3) => level3.level3_id == addressArr[2],
    orElse: () => Level3(level3_id: '', name: '', type: ''),
  );
  return '${ward.name}, ${district.name}, ${province.name}';
}
