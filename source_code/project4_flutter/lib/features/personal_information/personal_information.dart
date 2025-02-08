import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/personal_information/widgets/FormInput.dart';
import 'package:project4_flutter/features/personal_information/widgets/phone_number.dart';
import 'package:project4_flutter/features/personal_information/widgets/preferred_name.dart';
import 'package:project4_flutter/shared/api/api_service.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';

class PersonalInformation extends StatefulWidget {
  const PersonalInformation({super.key});

  @override
  State<PersonalInformation> createState() => _PersonalInformationState();
}

class _PersonalInformationState extends State<PersonalInformation> {
  ApiService apiService = ApiService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Personal Information"),
      ),
      body: SingleChildScrollView(
        child: BlocBuilder<UserCubit, UserState>(
          builder: (context, state) {
            var user = context.read<UserCubit>().loginUser;
            return const Column(
              children: [
                Row(
                  children: [Forminput()],
                ),
                Row(
                  children: [PreferredName()],
                ),
                Row(
                  children: [PhoneNumber()],
                )
              ],
            );
          },
        ),
      ),
    );
  }
}
