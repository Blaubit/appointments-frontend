const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    currencyDisplay: "symbol", // fuerza a usar "Q"
    minimumFractionDigits: 2, // asegura 2 decimales
    maximumFractionDigits: 2,
  }).format(amount);
};

export default formatCurrency;
