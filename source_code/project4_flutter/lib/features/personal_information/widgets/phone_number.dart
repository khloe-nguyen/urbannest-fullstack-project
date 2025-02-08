import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/personal_information/models/country.dart';
import 'package:project4_flutter/features/personal_information/models/phone_number_request.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';
import 'package:project4_flutter/features/personal_information/service/validator_service.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';

class PhoneNumber extends StatefulWidget {
  const PhoneNumber({super.key});

  @override
  State<PhoneNumber> createState() => _PhoneNumberState();
}

class _PhoneNumberState extends State<PhoneNumber> {
  final _formKey = GlobalKey<FormState>();
  bool isShowInput = false;
  String title = "Edit";
  Country? countrySelected;
  Future<List<Country>>? _countriesFuture;
  PersonalInformationService _personalInformationService =
      new PersonalInformationService();

  Future<List<Country>> loadCountries() async {
    final String response =
        await rootBundle.loadString('assets/data/phones.json');
    final List<dynamic> data = json.decode(response);
    return data.map<Country>((json) => Country.fromJson(json)).toList();
  }

  void showInput() {
    isShowInput = !isShowInput;
    if (isShowInput) {
      title = "Cancel";
    } else {
      title = "Edit";
    }
    setState(() {});
  }

  void handlePutPhoneNumber(String phoneNumber) async {
    if (_formKey.currentState!.validate()) {
      try {
        PhoneNumberRequest phoneNumberRequest = PhoneNumberRequest(
            phoneNumber: "${countrySelected?.dialCode},$phoneNumber");
        await _personalInformationService.putPhoneNumber(phoneNumberRequest);
        context.read<UserCubit>().initializeUser();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Phone number updated successfully")),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to update Phone number: $e")),
        );
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _countriesFuture = loadCountries(); // Gọi hàm chỉ một lần
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    var user = context.read<UserCubit>().loginUser;
    String? phoneNumber = user!.phoneNumber;
    TextEditingController phoneInputController =
        TextEditingController(text: "");

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      width: screenWidth,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Text(
              "Phone Number",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Expanded(child: Container()),
            Container(
              child:
                  TextButton(onPressed: () => showInput(), child: Text(title)),
            )
          ]),
          !isShowInput
              ? Text(phoneNumber == null || phoneNumber.isEmpty
                  ? "Update your phone"
                  : phoneNumber)
              : Container(
                  child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          FutureBuilder(
                            future: _countriesFuture,
                            builder: (context, snapshot) {
                              if (snapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return Center(
                                    child: CircularProgressIndicator());
                              } else if (snapshot.hasError) {
                                return Center(
                                    child: Text("Error: ${snapshot.error}"));
                              } else if (!snapshot.hasData ||
                                  snapshot.data!.isEmpty) {
                                return Center(child: Text("No phones found."));
                              }

                              final countries = snapshot.data!;

                              if (countrySelected != null &&
                                  !countries.contains(countrySelected)) {
                                countrySelected =
                                    null; // Đặt lại nếu không khớp
                              }

                              return DropdownButtonFormField<Country>(
                                hint: Text("Select a phone"),
                                value: countrySelected,
                                validator: (value) {
                                  if (value == null) {
                                    return "Select one";
                                  }
                                  return null;
                                },
                                onChanged: (Country? countrySelect) {
                                  countrySelected = countrySelect;
                                },
                                items: countries.map<DropdownMenuItem<Country>>(
                                    (Country country) {
                                  return DropdownMenuItem<Country>(
                                    value: country,
                                    child: Text(
                                      "${country.dialCode} ${country.name}",
                                      style: TextStyle(fontSize: 12.0),
                                    ),
                                  );
                                }).toList(),
                              );
                            },
                          ),
                          SizedBox(
                            height: 10,
                          ),
                          TextFormField(
                            controller: phoneInputController,
                            decoration: const InputDecoration(
                              focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Colors.black, width: 2)),
                              label: Text(
                                "Phone Number",
                                style: TextStyle(color: Colors.black),
                              ),
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.number,
                            inputFormatters: <TextInputFormatter>[
                              FilteringTextInputFormatter.digitsOnly,
                            ],
                            validator: Validator.validatePhoneNumber,
                          ),
                          ElevatedButton(
                            onPressed: () =>
                                handlePutPhoneNumber(phoneInputController.text),
                            child: Text(
                              "Save",
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.black,
                            ),
                          )
                        ],
                      )),
                )
        ],
      ),
    );
  }
}
