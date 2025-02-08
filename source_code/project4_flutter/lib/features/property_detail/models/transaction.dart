import 'package:json_annotation/json_annotation.dart';
part 'transaction.g.dart';
@JsonSerializable()
class Transaction {

  final int? id;
  final int? bookingId;

  final double? amount;

  final String? transactionType; // escrow, refund, webrevenue, hostrevenue

  final DateTime? transferOn;
  Transaction({ this.bookingId, this.id, this.amount, this.transactionType, this.transferOn});
  factory Transaction.fromJson(Map<String, dynamic> json)=> _$TransactionFromJson(json);
  Map<String, dynamic> toJson() => _$TransactionToJson(this);

}