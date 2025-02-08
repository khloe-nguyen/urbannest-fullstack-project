abstract class FilterState {}

class InitialState extends FilterState {}

class SearchNameChangeSuccess extends FilterState {
  SearchNameChangeSuccess();
}

class PropertyTypeChangeSuccess extends FilterState {
  String? propertyType;
  PropertyTypeChangeSuccess(this.propertyType);
}

class PriceChangeSuccess extends FilterState {
  final List<double> priceRange;
  PriceChangeSuccess(this.priceRange);
}

class RoomChangeSuccess extends FilterState {
  final int room;
  RoomChangeSuccess(this.room);
}

class BedChangeSuccess extends FilterState {
  final int bed;
  BedChangeSuccess(this.bed);
}

class BathChangeSuccess extends FilterState {
  final int bathroom;
  BathChangeSuccess(this.bathroom);
}

class SelfCheckInChangeSuccess extends FilterState {
  final bool? selfCheckIn;
  SelfCheckInChangeSuccess(this.selfCheckIn);
}

class IsInstantChangeSuccess extends FilterState {
  final String? isInstant;
  IsInstantChangeSuccess(this.isInstant);
}

class IsPetAllowedChangeSuccess extends FilterState {
  final bool? isPetAllowed;
  IsPetAllowedChangeSuccess(this.isPetAllowed);
}

class GuestChangeSuccess extends FilterState {
  final int guest;
  GuestChangeSuccess(this.guest);
}

class AddressCodeChangeSuccess extends FilterState {
  final String addressCode;
  AddressCodeChangeSuccess(this.addressCode);
}

class DateChangeSuccess extends FilterState {
  DateChangeSuccess();
}

class StartChangeSuccess extends FilterState {
  StartChangeSuccess();
}
