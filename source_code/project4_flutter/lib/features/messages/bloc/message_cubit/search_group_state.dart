import 'package:project4_flutter/features/messages/models/search_friend_entity.dart';

abstract class SearchGroupState {}

class SearchGroupLoading extends SearchGroupState {}

class SearchGroupSuccess extends SearchGroupState {
  final List<SearchFriendEntity>? list;
  SearchGroupSuccess({required this.list});
}

class SearchGroupError extends SearchGroupState {
  final String error;

  SearchGroupError({required this.error});
}
