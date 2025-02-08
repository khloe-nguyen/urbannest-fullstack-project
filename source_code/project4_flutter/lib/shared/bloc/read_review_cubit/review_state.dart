import 'package:project4_flutter/shared/models/custom_paging.dart';

abstract class ReviewState {}

class ReviewLoading extends ReviewState {
  final String message;
  ReviewLoading(this.message);
}

class ReviewSuccess extends ReviewState {
  final CustomPaging custom_paging;
  ReviewSuccess(this.custom_paging);
}

class ReviewFailure extends ReviewState {
  final String message;
  ReviewFailure(this.message);
}
