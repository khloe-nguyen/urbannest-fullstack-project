import 'package:flutter/material.dart';
import 'package:project4_flutter/features/authentication/api/authentication_api.dart';
import 'package:project4_flutter/features/property_detail/property_detail.dart';
import 'package:project4_flutter/main.dart';
import 'package:project4_flutter/shared/api/user_api.dart';
import 'package:project4_flutter/shared/models/custom_result.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';
import 'package:project4_flutter/shared/widgets/custom_input_form.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';
import 'package:provider/provider.dart';
import '../../../shared/bloc/user_cubit/user_cubit.dart';

class UserLoginForBooking extends StatefulWidget {
  final int propertyId;
  const UserLoginForBooking(
    this.email, {
    super.key,
    required this.propertyId,
  });
  final String email;

  @override
  State<UserLoginForBooking> createState() => _UserLoginState();
}

class _UserLoginState extends State<UserLoginForBooking> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final AuthenticationApi authenticationApi = AuthenticationApi();
  final userApi = UserApi();
  bool _isLoading = false;
  final TokenStorage _tokenStorage = TokenStorage();

  @override
  void dispose() {
    super.dispose();
    _passwordController.dispose();
  }

  String? validation(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }

    if (value.contains(" ")) {
      return "Password cannot contains space";
    }

    if (value.length < 6) {
      return 'Password length must be equal or larger than 6';
    }

    return null;
  }

  void onSubmit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      var body = <String, String>{};
      body['email'] = widget.email;
      body['password'] = _passwordController.text.toString();
      body['token'] = fcmToken!;

      CustomResult customResult = await authenticationApi.loginRequest(body);

      setState(() {
        _isLoading = false;
      });

      if (customResult.status == 200) {
        var token = customResult.data as String;
        await _tokenStorage.saveToken(token);

        if (mounted) {
          context.read<UserCubit>().initializeUser();

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Success")),
          );

          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(
                builder: (context) => PropertyDetail(widget.propertyId)),
            (route) => false, // Removes all previous routes
          );
        }
      }
      if (customResult.status == 403) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(customResult.message)),
          );
        }
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
            icon: const Icon(Icons.arrow_back)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Log in",
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  CustomInputForm(
                      isPassword: true,
                      inputController: _passwordController,
                      validation: validation,
                      labelText: "Password"),
                  const SizedBox(
                    height: 20,
                  ),
                  _isLoading
                      ? const CircularProgressIndicator() // Show loading indicator
                      : RedButton(action: onSubmit, text: "Login")
                ],
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Align(
              alignment: Alignment.center,
              child: TextButton(
                onPressed: () {},
                child: const Text(
                  "Forgot password",
                  style: TextStyle(
                      color: Colors.black,
                      fontSize: 18,
                      fontWeight: FontWeight.w600),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
