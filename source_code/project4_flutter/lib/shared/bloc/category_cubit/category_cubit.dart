import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/api/api_service.dart';

import '../../models/category.dart';
import '../../models/custom_result.dart';

//this Cubit receive int? as a state to manage (emit new state whenever state changed), save data from api...
class CategoryCubit extends Cubit<int?> {
  CategoryCubit() : super(null) {
    getCategory(); // Call initializeUser when the cubit is created
  }

  bool isLoading = false;
  int? categoryId = -1;
  List<Category> categoryList = [];
  var apiService = ApiService();

  void changeCategory(int? category) {
    categoryId = category;
    emit(categoryId); //emit to change state => re-render base on BlocListener
  }

  Future<void> getCategory() async {
    try {
      isLoading = true;
      var response = await apiService.get("categoryCM");
      var customResult = CustomResult.fromJson(response);

      if (customResult.status == 200) {
        var categories = (customResult.data as List).map((item) {
          return Category.fromJson(item);
        }).toList();

        //get PUBLIC category
        categoryList = categories.where((element) {
          return element.status == true;
        }).toList();

        categoryId = categoryList[0].id;
        emit(categoryId);
      } else {
        print('fail to load categories');
      }
    } catch (ex) {
      print(ex.toString());
    } finally {
      isLoading = false;
    }
  }
}
