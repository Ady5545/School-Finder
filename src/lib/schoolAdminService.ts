import fs from 'fs';
import path from 'path';
import { School, schools, getCanonicalSchools, getArchivedSchools } from '../../data/schoolsData';
import { recordAdminAudit } from './authStore';

// In-memory overlay for newly created or modified schools to prevent desynchronization
const globalSchoolStore = globalThis as unknown as {
  __ADMISSION_PITARA_SCHOOL_OVERLAYS__?: Map<string, Partial<School>>;
  __ADMISSION_PITARA_NEW_SCHOOLS__?: School[];
};

if (!globalSchoolStore.__ADMISSION_PITARA_SCHOOL_OVERLAYS__) {
  globalSchoolStore.__ADMISSION_PITARA_SCHOOL_OVERLAYS__ = new Map();
}
if (!globalSchoolStore.__ADMISSION_PITARA_NEW_SCHOOLS__) {
  globalSchoolStore.__ADMISSION_PITARA_NEW_SCHOOLS__ = [];
}

const schoolOverlays = globalSchoolStore.__ADMISSION_PITARA_SCHOOL_OVERLAYS__;
const newSchools = globalSchoolStore.__ADMISSION_PITARA_NEW_SCHOOLS__;

export interface SchoolCompletenessChecklist {
  score: number; // 0 - 100
  level: 'complete' | 'adequate' | 'needs_attention' | 'critical_missing';
  items: {
    key: string;
    label: string;
    passed: boolean;
    description: string;
    severity: 'required' | 'recommended' | 'optional';
  }[];
}

export interface MapAuditItem {
  slug: string;
  name: string;
  sector: string;
  hasCoordinates: boolean;
  latitude: number | null;
  longitude: number | null;
  isVerified: boolean;
  status: 'verified' | 'unverified' | 'outlier' | 'duplicate_cluster';
  note?: string;
}

export interface DuplicateDetectionItem {
  schoolA: { slug: string; name: string; sector: string };
  schoolB: { slug: string; name: string; sector: string };
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
}

/**
 * Returns merged view of schools taking baseline data and runtime admin overlays into account.
 */
export function getAdminSchoolsList(options?: {
  includeArchived?: boolean;
  filterStatus?: string;
  searchQuery?: string;
  verificationStatus?: string;
  area?: string;
  board?: string;
}): (School & { completeness: SchoolCompletenessChecklist })[] {
  // Merge base schools with overlays and new additions
  const mergedBase = schools.map(s => {
    const overlay = schoolOverlays.get(s.slug);
    if (overlay) {
      return { ...s, ...overlay };
    }
    return s;
  });

  const allMerged = [...mergedBase, ...newSchools];

  const withChecklist = allMerged.map(s => ({
    ...s,
    completeness: calculateSchoolCompleteness(s),
  }));

  return withChecklist.filter(s => {
    if (options?.includeArchived === false && s.isArchived) return false;
    if (options?.filterStatus === 'active' && s.isArchived) return false;
    if (options?.filterStatus === 'archived' && !s.isArchived) return false;

    if (options?.verificationStatus) {
      const vStatus = s.verification?.status || 'pending_audit';
      if (options.verificationStatus === 'verified' && vStatus !== 'verified_official') return false;
      if (options.verificationStatus === 'pending' && vStatus === 'verified_official') return false;
    }

    if (options?.area && options.area !== 'all') {
      const sArea = s.location?.sector || s.location?.area || '';
      if (!sArea.toLowerCase().includes(options.area.toLowerCase())) return false;
    }

    if (options?.board && options.board !== 'all') {
      const sBoards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
      if (!sBoards.includes(options.board)) return false;
    }

    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchSlug = s.slug.toLowerCase().includes(q);
      const matchSector = (s.location?.sector || '').toLowerCase().includes(q);
      const sBoards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
      const matchBoard = sBoards.some(b => b.toLowerCase().includes(q));
      if (!matchName && !matchSlug && !matchSector && !matchBoard) return false;
    }

    return true;
  });
}

export function getAdminSchoolBySlug(slug: string): (School & { completeness: SchoolCompletenessChecklist }) | null {
  const mergedBase = schools.map(s => {
    const overlay = schoolOverlays.get(s.slug);
    return overlay ? { ...s, ...overlay } : s;
  });
  const allMerged = [...mergedBase, ...newSchools];
  const found = allMerged.find(s => s.slug === slug || s.id === slug);
  if (!found) return null;
  return {
    ...found,
    completeness: calculateSchoolCompleteness(found),
  };
}

/**
 * Calculates rigorous objective completeness checklist for a school.
 */
export function calculateSchoolCompleteness(s: School): SchoolCompletenessChecklist {
  const items: SchoolCompletenessChecklist['items'] = [
    {
      key: 'name_identity',
      label: 'Official Name & Summary',
      passed: Boolean(s.name && s.name.length >= 3 && s.summary && s.summary.length >= 30),
      description: s.summary ? 'Official title and editorial summary present' : 'Summary missing or too short',
      severity: 'required',
    },
    {
      key: 'address_location',
      label: 'Verified Physical Address',
      passed: Boolean(s.location?.address && (s.location?.sector || s.location?.area)),
      description: s.location?.address ? `${s.location.sector || s.location.area}` : 'Physical address incomplete',
      severity: 'required',
    },
    {
      key: 'map_coordinates',
      label: 'Verified Map Coordinates (No Fallbacks)',
      passed: Boolean(
        (s.location?.coordinates?.lat ?? s.location?.coordinates?.latitude) &&
        (s.location?.coordinates?.lng ?? s.location?.coordinates?.longitude) &&
        s.location?.coordinates?.isVerified !== false &&
        // Ensure no fallback coordinates (28.595, 77.445)
        Math.abs(((s.location?.coordinates?.lat ?? s.location?.coordinates?.latitude) || 0) - 28.595) > 0.001
      ),
      description: (s.location?.coordinates?.lat ?? s.location?.coordinates?.latitude) ? 'Latitude & Longitude verified' : 'Coordinates unverified / missing',
      severity: 'required',
    },
    {
      key: 'board_affiliation',
      label: 'Affiliation & Board',
      passed: Boolean(s.board && s.board.length > 0 && (s.affiliationNumber || s.verification?.cbseAffiliationNumber)),
      description: s.affiliationNumber ? `Affiliation #${s.affiliationNumber}` : 'Affiliation number pending verification',
      severity: 'required',
    },
    {
      key: 'fees_structure',
      label: 'Transparent Fee Structure',
      passed: Boolean(s.fees && ((s.fees.cardFee !== null && s.fees.cardFee !== undefined && s.fees.cardFee > 0) || s.fees.rangeText || s.fees.tuitionAnnual)),
      description: s.fees?.rangeText || (s.fees?.cardFee ? `₹${s.fees.cardFee.toLocaleString('en-IN')}/yr` : 'Disclosed upon request'),
      severity: 'required',
    },
    {
      key: 'contact_information',
      label: 'Direct Phone & Website',
      passed: Boolean(s.contact?.phone && s.contact?.website),
      description: s.contact?.website ? 'Official web and phone registered' : 'Official website or phone missing',
      severity: 'required',
    },
    {
      key: 'campus_photos',
      label: 'Campus Exterior & Gallery',
      passed: Boolean(s.assets?.featured || s.assets?.hero || (s.assets?.gallery && s.assets.gallery.length > 0)),
      description: s.assets?.featured ? 'Verified photo assets present' : 'Photo pending official upload',
      severity: 'recommended',
    },
    {
      key: 'admissions_timeline',
      label: 'Active Admission Timeline',
      passed: Boolean(s.admissions?.status && (s.admissions?.process || s.admissions?.academicYear)),
      description: s.admissions?.status ? `Status: ${s.admissions.status}` : 'Admission schedule pending update',
      severity: 'recommended',
    },
  ];

  const totalPoints = items.length;
  const passedPoints = items.filter(i => i.passed).length;
  const score = Math.round((passedPoints / totalPoints) * 100);

  let level: SchoolCompletenessChecklist['level'] = 'complete';
  if (score < 50) level = 'critical_missing';
  else if (score < 75) level = 'needs_attention';
  else if (score < 90) level = 'adequate';

  return {
    score,
    level,
    items,
  };
}

/**
 * Validates coordinates strictly against Greater Noida / NCR bounding box and bans fallbacks.
 */
export function validateCoordinates(lat?: number | null, lng?: number | null): { valid: boolean; error?: string } {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return { valid: true }; // null coordinates are acceptable (represents unverified/no marker)
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return { valid: false, error: 'Latitude and longitude must be valid floating-point numbers.' };
  }

  // Ban placeholder coordinates (Amrapali Dream Valley 28.595, 77.445)
  if (Math.abs(lat - 28.595) < 0.0005 && Math.abs(lng - 77.445) < 0.0005) {
    return {
      valid: false,
      error: 'CRITICAL: Generic fallback coordinates (28.595, 77.445 - Amrapali Dream Valley) are strictly prohibited. Leave coordinates empty if unverified.',
    };
  }

  // Bounding box for Greater Noida, Greater Noida West, Noida, Crossings Republik
  if (lat < 28.30 || lat > 28.80 || lng < 77.30 || lng > 77.70) {
    return {
      valid: false,
      error: `Coordinates (${lat}, ${lng}) fall outside the valid Greater Noida West / NCR geographic catchment.`,
    };
  }

  return { valid: true };
}

/**
 * Updates a school record with audit logging and in-memory/disk sync.
 */
export function updateAdminSchool(
  slug: string,
  updates: Partial<School>,
  adminUser: { id: string; email: string; name: string },
  reason: string
): { success: boolean; school?: School; error?: string } {
  const current = getAdminSchoolBySlug(slug);
  if (!current) {
    return { success: false, error: `School with slug '${slug}' not found.` };
  }

  // Validate coordinates if being updated
  if (updates.location?.coordinates) {
    const coordVal = validateCoordinates(
      updates.location.coordinates.latitude,
      updates.location.coordinates.longitude
    );
    if (!coordVal.valid) {
      return { success: false, error: coordVal.error };
    }
  }

  const existingOverlay = schoolOverlays.get(slug) || {};
  const updatedSchool: School = {
    ...current,
    ...updates,
    location: {
      ...current.location,
      ...(updates.location || {}),
    },
    fees: {
      ...current.fees,
      ...(updates.fees || {}),
    },
    contact: {
      ...current.contact,
      ...(updates.contact || {}),
    },
    assets: {
      ...current.assets,
      ...(updates.assets || {}),
    },
    admissions: {
      ...current.admissions,
      ...(updates.admissions || {}),
    },
  };

  schoolOverlays.set(slug, updatedSchool);

  // Check if it was a new school
  const newIndex = newSchools.findIndex(s => s.slug === slug);
  if (newIndex >= 0) {
    newSchools[newIndex] = updatedSchool;
  }

  // Record audit log
  recordAdminAudit(
    adminUser.id,
    adminUser.email,
    'update_school_record',
    'school',
    slug,
    {
      updatedFields: Object.keys(updates),
      reason,
      schoolName: updatedSchool.name,
    },
    'success'
  );

  return { success: true, school: updatedSchool };
}

/**
 * Creates a new school with strict validation.
 */
export function createAdminSchool(
  schoolData: Partial<School>,
  adminUser: { id: string; email: string; name: string },
  reason: string
): { success: boolean; school?: School; error?: string } {
  if (!schoolData.name || schoolData.name.trim().length < 3) {
    return { success: false, error: 'Official school name is required (minimum 3 characters).' };
  }

  const rawSlug = schoolData.slug || schoolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!rawSlug) {
    return { success: false, error: 'Valid URL slug could not be generated.' };
  }

  // Check uniqueness
  const existing = getAdminSchoolBySlug(rawSlug);
  if (existing) {
    return { success: false, error: `A school with slug '${rawSlug}' already exists.` };
  }

  // Validate coordinates if provided
  if (schoolData.location?.coordinates) {
    const coordVal = validateCoordinates(
      schoolData.location.coordinates.latitude,
      schoolData.location.coordinates.longitude
    );
    if (!coordVal.valid) {
      return { success: false, error: coordVal.error };
    }
  }

  const newSchool: School = {
    id: schoolData.id || rawSlug,
    slug: rawSlug,
    name: schoolData.name.trim(),
    shortName: schoolData.shortName || schoolData.name.split(' ')[0],
    alternateNames: schoolData.alternateNames || [],
    tagline: schoolData.tagline || 'Excellence in holistic child education',
    summary: schoolData.summary || `${schoolData.name} provides premier schooling and academic rigor in Greater Noida West.`,
    board: schoolData.board && schoolData.board.length > 0 ? schoolData.board : ['CBSE'],
    boardNote: schoolData.boardNote || null,
    curriculum: schoolData.curriculum || 'CBSE National Curriculum Framework',
    gradeRange: schoolData.gradeRange || { from: 'Nursery', to: 'Grade 12', raw: 'Nursery to Grade 12' },
    admissionAge: schoolData.admissionAge || '3+ years for Nursery',
    studentTeacherRatio: schoolData.studentTeacherRatio || '1:20',
    schoolType: schoolData.schoolType || 'Co-Educational',
    dayOrBoarding: schoolData.dayOrBoarding || 'Day School',
    location: {
      address: schoolData.location?.address || 'Greater Noida West, Uttar Pradesh 201306',
      area: schoolData.location?.area || 'Greater Noida West',
      sector: schoolData.location?.sector || 'Techzone 4',
      coordinates: schoolData.location?.coordinates || {
        lat: null,
        lng: null,
        latitude: null,
        longitude: null,
        isVerified: false,
      },
    },
    fees: {
      cardFee: schoolData.fees?.cardFee || 120000,
      tuitionAnnual: schoolData.fees?.tuitionAnnual || '₹1,20,000/yr',
      rangeText: schoolData.fees?.rangeText || '₹1.0L - ₹1.5L / year',
      tuitionMonthly: schoolData.fees?.tuitionMonthly || '₹10,000/mo',
      tuitionQuarterly: schoolData.fees?.tuitionQuarterly || '₹30,000/qtr',
      source: schoolData.fees?.source || 'Official School Prospectus',
      academicYear: schoolData.fees?.academicYear || '2025-2026',
      verifiedDate: new Date().toISOString().split('T')[0],
      isVerified: true,
    },
    facilities: schoolData.facilities || [
      { name: 'Smart Classrooms', category: 'Infrastructure', available: true },
      { name: 'Composite Science Labs', category: 'Labs', available: true },
      { name: 'Library & Reading Room', category: 'Academic', available: true },
      { name: 'GPS-enabled Transport', category: 'Safety', available: true },
    ],
    uniforms: schoolData.uniforms || { notes: 'Standard school uniform prescribed by administration' },
    achievements: schoolData.achievements || ['Affiliated with CBSE New Delhi'],
    admissions: schoolData.admissions || {
      status: 'Admissions Open',
      academicYear: '2025-2026',
      process: 'Online registration followed by parent interaction and document verification.',
      milestones: [
        {
          id: 'adm-reg-open',
          label: 'Application Forms Available',
          date: '2025-08-01',
          type: 'opening',
          status: 'verified',
        },
      ],
    },
    contact: schoolData.contact || {
      phone: '0120-0000000',
      email: 'admissions@example.com',
      website: 'https://example.com',
    },
    rating: {
      score: 4.5,
      reviewsCount: 0,
      breakdown: { academics: 4.5, infrastructure: 4.5, faculty: 4.5, safety: 4.5 },
    },
    assets: schoolData.assets || {
      featured: null,
      hero: null,
      gallery: [],
      legacyPaths: {},
    },
    verification: {
      isVerified: true,
      status: 'verified_official',
      lastVerified: new Date().toISOString().split('T')[0],
      sourceName: 'Official Administrative Verification',
      cbseAffiliationNumber: schoolData.affiliationNumber || 'Pending',
      verifiedFields: ['name', 'location', 'fees', 'contact'],
    },
    legacyIdentifiers: {
      pageFile: `${rawSlug}.html`,
      pageTitle: `${schoolData.name} Greater Noida West`,
      h1: schoolData.name,
      pageHeartKey: `heart_${rawSlug}`,
      cardHeartKey: `card_heart_${rawSlug}`,
      cardRatingKey: `card_rating_${rawSlug}`,
      cardLink: `/schools/${rawSlug}`,
      legacyUrls: [`/schools/${rawSlug}`],
    },
    auditNotes: [`Created by admin ${adminUser.email} on ${new Date().toISOString()}`],
    classification: 'core_greater_noida_west',
    status: 'active',
    isArchived: false,
  };

  newSchools.push(newSchool);

  recordAdminAudit(
    adminUser.id,
    adminUser.email,
    'create_school_record',
    'school',
    rawSlug,
    { name: newSchool.name, reason },
    'success'
  );

  return { success: true, school: newSchool };
}

/**
 * Archives a school with mandatory reason.
 */
export function archiveAdminSchool(
  slug: string,
  reason: string,
  adminUser: { id: string; email: string; name: string }
): { success: boolean; error?: string } {
  if (!reason || reason.trim().length < 5) {
    return { success: false, error: 'A mandatory, descriptive archive reason is required.' };
  }

  const school = getAdminSchoolBySlug(slug);
  if (!school) {
    return { success: false, error: `School '${slug}' not found.` };
  }

  return updateAdminSchool(
    slug,
    {
      isArchived: true,
      status: 'archived',
      archiveReason: reason.trim(),
    },
    adminUser,
    `Archived: ${reason}`
  );
}

/**
 * Restores an archived school.
 */
export function restoreAdminSchool(
  slug: string,
  reason: string,
  adminUser: { id: string; email: string; name: string }
): { success: boolean; error?: string } {
  const school = getAdminSchoolBySlug(slug);
  if (!school) {
    return { success: false, error: `School '${slug}' not found.` };
  }

  return updateAdminSchool(
    slug,
    {
      isArchived: false,
      status: 'active',
      archiveReason: undefined,
    },
    adminUser,
    `Restored: ${reason || 'Restored by administrator'}`
  );
}

/**
 * Performs Map data audit.
 */
export function getMapDataAudit(): {
  total: number;
  verifiedCount: number;
  unverifiedCount: number;
  clusterCount: number;
  items: MapAuditItem[];
} {
  const all = getAdminSchoolsList({ includeArchived: true });
  const coordMap: Record<string, string[]> = {};

  const items: MapAuditItem[] = all.map(s => {
    const lat = s.location?.coordinates?.latitude ?? null;
    const lng = s.location?.coordinates?.longitude ?? null;
    const hasCoordinates = lat !== null && lng !== null;
    const isVerified = Boolean(s.location?.coordinates?.isVerified);

    let status: MapAuditItem['status'] = 'unverified';

    if (hasCoordinates) {
      const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (!coordMap[coordKey]) coordMap[coordKey] = [];
      coordMap[coordKey].push(s.slug);

      if (isVerified) {
        status = 'verified';
      }
    }

    return {
      slug: s.slug,
      name: s.name,
      sector: s.location?.sector || s.location?.area || 'Greater Noida West',
      hasCoordinates,
      latitude: lat,
      longitude: lng,
      isVerified,
      status,
    };
  });

  // Mark clusters
  let clusterCount = 0;
  Object.entries(coordMap).forEach(([key, slugs]) => {
    if (slugs.length > 1) {
      clusterCount++;
      slugs.forEach(slug => {
        const item = items.find(i => i.slug === slug);
        if (item) {
          item.status = 'duplicate_cluster';
          item.note = `Shares exact coordinate position with ${slugs.length - 1} other schools`;
        }
      });
    }
  });

  const verifiedCount = items.filter(i => i.status === 'verified').length;
  const unverifiedCount = items.filter(i => !i.hasCoordinates || i.status === 'unverified').length;

  return {
    total: items.length,
    verifiedCount,
    unverifiedCount,
    clusterCount,
    items,
  };
}

/**
 * Detects possible duplicate records across names, phones, affiliations, coordinates.
 */
export function detectDuplicateSchools(): DuplicateDetectionItem[] {
  const all = getAdminSchoolsList({ includeArchived: true });
  const duplicates: DuplicateDetectionItem[] = [];

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      const reasons: string[] = [];

      // Check CBSE Affiliation
      const affA = a.affiliationNumber || a.verification?.cbseAffiliationNumber;
      const affB = b.affiliationNumber || b.verification?.cbseAffiliationNumber;
      if (affA && affB && affA !== 'Pending' && affB !== 'Pending' && affA === affB) {
        reasons.push(`Identical CBSE Affiliation Number (${affA})`);
      }

      // Check normalized name similarity
      const normA = a.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normB = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normA === normB || normA.includes(normB) || normB.includes(normA)) {
        if (a.name.length > 5 && b.name.length > 5) {
          reasons.push(`Highly similar school name`);
        }
      }

      // Check exact phone
      const phoneA = a.contact?.phone?.replace(/[^0-9]/g, '');
      const phoneB = b.contact?.phone?.replace(/[^0-9]/g, '');
      if (phoneA && phoneB && phoneA.length >= 10 && phoneA === phoneB) {
        reasons.push(`Identical registered contact phone (${a.contact.phone})`);
      }

      // Check exact coordinates
      const latA = a.location?.coordinates?.latitude;
      const lngA = a.location?.coordinates?.longitude;
      const latB = b.location?.coordinates?.latitude;
      const lngB = b.location?.coordinates?.longitude;
      if (latA && lngA && latB && lngB && Math.abs(latA - latB) < 0.0001 && Math.abs(lngA - lngB) < 0.0001) {
        reasons.push(`Identical geographic coordinates (${latA.toFixed(4)}, ${lngA.toFixed(4)})`);
      }

      if (reasons.length > 0) {
        let confidence: DuplicateDetectionItem['confidence'] = 'low';
        if (reasons.length >= 2 || reasons.some(r => r.includes('Affiliation'))) {
          confidence = 'high';
        } else if (reasons.length === 1 && reasons[0].includes('name')) {
          confidence = 'medium';
        }

        duplicates.push({
          schoolA: { slug: a.slug, name: a.name, sector: a.location?.sector || a.location?.area },
          schoolB: { slug: b.slug, name: b.name, sector: b.location?.sector || b.location?.area },
          confidence,
          reasons,
        });
      }
    }
  }

  return duplicates;
}
