import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_state.dart';
import 'package:project4_flutter/features/messages/models/room.dart';
import 'package:project4_flutter/features/messages/models/search_friend_entity.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_result.dart';

class SearchFriendCubit extends Cubit<SearchFriendState> {
  final String userId;

  SearchFriendCubit(this.userId) : super(SearchFriendLoading()) {
    searchFriend(userId); // Call initializeUser when the cubit is created
  }

  var apiService = ApiService();

  Future<List<SearchFriendEntity>?> searchFriend(String userId,
      {String? search}) async {
    emit(SearchFriendLoading());
    try {
      Map<String, dynamic> params = {'userId': userId, 'search': search};
      var response =
          await apiService.get("/chat/search_new_frient", params: params);

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var friends = (customResult.data as List).map((item) {
          return SearchFriendEntity.fromJson(item);
        }).toList();

        emit(SearchFriendSuccess(list: friends));

        return friends;
      }
      return null;
    } catch (ex) {
      emit(SearchFriendError(error: ex.toString()));
      return null;
    }
  }
}
