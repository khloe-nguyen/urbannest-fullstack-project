// import 'package:flutter/material.dart';
//
// class PaymentForm extends StatefulWidget {
//   final Function(String, String, String) onCardDetailsSaved;
//
//   PaymentForm({required this.onCardDetailsSaved});
//
//   @override
//   _PaymentFormState createState() => _PaymentFormState();
// }
//
// class _PaymentFormState extends State<PaymentForm> {
//   final TextEditingController cardNumberController = TextEditingController();
//   final TextEditingController expirationController = TextEditingController();
//   final TextEditingController cvvController = TextEditingController();
//
//   String? cardNumberError;
//   String? expirationError;
//   String? cvvError;
//
//   // Hàm xử lý khi người dùng nhập số thẻ
//   void handleCardNumberChange(String value) {
//     setState(() {
//       cardNumberError = null;
//     });
//
//     if (value.length == 16) {
//       widget.onCardDetailsSaved(value, expirationController.text, cvvController.text);
//     }
//   }
//
//   // Hàm kiểm tra CVV
//   void handleCvvChange(String value) {
//     if (value.length == 3) {
//       setState(() {
//         cvvError = null;
//       });
//     } else {
//       setState(() {
//         cvvError = "CVV must be 3 digits.";
//       });
//     }
//   }
//
//   // Hàm xử lý ngày hết hạn
//   void handleExpirationChange(String value) {
//     if (value.length == 5 && value[2] == '/') {
//       setState(() {
//         expirationError = null;
//       });
//     } else {
//       setState(() {
//         expirationError = "Expiration must be in MM/YY format.";
//       });
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         // Input Card Number
//         TextField(
//           controller: cardNumberController,
//           decoration: InputDecoration(
//             labelText: "Card number (e.g., 4111 1111 1111 1111)",
//             errorText: cardNumberError,
//             border: OutlineInputBorder(),
//           ),
//           onChanged: handleCardNumberChange,
//         ),
//         SizedBox(height: 10),
//
//         // Input Expiration Date
//         TextField(
//           controller: expirationController,
//           decoration: InputDecoration(
//             labelText: "MM/YY (e.g., 04/26)",
//             errorText: expirationError,
//             border: OutlineInputBorder(),
//           ),
//           onChanged: handleExpirationChange,
//         ),
//         SizedBox(height: 10),
//
//         // Input CVV
//         TextField(
//           controller: cvvController,
//           decoration: InputDecoration(
//             labelText: "CVV (3 digits)",
//             errorText: cvvError,
//             border: OutlineInputBorder(),
//           ),
//           onChanged: handleCvvChange,
//           maxLength: 3,
//         ),
//         SizedBox(height: 20),
//
//         // Save Button
//         ElevatedButton(
//           onPressed: () {
//             if (cardNumberController.text.length == 16 &&
//                 expirationController.text.length == 5 &&
//                 cvvController.text.length == 3) {
//               widget.onCardDetailsSaved(
//                 cardNumberController.text,
//                 expirationController.text,
//                 cvvController.text,
//               );
//               Navigator.pop(context); // Đóng modal sau khi lưu thông tin
//             } else {
//               // Hiển thị thông báo lỗi nếu thông tin không hợp lệ
//               setState(() {
//                 if (cardNumberController.text.length != 16) {
//                   cardNumberError = "Card number must have 16 digits.";
//                 }
//                 if (expirationController.text.length != 5 || expirationController.text[2] != '/') {
//                   expirationError = "Expiration must be in MM/YY format.";
//                 }
//                 if (cvvController.text.length != 3) {
//                   cvvError = "CVV must be 3 digits.";
//                 }
//               });
//             }
//           },
//           child: Text('Save Transaction'),
//         ),
//       ],
//     );
//   }
// }
//
// class TransactionModal extends StatelessWidget {
//   final Function(String cardNumber, String expiration, String cvv) onTransactionSaved;
//
//   TransactionModal({required this.onTransactionSaved});
//
//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.all(20.0),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Text('Enter Payment Information', style: Theme.of(context).textTheme.headlineSmall),
//           SizedBox(height: 20),
//           PaymentForm(onCardDetailsSaved: onTransactionSaved),
//         ],
//       ),
//     );
//   }
// }
