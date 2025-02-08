class PreferredNameRequest{
  String preferredName;


  PreferredNameRequest({required this.preferredName});

  Map<String,dynamic> toJson(){
    return {
      "preferredName" : preferredName
    };
  }
}