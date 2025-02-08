import 'package:project4_flutter/shared/models/custom_result.dart';

import '../../../shared/api/api_service.dart';

class AuthenticationApi {
  ApiService apiService = ApiService();

  Future<CustomResult> authenticationRequest(Map<String, String> body) async {
    try {
      var response = await apiService.post("authCM/login_signup", body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }

  Future<CustomResult> loginRequest(Map<String, String> body) async {
    try {
      var response =
          await apiService.post("authCM/login_by_mobile", body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }

  Future<CustomResult> loginOrSignUpGoogleRequest(
      Map<String, String> body) async {
    try {
      var response =
          await apiService.post("authCM/login_sign_up_google", body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }

  Future<CustomResult> registerRequest(Map<String, String> body) async {
    try {
      var response = await apiService.post("authCM/register", body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }

  Future<CustomResult> createAuthenticationRequest(
      Map<String, String> body) async {
    try {
      var response = await apiService.post("authCM/create_authentication_code",
          body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }

  Future<CustomResult> registerByGoogle(Map<String, String> body) async {
    try {
      var response =
          await apiService.post("authCM/register_by_google", body: body);
      var customResult = CustomResult.fromJson(response);
      return customResult;
    } catch (ex) {
      return CustomResult(
          status: 999, message: ex.toString(), data: List.empty());
    }
  }
}
