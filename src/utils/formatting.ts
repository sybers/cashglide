export function getCurrencySymbol(currencyCode: string): string {
  try {
    return (
      new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? currencyCode
    );
  } catch {
    return currencyCode;
  }
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
