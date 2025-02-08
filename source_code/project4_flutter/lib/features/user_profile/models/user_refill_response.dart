class UserRefillResponse{
  List<String> message;
  bool isComplete;
  int progress;

  UserRefillResponse({required this.message,required this.isComplete,required this.progress});

  factory UserRefillResponse.fromJson(Map<String,dynamic> json){

    var messageList = json['data']['message'];
    print(json);
    print(json['data']['message']);
    print(json['data']['complete']);
    print(json['data']['progress']);


      return UserRefillResponse(
        message: List<String>.from(messageList.map((item) => item.toString())),
        isComplete: json['data']['complete'],
        progress: json['data']['progress'],
      );

  }
}