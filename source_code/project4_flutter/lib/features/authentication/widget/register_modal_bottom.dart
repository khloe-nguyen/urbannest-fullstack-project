import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';
import 'package:project4_flutter/features/authentication/api/authentication_api.dart';
import 'package:project4_flutter/features/profile/profile.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:provider/provider.dart';

class RegisterModalBottom extends StatefulWidget {
  const RegisterModalBottom(
      {super.key,
      required this.email,
      required this.password,
      required this.dateOfBirth,
      required this.firstName,
      required this.lastName});

  final String email;
  final String password;
  final String dateOfBirth;
  final String firstName;
  final String lastName;

  @override
  State<RegisterModalBottom> createState() => _RegisterModalBottomState();
}

class _RegisterModalBottomState extends State<RegisterModalBottom> {
  final authenticationApi = AuthenticationApi();

  void onFinish(String value) async {
    final body = <String, String>{};

    body['code'] = value;
    body['email'] = widget.email;
    body['password'] = widget.password;
    body['dob'] = widget.dateOfBirth;
    body['firstName'] = widget.firstName;
    body['lastName'] = widget.lastName;

    var customResult = await authenticationApi.registerRequest(body);

    if (customResult.status == 200) {
      if (mounted) {
        context.read<UserCubit>().initializeUser();

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Success")),
        );

        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(
            builder: (context) => const Profile(),
          ),
          (route) => false, // Removes all previous routes
        );
      }
    }

    if (customResult.status == 403) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(customResult.message)),
        );

        return;
      }
    }
  }

  void onRetry() async {
    var customResult = await authenticationApi
        .createAuthenticationRequest({'email': widget.email});

    if (customResult.status == 200) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Please check your mail again")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
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
          icon: const Icon(Icons.close),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Enter your verification code",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
              ),
              const SizedBox(
                height: 20,
              ),
              Text(
                "Enter the code we emailed to ${widget.email}",
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(
                height: 20,
              ),
              Pinput(
                length: 6,
                onCompleted: onFinish,
                keyboardType: TextInputType.text,
              ),
              const SizedBox(
                height: 20,
              ),
              RichText(
                text: TextSpan(
                  children: [
                    const TextSpan(
                      text: "Didn't get the email? ",
                      style: TextStyle(fontSize: 20),
                    ),
                    TextSpan(
                      text: "Try again",
                      recognizer: TapGestureRecognizer()..onTap = onRetry,
                      style: const TextStyle(
                        decoration: TextDecoration.underline,
                        fontSize: 20,
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
