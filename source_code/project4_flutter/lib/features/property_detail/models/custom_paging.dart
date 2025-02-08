import 'package:json_annotation/json_annotation.dart';
part  'custom_paging.g.dart';
@JsonSerializable()
class CustomPaging {
  final int status;
  final String message;
  final int totalPages;
  final int currentPage;
  final int pageSize;
  final int totalCount;
  final bool hasPrevious;
  final bool hasNext;
  // dynamic data;

  CustomPaging({ required this.status,
    required this.message,
    required this.currentPage,
    required this.totalPages,
    required this.pageSize,
    required this.totalCount,
    required this.hasPrevious,
    required this.hasNext,
    // required this.data
  });

  factory CustomPaging.fromJson(Map<String, dynamic> json) => _$CustomPagingFromJson(json);
  Map<String, dynamic> toJson() => _$CustomPagingToJson(this) ;
}