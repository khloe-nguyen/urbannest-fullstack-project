function getWords(str, n) {
  // Split the string into an array of words
  const words = str.split(" ");

  // If the number of words is less than or equal to n, return the string as is
  if (words.length <= n) {
    return str;
  }

  // Otherwise, return the first n words joined with spaces and add "..."
  return words.slice(0, n).join(" ") + "...";
}

export default getWords;
