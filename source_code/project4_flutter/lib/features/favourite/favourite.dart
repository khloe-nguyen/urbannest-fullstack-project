import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/favourite/travels_in_collection.dart';
import 'package:project4_flutter/features/travel/favourite_popup/fav_card.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_state.dart';
import 'package:project4_flutter/shared/models/favourite_entity.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';

class Favourite extends StatefulWidget {
  const Favourite({super.key});

  @override
  State<Favourite> createState() => _FavouriteState();
}

class _FavouriteState extends State<Favourite> {
  late FavouriteCubit getFavouriteCubit;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getFavouriteCubit = context.read<FavouriteCubit>();
    getFavouriteCubit.getFavourites();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
        toolbarHeight: 60,
        title: const Text(
          "Wishlists",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 26),
          textAlign: TextAlign.center,
        ),
        centerTitle: true,
      ),
      body: BlocBuilder<FavouriteCubit, FavouriteState>(
        builder: (context, state) {
          if (state is FavouriteLoading) {
            return const LoadingIcon(size: 40);
          }

          if (state is FavouriteSuccess || state is ChangeFavouriteSuccess) {
            final groupedCollections = getFavouriteCubit.favourites
                .fold<Map<String, Map<String, dynamic>>>(
                  {},
                  (map, favourite) {
                    if (map.containsKey(favourite.collectionName)) {
                      map[favourite.collectionName]!['count'] +=
                          1; // Tăng số lượng
                    } else {
                      map[favourite.collectionName] = {
                        'count': 1,
                        'firstImage':
                            favourite.propertyImage, // Lưu hình ảnh đầu tiên
                        'collectionName': favourite.collectionName,
                      };
                    }
                    return map;
                  },
                )
                .values
                .toList();

            return FractionallySizedBox(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 0, vertical: 8.0),
                child: Column(
                  children: [
                    Expanded(
                      child: groupedCollections.isNotEmpty
                          ? Scrollbar(
                              child: SingleChildScrollView(
                                child: Center(
                                  child: Wrap(
                                    spacing:
                                        5, // Khoảng cách ngang giữa các phần tử
                                    runSpacing:
                                        8.0, // Khoảng cách dọc giữa các dòng
                                    children:
                                        groupedCollections.map((collection) {
                                      return GestureDetector(
                                        onTap: () async {
                                          Navigator.push(context,
                                              MaterialPageRoute(
                                            builder: (context) {
                                              return TravelsInCollection(
                                                  collectionName: collection[
                                                      'collectionName']);
                                            },
                                          ));
                                        },
                                        child: SizedBox(
                                          width: (MediaQuery.of(context)
                                                      .size
                                                      .width -
                                                  32) /
                                              2, // Đặt chiều rộng cho mỗi card
                                          child: FavCard(
                                            favourite: FavouriteEntity(
                                              collectionName:
                                                  collection['collectionName'],
                                              propertyImage:
                                                  collection['firstImage'], //
                                              propertyId:
                                                  0, // Giá trị mặc định không sử dụng
                                              propertyName:
                                                  '', // Giá trị mặc định không sử dụng
                                            ),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                              ),
                            )
                          : Center(
                              child: getFavouriteCubit.state is FavouriteLoading
                                  ? const CircularProgressIndicator()
                                  : const Text(
                                      "You have not any wishlist",
                                      style: TextStyle(
                                          color: Colors.grey, fontSize: 23),
                                    ),
                            ),
                    ),
                    const SizedBox(height: 10),
                  ],
                ),
              ),
            );
          }

          return const Text("error");
        },
      ),
    );
  }
}
