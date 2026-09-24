import type { School } from '../../data/schoolsData';
import { schools } from '../../data/schoolsData';
import { getManagedSchoolsCollection, isMongoConfigured } from './mongodb';

// Keep the CMS highly fresh. Admin writes also invalidate this cache immediately on the current instance.
const CACHE_TTL_MS = 1_000;

type ManagedCache = {
  schools: School[];
  expiresAt: number;
  promise?: Promise<School[]>;
};

const globalManaged = globalThis as unknown as {
  __ADMISSION_PITARA_MANAGED_SCHOOLS_CACHE__?: ManagedCache;
};

function getCache(): ManagedCache {
  if (!globalManaged.__ADMISSION_PITARA_MANAGED_SCHOOLS_CACHE__) {
    globalManaged.__ADMISSION_PITARA_MANAGED_SCHOOLS_CACHE__ = {
      schools: [],
      expiresAt: 0,
    };
  }
  return globalManaged.__ADMISSION_PITARA_MANAGED_SCHOOLS_CACHE__;
}

function sortCanonical(list: School[]): School[] {
  const featuredSlug = 'delhi-world-public-school-kp-5';
  return [...list].sort((a, b) => {
    if (a.slug === featuredSlug) return -1;
    if (b.slug === featuredSlug) return 1;
    return 0;
  });
}

export function invalidateManagedSchoolsCache(): void {
  const cache = getCache();
  cache.expiresAt = 0;
  cache.promise = undefined;
}

export async function getManagedSchoolRecordsAsync(): Promise<School[]> {
  if (!isMongoConfigured()) return [];

  const cache = getCache();
  const now = Date.now();
  if (cache.schools.length > 0 && cache.expiresAt > now) {
    return cache.schools;
  }
  if (cache.promise) return cache.promise;

  cache.promise = (async () => {
    try {
      const collection = await getManagedSchoolsCollection(false);
      if (!collection) return [];

      const docs = await collection.find({}).sort({ updatedAt: 1 }).toArray();
      const normalized = docs.map(doc => {
        const { _id, updatedAt, updatedBy, updateReason, ...school } = doc as any;
        return school as School;
      });

      cache.schools = normalized;
      cache.expiresAt = Date.now() + CACHE_TTL_MS;
      return normalized;
    } catch (error) {
      // A temporary CMS database outage must not take the public school directory down.
      console.warn('[MANAGED_SCHOOLS_READ]', error);
      cache.schools = [];
      cache.expiresAt = 0;
      return [];
    }
  })().finally(() => {
    cache.promise = undefined;
  });

  return cache.promise;
}

export async function getEffectiveSchoolsAsync(): Promise<School[]> {
  const managed = await getManagedSchoolRecordsAsync();
  if (managed.length === 0) return schools;

  const managedBySlug = new Map(managed.map(s => [s.slug, s]));
  const merged = schools.map(base => managedBySlug.get(base.slug) || base);
  const baseSlugs = new Set(schools.map(s => s.slug));

  for (const managedSchool of managed) {
    if (!baseSlugs.has(managedSchool.slug)) merged.push(managedSchool);
  }

  return merged;
}

export async function getEffectiveCanonicalSchoolsAsync(): Promise<School[]> {
  const all = await getEffectiveSchoolsAsync();
  return sortCanonical(all.filter(s => !s.isDuplicate && !s.isArchived));
}

export async function getEffectiveSchoolBySlugAsync(slug: string): Promise<School | undefined> {
  if (!slug) return undefined;
  const all = await getEffectiveSchoolsAsync();
  return all.find(s => s.slug === slug || s.id === slug);
}

export async function getEffectivePublicSchoolBySlugAsync(slug: string): Promise<School | undefined> {
  const school = await getEffectiveSchoolBySlugAsync(slug);
  if (!school || school.isArchived || school.isDuplicate) return undefined;
  return school;
}
