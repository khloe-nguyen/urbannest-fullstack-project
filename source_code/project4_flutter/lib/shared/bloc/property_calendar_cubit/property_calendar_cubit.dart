import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/listing_list_cubit/listing_list_state.dart';
import 'package:project4_flutter/shared/bloc/property_calendar_cubit/property_calendar_state.dart';
import 'package:project4_flutter/shared/bloc/trip_cubit/trip_state.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_paging.dart';
import '../../../../shared/utils/token_storage.dart';
import '../../../features/trips/models/trip_count.dart';

class PropertyCalendarCubit extends Cubit<PropertyCalendarState> {
  bool isLoading = false;
  var tokenStorage = TokenStorage();
  final List<BookingMinimizeDto> bookings = [];
  PropertyMinimizeDto? property;
  var apiService = ApiService();
  List<DateTime> selectedDate = [];
  bool isEditPrice = false;

  void onChangeEditPrice() {
    isEditPrice = !isEditPrice;
    emit(ChangeEditPrice());
  }

  PropertyCalendarCubit() : super(PropertyCalendarStateNotAvailable());

  void onChangeSelectedDate(date) {
    var now = DateTime.now();
    var nowDate = DateTime(now.year, now.month, now.day);

    if (date!.isBefore(nowDate)) {
      return;
    }

    if (selectedDate.contains(date)) {
      selectedDate.removeWhere(
        (element) => element.isAtSameMomentAs(date),
      );
    } else {
      selectedDate.add(date);
    }

    emit(ChangSelectedDate(selectedDate));
  }

  void clearSelectedDate() {
    selectedDate.clear();
    emit(ChangSelectedDate(selectedDate));
  }

  Future openDate(body) async {
    try {
      var token = await tokenStorage.getToken();

      var response = await apiService.put(
        "listingCM/open_not_available_date_mobile",
        body: body,
        headers: {"Authorization": "Bearer $token"},
      );

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        selectedDate.clear();
        fetchBooking(property!.id);
      } else {
        emit(PropertyCalendarStateError('Failed to load posts'));
      }
    } catch (ex) {
      emit(PropertyCalendarStateError(ex.toString()));
    }
  }

  Future blockDate(body) async {
    try {
      var token = await tokenStorage.getToken();

      var response = await apiService.put(
        "listingCM/update_not_available_date_mobile",
        body: body,
        headers: {"Authorization": "Bearer $token"},
      );

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        selectedDate.clear();
        fetchBooking(property!.id);
      } else {
        emit(PropertyCalendarStateError('Failed to load posts'));
      }
    } catch (ex) {
      emit(PropertyCalendarStateError(ex.toString()));
    }
  }

  Future updateExceptionDate(body) async {
    try {
      var token = await tokenStorage.getToken();

      var response = await apiService.put(
        "listingCM/update_exception_date_mobile",
        body: body,
        headers: {"Authorization": "Bearer $token"},
      );

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        isEditPrice = false;
        selectedDate.clear();
        fetchBooking(property!.id);
      } else {
        emit(PropertyCalendarStateError('Failed to load posts'));
      }
    } catch (ex) {
      emit(PropertyCalendarStateError(ex.toString()));
    }
  }

  Future fetchBooking(propertyId) async {
    try {
      isLoading = true;

      emit(PropertyCalendarLoading());

      Map<String, dynamic> params = {
        'propertyId': propertyId,
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("bookingCM/property_booking",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        bookings.clear();
        bookings.addAll((customResult.data as List).map((item) {
          return BookingMinimizeDto.fromJson(item);
        }).toList());

        property = bookings[0].property;

        emit(PropertyCalendarFinishLoaded());
      } else {
        emit(PropertyCalendarStateError('Failed to load posts'));
      }
    } catch (ex) {
      emit(PropertyCalendarStateError(ex.toString()));
    } finally {
      isLoading = false;
    }
  }
}
