/**
 * Format a number/string as AED currency, mirroring yabala-fe's formatToAED.
 * e.g. formatCurrency(12.5) => "12.50 AED"
 */
export const formatCurrency = (value: string | number): string => {
  const number = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(number)) return '0.00 AED';
  return `${number.toFixed(2)} AED`;
};

/**
 * Compact number formatting for large counts, e.g. 1200 => "1.2k".
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(value);
};
