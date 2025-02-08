import 'package:project4_flutter/features/messages/models/message_room_entity.dart';

abstract class MessageState {}

class MessageLoading extends MessageState {}

class MessageSuccessFirstLoad extends MessageState {}

class MessageFinishedLoaded extends MessageState {}

class MessageLoaded extends MessageState {}

class MessageError extends MessageState {
  final String error;

  MessageError({required this.error});
}
