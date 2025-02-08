import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/api/property_detail_api.dart';
import 'package:project4_flutter/shared/bloc/read_review_cubit/review_state.dart';

class ReviewCubit extends Cubit<ReviewState> {
  ReviewCubit() : super(ReviewLoading("Loading..."));

  var propertyApi = PropertyDetailApi();

  Future<void> getReviewOfProperty(id) async {
    emit(ReviewLoading("Loading..."));
    try {
      var customPaging = await propertyApi.getCountReviewOfProperty(id, 0);
      if (customPaging != null) {
        emit(ReviewSuccess(customPaging));
      } else {
        emit(ReviewFailure("Review not found"));
      }
    } catch (ex) {
      emit(ReviewFailure("Failed to load review: $ex"));
    }
  }
}
