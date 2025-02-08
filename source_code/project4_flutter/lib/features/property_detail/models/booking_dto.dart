import 'package:json_annotation/json_annotation.dart';
part 'booking_dto.g.dart';

@JsonSerializable()
class BookingDto {
  final DateTime checkInDay;
  final DateTime checkOutDay;
  final int children;
  final int adult;
  final double amount;
  final int propertyId;

  final int? hostId;
  final int? customerId;
  final double? hostFee;
  final double? websiteFee;

  BookingDto({
    required this.checkInDay,
    required this.checkOutDay,
    required this.children,
    required this.adult,
    required this.amount,
    required this.propertyId,
    this.hostId,
    this.customerId,
    this.hostFee,
    this.websiteFee,
  });
  factory BookingDto.fromJson(Map<String, dynamic> json) =>
      _$BookingDtoFromJson(json);
  Map<String, dynamic> toJson() => _$BookingDtoToJson(this);
}
