import '../../../features/messages/models/room.dart';

abstract class MessageRoomState {}

class MessageRoomLoading extends MessageRoomState {}

class MessageRoomSuccess extends MessageRoomState {
  final List<Room>? roomList;
  MessageRoomSuccess(this.roomList);
}

class MessageRoomError extends MessageRoomState {
  final String message;
  MessageRoomError(this.message);
}

class MessageRoomNotAvailable extends MessageRoomState {}
