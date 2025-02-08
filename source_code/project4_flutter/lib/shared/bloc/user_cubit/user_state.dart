import '../../models/user.dart';

abstract class UserState {}

class UserLoading extends UserState {}

class UserError extends UserState {
  final String message;
  UserError(this.message);
}

class UserSuccess extends UserState {
  final User user;
  UserSuccess(this.user);
}

class UserLogout extends UserState {
  final String message;
  UserLogout(this.message);
}

class UserNotLogin extends UserState {}
