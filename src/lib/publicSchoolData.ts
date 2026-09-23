import 'server-only';

import {
  getAdminSchoolBySlugAsync,
  getAdminSchoolsListAsync,
} from './schoolAdminService';
import type { School } from '../../data/schoolsData';

function toPublicSchool(value: School): School {
  return value;
}

export async function getPublicSchoolsAsync(options?: {
  includeAliases?: boolean;
  includeArchived?: boolean;
}): Promise<School[]> {
  const records = await getAdminSchoolsListAsync({
    includeArchived: Boolean(options?.includeArchived),
  });

  return records
    .filter((school) => options?.includeArchived || !school.isArchived)
    .filter((school) => options?.includeAliases || !school.isDuplicate)
    .map(({ completeness: _completeness, ...school }) => toPublicSchool(school as School));
}

export async function getPublicSchoolBySlugAsync(slug: string): Promise<School | undefined> {
  const record = await getAdminSchoolBySlugAsync(slug);
  if (!record || record.isArchived) return undefined;
  return toPublicSchool(record);
}

export async function getPublicSchoolSlugsAsync(): Promise<string[]> {
  const schools = await getPublicSchoolsAsync();
  return schools.map((school) => school.slug);
}

export function getDistinctBoardsFromSchools(schools: School[]): string[] {
  const values = new Set<string>();
  for (const school of schools) {
    const boards = Array.isArray(school.board) ? school.board : [school.board];
    boards.filter(Boolean).forEach((board) => values.add(board));
  }
  return Array.from(values).sort();
}

export function getDistinctAreasFromSchools(schools: School[]): string[] {
  const values = new Set<string>();
  for (const school of schools) {
    if (school.location?.area) values.add(school.location.area);
    if (school.location?.sector) values.add(school.location.sector);
  }
  return Array.from(values).sort();
}

export async function filterPublicSchoolsAsync(options: {
  searchQuery?: string;
  board?: string[];
  area?: string[];
}): Promise<School[]> {
  const schools = await getPublicSchoolsAsync();
  const query = options.searchQuery?.trim().toLowerCase() || '';

  return schools.filter((school) => {
    const boards = Array.isArray(school.board) ? school.board : [school.board];
    if (
      query &&
      !school.name.toLowerCase().includes(query) &&
      !(school.shortName || '').toLowerCase().includes(query) &&
      !(school.location?.area || '').toLowerCase().includes(query) &&
      !(school.location?.sector || '').toLowerCase().includes(query) &&
      !boards.some((board) => board.toLowerCase().includes(query))
    ) {
      return false;
    }

    if (options.board?.length) {
      if (!boards.some((board) => options.board!.includes(board))) return false;
    }

    if (options.area?.length) {
      if (
        !options.area.includes(school.location?.area) &&
        !options.area.includes(school.location?.sector)
      ) {
        return false;
      }
    }

    return true;
  });
}
