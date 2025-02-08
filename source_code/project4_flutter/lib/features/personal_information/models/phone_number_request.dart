class PhoneNumberRequest{
  String phoneNumber;
  PhoneNumberRequest({required this.phoneNumber});

  Map<String,dynamic> toJson(){
    return {
      "phoneNumber": phoneNumber
    };
  }
}