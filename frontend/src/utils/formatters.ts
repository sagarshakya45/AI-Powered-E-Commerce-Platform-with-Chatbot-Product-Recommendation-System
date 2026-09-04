const COUNTRY_CURRENCY: Record<string, string> = {
  US: 'USD', GB: 'GBP', IN: 'INR', CA: 'CAD', AU: 'AUD',
  DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', JP: 'JPY',
  CN: 'CNY', BR: 'BRL', MX: 'MXN', AE: 'AED', SA: 'SAR',
  NG: 'NGN', ZA: 'ZAR', RU: 'RUB', KR: 'KRW', SG: 'SGD',
};

export function detectCurrency(): string {
  try {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    const country = locale.split('-')[1]?.toUpperCase();
    return COUNTRY_CURRENCY[country || ''] || 'USD';
  } catch {
    return 'USD';
  }
}

export const formatCurrency = (amount: number): string => {
  const currency = detectCurrency();
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const calculateDiscountPercentage = (price: number, discountPrice?: number | null): number | null => {
  if (!discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
};
