import 'package:project4_flutter/features/messages/models/search_friend_entity.dart';

abstract class SearchFriendState {}

class SearchFriendLoading extends SearchFriendState {}

class SearchFriendSuccess extends SearchFriendState {
  final List<SearchFriendEntity>? list;
  SearchFriendSuccess({required this.list});
}

class SearchFriendError extends SearchFriendState {
  final String error;

  SearchFriendError({required this.error});
}
