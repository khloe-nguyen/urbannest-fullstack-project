import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/personal_information/models/legal_name_request.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';
import 'package:project4_flutter/features/personal_information/service/validator_service.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'dart:convert' show utf8;

class Forminput extends StatefulWidget {
  const Forminput({super.key});

  @override
  State<Forminput> createState() => _InputFromState();
}

class _InputFromState extends State<Forminput> {
  final _formKey = GlobalKey<FormState>();
  PersonalInformationService _personalInformationService =
      new PersonalInformationService();
  bool isShowInput = false;
  String title = "Edit";

  void showInput() {
    isShowInput = !isShowInput;
    if (isShowInput) {
      title = "Cancel";
    } else {
      title = "Edit";
    }
    setState(() {});
  }

  void handlePutLegalName(String firstName, String lastName) async {
    if (_formKey.currentState!.validate()) {
      try {
        LegalNameRequest request = LegalNameRequest(
            firstName: firstName.trim(), lastName: lastName.trim());

        await _personalInformationService.putLegalName(request);
        context.read<UserCubit>().initializeUser();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Legal name updated successfully")),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to update legal name: $e")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    var user = context.read<UserCubit>().loginUser;
    TextEditingController firstNameController =
        TextEditingController(text: user!.firstName);
    TextEditingController lastNameController =
        TextEditingController(text: user!.lastName);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      width: screenWidth,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                "Legal Name",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Expanded(child: Container()),
              Container(
                child: TextButton(
                    onPressed: () {
                      showInput();
                    },
                    child: Text("${title}")),
              )
            ],
          ),
          !isShowInput
              ? Text("${user.firstName} ${user.lastName}")
              : Container(
                  child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: firstNameController,
                        decoration: const InputDecoration(
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 2)),
                          label: Text(
                            "First name on Id",
                            style: TextStyle(color: Colors.black),
                          ),
                          border:
                              OutlineInputBorder(), // Thêm viền cho trường nhập
                        ),
                        validator: Validator.validateFirstName,
                      ),
                      const SizedBox(
                        height: 10,
                      ),
                      TextFormField(
                        controller: lastNameController,
                        decoration: const InputDecoration(
                          focusedBorder: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 2)),
                          label: Text(
                            "Last name on Id",
                            style: TextStyle(color: Colors.black),
                          ),
                          border:
                              OutlineInputBorder(), // Thêm viền cho trường nhập
                        ),
                        validator: Validator.validateLastName,
                      ),
                      const SizedBox(
                        height: 10,
                      ),
                      ElevatedButton(
                        onPressed: () => handlePutLegalName(
                            firstNameController.text, lastNameController.text),
                        child: Text(
                          "Save",
                          style: TextStyle(color: Colors.white),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black,
                        ),
                      )
                    ],
                  ),
                ))
        ],
      ),
    );
  }
}
