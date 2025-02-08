import 'package:project4_flutter/features/property_detail/models/policy.dart';
import 'package:project4_flutter/features/property_detail/models/property.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/models/custom_paging.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';

class PropertyDetailApi {
  final ApiService apiService = ApiService();
  Future<Property?> getProperty(int id) async {
    var response = await apiService.get("listingCM", params: {"id": id});

    //convert to json
    var customResult = CustomResult.fromJson(response);

    if (customResult.status == 200) {
      //get data from customResult and convert to Property object
      var property = Property.fromJson(customResult.data);
      return property;
    }
    return null;
  }

  Future<List<Policy>> getPolicy() async {
    var response = await apiService.get("policyCM");
    var customResult = CustomResult.fromJson(response);

    if (customResult.status == 200) {
      var policies = (customResult.data as List)
          .map((policyJson) => Policy.fromJson(policyJson))
          .toList();
      return policies;
    }
    return [];
  }

  Future<CustomPaging?> getCountReviewOfProperty(int id, int pageNumber) async {
    //response is map<String, dynamic>
    var response = await apiService.get("reviewCM/get_reviews_of_property",
        params: {"propertyId": id, "pageNumber": pageNumber, "pageSize": 4});
    var customResult = CustomPaging.fromJson(response);
    if (customResult.status == 200) {
      return customResult;
    }
    return null;
  }
}
