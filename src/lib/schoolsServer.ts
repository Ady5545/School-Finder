import {
  type School,
} from '../../data/schoolsData';
import { schools } from '../../data/schoolsData';
import type { SchoolFilterOptions } from '../types/school';
import {
  getEffectiveSchoolsAsync,
  getEffectiveCanonicalSchoolsAsync,
  getEffectiveSchoolBySlugAsync,
  getEffectivePublicSchoolBySlugAsync,
} from './managedSchools';

export async function getAllSchoolsAsync(options?: { includeAliases?: boolean; includeArchived?: boolean }): Promise<School[]> {
  const base = await getEffectiveSchoolsAsync();
  if (options?.includeAliases && options?.includeArchived) return base;
  if (options?.includeArchived) return base.filter(s => !s.isDuplicate);
  if (options?.includeAliases) return base.filter(s => !s.isArchived);
  return getEffectiveCanonicalSchoolsAsync();
}

export async function getCanonicalSchoolsAsync(): Promise<School[]> {
  return getEffectiveCanonicalSchoolsAsync();
}

export async function getArchivedSchoolsAsync(): Promise<School[]> {
  const all = await getEffectiveSchoolsAsync();
  return all.filter(s => Boolean(s.isArchived));
}

export async function getAllSchoolSlugsAsync(): Promise<string[]> {
  const all = await getEffectiveSchoolsAsync();
  return all.filter(s => s.slug !== 'mount-vinson-school').map(s => s.slug);
}

export async function getSchoolBySlugAsync(slug: string): Promise<School | undefined> {
  return getEffectiveSchoolBySlugAsync(slug);
}

export async function getPublicSchoolBySlugAsync(slug: string): Promise<School | undefined> {
  return getEffectivePublicSchoolBySlugAsync(slug);
}

export async function getDistinctAreasAsync(): Promise<string[]> {
  const all = await getEffectiveCanonicalSchoolsAsync();
  const areas = new Set<string>();
  all.forEach(s => {
    if (s.location.area) areas.add(s.location.area);
    if (s.location.sector) areas.add(s.location.sector);
  });
  return Array.from(areas).sort();
}

export async function getDistinctBoardsAsync(): Promise<string[]> {
  const all = await getEffectiveCanonicalSchoolsAsync();
  const boards = new Set<string>();
  all.forEach(s => {
    const sBoards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
    sBoards.forEach(b => boards.add(b));
  });
  return Array.from(boards).sort();
}

function levenshteinServer(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function fuzzyWordMatchServer(query: string, text: string): boolean {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  return words.some(w => levenshteinServer(query, w) <= (w.length <= 5 ? 1 : 2));
}

export async function filterSchoolsAsync(options: SchoolFilterOptions): Promise<School[]> {
  const baseSchools = await getEffectiveCanonicalSchoolsAsync();
  const q = options.searchQuery?.toLowerCase().trim() || '';
  const selectedBoards = options.board || [];
  const selectedAreas = options.area || [];

  return baseSchools
    .map(school => {
      const schoolBoards = Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[];
      let relevance = 0;
      if (q) {
        const nameLower = school.name.toLowerCase();
        const shortLower = school.shortName?.toLowerCase() || '';
        const haystack = [
          school.name,
          school.shortName,
          school.location?.area,
          school.location?.sector,
          school.location?.address,
          ...(Array.isArray(school.alternateNames) ? school.alternateNames : []),
          ...schoolBoards,
        ].filter(Boolean).join(' ').toLowerCase();
        const matchName = nameLower.includes(q);
        const matchShort = shortLower.includes(q);
        const matchAlt = school.alternateNames?.some(alt => alt.toLowerCase().includes(q));
        const matchArea = (school.location?.area || '').toLowerCase().includes(q);
        const matchSector = (school.location?.sector || '').toLowerCase().includes(q);
        const matchAddress = (school.location?.address || '').toLowerCase().includes(q);
        const matchBoard = schoolBoards.some(b => b.toLowerCase().includes(q));
        const matchFuzzy = !matchName && !matchShort && !matchAlt && !matchArea && !matchSector && !matchAddress && !matchBoard &&
          q.length >= 4 && fuzzyWordMatchServer(q, haystack);
        if (!matchName && !matchShort && !matchAlt && !matchArea && !matchSector && !matchAddress && !matchBoard && !matchFuzzy) return null;
        relevance = nameLower === q ? 100 : nameLower.startsWith(q) ? 90 : matchName ? 80 : matchShort ? 70 : matchAlt ? 60 : matchFuzzy ? 20 : 40;
      }
      if (selectedBoards.length > 0 && !schoolBoards.some(b => selectedBoards.some(sel => b.toLowerCase().includes(sel.toLowerCase())))) return null;
      if (selectedAreas.length > 0 && !selectedAreas.some(sel =>
        (school.location?.area + ' ' + school.location?.sector + ' ' + school.location?.address).toLowerCase().includes(sel.toLowerCase())
      )) return null;
      return { school, relevance };
    })
    .filter((item): item is { school: School; relevance: number } => Boolean(item))
    .sort((a, b) => b.relevance - a.relevance)
    .map(item => item.school);
}
