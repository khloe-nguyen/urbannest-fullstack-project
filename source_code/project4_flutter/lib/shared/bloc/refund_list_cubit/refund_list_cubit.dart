import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/refund_list_cubit/refund_list_state.dart';
import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_paging.dart';
import '../../../../shared/utils/token_storage.dart';

class RefundListCubit extends Cubit<RefundListState> {
  var apiService = ApiService();
  var tokenStorage = TokenStorage();
  String? currentStartDate;
  String? currentEndDate;
  int currentPage = 0;
  bool hasMore = true;
  bool isLoading = false;
  final List<BookingMinimizeDto> refundList = [];
  RefundListCubit() : super(RefundListNotAvailable());

  Future updateDateRange(DateTimeRange selectedDateRange) async {
    currentPage = 0;
    hasMore = true;
    currentStartDate = DateFormat('yyyy-MM-dd').format(selectedDateRange.start);
    currentEndDate = DateFormat('yyyy-MM-dd').format(selectedDateRange.end);
    refundList.clear();
    await getRefundList();
  }

  void logout() {
    emit(RefundListNotAvailable());
  }

  Future refresh() async {
    hasMore = true;
    refundList.clear();
    currentPage = 0;
    await getRefundList();
  }

  Future getRefundList() async {
    if (!hasMore) {
      emit(RefundListFinishLoaded());
      return;
    }

    if (hasMore) {
      emit(RefundListLoading());
    }

    try {
      isLoading = true;

      Map<String, dynamic> params = {
        'pageNumber': currentPage,
        'pageSize': 10,
        'startDate': currentStartDate,
        'endDate': currentEndDate,
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("bookingCM/get_user_refund",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customPaging = CustomPaging.fromJson(response);

      if (customPaging.status == 200) {
        var bookings = (customPaging.data as List).map((item) {
          return BookingMinimizeDto.fromJson(item);
        }).toList();

        hasMore = customPaging.hasNext;
        refundList.addAll(bookings);
        currentPage++;

        emit(RefundListLoaded());
      } else {
        emit(RefundListError('Failed to load posts'));
      }
    } catch (ex) {
      emit(RefundListError(ex.toString()));
    } finally {
      isLoading = false;
    }
  }
}
