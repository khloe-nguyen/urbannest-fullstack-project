import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/travel/widgets/search_date.dart';
import 'package:project4_flutter/features/travel/widgets/search_guest.dart';
import 'package:project4_flutter/features/travel/widgets/search_location.dart';
import 'package:project4_flutter/shared/bloc/city_cubit/city_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';

class SearchPopup extends StatefulWidget {
  const SearchPopup({super.key});

  @override
  State<SearchPopup> createState() => _SearchPopupState();
}

class _SearchPopupState extends State<SearchPopup> {
  final searchTextController = TextEditingController();

  bool isGuestExpanded = false;
  bool isDateExpanded = false;
  bool isLocationExpanded = false;

  late FilterCubit getFilterCubit;
  late CityCubit getCityCubit;

  @override
  void initState() {
    super.initState();
    getFilterCubit = context.read<FilterCubit>();
    getCityCubit = context.read<CityCubit>();
  }

  @override
  Widget build(BuildContext context) {
    searchTextController.text = getFilterCubit.searchName == null
        ? ''
        : getFilterCubit.searchName.toString();
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      height: MediaQuery.of(context).size.height,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 25),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
              const Text(
                "Where to?",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 10),

                  TextField(
                    controller: searchTextController,
                    onSubmitted: (value) {
                      getFilterCubit.changeSearchName(value);
                    },
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search),
                      hintText: "Search destinations",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  // AnimatedContainer để tạo hiệu ứng mượt
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        isLocationExpanded =
                            !isLocationExpanded; // Thay đổi trạng thái
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(seconds: 10),
                      curve: Curves.easeInOut,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: isLocationExpanded
                          ? const SearchLocation() // Nếu trạng thái mở rộng, hiển thị SearchGuest
                          : const Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  "Where",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "Your place",
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.grey),
                                ),
                              ],
                            ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        isGuestExpanded =
                            !isGuestExpanded; // Thay đổi trạng thái
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(seconds: 10),
                      curve: Curves.easeInOut,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: isGuestExpanded
                          ? const SearchGuest() // Nếu trạng thái mở rộng, hiển thị SearchGuest
                          : const Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  "Who",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "Number of you",
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.grey),
                                ),
                              ],
                            ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        isDateExpanded = !isDateExpanded; // Thay đổi trạng thái
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(seconds: 10),
                      curve: Curves.easeInOut,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: isDateExpanded
                          ? const SearchDate() // Nếu trạng thái mở rộng, hiển thị SearchGuest
                          : const Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  "When",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "Your days",
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.grey),
                                ),
                              ],
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton(
                onPressed: () {
                  getFilterCubit.updateDates(null, null);
                  getCityCubit.changeCity(null);
                  getCityCubit.changeDistrict(null);
                  getCityCubit.changeWard(null);
                  getFilterCubit.changeAdult(1);
                  getFilterCubit.changeChildren(0);
                  getFilterCubit.changeSearchName(null);
                  searchTextController.text = "";
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
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize:
                      Size(MediaQuery.of(context).size.width * 0.3, 50),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.search, color: Colors.white),
                    SizedBox(width: 10),
                    Text("Search",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
