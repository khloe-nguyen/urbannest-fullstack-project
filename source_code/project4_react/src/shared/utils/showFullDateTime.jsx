export const showDate = (datetime) => {
  const totalMsADay = 86400000;

  const date = new Date(datetime);
  const now = new Date();
  const diff = date - now;

  if (diff <= totalMsADay && date.getDate() == now.getDate()) {
    return `${date.getHours()} : ${date.getMinutes()}`;
  }

  if (date.getFullYear() != now.getFullYear()) {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()} : ${date.getMinutes()}`;
  }

  return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()} : ${date.getMinutes()}`;
};
