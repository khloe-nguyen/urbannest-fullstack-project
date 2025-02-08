class Validator {
  static String? validateFirstName(String? value) {
    if (value == null || value.isEmpty) {
      return "First Name can't be blank";
    }
    if(value.length > 10){
      return "First Name can't too long";
    }
    return null;
  }

  static String? validateLastName(String? value) {
    if (value == null || value.isEmpty) {
      return "Last Name can't be blank";
    }
    if(value.length > 10){
      return "Last Name can't too long";
    }
    return null;
  }

  static String? validatePreferredName(String? value){
    if(value == null || value.isEmpty){
      return "Preferred Name can't be blank";
    }
    if(value.length > 10){
      return "Preferred Name can't too long";
    }
    return null;
  }

  static String? validatePhoneNumber(String? value){
    if(value == null || value.isEmpty){
      return "Phone number cannot be empty";
    }
    if(value.length > 10){
      return "Phone number cannot too long";
    }
    return null;
  }

  static String? validatePassword(String? value, String message){
    if(value == null || value.isEmpty){
      return "$message cannot be empty";
    }
    if(value.length > 10){
      return "$message cannot too long";
    }
    return null;
  }
}
