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
 * Returns every school slug so static routes and legacy URLs continue resolving without 404s.
 */
export function getAllSchoolSlugs(): string[] {
  return schools.filter(s => s.slug !== 'mount-vinson-school').map(s => s.slug);
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
    const sBoards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
    sBoards.forEach(b => boards.add(b));
  });
  return Array.from(boards).sort();
}

// Small Levenshtein distance, used only as a typo-tolerant fallback when a
// search query has no direct substring match anywhere - so "Ramgya" still
// finds "Ramagya" without weakening how exact/substring matches are scored.
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function fuzzyWordMatch(query: string, text: string): boolean {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  // Allow 1 typo for short words, 2 for longer ones - tight enough that
  // unrelated short words don't start matching by coincidence.
  return words.some(w => {
    const maxDist = w.length <= 5 ? 1 : 2;
    return levenshtein(query, w) <= maxDist;
  });
}

export function filterSchools(options: SchoolFilterOptions): School[] {
  const baseSchools = getCanonicalSchools();
  const q = options.searchQuery?.toLowerCase().trim() || '';

  const scored = baseSchools
    .map(school => {
      const schoolBoards = Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[];

      let relevance = 0;
      if (q) {
        const nameLower = school.name.toLowerCase();
        const shortLower = school.shortName?.toLowerCase() || '';
        const matchName = nameLower.includes(q);
        const matchShort = shortLower.includes(q);
        const matchAlt = school.alternateNames?.some(alt => alt.toLowerCase().includes(q));
        const matchArea = (school.location?.area || '').toLowerCase().includes(q);
        const matchSector = (school.location?.sector || '').toLowerCase().includes(q);
        const matchBoard = schoolBoards.some(b => b.toLowerCase().includes(q));
        const anyDirectMatch = matchName || matchShort || matchAlt || matchArea || matchSector || matchBoard;

        // Typo-tolerant fallback only kicks in when nothing matched directly,
        // and only against the name/shortName (where typos actually matter).
        const matchFuzzy = !anyDirectMatch && q.length >= 4 && (fuzzyWordMatch(q, nameLower) || fuzzyWordMatch(q, shortLower));

        if (!anyDirectMatch && !matchFuzzy) return null;

        // Relevance: exact/prefix name match ranks highest, then substring
        // name match, then short name, then everything else, with fuzzy
        // matches ranked lowest since they're the least certain.
        if (nameLower === q) relevance = 100;
        else if (nameLower.startsWith(q)) relevance = 90;
        else if (matchName) relevance = 80;
        else if (matchShort) relevance = 70;
        else if (matchAlt) relevance = 60;
        else if (matchArea || matchSector) relevance = 40;
        else if (matchBoard) relevance = 20;
        else if (matchFuzzy) relevance = 10;
      }

      return { school, relevance, schoolBoards };
    })
    .filter((entry): entry is { school: School; relevance: number; schoolBoards: string[] } => entry !== null)
    .filter(({ school, schoolBoards }) => {
      if (options.board && options.board.length > 0) {
        const hasBoard = schoolBoards.some(b => options.board!.includes(b));
        if (!hasBoard) return false;
      }

      if (options.maxFee !== undefined && options.maxFee > 0) {
        if (school.fees.cardFee !== null && school.fees.cardFee !== undefined && school.fees.cardFee > options.maxFee) {
          return false;
        }
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

  // Only reorder by relevance when there's an active search query - otherwise
  // preserve the existing dataset order so callers' own default sort (e.g.
  // SchoolDirectory's featured/fee-undisclosed-last logic) isn't disturbed.
  if (q) {
    scored.sort((a, b) => b.relevance - a.relevance);
  }

  return scored.map(entry => entry.school);
}
