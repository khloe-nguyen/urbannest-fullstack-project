import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';

class FilterCubit extends Cubit<FilterState> {
  String? propertyType;
  List<double> priceRange = [0, 1000];
  RangeValues currentRangeValues = const RangeValues(
    0,
    1000,
  );
  int room = 1;
  int bed = 1;
  int bathRoom = 1;
  String? isInstant;
  bool? isSelfCheckIn;
  bool? isPetAllow;
  DateTime? startDate;
  DateTime? endDate;
  int children = 0;
  int adult = 1;
  int guest = 1;
  String? searchName;

  FilterCubit() : super(InitialState());

  void changeSearchName(String? n) {
    searchName = n;
    emit(SearchNameChangeSuccess());
  }

  //Search Guest
  void changeAdult(int a) {
    adult = a;
    guest = a + children;
    emit(GuestChangeSuccess(guest));
  }

  void changeChildren(int c) {
    children = c;
    guest = adult + c;
    emit(GuestChangeSuccess(guest));
  }

  //Search Dates
  void updateDates(DateTime? _startDate, DateTime? _endDate) {
    //dùng để update giao diện cho nút start
    if (_startDate != null) {
      startDate = _startDate;
      endDate = null;
      emit(StartChangeSuccess());
    }
    //có khoảng thi moi gọi request mới
    if (_startDate != null && _endDate != null) {
      startDate = _startDate;
      endDate = _endDate;
      emit(DateChangeSuccess());
    }
    //clealAll
    if (_startDate == null && _endDate == null) {
      startDate = _startDate;
      endDate = _endDate;
      emit(DateChangeSuccess());
    }
  }

  //PropertyType
  void changePropertyType(String? proType) {
    if (propertyType == proType) {
      propertyType = null;
    } else {
      propertyType = proType;
    }
    emit(PropertyTypeChangeSuccess(propertyType));
  }

  bool selectedPropertyType(String proType) {
    return propertyType == proType;
  }

  //Price
  void changePrice(List<double> prices) {
    priceRange = prices;
    currentRangeValues = RangeValues(prices[0], prices[1]);
    emit(PriceChangeSuccess(prices));
  }

  //Rooms and Beds
  void changeRoom(int r) {
    room = r;
    emit(RoomChangeSuccess(r));
  }

  void changeBed(int b) {
    bed = b;
    emit(BedChangeSuccess(b));
  }

  void changeBathroom(int bath) {
    bathRoom = bath;
    emit(BathChangeSuccess(bathRoom));
  }

  //Instant
  void changeInstant(String? ins) {
    if (isInstant == ins) {
      isInstant = null;
    } else {
      isInstant = ins;
    }
    emit(IsInstantChangeSuccess(isInstant));
  }

  bool selectedInstant(String ins) {
    return isInstant == ins;
  }

  //Self Check-in
  void changeSelfCheckIn(bool? self) {
    if (isSelfCheckIn == self) {
      isSelfCheckIn = null;
    } else {
      isSelfCheckIn = self;
    }
    emit(SelfCheckInChangeSuccess(isSelfCheckIn));
  }

  bool selectedSelfCheckIn(bool? self) {
    return isSelfCheckIn == self;
  }

  //Pet Allow
  void changePet(bool? pet) {
    if (isPetAllow == pet) {
      isPetAllow = null;
    } else {
      isPetAllow = pet;
    }
    emit(IsPetAllowedChangeSuccess(isPetAllow));
  }

  bool selectedPetAllow(bool? pet) {
    return isPetAllow == pet;
  }
}
