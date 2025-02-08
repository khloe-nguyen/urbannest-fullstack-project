import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:project4_flutter/features/government/models/government_request.dart';
import 'package:project4_flutter/features/personal_information/models/country.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';

class Government extends StatefulWidget {
  const Government({super.key});

  @override
  State<Government> createState() => _GovernmentState();
}

class _GovernmentState extends State<Government> {
  final _formKey = GlobalKey<FormState>();
  final _formKey2 = GlobalKey<FormState>();
  Future<List<Country>>? _countriesFuture;
  Country? countrySelected;
  int optionId = 1;
  PersonalInformationService _personalInformationService =
      new PersonalInformationService();
  int stage = 1;

  Future<List<Country>> loadCountries() async {
    final String response =
        await rootBundle.loadString('assets/data/phones.json');
    final List<dynamic> data = json.decode(response);
    return data.map<Country>((json) => Country.fromJson(json)).toList();
  }

  final ImagePicker _picker = ImagePicker();
  XFile? _imageFile; // Biến để lưu hình ảnh đã chọn
  XFile? _imageFile2;

  Future<void> _pickImage() async {
    // Hiển thị hộp thoại chọn hình ảnh
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    setState(() {
      _imageFile = image; // Lưu hình ảnh đã chọn
    });
  }

  Future<void> _pickImage2() async {
    // Hiển thị hộp thoại chọn hình ảnh
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    setState(() {
      _imageFile2 = image; // Lưu hình ảnh đã chọn
    });
  }

  @override
  void initState() {
    super.initState();
    _countriesFuture = loadCountries(); // Gọi hàm chỉ một lần
  }

  void handleUpdateGovernment() async {
    try {
      GovernmentRequest governmentRequest = GovernmentRequest(
          idType: optionId,
          governmentCountry: "countrySelected!.name",
          frontImageUri: _imageFile!.path,
          backImageUri: _imageFile2!.path);
      await _personalInformationService.putGovernment(governmentRequest);
      _imageFile = null; // Biến để lưu hình ảnh đã chọn
      _imageFile2 = null;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("Upload Government Information successfully")),
      );
      setState(() {
        stage = 1;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to upload Government Information: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final double appBarHeight = AppBar().preferredSize.height;
    final double statusBarHeight = MediaQuery.of(context).padding.top;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Government Information"),
        backgroundColor: Colors.white,
      ),
      body: Container(
        padding: const EdgeInsets.all(15),
        color: Colors.white,
        width: screenWidth,
        height: screenHeight - appBarHeight - statusBarHeight,
        child: stage == 1
            ? Form(
                key: _formKey,
                child: Column(
                  children: [
                    // FutureBuilder(
                    //   future: _countriesFuture,
                    //   builder: (context, snapshot) {
                    //     if (snapshot.connectionState ==
                    //         ConnectionState.waiting) {
                    //       return const Center(
                    //           child: CircularProgressIndicator());
                    //     } else if (snapshot.hasError) {
                    //       return Center(
                    //           child: Text("Error: ${snapshot.error}"));
                    //     } else if (!snapshot.hasData ||
                    //         snapshot.data!.isEmpty) {
                    //       return Center(child: Text("No phones found."));
                    //     }
                    //
                    //     final countries = snapshot.data!;
                    //
                    //     if (countrySelected != null &&
                    //         !countries.contains(countrySelected)) {
                    //       countrySelected = null; // Đặt lại nếu không khớp
                    //     }
                    //
                    //     return DropdownButtonFormField<Country>(
                    //       hint: Text("Select a Country"),
                    //       value: countrySelected,
                    //       validator: (value) {
                    //         if (value == null) {
                    //           return "Select one";
                    //         }
                    //         return null;
                    //       },
                    //       onChanged: (Country? countrySelect) {
                    //         countrySelected = countrySelect;
                    //       },
                    //       items: countries.map<DropdownMenuItem<Country>>(
                    //           (Country country) {
                    //         return DropdownMenuItem<Country>(
                    //           value: country,
                    //           child: Text(
                    //             "${country.dialCode} ${country.name}",
                    //             style: TextStyle(fontSize: 12.0),
                    //           ),
                    //         );
                    //       }).toList(),
                    //     );
                    //   },
                    // ),
                    const SizedBox(
                      height: 10,
                    ),
                    Container(
                      color: Colors.white,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              optionId == 1 ? Colors.grey : Colors.white,
                        ),
                        onPressed: () {
                          // Hành động khi nhấn button
                          setState(() {
                            optionId = 1;
                          });
                          print('Button Pressed!');
                        },
                        child: const Row(
                          children: [
                            Icon(
                              Icons.car_crash_sharp,
                              color: Colors.black,
                            ),
                            SizedBox(
                              width: 10,
                            ),
                            Text(
                              "Identity Card",
                              style: TextStyle(color: Colors.black),
                            )
                          ],
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Container(
                      color: Colors.white,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              optionId == 2 ? Colors.grey : Colors.white,
                        ),
                        onPressed: () {
                          // Hành động khi nhấn button

                          setState(() {
                            optionId = 2;
                          });
                        },
                        child: const Row(
                          children: [
                            Icon(
                              Icons.perm_identity,
                              color: Colors.black,
                            ),
                            SizedBox(
                              width: 10,
                            ),
                            Text(
                              "Driver License",
                              style: TextStyle(color: Colors.black),
                            )
                          ],
                        ),
                      ),
                    ),
                    TextButton(
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.black,
                        // Màu nền của TextButton
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 10),
                        // Khoảng cách bên trong
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8), // Bo góc
                        ),
                      ),
                      onPressed: () {
                        // if (_formKey.currentState!.validate()) {
                        setState(() {
                          stage = 2;
                        });
                        // }
                      },
                      child: const Text(
                        "Next",
                        style: TextStyle(color: Colors.white),
                      ),
                    )
                  ],
                ),
              )
            : Form(
                key: _formKey2,
                child: Column(
                  children: [
                    // Hiển thị hình ảnh nếu có
                    TextButton(
                      onPressed: _pickImage,
                      child: Container(
                        width: 200,
                        height: 100,
                        decoration: BoxDecoration(
                          color: Colors.white, // Màu nền của Container
                          border: Border.all(
                            color: Colors.black, // Màu sắc của border
                            width: 2, // Độ dày của border
                          ),
                          borderRadius:
                              BorderRadius.circular(8), // Bo góc (tuỳ chọn)
                        ),
                        child: Center(
                            child: _imageFile != null
                                ? Image.file(
                                    File(_imageFile!.path),
                                    height: 200,
                                    width: 200,
                                    fit: BoxFit.cover,
                                  )
                                : Text("Upload Front")),
                      ),
                      style: ButtonStyle(
                        backgroundColor:
                            MaterialStateProperty.all(Colors.white),
                        foregroundColor:
                            MaterialStateProperty.all(Colors.black),
                        overlayColor:
                            MaterialStateProperty.all(Colors.transparent),
                      ),
                    ),
                    TextButton(
                      onPressed: _pickImage2,
                      child: Container(
                        width: 200,
                        height: 100,
                        decoration: BoxDecoration(
                          color: Colors.white, // Màu nền của Container
                          border: Border.all(
                            color: Colors.black, // Màu sắc của border
                            width: 2, // Độ dày của border
                          ),
                          borderRadius:
                              BorderRadius.circular(8), // Bo góc (tuỳ chọn)
                        ),
                        child: Center(
                            child: _imageFile2 != null
                                ? Image.file(
                                    File(_imageFile2!.path),
                                    height: 200,
                                    width: 200,
                                    fit: BoxFit.cover,
                                  )
                                : Text("Upload Back")),
                      ),
                      style: ButtonStyle(
                        backgroundColor:
                            MaterialStateProperty.all(Colors.white),
                        foregroundColor:
                            MaterialStateProperty.all(Colors.black),
                        overlayColor:
                            MaterialStateProperty.all(Colors.transparent),
                      ),
                    ),
                    Row(
                      children: [
                        TextButton(
                            onPressed: () {
                              setState(() {
                                stage = 1;
                              });
                            },
                            child: Text("Back")),
                        Expanded(child: Container()),
                        Container(
                            padding: EdgeInsets.fromLTRB(0, 0, 0, 0),
                            // Khoảng cách bên trong
                            decoration: BoxDecoration(
                              color: Colors.black, // Màu nền
                              border: Border.all(
                                color: Colors.black, // Màu sắc của border
                                width: 2, // Độ dày của border
                              ),
                              borderRadius: BorderRadius.circular(
                                  10), // Bo góc (tuỳ chọn)
                            ),
                            child: TextButton(
                                onPressed: handleUpdateGovernment,
                                child: Text(
                                  "Upload",
                                  style: TextStyle(color: Colors.white),
                                )))
                      ],
                    )
                  ],
                ),
              ),
      ),
    );
  }
}
