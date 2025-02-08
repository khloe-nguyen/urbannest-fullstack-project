abstract class FavouriteState {}

class FavouriteNotAvailable extends FavouriteState {}

class FavouriteLoading extends FavouriteState {}

class FavouriteSuccess extends FavouriteState {}

class FavouriteError extends FavouriteState {
  final String message;
  FavouriteError(this.message);
}

class ChangeFavouriteSuccess extends FavouriteState {}
