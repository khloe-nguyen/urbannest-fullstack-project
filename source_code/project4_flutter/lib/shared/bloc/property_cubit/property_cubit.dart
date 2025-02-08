import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/api/property_detail_api.dart';
import 'package:project4_flutter/features/property_detail/models/property.dart';
import 'package:project4_flutter/shared/bloc/property_cubit/property_state.dart';

class PropertyCubit extends Cubit<PropertyState> {
  PropertyCubit() : super(PropertyLoading("Loading..."));
  Property? property;

  var propertyApi = PropertyDetailApi();

  Future<void> getProperty(int id) async {
    emit(PropertyLoading("Loading..."));
    try {
      var propertyResponse = await propertyApi.getProperty(id);
      if (propertyResponse != null) {
        property = propertyResponse;
        emit(PropertySuccess(propertyResponse));
      } else {
        emit(PropertyError("Property not found"));
      }
    } catch (ex) {
      emit(PropertyError("Failed to load property: $ex"));
    }
  }
}
