import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_state.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_state.dart';
import 'package:project4_flutter/features/messages/models/room.dart';
import 'package:project4_flutter/features/messages/models/search_friend_entity.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_result.dart';

class AddFriendCubit extends Cubit<AddFriendState> {
  AddFriendCubit() : super(AddFriendNotLoaded());

  var apiService = ApiService();

  Future addFriend(Map<String, dynamic> body) async {
    emit(AddFriendLoading());
    try {
      var response = await apiService.post("/chat/add_new_friend", body: body);

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        emit(AddFriendSuccess(customResult.data as int));
      }
      return null;
    } catch (ex) {
      emit(AddFriendError(ex.toString()));
      return null;
    }
  }
}
