abstract class AmenityState {}

class AmenityNotAvailable extends AmenityState {}

class AmenityLoading extends AmenityState {}

class AmenitySuccess extends AmenityState {}

class AmenityError extends AmenityState {
  final String message;
  AmenityError(this.message);
}

class ChangeSuccess extends AmenityState {
  final List<int> amenityIdList;
  ChangeSuccess(this.amenityIdList);
}
