import schoolsJson from './schools.json';
import legacyUrlMapJson from './legacyUrlMap.json';

export interface SchoolLocation {
  address: string;
  sector: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
  coordinates: { lat: number | null; lng: number | null };
  mapSearchQuery: string;
  mapEmbedUrl: string | null;
}

export interface FeeItem {
  type: string;
  cost: string;
}

export interface SchoolFees {
  cardFee: number;
  estimatedFirstYear: number | null;
  currency: string;
  rangeText: string;
  registrationFee: number | null;
  admissionFee: number | null;
  tuitionMonthly: string | null;
  tuitionQuarterly: string | null;
  tuitionAnnual: string | null;
  transportMonthly: string | null;
  transportAnnual: string | null;
  verificationStatus: 'verified_from_source' | 'unverified_copied_from_wisdom_tree' | 'partially_verified' | 'unverified_undisclosed' | 'not_publicly_verified';
  comparableAnnualAvailable?: boolean;
  feeCategory?: string;
  academicSession?: string;
  lastVerifiedDate?: string;
  sourceUrl?: string;
  table: FeeItem[];
  legacyRawFees?: FeeItem[];
}

export interface Facility {
  name: string;
  category: string;
  icon: string;
}

export interface UniformItem {
  image: string | null;
  label: string;
}

export interface SchoolUniforms {
  boys: UniformItem;
  girls: UniformItem;
  winter?: UniformItem;
}

export interface AdmissionMilestone {
  id: string; // e.g. "app_opening", "app_deadline", "assessment_date"
  label: string; // e.g. "Application Opening", "Application Deadline", "Campus Interaction / Test"
  date: string; // YYYY-MM-DD e.g. "2026-10-15"
  verified: boolean;
  notes?: string;
}

export interface SchoolAdmissions {
  date: string | null;
  status: string;
  process: string;
  session?: string;
  timelineDescription?: string;
  sourceUrl?: string;
  lastVerifiedDate?: string;
  verificationStatus?: string;
  milestones?: AdmissionMilestone[];
}

export interface SchoolContact {
  phone: string | null;
  website: string | null;
  email: string | null;
}

export interface SchoolRating {
  score: number;
  scale: number;
  reviewsCount: number;
}

export interface SchoolAssets {
  featured: string | null;
  hero: string | null;
  gallery: string[];
  coverImage?: string;
  imageSource?: string;
  imageSourceUrl?: string | null;
  imageVerifiedAt?: string;
  legacyPaths: Record<string, string>;
}

export interface SchoolVerification {
  isVerified: boolean;
  status: 'verified_official' | 'pending_audit' | 'partially_verified';
  lastVerified: string;
  sourceName: string;
  sourceUrl?: string | null;
  cbseAffiliationNumber?: string | null;
  schoolCode?: string | null;
  verifiedFields: string[];
  notes?: string;
}

export interface LegacyIdentifiers {
  pageFile: string;
  pageTitle: string;
  h1: string;
  pageHeartKey: string;
  cardHeartKey: string;
  cardRatingKey: string;
  cardLink: string;
  legacyUrls: string[];
}

export interface School {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  alternateNames: string[];
  tagline: string;
  summary: string;
  board: string[];
  boardNote: string | null;
  curriculum: string;
  gradeRange: { from: string; to: string; raw: string };
  admissionAge: string;
  studentTeacherRatio: string;
  schoolType: string;
  dayOrBoarding: string;
  location: SchoolLocation;
  fees: SchoolFees;
  facilities: Facility[];
  uniforms: SchoolUniforms;
  achievements: string[];
  admissions: SchoolAdmissions;
  contact: SchoolContact;
  rating: SchoolRating;
  assets: SchoolAssets;
  verification?: SchoolVerification;
  legacyIdentifiers: LegacyIdentifiers;
  auditNotes: string[];
  classification?: 'core_greater_noida_west' | 'nearby_surrounding';
  geographicClassification?: 'core_greater_noida_west' | 'nearby_surrounding' | 'geographic_outlier';
  recordType?: 'canonical' | 'alias' | 'nearby_surrounding' | 'geographic_outlier';
  canonicalSlug?: string;
  isDuplicate?: boolean;
  duplicateOf?: string | null;
  isArchived?: boolean;
  archiveReason?: string;
  status?: 'active' | 'archived' | 'alias';
  affiliationNumber?: string | null;
  establishedYear?: number | null;
  sports?: string[];
}

export const schools: School[] = schoolsJson as unknown as School[];
export const legacyUrlMap: Record<string, string> = legacyUrlMapJson as Record<string, string>;

/**
 * Returns raw all schools including aliases, duplicates, and archived records (total 70).
 */
export function getRawSchools(): School[] {
  return schools;
}

/**
 * Returns strictly unique active canonical schools (excluding aliases, duplicate records, and archived records).
 */
export function getCanonicalSchools(): School[] {
  return schools.filter(s => !s.isDuplicate && !s.isArchived);
}

/**
 * Returns all archived schools that remain in historical repository.
 */
export function getArchivedSchools(): School[] {
  return schools.filter(s => Boolean(s.isArchived));
}

/**
 * Single canonical count helper. Always derived from active canonical dataset.
 */
export function getCanonicalSchoolsCount(): number {
  return getCanonicalSchools().length;
}

/**
 * Resolves any slug or ID (including legacy aliases) to its canonical school slug.
 */
export function getCanonicalSlug(slugOrId: string): string {
  if (!slugOrId) return '';
  const s = schools.find(item => item.slug === slugOrId || item.id === slugOrId);
  if (!s) return slugOrId;
  if (s.isDuplicate && s.duplicateOf) {
    return s.duplicateOf;
  }
  return s.slug;
}

export function getSchoolBySlug(slug: string): School | undefined {
  return schools.find(s => s.slug === slug || s.id === slug);
}

export function resolveLegacyUrl(url: string): School | undefined {
  const clean = (url || '').trim().replace(/^\/+/, '');
  const slug = legacyUrlMap[url] || legacyUrlMap['/' + clean] || legacyUrlMap[clean];
  return slug ? getSchoolBySlug(slug) : undefined;
}

export default schools;
