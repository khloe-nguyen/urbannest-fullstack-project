import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:project4_flutter/features/travel/favourite_popup/fav_card.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_state.dart';
import 'package:project4_flutter/shared/models/favourite_entity.dart';

class FavPopup extends StatefulWidget {
  final int propertyId;

  const FavPopup({super.key, required this.propertyId});

  @override
  State<FavPopup> createState() => _FavPopupState();
}

class _FavPopupState extends State<FavPopup> {
  late FavouriteCubit getFavouriteCubit;

  // Declare a controller to handle the input from TextFormField
  final TextEditingController wishlistNameController = TextEditingController();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getFavouriteCubit = context.read<FavouriteCubit>();
    getFavouriteCubit.getFavourites();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    print(widget.propertyId);
    // Nhóm các favourites bằng phương thức fold
    final groupedCollections = getFavouriteCubit.favourites
        .fold<Map<String, Map<String, dynamic>>>(
          {},
          (map, favourite) {
            if (map.containsKey(favourite.collectionName)) {
              map[favourite.collectionName]!['count'] += 1; // Tăng số lượng
            } else {
              map[favourite.collectionName] = {
                'count': 1,
                'firstImage': favourite.propertyImage, // Lưu hình ảnh đầu tiên
                'collectionName': favourite.collectionName,
              };
            }
            return map;
          },
        )
        .values
        .toList(); // Chuyển thành danh sách các giá trị
    return BlocBuilder<FavouriteCubit, FavouriteState>(
        builder: (context, state) {
      print("object");
      // var _favList = getFavouriteCubit.favourites;
      return FractionallySizedBox(
        heightFactor: 0.8, // Chiếm 70% chiều cao màn hình
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 8.0),
          child: Column(
            children: [
              // Tiêu đề cố định ở đầu, thêm border-bottom
              Container(
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                        color: Color.fromRGBO(128, 128, 128, 0.3), width: 1),
                    // Border dưới
                  ),
                ),
                child: Stack(
                  alignment: Alignment.center, // Căn giữa tiêu đề
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      // Đặt icon ở góc trái
                      child: IconButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        icon: const Icon(Icons.close),
                      ),
                    ),
                    const Text(
                      'Wishlists',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              // Phần nội dung cuộn
              Expanded(
                child: groupedCollections.isNotEmpty
                    ? SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Wrap(
                            spacing: 12.0, // Khoảng cách ngang giữa các phần tử
                            runSpacing: 8.0, // Khoảng cách dọc giữa các dòng
                            children: groupedCollections.map((collection) {
                              return GestureDetector(
                                onTap: () async {
                                  await getFavouriteCubit.createFavourite(
                                    collectionName:
                                        collection['collectionName'],
                                    propertyId: widget.propertyId,
                                  );
                                  if (context.mounted) {
                                    Navigator.pop(context);
                                    // Hiển thị thông báo thành công bằng FlutterToast
                                    Fluttertoast.showToast(
                                      msg:
                                          "Added success to ${collection['collectionName']}!",
                                      toastLength: Toast.LENGTH_SHORT,
                                      gravity: ToastGravity.BOTTOM,
                                      backgroundColor: Colors.green.shade400,
                                      textColor: Colors.white,
                                      fontSize: 16.0,
                                    );
                                  }
                                },
                                child: SizedBox(
                                  width:
                                      (MediaQuery.of(context).size.width - 32) /
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
                      )
                    : Center(
                        child: getFavouriteCubit.state is FavouriteLoading
                            ? const CircularProgressIndicator()
                            : const Text(
                                "Nothing to show more",
                                style:
                                    TextStyle(color: Colors.grey, fontSize: 16),
                              ),
                      ),
              ),

              const SizedBox(height: 10),
              // Các nút cố định ở cuối, thêm border-top
              Container(
                decoration: const BoxDecoration(
                  border: Border(
                      top: BorderSide(
                          color: Color.fromRGBO(128, 128, 128, 0.3),
                          width: 1) // Border trên
                      ),
                ),
                width: screenWidth,
                padding: const EdgeInsets.only(top: 8),
                child: Column(
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            // Khai báo controller cho TextFormField
                            TextEditingController wishlistNameController =
                                TextEditingController();

                            return AlertDialog(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              title: Center(
                                child: const Text(
                                  "Create New Wishlist",
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                              content: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  TextFormField(
                                    controller: wishlistNameController,
                                    // Kết nối controller
                                    decoration: InputDecoration(
                                      labelText: "Wishlist Name",
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                      ),
                                    ),
                                    maxLength: 20,
                                    // Giới hạn 50 ký tự
                                    buildCounter: (BuildContext context,
                                        {int? currentLength,
                                        int? maxLength,
                                        bool? isFocused}) {
                                      return Text(
                                        '$currentLength/$maxLength',
                                        style: TextStyle(color: Colors.grey),
                                      );
                                    },
                                  ),
                                ],
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.of(context).pop(); // Đóng popup
                                  },
                                  child: const Text(
                                    "Cancel",
                                    style: TextStyle(color: Colors.black26),
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () async {
                                    String wishlistName =
                                        wishlistNameController.text.trim();

                                    // Kiểm tra nếu tên không rỗng
                                    if (wishlistName.isNotEmpty) {
                                      // Gọi createFavourite với wishlistName
                                      await getFavouriteCubit.createFavourite(
                                        collectionName: wishlistName,
                                        // Sử dụng tên wishlist từ TextFormField
                                        propertyId: widget.propertyId,
                                      );
                                      if (context.mounted) {
                                        Navigator.of(context)
                                            .pop(); // Đóng popup
                                        Navigator.of(context)
                                            .pop(); // Đóng popup
                                        // Hiển thị thông báo thành công bằng FlutterToast
                                        Fluttertoast.showToast(
                                          msg:
                                              "Added success to $wishlistName!",
                                          toastLength: Toast.LENGTH_SHORT,
                                          gravity: ToastGravity.BOTTOM,
                                          backgroundColor:
                                              Colors.green.shade400,
                                          textColor: Colors.white,
                                          fontSize: 16.0,
                                        );
                                      }
                                    } else {
                                      Fluttertoast.showToast(
                                        msg: "Please enter a wishlist name!",
                                        toastLength: Toast.LENGTH_SHORT,
                                        gravity: ToastGravity.BOTTOM,
                                        backgroundColor: Colors.red.shade400,
                                        textColor: Colors.white,
                                        fontSize: 16.0,
                                      );
                                    }
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                  ),
                                  child: const Text(
                                    "Save",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
                              ],
                            );
                          },
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black, // Nền đen
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        minimumSize: Size(screenWidth * 0.8, 50),
                      ),
                      child: const Text(
                        "Create new wishlist",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white, // Chữ màu trắng
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    });
  }
}
