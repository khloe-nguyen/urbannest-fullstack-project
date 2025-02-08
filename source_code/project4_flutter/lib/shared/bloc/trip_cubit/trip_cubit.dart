import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/trip_cubit/trip_state.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_paging.dart';
import '../../../../shared/utils/token_storage.dart';
import '../../../features/trips/models/trip_count.dart';

class TripCubit extends Cubit<TripState> {
  var apiService = ApiService();
  var tokenStorage = TokenStorage();
  String? currentStatus = "upcoming";
  String? currentStartDate;
  String? currentEndDate;
  int currentPage = 0;
  bool hasMore = true;
  bool isLoading = false;
  TripCount? tripCount;
  bool groupDate = false;
  final List<BookingMinimizeDto> bookingList = [];
  TripCubit() : super(TripNotAvailable());

  void logout() {
    tripCount = null;
    emit(TripNotAvailable());
  }

  void updateDateRange(DateTimeRange selectedDateRange) async {
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

  Future updateGroupDate() async {
    groupDate = !groupDate;
    currentPage = 0;
    hasMore = true;
    bookingList.clear();
    await getBookingList();
    await getBookingCount();
  }

  Future getBookingCount() async {
    try {
      Map<String, dynamic> params = {
        'startDate': currentStartDate,
        'endDate': currentEndDate,
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("bookingCM/get_tripping_count",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customResult = CustomResult.fromJson(response);

      tripCount = TripCount.fromJson(customResult.data);

      if (customResult.status == 200) {}
    } catch (ex) {
      print(ex.toString());
    }
  }

  Future<bool> refund(Map<String, String> body) async {
    try {
      var response =
          await apiService.post("bookingCM/updateRefundForBooking", body: body);
      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        bookingList.clear();
        await getBookingList();
        await getBookingCount();
        return true;
      }

      return false;
    } catch (ex) {
      return false;
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
      emit(TripFinishLoaded());
      return;
    }

    if (hasMore) {
      emit(TripLoading());
    }

    try {
      isLoading = true;

      Map<String, dynamic> params = {
        'pageNumber': currentPage,
        'pageSize': 10,
        'status': currentStatus,
        'startDate': currentStartDate,
        'endDate': currentEndDate,
        'groupDate': groupDate
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("bookingCM/get_user_booking",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customPaging = CustomPaging.fromJson(response);

      if (customPaging.status == 200) {
        var bookings = (customPaging.data as List).map((item) {
          return BookingMinimizeDto.fromJson(item);
        }).toList();

        hasMore = customPaging.hasNext;
        bookingList.addAll(bookings);
        currentPage++;

        emit(TripLoaded());
      } else {
        emit(TripError('Failed to load posts'));
      }
    } catch (ex) {
      emit(TripError(ex.toString()));
    } finally {
      isLoading = false;
    }
  }
}
