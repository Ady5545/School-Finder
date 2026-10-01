import type { SchoolFees } from '../types/school';

const CARD_FEE_OVERRIDES: Record<string, string> = {
  'delhi-world-public-school-kp-5': '₹2,04,464',
  'delhi-public-school-knowledge-park-5': '₹2,00,100',
  'the-shri-ram-universal-school': '₹1,58,400',
  'the-infinity-school': '₹1,84,000',
  'gd-goenka-international-school': 'Up to ₹3,95,800',
  'aster-public-school-kp5': '₹1,20,000+',
  'aster-public-school-sector-3': '₹96,000',
  'sarvottam-international-school': '₹1,53,300+',
  'the-millennium-school-noida-extension': '₹1,64,640',
  'gagan-public-school-sector-4': '₹81,600',
  'indirapuram-public-school-crossings-republik': '₹1,20,000',
  'the-khaitan-school-sector-40-noida': '₹2,40,120',
  'global-indian-international-school-noida': '₹2,40,000',
  'aspam-scottish-school-noida': '₹1,62,240',
  'ryan-international-school-noida-extension': '₹1,40,580',
  'st-teresa-school-greater-noida-west': '₹1,40,500',
  'lotus-valley-international-school': '₹1,57,560',
  'pacific-world-school-techzone-4': '₹1,30,800',
  'jm-international-school': '₹1,14,000 – ₹1,44,000',
  'the-wisdom-tree-school': '₹1,10,000',
  'bls-world-school': '₹1,23,000',
  'salvation-tree-school': '₹1,12,371',
  'ramagya-school-noida-extension': '₹1,72,752',
  'shri-ram-global-school': '₹1,97,856',
  'st-johns-senior-secondary-school-noida-ext': '₹1,00,368',
  'cambridge-school-noida-sector-27': '₹1,17,000',
  'indus-valley-school-noida-ext': '₹1,51,728',
  'modern-public-school-noida-extension': '₹1,05,600',
    'the-manthan-school-greater-noida-west': '₹1,29,600',
  'bgs-vijnatham-school': '₹1,35,000',
  'sparsh-global-school-greater-noida-west': '₹1,28,000',
  'genesis-global-school-sector-132-noida': '₹5,50,800',
  'kaushalya-world-school-greater-noida': '₹90,000',
  'lps-global-school-sector-51-noida': '₹1,60,800',
};

const LOCKED_CARD_FEE_OVERRIDES_BEFORE_JM: Record<string, string> = {
  'delhi-public-school-knowledge-park-5': '₹2,00,100',
  'lotus-valley-international-school': '₹1,57,560',
  'pacific-world-school-techzone-4': '₹1,30,800',
  'the-shri-ram-universal-school': '₹1,58,400',
  'delhi-world-public-school-kp-5': '₹2,04,464',
  'sks-world-school-greater-noida-west': '₹91,200',
};

const LOCKED_CARD_FEE_OVERRIDES_FROM_JM: Record<string, string> = {
  'jm-international-school': '₹1,14,000 – ₹1,44,000',
  'the-wisdom-tree-school': '₹1,10,000',
  'bls-world-school': '₹1,23,000',
  'salvation-tree-school': '₹1,12,371',
  'ramagya-school-noida-extension': '₹1,72,752',
  'shri-ram-global-school': '₹1,97,856',
  'st-johns-senior-secondary-school-noida-ext': '₹1,00,368',
  'cambridge-school-noida-sector-27': '₹1,17,000',
  'indus-valley-school-noida-ext': '₹1,51,728',
  'modern-public-school-noida-extension': '₹1,05,600',
    'the-manthan-school-greater-noida-west': '₹1,29,600',
  'bgs-vijnatham-school': '₹1,35,000',
  'sparsh-global-school-greater-noida-west': '₹1,28,000',
  'genesis-global-school-sector-132-noida': '₹5,50,800',
  'kaushalya-world-school-greater-noida': '₹90,000',
  'lps-global-school-sector-51-noida': '₹1,60,800',
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

function formatLakhValue(value: string): string {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return '';
  return Math.round(numeric * 100000).toLocaleString('en-IN');
}

/**
 * Card-only annual fee presentation. It deliberately does not mutate or
 * normalize the underlying detailed fee structure used by school profiles.
 */
export function getCardAnnualFeeDisplay(slug: string, fees: SchoolFees): string {
  // Preserve every pre-JM card exactly as it was before the audit.\n  const preJmOverride = LOCKED_CARD_FEE_OVERRIDES_BEFORE_JM[slug];\n  if (preJmOverride) return preJmOverride;\n\n  // JM International onward is protected from corrupted/stale persisted fee fields.
  const lockedOverride = LOCKED_CARD_FEE_OVERRIDES_FROM_JM[slug];
  if (lockedOverride) return lockedOverride;

  // CMS-managed card presentation is authoritative. Legacy hardcoded values
  // remain only as a fallback for records that have no usable fee data yet.
  const managedOverride = typeof fees.feeDisplayOverride === 'string' ? clean(fees.feeDisplayOverride) : '';
  if (managedOverride) return managedOverride;

  const candidates = [
    typeof fees.annualDisplay === 'string' ? fees.annualDisplay : '',
    typeof fees.tuitionAnnual === 'string' ? fees.tuitionAnnual : '',
    typeof fees.rangeText === 'string' ? fees.rangeText : '',
  ]
    .map(clean)
    .filter(Boolean);

  for (const candidate of candidates) {
    if (/not publicly disclosed|please contact the school to know|contact the school for the current fee/i.test(candidate)) {
      return 'Not publicly disclosed';
    }

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

    // Support compact Indian lakh notation such as “₹1.58–₹1.72 lakh / year”.
    const lakhRange = candidate.match(/₹?\s*([\d.]+)\s*[–-]\s*₹?\s*([\d.]+)\s*lakh/i);
    if (lakhRange && (hasAnnualMarker || /calculated/i.test(candidate))) {
      return `₹${formatLakhValue(lakhRange[2])}`;
    }

    const lakhSingle = candidate.match(/₹?\s*([\d.]+)\s*lakh/i);
    if (lakhSingle && (hasAnnualMarker || /calculated/i.test(candidate))) {
      return `₹${formatLakhValue(lakhSingle[1])}`;
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

  // A raw cardFee is only valid when its stored billing frequency is annual.
  // Monthly/quarterly cardFee values must never appear under the card's
  // "Annual Fee" label.
  if (fees.billingFrequency === 'annual' && typeof fees.cardFee === 'number' && Number.isFinite(fees.cardFee)) {
    return `₹${fees.cardFee.toLocaleString('en-IN')}`;
  }

  const legacyOverride = CARD_FEE_OVERRIDES[slug];
  if (legacyOverride) return legacyOverride;

  return fees.disclosed === false ? 'Not publicly disclosed' : 'Fee details available';
}
