import '../../../shared/api/api_service.dart';
import '../../../shared/models/custom_result.dart';

class CalendarApi {
  ApiService apiService = ApiService();

  Future<CustomResult> createAuthenticationRequest(
      Map<String, String> body) async {
    try {
      var response = await apiService
          .post("listingCM/update_not_available_date_mobile", body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }
}
