import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/authentication/api/authentication_api.dart';
import 'package:project4_flutter/features/authentication/widget/register_modal_bottom.dart';
import 'package:project4_flutter/shared/widgets/custom_input_form.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';

import '../../../shared/bloc/user_cubit/user_cubit.dart';
import '../../profile/profile.dart';

var format = DateFormat('yyyy-MM-dd');

class UserRegister extends StatefulWidget {
  const UserRegister(this.email, {super.key, required this.isGoogle});

  final String? email;
  final bool isGoogle;

  @override
  State<UserRegister> createState() => _UserRegisterState();
}

class _UserRegisterState extends State<UserRegister> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _dateBirthController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  final authenticationApi = AuthenticationApi();

  String? validateFirstName(String? value) {
    if (value == null || value.isEmpty) {
      return "First name cannot be empty";
    }

    return null;
  }

  String? validateLastName(String? value) {
    if (value == null || value.isEmpty) {
      return "First name cannot be empty";
    }

    return null;
  }

  String? validateDateBirth(String? value) {
    if (value == null || value.isEmpty) {
      return "Date of birth cannot be empty";
    }
    final mili18Years = DateTime.now().millisecondsSinceEpoch - 567648000000;

    final birthDay = format.parse(value).millisecondsSinceEpoch;

    if (birthDay > mili18Years) {
      return "You need to be at least 18 to join this community";
    }
    return null;
  }

  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return "Password cannot be empty";
    }

    if (value.length < 6) {
      return "Password length cannot be smaller than 6 characters";
    }

    return null;
  }

  void pickDateOfBirth() async {
    if (mounted) {
      final DateTime? birthday = await showDatePicker(
          context: context,
          firstDate: DateTime(1900),
          lastDate: DateTime.now());

      if (birthday != null) {
        _dateBirthController.text = format.format(birthday);
      }
    }
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    _lastNameController.dispose();
    _firstNameController.dispose();
    _dateBirthController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _emailController.text = widget.email!;
  }

  void onSubmit() async {
    if (_formKey.currentState!.validate()) {
      if (widget.isGoogle == false) {
        var customResult = await authenticationApi.createAuthenticationRequest(
            {'email': _emailController.text.toString()});

        if (customResult.status == 200) {
          if (mounted) {
            showModalBottomSheet(
              context: context,
              builder: (context) {
                return RegisterModalBottom(
                    email: _emailController.text,
                    password: _passwordController.text,
                    dateOfBirth: _dateBirthController.text,
                    firstName: _firstNameController.text,
                    lastName: _lastNameController.text);
              },
            );
          }
        }
      } else {
        final body = <String, String>{};

        body['email'] = _emailController.text;
        body['password'] = _passwordController.text;
        body['dob'] = _dateBirthController.text;
        body['firstName'] = _firstNameController.text;
        body['lastName'] = _lastNameController.text;

        var customResult = await authenticationApi.registerByGoogle(body);

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
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        forceMaterialTransparency: true,
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
          icon: const Icon(Icons.arrow_back),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Finish signing up",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 22,
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                const Text(
                  "Legal name",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Color.fromARGB(200, 0, 0, 0),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                CustomInputForm(
                  inputController: _firstNameController,
                  validation: validateFirstName,
                  labelText: "First name on ID",
                  isPassword: false,
                ),
                const SizedBox(
                  height: 5,
                ),
                CustomInputForm(
                  inputController: _lastNameController,
                  validation: validateLastName,
                  labelText: "Last name on ID",
                  isPassword: false,
                ),
                const SizedBox(
                  height: 5,
                ),
                const Text(
                  "Make sure this matches the name on your government ID.",
                ),
                const SizedBox(
                  height: 20,
                ),
                const Text(
                  "Date of birth",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Color.fromARGB(200, 0, 0, 0),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                CustomInputForm(
                  inputController: _dateBirthController,
                  validation: validateDateBirth,
                  labelText: "Birthday",
                  isPassword: false,
                  isReadOnly: true,
                  opTap: pickDateOfBirth,
                ),
                const SizedBox(
                  height: 5,
                ),
                const Text(
                  "To sign up, you need to be at least 18. Other people who use UrbanNest won't see your birthday.",
                ),
                const SizedBox(
                  height: 20,
                ),
                const Text(
                  "Email",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Color.fromARGB(200, 0, 0, 0),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                CustomInputForm(
                  inputController: _emailController,
                  validation: (value) => null,
                  labelText: "Email",
                  isPassword: false,
                  isReadOnly: true,
                ),
                const SizedBox(
                  height: 5,
                ),
                const Text(
                  "We'll email you a reservation confirmation.",
                ),
                const SizedBox(
                  height: 20,
                ),
                const Text(
                  "Password",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Color.fromARGB(200, 0, 0, 0),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                CustomInputForm(
                  inputController: _passwordController,
                  validation: validatePassword,
                  labelText: "Password",
                  isPassword: true,
                ),
                const SizedBox(
                  height: 5,
                ),
                RichText(
                  text: const TextSpan(
                    style: TextStyle(color: Colors.black, height: 1.3),
                    children: [
                      TextSpan(text: "By selecting "),
                      TextSpan(
                          text: "Agree and continue",
                          style:
                              TextStyle(decoration: TextDecoration.underline)),
                      TextSpan(text: ", I agree to UrbanNest's "),
                      TextSpan(
                          text: "Terms of Service, Payments Terms of Service",
                          style:
                              TextStyle(decoration: TextDecoration.underline)),
                      TextSpan(text: " and "),
                      TextSpan(
                          text: "Nondiscrimination Policy,",
                          style:
                              TextStyle(decoration: TextDecoration.underline)),
                      TextSpan(text: "and acknowledge the "),
                      TextSpan(
                          text: "Privacy Policy",
                          style:
                              TextStyle(decoration: TextDecoration.underline))
                    ],
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                RedButton(
                  action: onSubmit,
                  text: "Agree and continue",
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
