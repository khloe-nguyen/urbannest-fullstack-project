import 'package:flutter/material.dart';

abstract class TripState {}

class TripLoaded extends TripState {}

class TripFinishLoaded extends TripState {}

class TripLoading extends TripState {}

class TripError extends TripState {
  final String message;

  TripError(this.message);
}

class TripDateUpdated extends TripState {
  DateTimeRange selectedDateRange;
  TripDateUpdated(this.selectedDateRange);
}

class TripStatusUpdated extends TripState {
  String status;
  TripStatusUpdated(this.status);
}

class TripNotAvailable extends TripState {}
