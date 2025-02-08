import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

Widget formatDateRange(DateTime startDate, DateTime endDate) {
  final DateFormat dateFormat = DateFormat('dd MMM');

  if (startDate.month == endDate.month) {
    return Text(
      '${dateFormat.format(startDate).split(' ')[0]} - ${dateFormat.format(endDate.add(const Duration(days: 1)))}',
      style: const TextStyle(fontSize: 18 ,color: Colors.black),
    );
  } else {
    return Text(
      '${dateFormat.format(startDate)} - ${dateFormat.format(endDate)}',
      style: const TextStyle(fontSize: 18, color: Colors.black),
    );
  }
}
