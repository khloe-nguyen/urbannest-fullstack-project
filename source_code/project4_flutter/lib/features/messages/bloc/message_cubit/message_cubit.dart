import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/messages/bloc/message_cubit/message_state.dart';
import 'package:project4_flutter/features/messages/models/message_room_entity.dart';
import 'package:project4_flutter/shared/api/api_service.dart';

import '../../../../shared/models/custom_paging.dart';

class MessageCubit extends Cubit<MessageState> {
  int roomId;
  MessageCubit(this.roomId) : super(MessageLoading()) {
    fetchMessages(roomId);
  }

  ApiService apiService = ApiService();

  final List<MessageRoomEntity> messageList = [];

  int currentPage = 0;
  bool hasMore = true;
  bool isLoading = false;

  Future<void> fetchMessages(roomId) async {
    if (!hasMore) {
      emit(MessageFinishedLoaded());
      return;
    }

    if (hasMore) emit(MessageLoading());

    try {
      isLoading = true;

      Map<String, dynamic> params = {
        'roomId': roomId,
        'pageNumber': currentPage,
        'pageSize': 10
      };

      final response =
          await apiService.get("/chat/get_room_messages", params: params);

      var customPaging = CustomPaging.fromJson(response);

      if (customPaging.status == 200) {
        var messages = (customPaging.data as List).map((item) {
          return MessageRoomEntity.fromJson(item);
        }).toList();

        hasMore = customPaging.hasNext;

        if (messageList.isEmpty) {
          emit(MessageSuccessFirstLoad());
        } else {
          emit(MessageLoaded());
        }

        messageList.addAll(messages);

        currentPage++;
      } else {
        emit(MessageError(error: 'Failed to load posts'));
      }
    } catch (e) {
      emit(MessageError(error: e.toString()));
    } finally {
      isLoading = false;
    }
  }
}
