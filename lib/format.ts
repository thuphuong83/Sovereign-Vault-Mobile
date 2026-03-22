/**
 * Currency & number formatting utilities for Sovereign Vault
 */

export function formatCurrency(
  value: number,
  currency = 'VND',
  locale = 'vi-VN'
): string {
  if (currency === 'VND') {
    // Custom VND with ₫ prefix, no decimals
    return `₫${Math.round(value).toLocaleString('vi-VN')}`;
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}
