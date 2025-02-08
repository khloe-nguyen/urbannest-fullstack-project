import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:image_picker/image_picker.dart';
import 'package:project4_flutter/features/personal_information/service/personal_information_service.dart';
import 'package:project4_flutter/features/user_profile/models/avatar_option_request.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/models/user.dart';

class UserAvatar extends StatefulWidget {
  const UserAvatar({super.key});

  @override
  State<UserAvatar> createState() => _UserAvatarState();
}

class _UserAvatarState extends State<UserAvatar> {
  XFile? _image;
  PersonalInformationService _personalInformationService =
      PersonalInformationService();

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    setState(() {
      _image = image;
    });
  }

  void putUploadAvatar(String avatarOptionId) async {
    try {
      await _pickImage();
      AvatarOptionRequest request = AvatarOptionRequest(
          avatarFileImageUri: _image!.path, avatarOption: avatarOptionId);
      await _personalInformationService.putAvatarImage(request);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Upload avatar successfully")),
      );
      await context.read<UserCubit>().initializeUser();
      setState(() {});
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to upload avatar: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    var user = context.read<UserCubit>().loginUser;
    final screenWidth = MediaQuery.of(context).size.width;
    return Container(
      margin: EdgeInsets.only(top: 20, left: 16, right: 16, bottom: 16),
      // color: Colors.white,
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
        mainAxisSize: MainAxisSize.min,
        children: [
          ClipOval(
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.white, // Màu sắc viền
                  width: 1, // Độ dày viền
                ),
              ),
              child: Image.network(
                user!.avatar != null || user.avatar!.isNotEmpty
                    ? "${user.avatar}"
                    : "https://th.bing.com/th/id/OIP.xv5ky4lYh1TkiIZW6wwYJAAAAA?w=140&h=150&c=7&r=0&o=5&pid=1.7",
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
          ),
          ElevatedButton(
              onPressed: () {
                putUploadAvatar("1");
              },
              child: Row(
                mainAxisSize:
                    MainAxisSize.min, // Đặt độ rộng của Row theo nội dung
                mainAxisAlignment: MainAxisAlignment.center,
                children: [Text("Add")],
              )),
          Text(
            "${user.firstName} ${user.lastName}",
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 24,
                fontFamily: 'Roboto',
                fontStyle: FontStyle.italic),
          )
        ],
      ),
    );
  }
}
