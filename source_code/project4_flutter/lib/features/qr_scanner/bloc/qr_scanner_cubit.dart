import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../shared/api/api_service.dart';
import '../../../shared/models/custom_result.dart';
import '../../../shared/utils/token_storage.dart';

abstract class QrScannerCubitState {}

class QrScannerSuccess extends QrScannerCubitState {}

class QrScannerLoading extends QrScannerCubitState {}

class QrScannerNotAvailable extends QrScannerCubitState {}

class QrScannerCubit extends Cubit<QrScannerCubitState> {
  ApiService apiService = ApiService();
  TokenStorage tokenStorage = TokenStorage();
  bool loading = false;

  QrScannerCubit() : super(QrScannerNotAvailable());

  Future<String?> createTokenByQrCode() async {
    loading = true;
    emit(QrScannerLoading());
    try {
      var token = await tokenStorage.getToken();
      var response = await apiService.post("authCM/login_by_QR_code",
          body: <String, dynamic>{},
          headers: {"Authorization": "Bearer $token"});
      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        emit(QrScannerSuccess());
        return customResult.data as String;
      }
    } catch (ex) {
      return null;
    }

    return null;
  }
}
