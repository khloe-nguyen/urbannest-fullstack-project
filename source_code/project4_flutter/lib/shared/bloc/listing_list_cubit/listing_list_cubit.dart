import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/listing_list_cubit/listing_list_state.dart';
import 'package:project4_flutter/shared/bloc/trip_cubit/trip_state.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_paging.dart';
import '../../../../shared/utils/token_storage.dart';
import '../../../features/trips/models/trip_count.dart';

class ListingListCubit extends Cubit<ListingListState> {
  var apiService = ApiService();
  var tokenStorage = TokenStorage();
  String currentStatus = "PUBLIC";
  String currentSearch = "";
  int currentPage = 0;
  bool hasMore = true;
  bool isLoading = false;
  final List<PropertyMinimizeDto> properties = [];
  ListingListCubit() : super(ListingListNotAvailable());

  void logout() {
    emit(ListingListNotAvailable());
  }

  Future reFetch() async {
    currentPage = 0;
    hasMore = true;
    properties.clear();
    await getListing();
  }

  void searchListing(value) async {
    currentPage = 0;
    hasMore = true;
    properties.clear();
    currentSearch = value;
    await getListing();
  }

  Future getListing() async {
    if (!hasMore) {
      emit(ListingListFinishLoaded());
      return;
    }

    if (hasMore) {
      emit(ListingListLoading());
    }

    try {
      isLoading = true;

      Map<String, dynamic> params = {
        'pageNumber': currentPage,
        'pageSize': 10,
        'status': currentStatus,
        'search': currentSearch
      };

      var token = await tokenStorage.getToken();

      var response = await apiService.get("listingCM/get_host_listings",
          headers: {"Authorization": "Bearer $token"}, params: params);

      var customPaging = CustomPaging.fromJson(response);

      if (customPaging.status == 200) {
        var bookings = (customPaging.data as List).map((item) {
          return PropertyMinimizeDto.fromJson(item);
        }).toList();

        hasMore = customPaging.hasNext;
        properties.addAll(bookings);
        currentPage++;

        emit(ListingListLoaded());
      } else {
        emit(ListingListError('Failed to load posts'));
      }
    } catch (ex) {
      emit(ListingListError(ex.toString()));
    } finally {
      isLoading = false;
    }
  }
}
