function calculatePercentDifference(price1, price2) {
  let difference = Math.abs(price1 - price2);

  let percentageDifference = (difference / price1) * 100;

  percentageDifference = Math.round(percentageDifference);

  return percentageDifference;
}

export default calculatePercentDifference;
