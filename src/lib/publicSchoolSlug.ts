/**
 * Lightweight public-school slug index for client-side shortlist storage.
 *
 * Keeps canonicalization/filtering behavior available without importing the
 * full school records into every client bundle.
 */

const PUBLIC_SCHOOL_SLUGS = new Set<string>([
  "delhi-public-school-knowledge-park-5",
  "lotus-valley-international-school",
  "pacific-world-school-techzone-4",
  "the-shri-ram-universal-school",
  "delhi-world-public-school-kp-5",
  "sks-world-school-greater-noida-west",
  "jm-international-school",
  "st-xaviers-high-school",
  "the-wisdom-tree-school",
  "the-infinity-school",
  "ramagya-school-noida-extension",
  "gd-goenka-international-school",
  "salvation-tree-school",
  "bls-world-school",
  "shri-ram-global-school",
  "florence-international-school",
  "st-teresa-school-greater-noida-west",
  "st-johns-senior-secondary-school-noida-ext",
  "cambridge-school-noida-sector-27",
  "apeejay-international-school-greater-noida",
  "indus-valley-school-noida-ext",
  "modern-public-school-noida-extension",
  "golden-valley-public-school-noida-ext",
  "aster-public-school-kp5",
  "the-manthan-school-greater-noida-west",
  "bgs-vijnatham-school",
  "sarvottam-international-school",
  "the-millennium-school-noida-extension",
  "gaurs-international-school-gaur-city-2",
  "ryan-international-school-noida-extension",
  "aster-public-school-sector-3",
  "bloom-international-school-techzone-7",
  "sparsh-global-school-greater-noida-west",
  "seth-anandram-jaipuria-school-greater-noida-west",
  "gagan-public-school-sector-4",
  "indirapuram-public-school-crossings-republik",
  "sapphire-international-school-crossings-republik",
  "the-khaitan-school-sector-40-noida",
  "clarwyn-international-school",
  "genesis-global-school-sector-132-noida",
  "sri-chaitanya-techno-school-gaur-city-1",
  "sri-chaitanya-techno-school-knowledge-park-1",
  "sri-chaitanya-techno-school-sector-41-noida",
  "learners-international-school",
  "aspam-scottish-school-noida",
  "global-indian-international-school-noida",
  "apeejay-school-sector-16a-noida",
  "kaushalya-world-school-greater-noida",
  "lps-global-school-sector-51-noida",
  "mount-litera-zee-school-dadri-greater-noida",
  "somerville-school-sector-22-noida",
  "cambridge-school-greater-noida",
  "modern-school-greater-noida",
  "sheoran-international-school",
  "rps-international-school-omega-ii",
  "millennium-international-school-greater-noida",
  "greater-noida-world-school",
  "gurukul-the-school-crossings-republik",
  "the-shriram-millennium-school-noida-sector-135",
  "narayana-school-greater-noida"
]);

const SCHOOL_SLUG_ALIASES: Record<string, string> = {
  "st-xaviers-high-school-greater-noida-west": "st-xaviers-high-school",
  "dps-world-school-noida-extension": "delhi-world-public-school-kp-5",
  "narayana-e-techno-school-greater-noida": "narayana-school-greater-noida"
};

export function canonicalizePublicSchoolSlug(input: string): string | null {
  const slug = String(input || '').trim();
  if (!slug) return null;

  const canonical = SCHOOL_SLUG_ALIASES[slug] || slug;
  return PUBLIC_SCHOOL_SLUGS.has(canonical) ? canonical : null;
}
