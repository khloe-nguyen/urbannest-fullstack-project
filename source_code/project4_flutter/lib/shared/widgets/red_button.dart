import 'package:flutter/material.dart';

class RedButton extends StatelessWidget {
  const RedButton({super.key, required this.action, required this.text});

  final void Function() action;
  final String text;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: action,
      style: ElevatedButton.styleFrom(
          shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(10))),
          backgroundColor: const Color.fromARGB(255, 229, 29, 83),
          minimumSize: const Size.fromHeight(55)),
      child: Text(
        text,
        style: const TextStyle(color: Colors.white, fontSize: 17),
      ),
    );
  }
}
