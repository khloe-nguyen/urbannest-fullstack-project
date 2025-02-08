import 'package:project4_flutter/shared/api/api_service.dart';
import '../../../shared/models/category.dart';
import '../../../shared/models/custom_result.dart';

class TravelApi {
  ApiService apiService = ApiService();

  Future<List<Category>?> getCategory() async {
    try {
      var response = await apiService.get("categoryCM");
      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var categories = (customResult.data as List).map((item) {
          return Category.fromJson(item);
        }).toList();

        return categories;
      }
      return null;
    } catch (ex) {
      return null;
    }
  }
}
