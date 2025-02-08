import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/travel/widgets/amenity_filter.dart';
import 'package:project4_flutter/features/travel/widgets/booking_options_filter.dart';
import 'package:project4_flutter/features/travel/widgets/price_filter.dart';
import 'package:project4_flutter/features/travel/widgets/property_type_filter.dart';
import 'package:project4_flutter/features/travel/widgets/room_bed_filter.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/travel_cubit/travel_cubit.dart';
import 'package:project4_flutter/shared/bloc/travel_cubit/travel_state.dart';

class FilterPopup extends StatefulWidget {
  const FilterPopup({super.key});

  @override
  State<FilterPopup> createState() => _FilterPopupState();
}

class _FilterPopupState extends State<FilterPopup> {
  late FilterCubit getFilterCubit;
  late AmenityCubit getAmenityCubit;
  late TravelCubit getTravelCubit;

  @override
  void initState() {
    super.initState();
    getFilterCubit = context.read<FilterCubit>();
    getAmenityCubit = context.read<AmenityCubit>();
    getTravelCubit = context.read<TravelCubit>();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return BlocBuilder<TravelCubit, TravelState>(builder: (context, state) {
      var _travels = getTravelCubit.travelList;
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
                      alignment: Alignment.centerLeft, // Đặt icon ở góc trái
                      child: IconButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        icon: const Icon(Icons.close),
                      ),
                    ),
                    const Text(
                      'Filters',
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

              const Expanded(
                child: Scrollbar(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 18.0),
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            PropertyTypeFilter(),
                            PriceFilter(),
                            RoomBedFilter(),
                            AmenityFilter(),
                            BookingOptionsFilter()
                          ]),
                    ),
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
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black, // Nền đen
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          minimumSize: Size(screenWidth * 0.8, 50),
                        ),
                        child: Text(
                          "Show ${_travels.length > 0 ? "${getTravelCubit.totalCount}" : ""} places",
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white, // Chữ màu trắng
                          ),
                        )),
                    TextButton(
                      onPressed: () {
                        getFilterCubit.changePropertyType(null);
                        getFilterCubit.changeInstant(null);
                        getFilterCubit.changeSelfCheckIn(null);
                        getFilterCubit.changePet(null);
                        getFilterCubit.changeRoom(1);
                        getFilterCubit.changeBed(1);
                        getFilterCubit.changeBathroom(1);
                        getFilterCubit.changePrice([0, 1000]);
                        getAmenityCubit.clearAmenityIdList();
                      },
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10), // Loại bỏ padding mặc định
                      ),
                      child: const Text(
                        "Clear all",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black, // Chữ màu đen
                        ),
                      ),
                    ),
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
