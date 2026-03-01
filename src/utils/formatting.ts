const formatCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  if (!formatCache.has(currency)) {
    formatCache.set(
      currency,
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  }
  return formatCache.get(currency)!;
}

export function getCurrencySymbol(currencyCode: string): string {
  try {
    return (
      getFormatter(currencyCode)
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? currencyCode
    );
  } catch {
    return currencyCode;
  }
}

export function formatCurrency(amount: number, currency: string): string {
  return getFormatter(currency).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
