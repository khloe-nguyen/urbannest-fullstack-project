import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/models/booking.dart';
import 'package:project4_flutter/features/property_detail/models/transaction.dart';
import 'package:project4_flutter/features/property_detail/widgets/credit_card_ui.dart';
import 'package:project4_flutter/features/property_detail/widgets/show_popup_transaction.dart';
import 'package:project4_flutter/features/travel/travel.dart';
import 'package:project4_flutter/home_screen.dart';
import 'package:project4_flutter/shared/bloc/booking/date_booking.dart';
import 'package:project4_flutter/shared/bloc/booking/transaction.dart';

class TransactionModal extends StatefulWidget {
  final Booking booking;

  const TransactionModal({Key? key, required this.booking}) : super(key: key);

  @override
  State<TransactionModal> createState() => _TransactionState();
}

class _TransactionState extends State<TransactionModal> {
  late Booking booking;
  bool isValidate = false;
  bool awaitTransaction = false;
  bool loading = false;
  TextEditingController cardNumberController = TextEditingController();
  TextEditingController cardHolderNameController = TextEditingController();
  TextEditingController expirationMonthController = TextEditingController();
  TextEditingController expirationYearController = TextEditingController();
  TextEditingController cvcController = TextEditingController();
  String errorMessage = '';
  @override
  void initState() {
    super.initState();
    booking = widget.booking;

  }

  bool _validateFields() {
    final now = DateTime.now();
    final currentYear = now.year;
    final currentMonth = now.month;
    if (cardNumberController.text.length != 16 ||
        int.tryParse(cardNumberController.text) == null) {
      errorMessage = 'Invalid card number';
      return false;
    }
    if (cardHolderNameController.text.isEmpty) {
      errorMessage = "Name must not be empty";
      return false;
    }
    final expYear = int.tryParse(expirationYearController.text) ?? 0;
    final expMonth = int.tryParse(expirationMonthController.text) ?? 0;

    if (expMonth < 1 ||
        expMonth > 12 ||
        expYear > 2100 ||
        expYear < currentYear ||
        (expYear == currentYear && expMonth < currentMonth)) {
      errorMessage = "Invalid expiry date";
      return false;
    }
    if (cvcController.text.isEmpty) {
      errorMessage = "CVC must not be empty";
      return false;
    }
    return true;
  }

  void _handleSubmit() {
    if (_validateFields()) {
      setState(() {
        errorMessage = '';
        awaitTransaction = true;
        isValidate = true;
      });
      createTransaction(context);
    } else {
      setState(() {
        isValidate = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // sua code
        context.read<DateBookingCubit>().updateDates(null, null);
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const HomeScreen()),
              (route) => false,
        );
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Add card information'),
        ),
        backgroundColor: Colors.black,
        body: BlocBuilder<TransactionCubit, TransactionState>(
          builder: (context, state) {

            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(26),
                child: Column(
                  children: [
                    CreditCardUI(
                      cardHolderName: cardHolderNameController.text,
                      cardNumber: cardNumberController.text,
                      cvcNumber: cvcController.text,
                      expirationMonth: expirationMonthController.text,
                      expirationYear: expirationYearController.text != ""
                          ? (int.parse(expirationYearController.text) % 100)
                          .toString()
                          : "",
                    ),
                    if (!isValidate)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Text(
                          errorMessage,
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    const SizedBox(height: 20),
                    Column(
                      children: [
                        TextFormField(
                          controller: cardNumberController,
                          decoration: const InputDecoration(
                            icon: Icon(Icons.credit_card_sharp,
                                color: Colors.white),
                            hintText: '4XXX XXXX XXXX XXXX',
                            labelText: 'Card number',
                            labelStyle: const TextStyle(
                              color: Colors.white70,
                            ),
                            focusedBorder: const UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(16),
                          ],
                          style: const TextStyle(
                            color: Colors.white,
                          ),
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        TextFormField(
                          controller: cardHolderNameController,
                          decoration: const InputDecoration(
                            icon: Icon(Icons.person, color: Colors.white),
                            labelText: 'Cardholder name',
                            labelStyle: const TextStyle(
                              color: Colors.white70,
                            ),
                            focusedBorder: const UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          inputFormatters: [
                            LengthLimitingTextInputFormatter(20),
                          ],
                          style: const TextStyle(
                            color: Colors.white,
                          ),
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        TextFormField(
                          controller: expirationMonthController,
                          decoration: const InputDecoration(
                            icon:
                            Icon(Icons.calendar_today, color: Colors.white),
                            labelText: 'Expiration Month',
                            labelStyle: const TextStyle(
                              color: Colors.white70,
                            ),
                            focusedBorder: const UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          //sua code
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(2),
                            TextInputFormatter.withFunction((oldValue, newValue) {
                              if (newValue.text.isNotEmpty && int.tryParse(newValue.text) != null) {
                                int value = int.parse(newValue.text);
                                if (value > 12) {
                                  return oldValue;
                                }
                              }
                              return newValue;
                            }),
                          ],

                          style: const TextStyle(
                            color: Colors.white,
                          ),
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        TextFormField(
                          controller: expirationYearController,
                          decoration: const InputDecoration(
                            icon:
                            Icon(Icons.calendar_today, color: Colors.white),
                            labelText: 'Expiration Year',
                            labelStyle: const TextStyle(
                              color: Colors.white70,
                            ),
                            focusedBorder: const UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(4),
                          ],
                          style: const TextStyle(
                            color: Colors.white,
                          ),
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        TextFormField(
                          controller: cvcController,
                          decoration: InputDecoration(
                            icon: const Icon(Icons.lock, color: Colors.white),
                            labelText: 'CVC',
                            labelStyle: const TextStyle(
                              color: Colors.white70,
                            ),
                            focusedBorder: const UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),

                          style: const TextStyle(
                            color: Colors.white,
                          ),
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(4),
                          ],
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        const SizedBox(
                          height: 10,
                        )
                      ],
                    ),
                    SizedBox(
                      width: double.infinity, // Full width
                      height: 50,

                      child: ElevatedButton(
                        onPressed: _handleSubmit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(
                              0xFFFF0000), // Màu nền của nút (thay đổi nếu cần)
                          foregroundColor: Colors.white, // Màu chữ (red)
                          textStyle: const TextStyle(
                            fontWeight:
                            FontWeight.bold, // Tùy chọn: làm đậm chữ
                          ),
                        ),
                        child: awaitTransaction
                            ? const CircularProgressIndicator(
                            color: Colors.white)
                            : const Text('Submit'),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Future<void> createTransaction(BuildContext context) async {
    final transactionCubit = context.read<TransactionCubit>();

    final transaction = Transaction(
      bookingId: booking.id,
      amount: booking.amount,
    );

    final result = await transactionCubit.initTransactionProcess(transaction);

    if (!mounted) return;

    final state = context.read<TransactionCubit>().state;
    String message = "";

    if (state is TransactionFail) {
      message = state.message;
    }
    setState(() {
      awaitTransaction = false;
    });

    if (result) {
      showErrorDialogTransaction(
        context,
        "Transaction Successful!",
        "Success",
      );
    } else {
      showErrorDialogTransaction(context, message, "Error");
    }
  }
}
