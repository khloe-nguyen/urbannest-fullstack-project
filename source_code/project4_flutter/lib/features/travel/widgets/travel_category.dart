import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/category_cubit/category_cubit.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../../shared/models/category.dart';

class TravelCategory extends StatefulWidget {
  const TravelCategory({super.key});

  @override
  State<TravelCategory> createState() => TravelCategoryState();
}

class TravelCategoryState extends State<TravelCategory> {
  final ScrollController _scrollController = ScrollController();
  late CategoryCubit getCategoryCubit;
  late List<Category>? _categories;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getCategoryCubit = context.read<CategoryCubit>();
    //at begining, state(int? / categoryId) = null
    if (getCategoryCubit.state == null) {
      getCategoryCubit.getCategory();
    }
  }

  @override
  void dispose() {
    super.dispose();
    _scrollController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CategoryCubit, int?>(
      builder: (context, state) {
        if (state == -1) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        } else {
          _categories = getCategoryCubit.categoryList;
          return SizedBox(
            height: 50,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categories!.length,
              itemBuilder: (context, index) {
                var category = _categories![index];
                return GestureDetector(
                  onTap: () {
                    if (getCategoryCubit.categoryId == category.id) {
                      getCategoryCubit.changeCategory(null);
                    } else {
                      getCategoryCubit.changeCategory(category.id);
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SizedBox(
                          height: 30,
                          child: CachedNetworkImage(
                            imageUrl: category.categoryImage,
                            placeholder: (context, url) => const Skeletonizer(
                              enabled: true,
                              child: Text("Loading..."),
                            ),
                            errorWidget: (context, url, error) =>
                                const Icon(Icons.error),
                            color: state == category.id
                                ? Colors.black
                                : const Color.fromARGB(150, 0, 0, 0),
                          ),
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Container(
                          decoration: BoxDecoration(
                            border: Border(
                              bottom: state == category.id
                                  ? const BorderSide(
                                      color: Colors.black,
                                      width: 3,
                                    )
                                  : BorderSide.none,
                            ),
                          ),
                          child: Text(_categories![index].categoryName),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        }
      },
    );
  }
}
