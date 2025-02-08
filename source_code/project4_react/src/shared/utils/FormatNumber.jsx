export default function formatNumber(amount) {
  amount = parseFloat(amount).toFixed(2);

  let parts = amount.split(".");
  let wholePart = parts[0];

  wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${wholePart}`;
}
