class ReservationCount {
  int pending;
  int denied;
  int cancel;

  ReservationCount({
    required this.pending,
    required this.denied,
    required this.cancel,
  });

  factory ReservationCount.fromJson(Map<String, dynamic> json) =>
      ReservationCount(
        pending: json["pending"],
        denied: json["denied"],
        cancel: json["cancel"],
      );

  Map<String, dynamic> toJson() => {
        "pending": pending,
        "denied": denied,
        "cancel": cancel,
      };
}
