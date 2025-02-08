import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/bloc/city_cubit/city_state.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';
import 'package:project4_flutter/shared/models/managed_city_entity.dart';

class CityCubit extends Cubit<CityState> {
  CityCubit() : super(ManagedCityNotAvailable()) {
    getManagedCities(); // Call initializeUser when the cubit is created
  }

  List<ManagedCityEntity> managedCityList = [];
  List<String> managedCityNames = [];
  var apiService = ApiService();
  String? city;
  String? district;
  String? ward;

  void changeCity(String? ct) {
    city = ct;
    print("hhhh"+ct.toString());
    emit(CityChangeSuccess());
  }

  void changeDistrict(String? dis) {
    district = dis;
    emit(DistrictChangeSuccess());
  }

  void changeWard(String? wa) {
    ward = wa;
    emit(WardChangeSuccess());
  }

  Future<void> getManagedCities() async {
    try {
      emit(ManagedCityLoading());

      var response = await apiService.get("managedCityCM");

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var cities = (customResult.data as List).map((item) {
          return ManagedCityEntity.fromJson(item);
        }).toList();

        // Lọc các Public city
        managedCityList =
            cities.where((element) => element.managed == true).toList();

        // Lấy danh sách tên thành phố
        managedCityNames =
            managedCityList.map((city) => city.cityName.trim()).toList();

        emit(ManagedCitySuccess());
      } else {
        emit(
            ManagedCityError('Failed to load cities: ${customResult.message}'));
      }
    } catch (ex) {
      // Bắt lỗi và hiển thị thông báo lỗi
      emit(ManagedCityError('An error occurred: $ex'));
    }
  }
}
