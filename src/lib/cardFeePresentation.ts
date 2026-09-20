import type { SchoolFees } from '../types/school';

const CARD_FEE_OVERRIDES: Record<string, string> = {
  'delhi-world-public-school-kp-5': '₹2,04,464',
  'delhi-public-school-knowledge-park-5': '₹2,00,100',
  'the-shri-ram-universal-school': '₹1,58,400',
  'the-infinity-school': '₹1,84,000',
  'gd-goenka-international-school': 'Up to ₹3,95,800',
  'aster-public-school-kp5': '₹1,20,000+',
  'aster-public-school-sector-3': '₹1,00,000',
  'sarvottam-international-school': '₹1,57,068',
  'the-millennium-school-noida-extension': '₹1,28,000',
  'gagan-public-school-sector-4': '₹1,02,000',
  'the-khaitan-school-sector-40-noida': '₹1,90,000',
  'global-indian-international-school-noida': '₹2,40,000',
  'aspam-scottish-school-noida': '₹2,37,740',
  'ryan-international-school-noida-extension': '₹1,50,000+',
  'st-teresa-school-greater-noida-west': '₹1,40,500',
};

function clean(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*\(calculated[^)]*\)/gi, '')
    .trim();
}

function formatIndianNumber(value: string): string {
  const numeric = value.replace(/[^0-9]/g, '');
  if (!numeric) return '';
  return Number(numeric).toLocaleString('en-IN');
}

/**
 * Card-only annual fee presentation. It deliberately does not mutate or
 * normalize the underlying detailed fee structure used by school profiles.
 */
export function getCardAnnualFeeDisplay(slug: string, fees: SchoolFees): string {
  const override = CARD_FEE_OVERRIDES[slug];
  if (override) return override;

  const candidates = [
    typeof fees.annualDisplay === 'string' ? fees.annualDisplay : '',
    typeof fees.tuitionAnnual === 'string' ? fees.tuitionAnnual : '',
    typeof fees.rangeText === 'string' ? fees.rangeText : '',
  ]
    .map(clean)
    .filter(Boolean);

  for (const candidate of candidates) {
    const upTo = candidate.match(/up to\s+(₹?\s*[\d,]+(?:\+)?)\b/i);
    if (upTo) {
      const value = upTo[1].replace(/\s+/g, '');
      const number = value.match(/₹?([\d,]+)(\+)?/);
      return number ? `Up to ₹${formatIndianNumber(number[1])}${number[2] || ''}` : candidate;
    }

    const annualToken = candidate.match(/₹?\s*([\d,]+)(\+)?\s*(?:\/\s*(?:year|annum)|per\s+year|annual|yearly)?/i);
    if (annualToken) {
      const prefix = candidate.match(/^up to\s+/i) ? 'Up to ' : '';
      return `${prefix}₹${formatIndianNumber(annualToken[1])}${annualToken[2] || ''}`;
    }

    const range = candidate.match(/₹?\s*([\d,]+)\s*[–-]\s*₹?\s*([\d,]+)/);
    if (range) {
      return `₹${formatIndianNumber(range[2])}`;
    }
  }

  if (fees.billingFrequency === 'annual' && typeof fees.cardFee === 'number' && Number.isFinite(fees.cardFee)) {
    return `₹${fees.cardFee.toLocaleString('en-IN')}`;
  }

  return fees.disclosed === false ? 'Not publicly disclosed' : 'Fee details available';
}
