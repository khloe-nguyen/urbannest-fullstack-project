import 'package:flutter/material.dart';

abstract class PropertyCalendarState {}

class ChangSelectedDate extends PropertyCalendarState {
  final List<DateTime> selectedDate;

  ChangSelectedDate(this.selectedDate);
}

class ChangeEditPrice extends PropertyCalendarState {}

class PropertyCalendarFinishLoaded extends PropertyCalendarState {}

class PropertyCalendarLoading extends PropertyCalendarState {}

class PropertyCalendarStateError extends PropertyCalendarState {
  final String message;

  PropertyCalendarStateError(this.message);
}

class PropertyCalendarStateNotAvailable extends PropertyCalendarState {}
