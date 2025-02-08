export default function formatDollar(amount) {
  amount = parseFloat(amount).toFixed(2);

  let parts = amount.split(".");
  let wholePart = parts[0];
  let fractionalPart = parts[1];

  wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${wholePart}.${fractionalPart}`;
}
