import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/personal_information/models/preferred_name_request.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';
import 'package:project4_flutter/features/personal_information/service/validator_service.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';

class PreferredName extends StatefulWidget {
  const PreferredName({super.key});

  @override
  State<PreferredName> createState() => _PreferredNameState();
}

class _PreferredNameState extends State<PreferredName> {
  final _formKey = GlobalKey<FormState>();
  bool isShowInput = false;
  String title = "Edit";
  PersonalInformationService _personalInformationService =
      new PersonalInformationService();

  void showInput() {
    isShowInput = !isShowInput;
    if (isShowInput) {
      title = "Cancel";
    } else {
      title = "Edit";
    }
    setState(() {});
  }

  void handlePutPreferredName(String preferredName) async {
    if (_formKey.currentState!.validate()) {
      try {
        PreferredNameRequest request =
            PreferredNameRequest(preferredName: preferredName.trim());

        await _personalInformationService.putPreferredName(request);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Preferred name updated successfully")),
        );
        await context.read<UserCubit>().initializeUser();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text("Something when wrong when update preferred Name")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    var user = context.read<UserCubit>().loginUser;
    String? preferredName = user!.preferredName;
    final screenWidth = MediaQuery.of(context).size.width;
    TextEditingController preferredNameController =
        TextEditingController(text: user!.preferredName);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      width: screenWidth,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Text(
              "Preferred Name",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Expanded(child: Container()),
            Container(
              child: TextButton(
                  onPressed: () => showInput(), child: Text("$title")),
            )
          ]),
          !isShowInput
              ? Text(preferredName == null || preferredName.isEmpty
                  ? "This is how your name will appear to Host"
                  : "$preferredName")
              : Container(
                  child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          TextFormField(
                            controller: preferredNameController,
                            decoration: const InputDecoration(
                              focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Colors.black, width: 2)),
                              label: Text(
                                "Preferred name on Id",
                                style: TextStyle(color: Colors.black),
                              ),
                              border: OutlineInputBorder(),
                            ),
                            validator: Validator.validatePreferredName,
                          ),
                          ElevatedButton(
                            onPressed: () => handlePutPreferredName(
                                preferredNameController.text),
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
