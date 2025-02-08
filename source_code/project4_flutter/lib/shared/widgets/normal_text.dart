import 'package:flutter/material.dart';

class NormalText extends StatelessWidget {
  const NormalText({required this.text, required this.fontSize, super.key});

  final double fontSize;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(fontSize: fontSize),
    );
  }
}
