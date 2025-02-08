import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/api/user_api.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';

import '../../models/user.dart';

class UserCubit extends Cubit<UserState> {
  User? loginUser;

  UserCubit() : super(UserNotLogin()) {
    initializeUser(); // Call initializeUser when the cubit is created
  }

  var tokenStorage = TokenStorage();
  var userApi = UserApi();
  var apiService = ApiService();

  Future initializeUser() async {
    emit(UserLoading());
    try {
      var token = await tokenStorage.getToken();

      if (token != null && token.isNotEmpty) {
        var user = await userApi.getUserRequest(token);

        loginUser = user;

        print("user login");

        emit(UserSuccess(user!));
      } else {
        emit(UserNotLogin());
      }
    } catch (ex) {
      emit(UserError("User token expired"));
    }
  }

  Future userLogout(body) async {
    emit(UserLoading());
    try {
      var response =
          await apiService.post("/authCM/logout_by_mobile", body: body);
      await tokenStorage.deleteToken();
      emit(UserNotLogin());
    } catch (ex) {
      emit(UserError("User token expired"));
    }
  }

  Future<void> logout(body) async {
    await userLogout(body);
  }
}
