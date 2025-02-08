import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/city_cubit/city_cubit.dart';
import 'package:project4_flutter/shared/bloc/city_cubit/city_state.dart';

class SearchLocation extends StatefulWidget {
  const SearchLocation({super.key});

  @override
  State<SearchLocation> createState() => _SearchLocationState();
}

class _SearchLocationState extends State<SearchLocation> {
  List<dynamic> level1List = []; // Không dùng late, khởi tạo là mảng rỗng
  List<dynamic> level2List = [];
  List<dynamic> level3List = [];

  String? selectedLevel1;
  String? selectedLevel2;
  String? selectedLevel3;

  late CityCubit getCityCubit;
  List<String> cityNames = [];

  @override
  void initState() {
    super.initState();
    getCityCubit = context.read<CityCubit>();

    getCityCubit.getManagedCities().then((v) {
      setState(() {
        cityNames = getCityCubit.managedCityNames;
      });
      _loadData();
    });
  }

  // Hàm tải dữ liệu từ file JSON
  Future<void> _loadData() async {
    try {
      final jsonString = await rootBundle.loadString('assets/data/dchc.json');
      final data = json.decode(jsonString);

      setState(() {
        level1List = data['data']
            .where((level1) =>
                getCityCubit.managedCityNames.contains(level1['name']))
            .toList();
      });
    } catch (e) {
      print("Lỗi khi tải dữ liệu: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    print("hêhe ${cityNames}");
    return GestureDetector(
      onTap: () {
        // // Gọi _loadData mỗi khi widget được bấm
        // context.read<CityCubit>().getManagedCities().then((v) {
        //   _loadData();
        // });
      },
      child: BlocBuilder<CityCubit, CityState>(builder: (context, state) {
        print(state);

        if (state is ManagedCityLoading) {
          // Hiển thị vòng xoay khi tải dữ liệu
          return const Center(child: CircularProgressIndicator());
        }

        return SizedBox(
          width: MediaQuery.of(context).size.width,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.max,
            children: [
              // Title và Dropdown cho Level 1
              const Text(
                "Select City",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              DropdownButton<String?>(
                value: getCityCubit.city,
                hint: const Text("Select city"),
                items: [
                  const DropdownMenuItem<String?>(
                    // Cho phép bỏ chọn
                    value: null,
                    child: Text("--No Choice--"),
                  ),
                  ...level1List.map((level1) {
                    return DropdownMenuItem<String?>(
                      value: level1['level1_id'],
                      child: Text(level1['name']),
                    );
                  }).toList(),
                ],
                onChanged: (value) {
                  setState(() {
                    // Lấy danh sách Level 2
                    level2List = level1List.firstWhere(
                          (level1) {
                            print(level1['level1_id'].toString());
                            print(value.toString());
                            return level1['level1_id'].toString() ==
                                value.toString();
                          },
                          orElse: () => {},
                        )['level2s'] ??
                        [];
                    level3List = []; // Reset Level 3
                  });
                  getCityCubit.changeCity(value);
                  getCityCubit.changeDistrict(null);
                  getCityCubit.changeWard(null);
                },
              ),
              const SizedBox(height: 16),

              // Title và Dropdown cho Level 2
              if (level2List.isNotEmpty)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Select District",
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    DropdownButton<String?>(
                      value: getCityCubit.district,
                      hint: const Text("Select District"),
                      items: [
                        const DropdownMenuItem<String?>(
                          // Cho phép bỏ chọn
                          value: null,
                          child: Text("--No Choice--"),
                        ),
                        ...level2List.map((level2) {
                          return DropdownMenuItem<String?>(
                            value: level2['level2_id'],
                            child: Text(level2['name']),
                          );
                        }).toList(),
                      ],
                      onChanged: (value) {
                        // getCityCubit.changeDistrict(value);
                        setState(() {
                          // selectedLevel2 = value;
                          // selectedLevel3 = null;

                          // Lấy danh sách Level 3
                          level3List = level2List.firstWhere(
                                (level2) =>
                                    level2['level2_id'] == value.toString(),
                                orElse: () => {},
                              )['level3s'] ??
                              [];
                        });
                        getCityCubit.changeDistrict(value);
                        getCityCubit.changeWard(null);
                      },
                    ),
                    const SizedBox(height: 16),
                  ],
                ),

              // Title và Dropdown cho Level 3
              if (level3List.isNotEmpty)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Select Ward",
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    DropdownButton<String?>(
                      value: getCityCubit.ward,
                      hint: const Text("Select Ward"),
                      items: [
                        const DropdownMenuItem<String?>(
                          // Cho phép bỏ chọn
                          value: null,
                          child: Text("--No Choice--"),
                        ),
                        ...level3List.map((level3) {
                          return DropdownMenuItem<String?>(
                            value: level3['level3_id'],
                            child: Text(level3['name']),
                          );
                        }).toList(),
                      ],
                      onChanged: (value) {
                        getCityCubit.changeWard(value);
                      },
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
            ],
          ),
        );
      }),
    );
  }
}
