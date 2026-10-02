/**
 * Lightweight client-side canonicalization for shortlist slugs.
 *
 * Only legacy duplicate aliases need a lookup. Dynamic CMS-created school
 * slugs remain valid without importing the full school dataset into the client.
 */

const SCHOOL_SLUG_ALIASES: Record<string, string> = {
  "st-xaviers-high-school-greater-noida-west": "st-xaviers-high-school",
  "dps-world-school-noida-extension": "delhi-world-public-school-kp-5",
  "narayana-e-techno-school-greater-noida": "narayana-school-greater-noida",
};

export function canonicalizePublicSchoolSlug(input: string): string | null {
  const slug = String(input || '').trim();
  if (!slug) return null;
  return SCHOOL_SLUG_ALIASES[slug] || slug;
}
