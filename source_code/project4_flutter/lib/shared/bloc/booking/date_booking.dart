import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

abstract class DateBookingState {}

class DateBookingAvailable extends DateBookingState {
  final DateTime? startDate;
  final DateTime? endDate;
  DateBookingAvailable({this.startDate, this.endDate});
}
class DateBookingNotAvailable extends DateBookingState {}
class DateBookingCubit extends Cubit<DateBookingState> {
  DateTime? startDate;
  DateTime? endDate;
  DateBookingCubit() : super(DateBookingNotAvailable());
  void updateDates(DateTime? _startDate, DateTime? _endDate) {
    startDate = _startDate;
    endDate = _endDate;
    emit(DateBookingAvailable(startDate: startDate, endDate: endDate));
  }
}
