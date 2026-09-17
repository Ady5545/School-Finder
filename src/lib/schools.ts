import {
  schools,
  type School,
  getSchoolBySlug as getBySlug,
  getCanonicalSchools,
  getArchivedSchools,
  getCanonicalSchoolsCount,
  getCanonicalSlug,
  getRawSchools,
} from '../../data/schoolsData';
import type { SchoolFilterOptions } from '../types/school';

export {
  getCanonicalSchools,
  getArchivedSchools,
  getCanonicalSchoolsCount,
  getCanonicalSlug,
  getRawSchools,
};

/**
 * Returns canonical unique active schools by default.
 * Pass { includeAliases: true, includeArchived: true } for full dataset access.
 */
export function getAllSchools(options?: { includeAliases?: boolean; includeArchived?: boolean }): School[] {
  if (options?.includeAliases && options?.includeArchived) {
    return schools;
  }
  if (options?.includeArchived) {
    return schools.filter(s => !s.isDuplicate);
  }
  if (options?.includeAliases) {
    return schools.filter(s => !s.isArchived);
  }
  return getCanonicalSchools();
}

/**
 * All 62 slugs so static routes and legacy URLs continue resolving without 404s.
 */
export function getAllSchoolSlugs(): string[] {
  return schools.map(s => s.slug);
}

export function getSchoolBySlug(slug: string): School | undefined {
  if (!slug) return undefined;
  return getBySlug(slug);
}

export function getSchoolByLegacyFile(filePath: string): School | undefined {
  if (!filePath) return undefined;
  const clean = filePath.replace(/^\/+/, '');
  return schools.find(
    s =>
      s.legacyIdentifiers.pageFile === clean ||
      s.legacyIdentifiers.pageFile === filePath ||
      s.legacyIdentifiers.cardLink.includes(clean) ||
      s.legacyIdentifiers.legacyUrls.includes(clean) ||
      s.legacyIdentifiers.legacyUrls.includes('/' + clean) ||
      s.legacyIdentifiers.legacyUrls.includes(filePath)
  );
}

export function getPopularSchools(limit: number = 4): School[] {
  // Sort canonical schools by rating score descending, then reviewsCount
  return [...getCanonicalSchools()]
    .sort((a, b) => b.rating.score - a.rating.score || b.rating.reviewsCount - a.rating.reviewsCount)
    .slice(0, limit);
}

export function getDistinctAreas(): string[] {
  const areas = new Set<string>();
  getCanonicalSchools().forEach(s => {
    if (s.location.area) areas.add(s.location.area);
    if (s.location.sector) areas.add(s.location.sector);
  });
  return Array.from(areas).sort();
}

export function getDistinctBoards(): string[] {
  const boards = new Set<string>();
  getCanonicalSchools().forEach(s => {
    s.board.forEach(b => boards.add(b));
  });
  return Array.from(boards).sort();
}

export function filterSchools(options: SchoolFilterOptions): School[] {
  const baseSchools = getCanonicalSchools();
  return baseSchools.filter(school => {
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchName = school.name.toLowerCase().includes(q);
      const matchShort = school.shortName.toLowerCase().includes(q);
      const matchAlt = school.alternateNames.some(alt => alt.toLowerCase().includes(q));
      const matchArea = school.location.area.toLowerCase().includes(q);
      const matchSector = school.location.sector.toLowerCase().includes(q);
      const matchBoard = school.board.some(b => b.toLowerCase().includes(q));
      if (!matchName && !matchShort && !matchAlt && !matchArea && !matchSector && !matchBoard) {
        return false;
      }
    }

    if (options.board && options.board.length > 0) {
      const hasBoard = school.board.some(b => options.board!.includes(b));
      if (!hasBoard) return false;
    }

    if (options.maxFee !== undefined && options.maxFee > 0) {
      if (school.fees.cardFee > options.maxFee) return false;
    }

    if (options.area && options.area.length > 0) {
      const hasArea = options.area.includes(school.location.area) || options.area.includes(school.location.sector);
      if (!hasArea) return false;
    }

    if (options.schoolType && options.schoolType.length > 0) {
      if (!options.schoolType.includes(school.schoolType)) return false;
    }

    return true;
  });
}
