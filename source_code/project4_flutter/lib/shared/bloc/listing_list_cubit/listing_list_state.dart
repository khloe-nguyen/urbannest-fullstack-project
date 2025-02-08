import 'package:flutter/material.dart';

abstract class ListingListState {}

class ListingListLoaded extends ListingListState {}

class ListingListFinishLoaded extends ListingListState {}

class ListingListLoading extends ListingListState {}

class ListingListError extends ListingListState {
  final String message;

  ListingListError(this.message);
}

class ListingListNotAvailable extends ListingListState {}
