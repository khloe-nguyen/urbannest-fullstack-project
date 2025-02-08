import 'package:flutter/material.dart';

import 'package:project4_flutter/home_screen.dart';

Future<void> showErrorDialogTransaction(
    BuildContext context, String message, String title) async {
  if (context.mounted) {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title,
              style: title == "Error"
                  ? const TextStyle(color: Colors.red)
                  : const TextStyle(color: Colors.green)),
          content: Text(
            message,
            style: const TextStyle(fontSize: 18),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                //sua code

                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (context) => const HomeScreen()),
                      (route) => false,
                );
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }
}
