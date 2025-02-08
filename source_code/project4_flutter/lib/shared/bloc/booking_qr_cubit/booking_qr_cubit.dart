import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/bloc/booking_qr_cubit/booking_qr_state.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';

import '../../../features/property_detail/models/custom_result.dart';

class BookingQrCubit extends Cubit<BookingQrState> {
  BookingQrCubit() : super(BookingQrNotAvailable());

  TokenStorage tokenStorage = TokenStorage();
  ApiService apiService = ApiService();

  bool isLoading = false;

  Future getBookingQr(String qrCode) async {
    try {
      isLoading = true;
      emit(BookingQrLoading());

      var token = await tokenStorage.getToken();
      var response = await apiService.get("bookingCM/get_booking_by_qr",
          params: {"qrcode": qrCode},
          headers: {"Authorization": "Bearer $token"});

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var booking = BookingMinimizeDto.fromJson(customResult.data);

        emit(BookingQrSuccess(booking));
      } else {
        emit(BookingQrError(customResult.message));
        print('fail to load ');
      }
    } catch (ex) {
      emit(BookingQrError(ex.toString()));
      print(ex.toString());
    } finally {
      isLoading = false;
    }
  }
}
