import type { SchoolFees } from '../types/school';

function formatIndianNumber(value: string): string {
  const numeric = value.replace(/[^0-9]/g, '');
  if (!numeric) return '';
  return Number(numeric).toLocaleString('en-IN');
}

/**
 * Card-only annual fee presentation.
 * Only a fee explicitly stored as an annual billing frequency is shown as an annual amount.
 * Monthly/quarterly values are deliberately not converted here.
 */
export function getCardAnnualFeeDisplay(slug: string, fees: SchoolFees): string {
  void slug;
  if (
    fees.billingFrequency === 'annual' &&
    typeof fees.cardFee === 'number' &&
    Number.isFinite(fees.cardFee)
  ) {
    return `₹${formatIndianNumber(String(fees.cardFee))}`;
  }

  const annual = typeof fees.tuitionAnnual === 'string' ? fees.tuitionAnnual.trim() : '';
  if (
    annual &&
    /\/\s*year|per\s+year|annual|per\s+annum|yearly/i.test(annual) &&
    !/calculated/i.test(annual)
  ) {
    const token = annual.match(/₹?\s*([\d,]+)(?:\+)??/);
    if (token) return `₹${formatIndianNumber(token[1])}`;
  }

  return fees.disclosed === false ? 'Contact school for current fee details' : 'Fee details available';
}
