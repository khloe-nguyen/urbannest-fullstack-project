import 'package:flutter/material.dart';

class BoldText extends StatelessWidget {
  const BoldText({required this.text, required this.fontSize, super.key});

  final double fontSize;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(fontWeight: FontWeight.bold, fontSize: fontSize),
    );
  }
}
