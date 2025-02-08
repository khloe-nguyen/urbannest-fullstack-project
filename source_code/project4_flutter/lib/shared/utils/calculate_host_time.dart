Map<String, int> calculateHostTime(DateTime createdAt) {
  final nowTime = DateTime.now();
  int years = nowTime.year - createdAt.year;
  int months = (nowTime.month - createdAt.month) + (years * 12);
  if (nowTime.month < createdAt.month ||
      (nowTime.month == createdAt.month && nowTime.day < createdAt.day)) {
    years -= 1;
    months -= 12;
  }
  Duration timeDifference = nowTime.difference(createdAt);
  int days = timeDifference.inDays % 30;
  int hours = timeDifference.inHours % 24;
  int minutes = timeDifference.inMinutes % 60;

  return {
    'years': years,
    'months': months,
    'days': days,
    'hours': hours,
    'minutes': minutes,
  };
}
