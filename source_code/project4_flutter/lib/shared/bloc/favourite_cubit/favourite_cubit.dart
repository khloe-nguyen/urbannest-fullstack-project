import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_state.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';
import 'package:project4_flutter/shared/models/favourite_entity.dart';
import 'package:project4_flutter/shared/models/travel_entity.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';

class FavouriteCubit extends Cubit<FavouriteState> {
  FavouriteCubit(this.userCubit) : super(FavouriteNotAvailable());

  final ApiService apiService = ApiService();
  final UserCubit userCubit;
  List<FavouriteEntity> favourites = [];
  late int userId;
  List<TravelEntity> propertiesInWishlist = [];
  var tokenStorage = TokenStorage();

  bool isLoved(int id) {
    return favourites.any((item) => item.propertyId == id);
  }

  Future<void> getFavourites() async {
    var state = userCubit.state;
    if (state is UserSuccess) {
      try {
        emit(FavouriteLoading());
        userId = state.user.id;
        var response = await apiService
            .get("favouriteCM/getFavourites", params: {"userId": userId});
        var customResult = CustomResult.fromJson(response);

        if (customResult.status == 200) {
          favourites = (customResult.data as List).map((item) {
            return FavouriteEntity.fromJson(item);
          }).toList();

          emit(FavouriteSuccess());
        } else {
          emit(FavouriteError('fail to load favourites'));
        }
      } catch (ex) {
        emit(FavouriteError(ex.toString()));
      }
    } else {
      print("chưa loginnnnnn");
      emit(FavouriteError("User not logged in"));
    }
  }

  Future<void> createFavourite(
      {required String collectionName, required int propertyId}) async {
    var state = userCubit.state;
    if (state is UserSuccess) {
      try {
        emit(FavouriteLoading());
        userId = state.user.id!;

        // Gửi POST request
        var response = await apiService.post("favouriteCM/createFavourite",
            body: {
              "userId": userId,
              "propertyId": propertyId,
              "collectionName": collectionName
            });

        // Parse response từ server
        var customResult = CustomResult.fromJson(response);

        if (customResult.status == 200) {
          // Nếu thành công => gọi lại danh sách mới
          await getFavourites();
          print("tao moi ok");
          emit(ChangeFavouriteSuccess());
        } else {
          emit(FavouriteError('Fail to create favourite'));
        }
      } catch (ex) {
        emit(FavouriteError(ex.toString()));
      }
    } else {
      print("User chưa đăng nhập");
      emit(FavouriteError("User not logged in"));
    }
  }

  Future<void> deleteFavourite({required int propertyId}) async {
    var state = userCubit.state;
    if (state is UserSuccess) {
      try {
        emit(FavouriteLoading());
        userId = state.user.id!;

        // Gửi POST request
        var response =
            await apiService.post("favouriteCM/deleteFavourites", body: {
          "userId": userId,
          "propertyId": propertyId,
        });

        // Parse response từ server
        var customResult = CustomResult.fromJson(response);

        if (customResult.status == 204) {
          // Nếu thành công => gọi lại danh sách mới
          await getFavourites();
          // Xóa yêu thích cục bộ
          // propertiesInWishlist.removeWhere((item) => item.id == propertyId);
          print("delete fav ok");
          emit(ChangeFavouriteSuccess());
        } else {
          emit(FavouriteError('Fail to delete favourite'));
        }
      } catch (ex) {
        emit(FavouriteError(ex.toString()));
      }
    } else {
      print("User chưa đăng nhập");
      emit(FavouriteError("User not logged in"));
    }
  }

  Future<void> getPropertiesFavourite({required String collectionName}) async {
    var state = userCubit.state;
    var token = await tokenStorage.getToken();
    if (state is UserSuccess) {
      try {
        emit(FavouriteLoading());

        var response = await apiService.get(
          "favouriteCM/getPropertiesInWishList",
          params: {"collectionName": collectionName},
          headers: {"Authorization": "Bearer $token"},
        );
        var customResult = CustomResult.fromJson(response);

        if (customResult.status == 200) {
          propertiesInWishlist = (customResult.data as List).map((item) {
            return TravelEntity.fromJson(item);
          }).toList();

          emit(FavouriteSuccess());
        } else {
          emit(FavouriteError('fail to load travels'));
        }
      } catch (ex) {
        emit(FavouriteError(ex.toString()));
      }
    } else {
      print("chưa loginnnnnn");
      emit(FavouriteError("User not logged in"));
    }
  }
}
