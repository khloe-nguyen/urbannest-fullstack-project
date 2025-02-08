abstract class AddFriendState {}

class AddFriendNotLoaded extends AddFriendState {}

class AddFriendLoading extends AddFriendState {}

class AddFriendSuccess extends AddFriendState {
  int id;
  AddFriendSuccess(this.id);
}

class AddFriendError extends AddFriendState {
  String errorMessage;

  AddFriendError(this.errorMessage);
}
