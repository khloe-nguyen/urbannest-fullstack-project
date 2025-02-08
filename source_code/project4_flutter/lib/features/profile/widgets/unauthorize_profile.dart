import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';

class UnauthorizeProfile extends StatelessWidget {
  const UnauthorizeProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
        toolbarHeight: 70,
        title: const Text(
          "Your profile",
          style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900),
        ),
        bottom: PreferredSize(
          preferredSize:
              const Size.fromHeight(1.0), // Set the height of the border
          child: Container(
            color: const Color.fromARGB(30, 0, 0, 0), // Border color
            height: 1.0, // Border thickness
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(
              height: 20,
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                "Log in to start planning your next trip.",
                style: TextStyle(
                  fontSize: 18,
                  color: Color.fromARGB(150, 0, 0, 0),
                ),
              ),
            ),
            const SizedBox(
              height: 25,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: RedButton(
                  action: () {
                    Navigator.pushNamed(context, "authentication");
                  },
                  text: "Login"),
            ),
            const SizedBox(
              height: 10,
            ),
            TextButton(
              style: TextButton.styleFrom(
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 10),
                child: Row(
                  children: [
                    Text("Don't have an account?",
                        style: TextStyle(color: Color.fromARGB(100, 0, 0, 0))),
                    SizedBox(
                      width: 10,
                    ),
                    Text("Sign up", style: TextStyle(color: Colors.black)),
                  ],
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedSettings02,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Settings",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedAccountSetting01,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Accessibility",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedHome13,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Learn about hosting",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedHelpCircle,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Get help",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedBookOpen02,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Term of Services",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedBookOpen02,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Privacy Policy",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius
                      .zero, // No rounded corners, sharp rectangle edges
                ),
              ),
              onPressed: () {},
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                          color: Color.fromARGB(30, 0, 0, 0), width: 1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedBookOpen02,
                        color: Colors.black,
                        size: 26.0,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Open source licenses",
                        style: TextStyle(fontSize: 16, color: Colors.black),
                      ),
                      Spacer(),
                      HugeIcon(
                        icon: HugeIcons.strokeRoundedArrowRight01,
                        color: Colors.black,
                        size: 24.0,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: 100,
            )
          ],
        ),
      ),
    );
  }
}
