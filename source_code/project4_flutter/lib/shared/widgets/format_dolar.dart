import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

Widget formatPrice(double basePrice) {
  String formattedPrice = NumberFormat.currency(symbol: "\$").format(basePrice);

  return Row(
    children: [
      Text(
        formattedPrice,
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold,color: Colors.black),
      ),
      const Text(
        "/night",
        style: TextStyle(
          fontSize: 18,
          color: Colors.black
        ),
      )
    ],
  );
}
