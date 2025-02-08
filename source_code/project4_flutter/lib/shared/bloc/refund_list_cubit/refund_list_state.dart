abstract class RefundListState {}

class RefundListLoaded extends RefundListState {}

class RefundListFinishLoaded extends RefundListState {}

class RefundListLoading extends RefundListState {}

class RefundListError extends RefundListState {
  final String message;

  RefundListError(this.message);
}

class RefundListNotAvailable extends RefundListState {}
