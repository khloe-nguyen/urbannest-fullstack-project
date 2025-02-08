import 'package:json_annotation/json_annotation.dart';

part 'custom_paging.g.dart';

@JsonSerializable()
class CustomPaging {
  int status;
  int currentPage;
  int totalPages;
  int pageSize;
  int totalCount;
  bool hasPrevious;
  bool hasNext;
  String message;
  dynamic data;

  CustomPaging(
      {required this.status,
      required this.message,
      required this.data,
      required this.currentPage,
      required this.totalPages,
      required this.pageSize,
      required this.totalCount,
      required this.hasPrevious,
      required this.hasNext});

  factory CustomPaging.fromJson(Map<String, dynamic> json) =>
      _$CustomPagingFromJson(json);

  Map<String, dynamic> toJson() => _$CustomPagingToJson(this);
}
