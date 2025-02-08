import 'package:flutter/material.dart';

class CreditCardUI extends StatelessWidget {
  final String cardNumber;
  final String cardHolderName;
  final String expirationMonth;
  final String expirationYear;
  final String cvcNumber;

  const CreditCardUI({
    Key? key,
    required this.cardNumber,
    required this.cardHolderName,
    required this.expirationMonth,
    required this.expirationYear,
    required this.cvcNumber,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Ensuring the card number is at least 16 characters long
    String formattedCardNumber = cardNumber.length >= 16
        ? cardNumber.replaceRange(4, 12, ' **** **** ****')
        : '**** **** **** 1234';

    return Center(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          border: Border.all(
            color: Colors.white,

          ),
        ),

        child: Card(
          elevation: 1.0,
          shape: RoundedRectangleBorder(

            borderRadius: BorderRadius.circular(8.0),
          ),
          color: Colors.black54,
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(

              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: const [
                    Icon(
                      Icons.credit_card,
                      color: Colors.white,
                      size: 30.0,
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Card number
                Text(
                  formattedCardNumber,
                  style: const TextStyle(
                    fontSize: 22.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),

                // Cardholder name
                Text(
                  cardHolderName.isNotEmpty ? cardHolderName : 'Name',
                  style: const TextStyle(
                    fontSize: 18.0,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 20),

                // Expiration date and CVC
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      expirationMonth.isNotEmpty && expirationYear.isNotEmpty
                          ? 'EXP: $expirationMonth/$expirationYear'
                          : 'EXP',
                      style: const TextStyle(
                        fontSize: 16.0,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      cvcNumber.isNotEmpty ? 'CVC: $cvcNumber' : 'CVC ',
                      style: const TextStyle(
                        fontSize: 16.0,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

