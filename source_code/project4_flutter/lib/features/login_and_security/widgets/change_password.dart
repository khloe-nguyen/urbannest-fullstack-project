import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:project4_flutter/features/login_and_security/models/change_password_request.dart';
import 'package:project4_flutter/features/login_and_security/models/otp_confirm_request.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';
import 'package:project4_flutter/features/personal_information/service/validator_service.dart';
import 'package:flutter_otp_text_field/flutter_otp_text_field.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';

class ChangePassword extends StatefulWidget {
  const ChangePassword({super.key});

  @override
  State<ChangePassword> createState() => _ChangePasswordState();
}

class _ChangePasswordState extends State<ChangePassword> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController currentPasswordController =
      TextEditingController(text: "");
  TextEditingController newPasswordController = TextEditingController(text: "");
  TextEditingController confirmPasswordController =
      TextEditingController(text: "");
  final PersonalInformationService _personalInformationService =
      PersonalInformationService();
  bool isShowOtp = false;
  String otpConfirm = "";

  void handlePutChangePassword() async {
    if (_formKey.currentState!.validate()) {
      try {
        ChangePasswordRequest changePasswordRequest = ChangePasswordRequest(
            currentPassword: currentPasswordController.text,
            newPassword: newPasswordController.text,
            confirmPassword: confirmPasswordController.text);

        await _personalInformationService
            .putChangePassword(changePasswordRequest);

        setState(() {
          isShowOtp = true;
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Otp sent to your email")),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Failed to update Password: $e")),
          );
        }
      }
    }
  }

  void handleCheckOtp() async {
    try {
      OtpConfirmRequest otpConfirmRequest = OtpConfirmRequest(Otp: otpConfirm);
      await _personalInformationService.putCheckOtp(otpConfirmRequest);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Update password successful")),
        );
      }

      setState(() {
        isShowOtp = false;
        currentPasswordController.text = "";
        newPasswordController.text = "";
        confirmPasswordController.text = "";
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to update Password: $e")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      width: screenWidth,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                "Change Password",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Expanded(child: Container()),
              Container(
                child:
                    TextButton(onPressed: () {}, child: const Text("Update")),
              )
            ],
          ),
          isShowOtp
              ? Container(
                  child: Column(children: [
                    OtpTextField(
                      numberOfFields: 4,
                      borderColor: const Color(0xFF512DA8),
                      //set to true to show as box or false to show as dash
                      showFieldAsBox: true,
                      //runs when a code is typed in
                      onCodeChanged: (String code) {
                        //handle validation or checks here
                      },
                      //runs when every textfield is filled
                      onSubmit: (String verificationCode) {
                        otpConfirm = verificationCode;

                        // showDialog(
                        //     context: context,
                        //     builder: (context) {
                        //       return AlertDialog(
                        //         title: Text("Verification Code"),
                        //         content:
                        //             Text('Code entered is $verificationCode'),
                        //       );
                        //     });
                      }, // end onSubmit
                    ),
                    Row(
                      children: [
                        TextButton(
                            onPressed: () {
                              setState(() {
                                isShowOtp = false;
                                currentPasswordController.text = "";
                                newPasswordController.text = "";
                                confirmPasswordController.text = "";
                              });
                            },
                            child: const Text("Cancel")),
                        Expanded(child: Container()),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black,
                          ),
                          onPressed: () => handleCheckOtp(),
                          child: const Text(
                            "Save",
                            style: TextStyle(color: Colors.white),
                          ),
                        )
                      ],
                    )
                  ]),
                )
              : Container(
                  child: Form(
                    key: _formKey,
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          TextFormField(
                            controller: currentPasswordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              labelStyle: TextStyle(color: Colors.red),
                              labelText: "Current Password",
                              focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Colors.black, width: 2)),
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              return Validator.validatePassword(
                                  value, "Current Password");
                            },
                          ),
                          const SizedBox(
                            height: 30,
                          ),
                          TextFormField(
                            controller: newPasswordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              labelText: "New Password",
                              labelStyle: TextStyle(color: Colors.red),
                              focusedBorder: OutlineInputBorder(
                                borderSide:
                                    BorderSide(color: Colors.black, width: 2),
                              ),
                              // label: Text(
                              //   "Current",
                              //   style: TextStyle(color: Colors.black),
                              // ),
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              return Validator.validatePassword(
                                  value, "New password");
                            },
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          TextFormField(
                            controller: confirmPasswordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              labelText: "Confirm Password",
                              labelStyle: TextStyle(color: Colors.red),
                              focusedBorder: OutlineInputBorder(
                                borderSide:
                                    BorderSide(color: Colors.black, width: 2),
                              ),
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              return Validator.validatePassword(
                                  value, "Confirm password");
                            },
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          RedButton(
                              action: () {
                                handlePutChangePassword();
                              },
                              text: "Save"),
                        ],
                      ),
                    ),
                  ),
                )
        ],
      ),
    );
  }
}
