import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/features/profile/widgets/authorize_profile.dart';
import 'package:project4_flutter/features/qr_scanner/bloc/qr_scanner_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';
import 'package:project4_flutter/shared/widgets/bold_text.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';
import 'package:project4_flutter/shared/widgets/normal_text.dart';
import 'package:project4_flutter/shared/widgets/red_button.dart';

import '../../../main.dart';
import '../../../shared/bloc/user_cubit/user_state.dart';
import '../../../shared/models/user.dart';

class QrCodeCheck extends StatefulWidget {
  const QrCodeCheck(this.qrCode, {super.key});
  final String qrCode;

  @override
  State<QrCodeCheck> createState() => _QrCodeCheckState();
}

class _QrCodeCheckState extends State<QrCodeCheck> {
  final TokenStorage tokenStorage = TokenStorage();

  void addData(barcode) async {
    String? token = await context.read<QrScannerCubit>().createTokenByQrCode();

    if (token != null) {
      databaseRef.child(barcode).set({
        'token': token,
      }).then((_) {
        print('Data added successfully!');
        if (mounted) {
          // Navigator.of(context).pushAndRemoveUntil(
          //   MaterialPageRoute(builder: (context) => const AuthorizeProfile()),
          //   (route) => false, // Removes all previous routes
          // );
          Navigator.pop(context);
        }
      }).catchError((error) {
        print('Failed to add data: $error');
      });
    }
  }

  String readData(barcode) {
    databaseRef.child(barcode).once().then((DatabaseEvent event) {
      final Map<Object?, Object?> data =
          event.snapshot.value as Map<Object?, Object?>;

      return DateFormat.yMMMMEEEEd()
          .format(DateTime.parse(data['time'] as String));
    });
    return "rsfpdsrtd";
  }

  @override
  Widget build(BuildContext context) {
    final qrScannerState = context.watch<QrScannerCubit>().state;

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 0,
      ),
      body: BlocBuilder<UserCubit, UserState>(
        builder: (context, state) {
          User user = context.read<UserCubit>().loginUser!;

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.center,
                  child: AdvancedAvatar(
                    name: "room",
                    image: user.avatar != null
                        ? NetworkImage(
                            user.avatar!) // Assuming cardAvatar is a URL
                        : null,
                    size: 120,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 120),
                      child: Text(
                        overflow: TextOverflow.fade,
                        user.firstName[0],
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 30,
                ),
                const BoldText(
                    text: "Login to Urban Nest by QR code", fontSize: 20),
                const SizedBox(
                  height: 40,
                ),
                Row(
                  children: [
                    const SizedBox(
                      width: 100,
                      child: BoldText(text: "Email: ", fontSize: 18),
                    ),
                    NormalText(text: user.email, fontSize: 17)
                  ],
                ),
                const SizedBox(
                  height: 10,
                ),
                Row(
                  children: [
                    const SizedBox(
                      width: 100,
                      child: BoldText(text: "Full name: ", fontSize: 18),
                    ),
                    NormalText(
                        text: "${user.firstName} ${user.lastName}",
                        fontSize: 17)
                  ],
                ),
                const SizedBox(
                  height: 10,
                ),
                const Spacer(),
                qrScannerState is QrScannerLoading
                    ? const LoadingIcon(size: 50)
                    : RedButton(
                        action: () {
                          addData(widget.qrCode);
                        },
                        text: "Signup"),
              ],
            ),
          );
        },
      ),
    );
  }
}
