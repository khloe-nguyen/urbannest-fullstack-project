import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_friend_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/add_group_state.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_state.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/search_friend_state.dart';
import 'package:project4_flutter/features/messages/models/room.dart';
import 'package:project4_flutter/features/messages/models/search_friend_entity.dart';

import '../../../../shared/api/api_service.dart';
import '../../../../shared/models/custom_result.dart';

class AddGroupCubit extends Cubit<AddGroupState> {
  AddGroupCubit() : super(AddGroupNotLoaded());

  var apiService = ApiService();

  Future addFriend(Map<String, dynamic> body) async {
    emit(AddGroupLoading());
    try {
      var response = await apiService.post("/chat/add_new_group", body: body);

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        emit(AddGroupSuccess(customResult.data as int));
      }
      return null;
    } catch (ex) {
      emit(AddGroupError(ex.toString()));
      return null;
    }
  }
}
