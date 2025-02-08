abstract class CityState {}

class ManagedCityNotAvailable extends CityState {}

class ManagedCityLoading extends CityState {}

class ManagedCitySuccess extends CityState {}

class ManagedCityError extends CityState {
  final String message;
  ManagedCityError(this.message);
}

class CityChangeSuccess extends CityState {
  CityChangeSuccess();
}

class DistrictChangeSuccess extends CityState {
  DistrictChangeSuccess();
}

class WardChangeSuccess extends CityState {
  WardChangeSuccess();
}
