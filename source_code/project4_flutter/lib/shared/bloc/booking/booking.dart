import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/models/booking.dart';
import 'package:project4_flutter/features/property_detail/models/booking_dto.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

abstract class BookingState {}

class BookingSuccess extends BookingState {
  final Booking booking;
  BookingSuccess(this.booking);
}

class BookingInitial extends BookingState {}

class BookingError extends BookingState {
  final String message;
  BookingError(this.message);
}

class BookingFail extends BookingState {
  final String message;
  BookingFail(this.message);
}

class BookingAwait extends BookingState {}

class BookingCubit extends Cubit<BookingState> {
  BookingCubit() : super(BookingInitial());
  Future<Booking?> initBookingProcess(BookingDto booking) async {
    if (_validateBookingData(booking)) {
      var res = await createBooking(booking);
      if (res != null) {
        return res;
      } else {
        emit(BookingFail("Some days have been booked"));
        return null;
      }
    } else {
      emit(BookingFail("Host cannot book their own property"));
      return null;
    }
  }

  bool _validateBookingData(BookingDto booking) {
    return booking.checkInDay != null &&
        booking.checkOutDay != null &&
        booking.customerId != null &&
        booking.propertyId != null &&
        booking.amount != null &&
        booking.hostId != null &&
        booking.websiteFee != null &&
        booking.adult != null &&
        booking.children != null &&
        booking.customerId != booking.hostId;
  }

  Future<Booking?> createBooking(BookingDto booking) async {
    emit(BookingAwait());
    try {
      ApiService apiService = ApiService();
      final response =
      await apiService.post("bookingCM/add", body: booking.toJson());
      final customResult = CustomResult.fromJson(response);
      if (customResult.status == 200) {
        final booking = Booking.fromJson(customResult.data);
        emit(BookingSuccess(booking));
        return booking;
      } else {
        return null;
      }
    } catch (ex, stackTrace) {
      emit(BookingError("Failed to create booking: $ex"));
      return null;
    } finally {}
  }
}
