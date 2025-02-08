import 'package:project4_flutter/shared/models/travel_entity.dart';

abstract class TravelState {}

class TravelNotAvailable extends TravelState {}

class TravelFinishLoaded extends TravelState {}

class TravelLoaded extends TravelState {}

class TravelLoading extends TravelState {}

class TravelSuccess extends TravelState {
  final List<TravelEntity>? travels;
  TravelSuccess(this.travels);
}

class TravelError extends TravelState {
  final String message;
  TravelError(this.message);
}
