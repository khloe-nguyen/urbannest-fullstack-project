import 'package:project4_flutter/features/property_detail/models/policy.dart';

abstract class PolicyState {}

class PolicyLoading extends PolicyState {
  final String message;
  PolicyLoading(this.message);
}

class PolicyFailure extends PolicyState {
  final String message;
  PolicyFailure(this.message);
}

class PolicySuccess extends PolicyState {
  final List<Policy> policies;
  PolicySuccess(this.policies);
}
