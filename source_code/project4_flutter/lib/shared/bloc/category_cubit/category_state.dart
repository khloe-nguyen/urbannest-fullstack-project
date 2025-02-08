abstract class CategoryState {}

class CategoryNotAvailable extends CategoryState {}

class CategoryLoading extends CategoryState {}

class CategorySuccess extends CategoryState {}

class CategoryError extends CategoryState {
  final String message;
  CategoryError(this.message);
}
