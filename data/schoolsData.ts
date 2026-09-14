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
  verificationStatus: 'verified_from_source' | 'unverified_copied_from_wisdom_tree';
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

export interface SchoolAdmissions {
  date: string;
  status: string;
  process: string;
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
  featured: string;
  hero: string;
  gallery: string[];
  legacyPaths: Record<string, string>;
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
  legacyIdentifiers: LegacyIdentifiers;
  auditNotes: string[];
}

export const schools: School[] = schoolsJson as unknown as School[];
export const legacyUrlMap: Record<string, string> = legacyUrlMapJson as Record<string, string>;

export function getSchoolBySlug(slug: string): School | undefined {
  return schools.find(s => s.slug === slug || s.id === slug);
}

export function resolveLegacyUrl(url: string): School | undefined {
  const clean = (url || '').trim().replace(/^\/+/, '');
  const slug = legacyUrlMap[url] || legacyUrlMap['/' + clean] || legacyUrlMap[clean];
  return slug ? getSchoolBySlug(slug) : undefined;
}

export default schools;
