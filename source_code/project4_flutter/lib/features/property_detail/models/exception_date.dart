
import 'package:json_annotation/json_annotation.dart';
part 'exception_date.g.dart';
@JsonSerializable()
class ExceptionDate {
  int id;
  DateTime date;
  int basePrice;

  ExceptionDate({
    required this.id,
    required this.date,
    required this.basePrice,
  });
  factory ExceptionDate.fromJson(Map<String, dynamic> json) =>
      _$ExceptionDateFromJson(json);

  Map<String, dynamic> toJson() => _$ExceptionDateToJson(this);

}
