import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/api/property_detail_api.dart';
import 'package:project4_flutter/shared/bloc/policy_cubit/policy_state.dart';

class PolicyCubit extends Cubit<PolicyState> {
  PolicyCubit() : super(PolicyLoading("Loading..."));
  var propertyApi = PropertyDetailApi();
  Future<void> getPolicy() async {
    emit(PolicyLoading("Loading..."));
    try {
      var policy = await propertyApi.getPolicy();

      if (policy.isNotEmpty) {
        emit(PolicySuccess(policy));
      } else {
        emit(PolicyFailure("Policy not found"));
      }
    } catch (ex) {
      emit(PolicyFailure("Failed to load policy: $ex"));
    }
  }
}
