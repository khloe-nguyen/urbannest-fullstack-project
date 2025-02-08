abstract class AddGroupState {}

class AddGroupNotLoaded extends AddGroupState {}

class AddGroupLoading extends AddGroupState {}

class AddGroupSuccess extends AddGroupState {
  int id;
  AddGroupSuccess(this.id);
}

class AddGroupError extends AddGroupState {
  String errorMessage;

  AddGroupError(this.errorMessage);
}
