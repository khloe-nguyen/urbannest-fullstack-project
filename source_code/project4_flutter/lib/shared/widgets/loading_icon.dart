import 'package:flutter/material.dart';
import 'package:loading_indicator/loading_indicator.dart';

class LoadingIcon extends StatelessWidget {
  const LoadingIcon({super.key, required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: size,
        child: const LoadingIndicator(
          indicatorType: Indicator.ballPulseSync,
          colors: [Colors.black],
          strokeWidth: 2,
        ),
      ),
    );
  }
}
