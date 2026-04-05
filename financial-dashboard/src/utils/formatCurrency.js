export const formatCurrency = (amount) => {
  const safe = isNaN(amount) || amount == null ? 0 : amount;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(safe);
};
