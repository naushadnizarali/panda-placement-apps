function FormatPrice({ value }) {
  return Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export default FormatPrice;
