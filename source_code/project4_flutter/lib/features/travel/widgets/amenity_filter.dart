import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_cubit.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_state.dart';

class AmenityFilter extends StatefulWidget {
  const AmenityFilter({super.key});

  @override
  State<AmenityFilter> createState() => _AmenityFilterState();
}

class _AmenityFilterState extends State<AmenityFilter> {
  late AmenityCubit getAmenityCubit;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getAmenityCubit = context.read<AmenityCubit>();
  }

  bool showMore = false;
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AmenityCubit, AmenityState>(
      builder: (context, state) {
        if (state is AmenityNotAvailable) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        } else {
          var _amenities = getAmenityCubit.amenityList;

          // Lấy danh sách các loại tiện nghi
          var typeList = _amenities.fold(
            [],
            (previousValue, element) {
              if (previousValue.contains(element.type)) {
                return previousValue;
              } else {
                previousValue.add(element.type);
                return previousValue;
              }
            },
          );

          return StatefulBuilder(
            builder: (context, setState) {
              return Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                        color: Color.fromRGBO(128, 128, 128, 0.3), width: 1),
                    // Border dưới
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "Amenity",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.left,
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        height: showMore
                            ? null // Hiển thị đầy đủ
                            : MediaQuery.of(context).size.height *
                                0.255, // Giới hạn chiều cao 20% màn hình
                        child: SingleChildScrollView(
                          physics: showMore
                              ? const BouncingScrollPhysics()
                              : const NeverScrollableScrollPhysics(),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: typeList.map((type) {
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    type,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black,
                                    ),
                                  ),
                                  Wrap(
                                    spacing:
                                        8.0, // Khoảng cách giữa các item theo chiều ngang
                                    runSpacing:
                                        8.0, // Khoảng cách giữa các dòng
                                    children: _amenities.where((a) {
                                      return a.type == type;
                                    }).map((amenity) {
                                      final isSelected = getAmenityCubit
                                          .isAmenitySelected(amenity.id);
                                      return GestureDetector(
                                        onTap: () {
                                          // Cập nhật trạng thái ở đây
                                          getAmenityCubit
                                              .changeAmenityIdList(amenity.id);
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 12, vertical: 8),
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                            border: Border.all(
                                              color: isSelected
                                                  ? Colors.black
                                                  : Colors.grey.shade300,
                                              width: 1.5,
                                            ),
                                            color: Colors.white,
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              CachedNetworkImage(
                                                imageUrl: amenity.image,
                                                placeholder: (context, url) =>
                                                    const SizedBox(
                                                  width: 20,
                                                  height: 20,
                                                  child:
                                                      CircularProgressIndicator(
                                                          strokeWidth: 2),
                                                ),
                                                errorWidget:
                                                    (context, url, error) =>
                                                        const Icon(Icons.error,
                                                            size: 16),
                                                color: Colors.black,
                                                height: 20,
                                                width: 20,
                                              ),
                                              const SizedBox(width: 6),
                                              Text(
                                                amenity.name,
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: isSelected
                                                      ? FontWeight.bold
                                                      : FontWeight.w500,
                                                  color: Colors.black,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ],
                              );
                            }).toList(),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          showMore = !showMore;
                        });
                      },
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            showMore ? "Show Less" : "Show More",
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.black,
                            ),
                          ),
                          Icon(
                            showMore
                                ? Icons.keyboard_arrow_up
                                : Icons.keyboard_arrow_down,
                            size: 20,
                            color: Colors.black,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        }
      },
    );
  }
}
