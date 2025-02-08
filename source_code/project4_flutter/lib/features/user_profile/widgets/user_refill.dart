import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';
import 'package:project4_flutter/features/user_profile/models/user_refill_response.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';

class UserRefill extends StatefulWidget {
  const UserRefill({super.key});

  @override
  State<UserRefill> createState() => _UserRefillState();
}

class _UserRefillState extends State<UserRefill> {
  UserRefillResponse? userRefill;
  PersonalInformationService personalInformationService =
      PersonalInformationService();

  @override
  Widget build(BuildContext context) {
    var user = context.read<UserCubit>().loginUser;
    final screenWidth = MediaQuery.of(context).size.width;
    return Container(
      width: screenWidth / 1.2,
      decoration: BoxDecoration(
          color: Colors.white, // Specify the background color here
          border: Border.all(color: Colors.white, width: 2),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.white.withOpacity(0.2), // Màu bóng
              spreadRadius: 2, // Độ lan tỏa
              blurRadius: 5, // Độ mờ của bóng
              offset: Offset(0, 3), // Vị trí của bóng
            )
          ]),
      child: Column(
        children: [
          Text("${user!.firstName} ${user!.lastName}'s refilled information",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          FutureBuilder<UserRefillResponse>(
            future: personalInformationService.getUserRefill(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(
                    child:
                        CircularProgressIndicator()); // Hiển thị khi đang tải
              } else if (snapshot.hasError) {
                return Center(
                    child: Text('Error: ${snapshot.error}')); // Hiển thị lỗi
              } else if (snapshot.hasData) {
                final userRefill = snapshot.data!;
                return SizedBox(
                  height: 300,
                  child: ListView.builder(
                    itemCount: userRefill.message.length,
                    itemBuilder: (context, index) {
                      return ListTile(title: Text(userRefill.message[index]));
                    },
                  ),
                );
              } else {
                return Center(
                    child: Text('No data')); // Hiển thị nếu không có dữ liệu
              }
            },
          ),
          // TextButton(onPressed: () async {}, child: Text("Test"))
        ],
      ),
    );
  }
}
