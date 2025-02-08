import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_state.dart';
import 'package:project4_flutter/shared/models/favourite_entity.dart';

class FavCard extends StatefulWidget {
  final FavouriteEntity favourite;
  const FavCard({super.key, required this.favourite});

  @override
  State<FavCard> createState() => _FavCardState();
}

class _FavCardState extends State<FavCard> {
  late FavouriteCubit getFavouriteCubit;
  late int propertyInSameCollectionCount;

  @override
  void initState() {
    super.initState();
    getFavouriteCubit = context.read<FavouriteCubit>();
    // number of property with the same collectionName
    propertyInSameCollectionCount = getFavouriteCubit.favourites
        .where((item) => item.collectionName == widget.favourite.collectionName)
        .length;
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return BlocBuilder<FavouriteCubit, FavouriteState>(
        builder: (context, state) {
      propertyInSameCollectionCount = getFavouriteCubit.favourites
          .where(
              (item) => item.collectionName == widget.favourite.collectionName)
          .length;
      return Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(5),
                decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.all(Radius.circular(8)),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.black12,
                          offset: Offset(1, 1),
                          blurRadius: 5),
                      BoxShadow(
                          color: Colors.black12,
                          offset: Offset(-1, -1),
                          blurRadius: 5),
                      // BoxShadow(color: Colors.red, offset: Offset(-5, -5))
                    ]),
                child: ClipRRect(
                  borderRadius: const BorderRadius.all(Radius.circular(3)),
                  child: CachedNetworkImage(
                    imageUrl: widget.favourite.propertyImage,
                    width: MediaQuery.of(context)
                        .size
                        .width, // Chiều rộng khung hình vuông
                    height: 150, // Chiều cao khung hình vuông
                    fit:
                        BoxFit.cover, // Hiển thị dạng cover (cắt ảnh vừa khung)
                  ),
                ),
              ),
              const SizedBox(height: 8), // Khoảng cách giữa ảnh và text
              Text(
                widget.favourite.collectionName,
                style:
                    const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4), // Khoảng cách giữa text và số lượng
              Text(
                '$propertyInSameCollectionCount saved',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
                textAlign: TextAlign.left,
              ),
            ],
          ));
    });
  }
}
