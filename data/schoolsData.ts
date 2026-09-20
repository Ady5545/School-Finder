import schoolsJson from './schools.json';
import legacyUrlMapJson from './legacyUrlMap.json';

export interface SchoolLocation {
  address: string;
  sector: string;
  city?: string;
  state?: string;
  pincode?: string;
  area: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
    latitude?: number | null;
    longitude?: number | null;
    isVerified?: boolean;
  };
  mapSearchQuery?: string;
  mapEmbedUrl?: string | null;
}

export interface FeeItem {
  type: string;
  cost: string;
}

export type FeeFrequency =
  | 'one_time'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'half_yearly'
  | 'per_term'
  | 'per_installment'
  | 'as_applicable'
  | 'optional'
  | 'recurring';

export type FeeVerificationStatus =
  | 'verified_from_source'
  | 'verified_official'
  | 'calculated_from_official'
  | 'estimated_historical'
  | 'estimated'
  | 'unverified_copied_from_wisdom_tree'
  | 'partially_verified'
  | 'unverified_undisclosed'
  | 'not_publicly_verified'
  | 'pending_audit'
  | 'unverified_third_party';

export interface DetailedFeeComponent {
  id: string;
  name: string;
  category:
    | 'one_time'
    | 'recurring'
    | 'grade_wise'
    | 'special_curriculum'
    | 'optional'
    | 'deposit'
    | 'activity'
    | 'examination'
    | 'transport'
    | 'other'
    | 'curriculum_addon'
    | 'lab_facility';
  amount?: number | null;
  formattedAmount: string;
  frequency: FeeFrequency;
  gradesApplicable?: string;
  mandatory: boolean;
  refundable: boolean;
  isCalculated?: boolean;
  calculationNotes?: string;
  isOfficial?: boolean;
  sourceUrl?: string;
  notes?: string;
}

export interface GradeWiseFeeTier {
  gradeGroup: string;
  grades?: string[];
  tuitionFee: string;
  tuitionFrequency: FeeFrequency;
  calculatedAnnualEquivalent?: string;
  totalAnnualPayable?: string;
  isCalculated?: boolean;
  curriculum?: string;
  specialCharges?: { name: string; amount: string; frequency: string }[];
  notes?: string;
}

export interface FeeConcession {
  title: string;
  category: 'sibling' | 'merit' | 'early_bird' | 'staff' | 'defense' | 'advance_payment' | 'other';
  discountDescription: string;
  discountValue?: string;
  eligibilityCriteria?: string;
  isOfficial: boolean;
}

export interface FeeCircularDocument {
  title: string;
  academicSession: string;
  publishDate?: string;
  circularType: 'official_pdf' | 'circular_document' | 'web_schedule' | 'institutional_letter';
  sourceUrl?: string;
  fileSize?: string;
  summary?: string;
  keyTerms?: string[];
  officialNotes?: string[];
}

export interface TransportZoneSchedule {
  zone: string;
  distanceSlab?: string;
  areasCovered?: string[];
  frequency: FeeFrequency;
  amount: string;
  isOptional: boolean;
}

export interface HistoricalFeeStructure {
  academicSession: string;
  annualCardFee?: number | null;
  rangeText: string;
  verificationStatus: string;
  summary: string;
  sourceUrl?: string;
  components?: DetailedFeeComponent[];
}

export interface SchoolFees {
  cardFee: number | null;
  estimatedFirstYear?: number | null;
  estimatedFirstYearText?: string;
  currency?: string;
  rangeText: string;
  registrationFee?: number | null;
  admissionFee?: number | null;
  tuitionMonthly?: string | null;
  tuitionQuarterly?: string | null;
  tuitionAnnual?: string | null;
  transportMonthly?: string | null;
  transportAnnual?: string | null;
  verificationStatus?: FeeVerificationStatus;
  isVerified?: boolean;
  disclosed?: boolean;
  comparableAnnualAvailable?: boolean;
  billingFrequency?: 'monthly' | 'quarterly' | 'annual' | string;
  feeCategory?: string;
  academicSession?: string;
  academicYear?: string;
  source?: string;
  lastVerifiedDate?: string;
  verifiedDate?: string;
  sourceUrl?: string;
  feeDisplayOverride?: string;
  annualDisplay?: string;
  table?: FeeItem[];
  components?: DetailedFeeComponent[];
  gradeWiseTiers?: GradeWiseFeeTier[];
  concessions?: FeeConcession[];
  circular?: FeeCircularDocument;
  transportSchedule?: TransportZoneSchedule[];
  history?: HistoricalFeeStructure[];
  footnotes?: string[];
  disclaimer?: string;
  calculatedAnnualNote?: string;
  legacyRawFees?: FeeItem[];
}

export interface Facility {
  name: string;
  category: string;
  icon?: string;
  available?: boolean;
}

export interface UniformItem {
  image: string | null;
  label: string;
}

export interface SchoolUniforms {
  boys?: UniformItem;
  girls?: UniformItem;
  winter?: UniformItem;
  notes?: string;
}

export interface AdmissionMilestone {
  id: string; // e.g. "app_opening", "app_deadline", "assessment_date"
  label: string; // e.g. "Application Opening", "Application Deadline", "Campus Interaction / Test"
  date: string; // YYYY-MM-DD e.g. "2026-10-15"
  type?: string;
  status?: string;
  verified?: boolean;
  notes?: string;
}

export interface SchoolAdmissions {
  date?: string | null;
  status: string;
  process: string;
  session?: string;
  academicYear?: string;
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
  scale?: number;
  reviewsCount: number;
  breakdown?: Record<string, number>;
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
  classification?: 'core_greater_noida_west' | 'nearby_surrounding' | 'primary' | 'upcoming';
  geographicClassification?: 'core_greater_noida_west' | 'nearby_surrounding' | 'geographic_outlier';
  recordType?: 'canonical' | 'alias' | 'nearby_surrounding' | 'geographic_outlier' | 'primary' | 'upcoming';
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
  const canonical = schools.filter(s => !s.isDuplicate && !s.isArchived);
  // Keep the current featured school first across directory surfaces without
  // presenting it as an objective ranking.
  const featuredSlug = 'delhi-world-public-school-kp-5';
  return [...canonical].sort((a, b) => {
    if (a.slug === featuredSlug) return -1;
    if (b.slug === featuredSlug) return 1;
    return 0;
  });
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
