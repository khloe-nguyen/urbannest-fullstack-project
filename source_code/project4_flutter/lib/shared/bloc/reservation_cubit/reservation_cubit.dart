import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/features/trips/models/reservation_count.dart';
import 'package:project4_flutter/shared/bloc/reservation_cubit/reservation_state.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_paging.dart';
import '../../../../shared/utils/token_storage.dart';

class ReservationCubit extends Cubit<ReservationState> {
  var apiService = ApiService();
  var tokenStorage = TokenStorage();
  String currentStatus = "pending";
  String? currentStartDate;
  String? currentEndDate;
  int currentPage = 0;
  bool hasMore = true;
  bool isLoading = false;
  final List<BookingMinimizeDto> bookingList = [];
  ReservationCount? reservationCount;
  ReservationCubit() : super(ReservationNotAvailable());

  Future updateDateRange(DateTimeRange selectedDateRange) async {
    currentPage = 0;
    hasMore = true;
    currentStartDate = DateFormat('yyyy-MM-dd').format(selectedDateRange.start);
    currentEndDate = DateFormat('yyyy-MM-dd').format(selectedDateRange.end);
    bookingList.clear();
    await getBookingCount();
    await getBookingList();
  }

  Future updateStatus(String status) async {
    currentPage = 0;
    hasMore = true;
    currentStatus = status;
    bookingList.clear();
    await getBookingList();
  }

  void logout() {
    reservationCount = null;
    emit(ReservationNotAvailable());
  }

  Future getBookingCount() async {
    try {
      Map<String, dynamic> params = {
        'startDate': currentStartDate,
        'endDate': currentEndDate,
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("bookingCM/get_reserved_count",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customResult = CustomResult.fromJson(response);

      reservationCount = ReservationCount.fromJson(customResult.data);

      if (customResult.status == 200) {}
    } catch (ex) {
      print(ex.toString());
    }
  }

  Future refresh() async {
    currentPage = 0;
    hasMore = true;
    bookingList.clear();
    await getBookingCount();
    await getBookingList();
  }

  Future getBookingList() async {
    if (!hasMore) {
      emit(ReservationFinishLoaded());
      return;
    }

    if (hasMore) {
      emit(ReservationLoading());
    }

    try {
      isLoading = true;

      Map<String, dynamic> params = {
        'pageNumber': currentPage,
        'pageSize': 10,
        'status': currentStatus,
        'startDate': currentStartDate,
        'endDate': currentEndDate,
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("bookingCM/get_user_reservation",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customPaging = CustomPaging.fromJson(response);

      if (customPaging.status == 200) {
        var bookings = (customPaging.data as List).map((item) {
          return BookingMinimizeDto.fromJson(item);
        }).toList();

        hasMore = customPaging.hasNext;
        bookingList.addAll(bookings);
        currentPage++;

        emit(ReservationLoaded());
      } else {
        emit(ReservationError('Failed to load posts'));
      }
    } catch (ex) {
      emit(ReservationError(ex.toString()));
    } finally {
      isLoading = false;
    }
  }
}
