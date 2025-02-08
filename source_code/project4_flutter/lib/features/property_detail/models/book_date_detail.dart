
import 'dart:convert';

import 'package:json_annotation/json_annotation.dart';
part 'book_date_detail.g.dart';

@JsonSerializable()
class BookDateDetail {
  int id;
  DateTime night;
  int price;

  BookDateDetail({
    required this.id,
    required this.night,
    required this.price,
  });

  factory BookDateDetail.fromJson(Map<String, dynamic> json) => _$BookDateDetailFromJson(json);
  Map<String, dynamic> toJson()=> _$BookDateDetailToJson(this);
}
