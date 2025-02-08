import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:project4_flutter/features/property_detail/property_detail.dart';

import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/models/travel_entity.dart';

import 'favourite_travel_card.dart';

class TravelsInCollection extends StatefulWidget {
  final String collectionName;

  const TravelsInCollection({super.key, required this.collectionName});

  @override
  State<TravelsInCollection> createState() => _TravelsInCollectionState();
}

class _TravelsInCollectionState extends State<TravelsInCollection> {
  late FavouriteCubit getFavouriteCubit;
  late List<TravelEntity> _travels; // Không cho phép null
  bool _isLoading = true; // Trạng thái loading

  @override
  void initState() {
    super.initState();
    getFavouriteCubit = context.read<FavouriteCubit>();
    _fetchData(); // Gọi API ngay khi khởi tạo
  }

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true; // Bắt đầu loading
    });

    try {
      await getFavouriteCubit.getPropertiesFavourite(
          collectionName: widget.collectionName);

      // Lấy dữ liệu từ Cubit và gán vào _travels
      setState(() {
        _travels = getFavouriteCubit.propertiesInWishlist ?? [];
        _isLoading = false; // Kết thúc loading
      });
    } catch (e) {
      // Có lỗi xảy ra
      setState(() {
        _isLoading = false;
        Fluttertoast.showToast(
          msg: "Failed to load data. Please try again!",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
        toolbarHeight: 60,
        title: Text(
          widget.collectionName,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 26),
          textAlign: TextAlign.center,
        ),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _travels.isEmpty
              ? const Center(child: Text("Your collection is empty"))
              : ListView.builder(
                  itemCount: _travels.length,
                  itemBuilder: (context, index) {
                    return Container(
                      padding: const EdgeInsets.all(13),
                      child: GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  PropertyDetail(_travels[index].id),
                            ),
                          );
                        },
                        child: FavouriteTravelCard(
                          travel: _travels[index],
                          collectionName: widget.collectionName,
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
