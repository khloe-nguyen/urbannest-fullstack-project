import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

abstract class GuestBookingState {}
class GuestInitialState extends GuestBookingState {}
class GuestAdultChangeState extends GuestBookingState {}
class GuestChildrenChangeState extends GuestBookingState {}
class GuestBookingCubit extends Cubit<GuestBookingState> {
  int adult = 1;
  int children = 0;
  GuestBookingCubit() : super(GuestInitialState());
  void updateAdultGuests(int adultParam) {
    adult = adultParam;
    emit(GuestAdultChangeState());
  }
  void updateChildrenGuests(int childrenParam) {
    children = childrenParam;
    emit(GuestChildrenChangeState());
  }

}
