import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:project4_flutter/features/property_calendar/widgets/host_booking_detail.dart';
import 'package:project4_flutter/features/qr_scanner/bloc/qr_scanner_cubit.dart';
import 'package:project4_flutter/shared/bloc/booking_qr_cubit/booking_qr_cubit.dart';
import 'package:project4_flutter/shared/bloc/booking_qr_cubit/booking_qr_state.dart';
import 'package:project4_flutter/shared/widgets/bold_text.dart';
import 'package:project4_flutter/shared/widgets/loading_icon.dart';
import 'package:project4_flutter/shared/widgets/normal_text.dart';

class BookingQrScan extends StatefulWidget {
  const BookingQrScan({super.key});

  @override
  State<BookingQrScan> createState() => _BookingQrScanState();
}

class _BookingQrScanState extends State<BookingQrScan> {
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

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<BookingQrCubit, BookingQrState>(
      builder: (context, state) {
        return MobileScanner(
          controller: _controller,
          onDetect: (capture) {
            final List<Barcode> barcodes = capture.barcodes;

            if (barcodes.first.rawValue != null) {
              context
                  .read<BookingQrCubit>()
                  .getBookingQr(barcodes.first.rawValue!);
            }
          },
        );
      },
      listener: (context, state) {
        if (state is BookingQrSuccess) {
          var booking = state.booking;

          Navigator.push(context, MaterialPageRoute(
            builder: (context) {
              return HostBookingDetail(booking: booking);
            },
          )).then((_) => _controller.start());
        }

        if (state is BookingQrError) {
          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title:
                    const NormalText(text: "Booking not found", fontSize: 20),
                actions: <Widget>[
                  TextButton(
                    onPressed: () => Navigator.pop(context, 'OK'),
                    child: const Text('OK'),
                  ),
                ],
              );
            },
          ).then((_) => _controller.start());
        }
      },
    );
  }
}
