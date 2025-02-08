export const formatDate = (createdAt, withYear = true) => {
  const date = new Date(createdAt);
  let options = { month: "long", day: "numeric", year: "numeric" };

  if (withYear == false) {
    options = { month: "long", day: "numeric" };
  }

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};
