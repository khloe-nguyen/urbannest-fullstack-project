import 'dart:typed_data';

import 'package:camera/camera.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:project4_flutter/features/qr_scanner/bloc/qr_scanner_cubit.dart';
import 'package:project4_flutter/features/qr_scanner/widgets/qr_code_check.dart';
import 'package:project4_flutter/shared/utils/token_storage.dart';
import 'package:project4_flutter/shared/widgets/normal_text.dart';

import '../../main.dart';

class QrScanner extends StatefulWidget {
  const QrScanner({super.key});

  @override
  State<QrScanner> createState() => _QrScannerState();
}

class _QrScannerState extends State<QrScanner> {
  late final MobileScannerController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
        MobileScannerController(detectionSpeed: DetectionSpeed.noDuplicates);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  TokenStorage tokenStorage = TokenStorage();

  void readData(String barcode) {
    try {
      databaseRef.child(barcode).once().then((DatabaseEvent event) {
        final data = event.snapshot.value as Map<dynamic, dynamic>;

        if (data.isNotEmpty) {
          if (mounted) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => BlocProvider(
                  create: (_) => QrScannerCubit(),
                  child: QrCodeCheck(barcode),
                ),
              ),
            ).then((_) {
              if (mounted) {
                Navigator.pop(context);
              }
            });
          }
        }
      });
    } catch (ex) {
      print(ex.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return MobileScanner(
      controller: _controller,
      onDetect: (capture) {
        final List<Barcode> barcodes = capture.barcodes;
        final Uint8List? image = capture.image;
        if (barcodes.first.rawValue != null) {
          readData(barcodes.first.rawValue!);
        }
      },
    );
  }
}
