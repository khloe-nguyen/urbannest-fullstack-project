import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

Widget formatDate(DateTime date) {
  final DateFormat dateFormat = DateFormat('dd/MM/yyyy');
    return Text(
      '${dateFormat.format(date)}  ',
      style: const TextStyle(fontSize: 16, color: Colors.black),
    );

}
