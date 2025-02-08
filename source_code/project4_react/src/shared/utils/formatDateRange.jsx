export default function formatDateRange(startDate, endDate) {
  // Parse the input date strings into Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Define arrays for month names and day names
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

  function formatDate(date) {
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  }

  if (start.getMonth() === end.getMonth() && start.getFullYear() == end.getFullYear()) {
    return `${formatDate(start)} – ${end.getDate()} - ${start.getFullYear()}`;
  }

  if (start.getMonth() != end.getMonth() && start.getFullYear() == end.getFullYear()) {
    return `${formatDate(start)} – ${formatDate(end)} ${start.getFullYear()}`;
  }

  return `${formatDate(start)}/${start.getFullYear()} – ${formatDate(end)}/${end.getFullYear()}`;
}
