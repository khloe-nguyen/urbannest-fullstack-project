class ChangePasswordRequest {
  String currentPassword;
  String newPassword;
  String confirmPassword;

  ChangePasswordRequest(
      {required this.currentPassword,
      required this.newPassword,
      required this.confirmPassword});

  Map<String, dynamic> toJson() {
    return {
      "currentPassword": currentPassword,
      "newPassword": newPassword,
      "confirmPassword": confirmPassword
    };
  }
}
