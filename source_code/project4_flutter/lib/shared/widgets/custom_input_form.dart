import 'package:flutter/material.dart';

class CustomInputForm extends StatelessWidget {
  const CustomInputForm({
    super.key,
    required this.inputController,
    required this.validation,
    required this.labelText,
    required this.isPassword,
    this.opTap,
    this.isReadOnly = false,
  });

  final TextEditingController inputController;
  final String? Function(String?) validation;
  final String labelText;
  final bool isPassword;
  final bool isReadOnly;
  final Function()? opTap;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: inputController,
      validator: validation,
      obscureText: isPassword,
      readOnly: isReadOnly,
      onTap: opTap,
      obscuringCharacter: "*",
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: const TextStyle(color: Colors.black),
        focusedBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black),
        ),
        border: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black),
        ),
      ),
    );
  }
}
