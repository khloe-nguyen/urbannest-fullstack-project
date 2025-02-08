import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/qr_scanner/qr_scanner.dart';

import '../login_and_security/login_and_security.dart';

class LoginSecurity extends StatelessWidget {
  const LoginSecurity({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 100,
        bottom: PreferredSize(
          preferredSize:
              const Size.fromHeight(1.0), // Set the height of the border
          child: Container(
            color: const Color.fromARGB(30, 0, 0, 0), // Border color
            height: 1.0, // Border thickness
          ),
        ),
        leading: IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.keyboard_arrow_left_outlined)),
      ),
      body: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 20,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Login and security",
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 20,
              ),
            ),
            const SizedBox(
              height: 60,
            ),
            const Text(
              "Login",
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 25,
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    width: 1,
                    color: Colors.black.withOpacity(0.1),
                  ),
                  top: BorderSide(
                    width: 1,
                    color: Colors.black.withOpacity(0.1),
                  ),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Login by QR code",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(
                        height: 10,
                      ),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 220),
                        child: const Text(
                          "Login to our website by QR",
                          softWrap: true,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const QrScanner(),
                        ),
                      );
                    },
                    icon: const HugeIcon(
                      icon: HugeIcons.strokeRoundedQrCode,
                      color: Colors.black,
                      size: 24.0,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    width: 1,
                    color: Colors.black.withOpacity(0.1),
                  ),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Password",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(
                        height: 10,
                      ),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 220),
                        child: const Text(
                          "Last updated was 2 month ago",
                          softWrap: true,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginAndSecurity(),
                          ));
                    },
                    child: const Text("Update"),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
