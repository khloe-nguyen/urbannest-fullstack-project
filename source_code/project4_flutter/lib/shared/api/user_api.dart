import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

import '../models/user.dart';

class UserApi {
  final _apiService = ApiService();

  Future<User?> getUserRequest(token) async {
    try {
      var response = await _apiService
          .get("authCM", headers: {"Authorization": "Bearer $token"});
      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var user = User.fromJson(customResult.data as Map<String, dynamic>);

        return user;
      }

      return null;
    } catch (ex) {
      print(ex);
      return null;
    }
  }
}
