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
  'indirapuram-public-school-crossings-republik': '₹1,20,000',
  'the-khaitan-school-sector-40-noida': '₹1,90,000',
  'global-indian-international-school-noida': '₹2,40,000',
  'aspam-scottish-school-noida': '₹2,37,740',
  'ryan-international-school-noida-extension': '₹1,50,000+',
  'st-teresa-school-greater-noida-west': '₹1,40,500',
  'lotus-valley-international-school': '₹1,57,560',
  'pacific-world-school-techzone-4': '₹1,30,800',
  'jm-international-school': '₹1,15,200',
  'the-wisdom-tree-school': '₹1,10,000',
  'bls-world-school': '₹1,56,000',
  'salvation-tree-school': '₹2,40,000',
  'ramagya-school-noida-extension': '₹2,13,700',
  'shri-ram-global-school': '₹1,14,000',
  'st-johns-senior-secondary-school-noida-ext': '₹1,00,368',
  'cambridge-school-noida-sector-27': '₹1,17,000',
  'indus-valley-school-noida-ext': '₹1,38,000',
  'modern-public-school-noida-extension': '₹85,000',
  'golden-valley-public-school-noida-ext': '₹45,000',
  'the-manthan-school-greater-noida-west': '₹1,23,600',
  'bgs-vijnatham-school': '₹1,40,400',
  'sparsh-global-school-greater-noida-west': '₹1,28,000',
  'genesis-global-school-sector-132-noida': '₹4,32,600',
  'kaushalya-world-school-greater-noida': '₹75,000',
  'lps-global-school-sector-51-noida': '₹1,60,800',
  'mount-litera-zee-school-dadri-greater-noida': '₹1,05,000',
  'clarwyn-international-school': '₹2,40,000',
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

    const hasMonthlyMarker = /\/\s*month|per\s+month|monthly/i.test(candidate);
    const hasQuarterlyMarker = /\/\s*quarter|per\s+quarter|quarterly/i.test(candidate);
    const hasAnnualMarker = /\/\s*year|per\s+year|annual|per\s+annum|yearly/i.test(candidate);

    if (hasMonthlyMarker || hasQuarterlyMarker) {
      continue;
    }

    const range = candidate.match(/₹?\s*([\d,]+)\s*[–-]\s*₹?\s*([\d,]+)/);
    if (range && (hasAnnualMarker || /calculated/i.test(candidate))) {
      return `₹${formatIndianNumber(range[2])}`;
    }

    const annualToken = candidate.match(/₹?\s*([\d,]+)(\+)?/);
    if (annualToken && (hasAnnualMarker || /^₹?\s*[\d,]+(?:\+)?$/i.test(candidate))) {
      return `₹${formatIndianNumber(annualToken[1])}${annualToken[2] || ''}`;
    }
  }

  if (fees.billingFrequency === 'annual' && typeof fees.cardFee === 'number' && Number.isFinite(fees.cardFee)) {
    return `₹${fees.cardFee.toLocaleString('en-IN')}`;
  }

  return fees.disclosed === false ? 'Not publicly disclosed' : 'Fee details available';
}
