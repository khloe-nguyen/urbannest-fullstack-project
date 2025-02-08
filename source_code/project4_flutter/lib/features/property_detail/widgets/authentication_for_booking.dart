import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/authentication/api/authentication_api.dart';
import 'package:project4_flutter/features/authentication/api/google_auth.dart';
import 'package:project4_flutter/features/authentication/widget/user_register.dart';
import 'package:project4_flutter/features/property_detail/property_detail.dart';
import 'package:project4_flutter/features/property_detail/widgets/user_login_for_booking.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';
import 'package:project4_flutter/shared/widgets/custom_input_form.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';
import 'package:sign_in_button/sign_in_button.dart';

class AuthenticationForBooking extends StatefulWidget {
  final int propertyId;
  const AuthenticationForBooking({super.key, required this.propertyId});

  @override
  State<AuthenticationForBooking> createState() => _AuthenticationState();
}

class _AuthenticationState extends State<AuthenticationForBooking> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final GoogleAuth googleAuth = GoogleAuth();
  final TokenStorage _tokenStorage = TokenStorage();
  final AuthenticationApi authenticationApi = AuthenticationApi();
  bool _loading = false;

  @override
  void dispose() {
    super.dispose();
    _emailController.dispose();
  }

  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    final emailRegex =
        RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Enter a valid email address';
    }
    return null; // Return null if the input is valid
  }

  void checkAccountExist() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _loading = true;
      });
      var body = <String, String>{};

      body['email'] = _emailController.value.text;

      CustomResult customResult =
          await authenticationApi.authenticationRequest(body);

      if (customResult.data as bool == true) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Navigate to login")),
          );
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => UserLoginForBooking(
                      _emailController.value.text,
                      propertyId: widget.propertyId,
                    )),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Navigate to sign-up")),
          );

          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => UserRegister(
                      _emailController.value.text,
                      isGoogle: false,
                    )),
          );
        }
      }

      setState(() {
        _loading = false;
      });
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
            icon: const Icon(Icons.close)),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Log in or sign up to Urban Nest",
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 20,
                ),
              ),
              const SizedBox(
                height: 30,
              ),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    CustomInputForm(
                      isPassword: false,
                      inputController: _emailController,
                      validation: validateEmail,
                      labelText: "Email",
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    _loading == false
                        ? RedButton(action: checkAccountExist, text: "Continue")
                        : const LoadingIcon(size: 40),
                  ],
                ),
              ),
              const SizedBox(
                height: 10,
              ),
              const Row(
                children: [
                  Expanded(
                    child: Divider(
                      color: Color.fromARGB(30, 0, 0, 0),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    child: Text("or"),
                  ),
                  Expanded(
                    child: Divider(
                      color: Color.fromARGB(30, 0, 0, 0),
                    ),
                  ),
                ],
              ),
              const SizedBox(
                height: 10,
              ),
              SizedBox(
                width: MediaQuery.of(context).size.width,
                child: _loading == false
                    ? SignInButton(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        Buttons.google,
                        onPressed: () async {
                          setState(() {
                            _loading = true;
                          });
                          var email = await googleAuth.handleGoogleSignIn();
                          print(email);

                          if (email != null) {
                            var customResult = await authenticationApi
                                .loginOrSignUpGoogleRequest({"email": email});

                            if (customResult.status == 202) {
                              var token = customResult.data as String;
                              await _tokenStorage.saveToken(token);

                              if (context.mounted) {
                                context.read<UserCubit>().initializeUser();

                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text("Success")),
                                );

                                Navigator.of(context).pushAndRemoveUntil(
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          PropertyDetail(widget.propertyId)),
                                  (route) =>
                                      false, // Removes all previous routes
                                );
                              }
                            }

                            if (customResult.status == 201) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                      content: Text("Navigate to sign-up")),
                                );

                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => UserRegister(
                                            email,
                                            isGoogle: true,
                                          )),
                                );
                              }
                            }
                          }
                          setState(() {
                            _loading = false;
                          });
                        },
                      )
                    : const LoadingIcon(size: 40),
              )
            ],
          ),
        ),
      ),
    );
  }
}
