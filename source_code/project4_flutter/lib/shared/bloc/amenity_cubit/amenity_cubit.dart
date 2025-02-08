import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_state.dart';
import 'package:project4_flutter/shared/models/amenity_entity.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

class AmenityCubit extends Cubit<AmenityState> {
  AmenityCubit() : super(AmenityNotAvailable()) {
    getAmenities(); // Call initializeUser when the cubit is created
  }

  bool isLoading = false;
  List<AmenityEntity> amenityList = [];
  List<int> selectedAmenityIdList = [];
  var apiService = ApiService();

  void changeAmenityIdList(int id) {
    if (selectedAmenityIdList.contains(id)) {
      selectedAmenityIdList.remove(id);
    } else {
      selectedAmenityIdList.add(id);
    }
    emit(ChangeSuccess(selectedAmenityIdList));
  }

  void clearAmenityIdList() {
    selectedAmenityIdList = [];
    emit(ChangeSuccess(selectedAmenityIdList));
  }

  bool isAmenitySelected(int id) {
    return selectedAmenityIdList.contains(id);
  }

  Future<void> getAmenities() async {
    try {
      isLoading = true;
      var response = await apiService.get("amenityCM");
      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var amenities = (customResult.data as List).map((item) {
          return AmenityEntity.fromJson(item);
        }).toList();

        //get PUBLIC amenity
        amenityList = amenities.where((element) {
          return element.status == true;
        }).toList();

        emit(AmenitySuccess());
      } else {
        emit(AmenityError('fail to load amenities'));
      }
    } catch (ex) {
      emit(AmenityError(ex.toString()));
    } finally {
      isLoading = false;
    }
  }
}
