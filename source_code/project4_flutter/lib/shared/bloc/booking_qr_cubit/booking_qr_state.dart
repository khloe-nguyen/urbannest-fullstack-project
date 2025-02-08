import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';

abstract class BookingQrState {}

class BookingQrNotAvailable extends BookingQrState {}

class BookingQrLoading extends BookingQrState {}

class BookingQrSuccess extends BookingQrState {
  BookingMinimizeDto booking;
  BookingQrSuccess(this.booking);
}

class BookingQrError extends BookingQrState {
  final String message;
  BookingQrError(this.message);
}
