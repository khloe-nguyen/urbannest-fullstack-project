import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

import '../../../features/property_detail/models/transaction.dart';

abstract class TransactionState {}

class TransactionSuccess extends TransactionState {
  final Transaction transaction;
  TransactionSuccess(this.transaction);
}

class TransactionInitial extends TransactionState {}

class TransactionError extends TransactionState {
  final String message;
  TransactionError(this.message);
}

class TransactionFail extends TransactionState {
  final String message;
  TransactionFail(this.message);
}

class TransactionAwait extends TransactionState {}

class TransactionCubit extends Cubit<TransactionState> {
  TransactionCubit() : super(TransactionInitial());
  Future<bool> initTransactionProcess(Transaction transaction) async {
    if (_validateTransactionData(transaction)) {
      var res = await createTransaction(transaction);
      if (res != null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  bool _validateTransactionData(Transaction transaction) {
    return transaction.bookingId != null && transaction.amount != null;
  }

  Future<Transaction?> createTransaction(Transaction transaction) async {
    emit(TransactionAwait());
    try {
      ApiService apiService = ApiService();
      final response = await apiService.post("transaction/booking_escrow",
          body: transaction.toJson());
      final customResult = CustomResult.fromJson(response);
      if (customResult.status == 200) {
        final transaction = Transaction.fromJson(customResult.data);
        emit(TransactionSuccess(transaction));
        return transaction;
      } else if (customResult.status == 404) {
        emit(TransactionFail("Out of payment time"));
        return null;
      } else {
        emit(TransactionFail("Chua book mẹ ơi!!!!"));
        return null;
      }
    } catch (ex, stackTrace) {
      emit(TransactionError("Failed to create transaction : $ex"));
      return null;
    } finally {}
  }
}
