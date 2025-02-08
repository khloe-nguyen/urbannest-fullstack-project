class OtpConfirmRequest {
  String Otp;

  OtpConfirmRequest({required this.Otp});

  Map<String, dynamic> toJson() {
    return {"Otp": Otp};
  }
}
