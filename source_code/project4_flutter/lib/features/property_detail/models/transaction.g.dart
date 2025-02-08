// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Transaction _$TransactionFromJson(Map<String, dynamic> json) => Transaction(
      id: (json['id'] as num?)?.toInt(),
      bookingId: (json['booking_id'] as num?)?.toInt(),
      amount: (json['amount'] as num?)?.toDouble(),
      transactionType: json['transactionType'] as String?,
      transferOn: json['transferOn'] == null
          ? null
          : DateTime.parse(json['transferOn'] as String),
    );

Map<String, dynamic> _$TransactionToJson(Transaction instance) =>
    <String, dynamic>{
      'id': instance.id,
      'bookingId': instance.bookingId,
      'amount': instance.amount,
      'transactionType': instance.transactionType,
      'transferOn': instance.transferOn?.toIso8601String(),
    };
