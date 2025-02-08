String formatDateRange(String startDate, String endDate) {
  // Parse the input date strings into DateTime objects
  final start = DateTime.parse(startDate);
  final end = DateTime.parse(endDate);

  // Define an array for month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  String formatDate(DateTime date) {
    final month = months[date.month - 1]; // Adjust for zero-based index
    final day = date.day;
    return '$month $day';
  }

  if (start.month == end.month && start.year == end.year) {
    return '${formatDate(start)} – ${end.day} - ${start.year}';
  }

  if (start.month != end.month && start.year == end.year) {
    return '${formatDate(start)} – ${formatDate(end)} ${start.year}';
  }

  return '${formatDate(start)}/${start.year} – ${formatDate(end)}/${end.year}';
}