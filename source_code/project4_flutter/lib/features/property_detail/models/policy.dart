import 'package:json_annotation/json_annotation.dart';
part 'policy.g.dart';
@JsonSerializable()
class Policy{
  final int id;
  final String policyName;
  final String policyDescription;

  Policy({required this.id, required this.policyDescription, required this.policyName});
factory Policy.fromJson(Map<String,dynamic> json)=> _$PolicyFromJson(json);

Map<String,dynamic> toJson() => _$PolicyToJson(this);


}