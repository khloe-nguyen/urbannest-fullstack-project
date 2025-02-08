import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:project4_flutter/features/authentication/authentication.dart';
import 'package:project4_flutter/features/travel/favourite_popup/fav_popup.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_state.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';

import 'package:project4_flutter/shared/models/travel_entity.dart';

class TravelCard extends StatefulWidget {
  final TravelEntity travel;

  const TravelCard({super.key, required this.travel});

  @override
  State<TravelCard> createState() => _TravelCardState();
}

void _showFavouritePopup(BuildContext context, propertyId) {
  showModalBottomSheet(
    context: context,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(
        top: Radius.circular(16), // Bo góc phía trên
      ),
    ),
    isScrollControlled: true, // Cho phép nội dung cuộn nếu cần
    builder: (context) {
      return FavPopup(propertyId: propertyId); // Hiển thị widget FilterPopup
    },
  );
}

class _TravelCardState extends State<TravelCard> {
  String fullAddress = "Loading...";
  late FavouriteCubit getFavouriteCubit;
  late UserCubit getUserCubit;

  @override
  void initState() {
    super.initState();
    _loadAddress();
    getFavouriteCubit = context.read<FavouriteCubit>();
    getUserCubit = context.read<UserCubit>();
  }

  Future<void> _loadAddress() async {
    final address = await convertAddressCode(widget.travel.addressCode);
    if (mounted) {
      setState(() {
        fullAddress = address;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FavouriteCubit, FavouriteState>(
      builder: (context, state) {
        getFavouriteCubit = context.read<FavouriteCubit>();
        getUserCubit = context.read<UserCubit>();
        return Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12.0),
            color: Colors.white,
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 8.0,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: 290,
                    child: PageView.builder(
                      itemCount: widget.travel.propertyImages.length,
                      itemBuilder: (context, index) {
                        return Image.network(
                          widget.travel.propertyImages[index],
                          fit: BoxFit.fill,
                          errorBuilder: (context, error, stackTrace) {
                            return const Center(
                              child: Icon(Icons.error, color: Colors.red),
                            );
                          },
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Row(
                    children: [
                      // Tên property
                      Text(
                        widget.travel.propertyTitle,
                        style:
                            Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontSize: 17,
                                  fontWeight: FontWeight.bold,
                                ),
                      ),
                      Spacer(),
                      Row(
                        children: [
                          const Icon(
                            Icons.star, // Biểu tượng ngôi sao
                            color: Colors.amber, // Màu vàng cho ngôi sao
                            size: 18, // Kích thước ngôi sao
                          ),
                          const SizedBox(
                              width: 4), // Khoảng cách giữa số và ngôi sao
                          Text(
                            widget.travel.averageRating.toStringAsFixed(
                                1), // Hiển thị số với 1 chữ số thập phân
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(
                                  fontSize: 17,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    fullAddress,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey,
                        ),
                  ),
                  const SizedBox(height: 5.0),
                  Text(
                    "\$${widget.travel.basePrice.toStringAsFixed(2)}",
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ],
              ),
              // Nút trái tim ở góc trên phải
              Positioned(
                top: 8,
                right: 8,
                child: GestureDetector(
                    onTap: () async {
                      // Xử lý sự kiện khi nhấn nút trái tim
                      print("Heart button pressed!");
                      if (getUserCubit.state is! UserSuccess) {
                        Navigator.push(context, MaterialPageRoute(
                          builder: (context) {
                            return Authentication();
                          },
                        ));
                      } else {
                        if (getFavouriteCubit.isLoved(widget.travel.id)) {
                          await getFavouriteCubit.deleteFavourite(
                              propertyId: widget.travel.id);
                          if (context.mounted) {
                            Fluttertoast.showToast(
                              msg: "Deleted success!",
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              backgroundColor: Colors.green.shade400,
                              textColor: Colors.white,
                              fontSize: 16.0,
                            );
                          }
                        } else {
                          _showFavouritePopup(context, widget.travel.id);
                        }
                      }
                    },
                    child: SizedBox(
                      width: 40,
                      height: 40,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Viền trắng xung quanh trái tim
                          const Icon(
                            Icons.favorite_border, // Trái tim viền
                            color: Colors.white, // Màu viền trắng
                            size: 33, // Kích thước viền
                          ),
                          if (getUserCubit.state is UserSuccess)
                            Icon(
                              Icons.favorite, // Trái tim đầy
                              color: getFavouriteCubit.isLoved(widget.travel.id)
                                  ? Colors.red // Màu đỏ khi yêu thích
                                  : Colors
                                      .transparent, // Trong suốt khi không yêu thích
                              size: 26, // Kích thước trái tim
                            ),
                        ],
                      ),
                    )),
              )
            ],
          ),
        );
      },
    );
  }
}

Future<String> convertAddressCode(String addressCode) async {
  // Load JSON file
  final String jsonString =
      await rootBundle.loadString('assets/data/dchc.json');
  final Map<String, dynamic> data = json.decode(jsonString);

  // Validate addressCode length
  if (addressCode.length != 12) return "Invalid address code";

  // Extract IDs from addressCode (subString by start + endindex)
  final String level1Id = addressCode.substring(0, 2);
  final String level2Id = addressCode.substring(3, 6);
  final String level3Id = addressCode.substring(7);

  // Find level1
  final level1 = data['data'].firstWhere(
    (item) => item['level1_id'] == level1Id,
    orElse: () => null,
  );
  if (level1 == null) return "Unknown address";

  // Find level2
  final List<dynamic>? level2s = level1['level2s'];
  if (level2s == null || level2s.isEmpty) {
    return level1['name']; // Return level1 name if no level2s
  }

  final level2 = level2s.firstWhere(
    (item) => item['level2_id'] == level2Id,
    orElse: () => null,
  );
  if (level2 == null) {
    return level1['name']; // Return level1 name if level2 is not found
  }

// Find level3
  final List<dynamic>? level3s = level2['level3s'];
  if (level3s == null || level3s.isEmpty) {
    return "${level2['name']}, ${level1['name']}"; // Return level2 and level1 names if no level3s
  }

  final level3 = level3s.firstWhere(
    (item) => item['level3_id'] == level3Id,
    orElse: () => null,
  );
  if (level3 == null) {
    return "${level2['name']}, ${level1['name']}"; // Return level2 and level1 names if level3 is not found
  }

  // Combine address
  return "${level3['name']}, ${level2['name']}, ${level1['name']}";
}
