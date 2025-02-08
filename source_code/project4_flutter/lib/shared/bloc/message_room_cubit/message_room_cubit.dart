import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_state.dart';
import 'package:project4_flutter/features/messages/models/room.dart';

import '../../api/api_service.dart';
import '../../models/custom_result.dart';

class MessageRoomCubit extends Cubit<MessageRoomState> {
  String? userId;

  List<Room> roomList = [];

  MessageRoomCubit() : super(MessageRoomNotAvailable());

  Future loadUserRoom(String id) async {
    userId = id;
    await getRooms();
  }

  void logout() {
    emit(MessageRoomNotAvailable());
  }

  var apiService = ApiService();

  Future<List<Room>?> getRooms() async {
    emit(MessageRoomLoading());
    try {
      Map<String, dynamic> params = {'userId': userId};

      Map<String, String> headers = {
        'Content-Type': 'application/json; charset=UTF-8',
      };

      var response = await apiService.get("/chat/get_chat_room",
          params: params, headers: headers);

      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var rooms = (customResult.data as List).map((item) {
          return Room.fromJson(item);
        }).toList();
        roomList.clear();
        roomList.addAll(rooms);

        emit(MessageRoomSuccess(rooms));

        return rooms;
      }
      return null;
    } catch (ex) {
      emit(MessageRoomError(ex.toString()));
      return null;
    }
  }
}
