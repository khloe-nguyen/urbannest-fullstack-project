class TripCount {
  int checkoutCount;
  int stayInCount;
  int upcomingCount;
  int pendingCount;
  int historyCount;

  TripCount({
    required this.checkoutCount,
    required this.stayInCount,
    required this.upcomingCount,
    required this.pendingCount,
    required this.historyCount,
  });

  factory TripCount.fromJson(Map<String, dynamic> json) => TripCount(
        checkoutCount: json["checkoutCount"],
        stayInCount: json["stayInCount"],
        upcomingCount: json["upcomingCount"],
        pendingCount: json["pendingCount"],
        historyCount: json["historyCount"],
      );

  Map<String, dynamic> toJson() => {
        "checkoutCount": checkoutCount,
        "stayInCount": stayInCount,
        "upcomingCount": upcomingCount,
        "pendingCount": pendingCount,
        "historyCount": historyCount,
      };
}
