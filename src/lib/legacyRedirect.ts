import { resolveLegacyUrl } from '../../data/schoolsData';

export interface LegacyResolutionResult {
  isLegacy: boolean;
  canonicalSlug: string | null;
  canonicalPath: string | null;
  schoolName: string | null;
}

export function resolveLegacyPath(pathname: string): LegacyResolutionResult {
  const school = resolveLegacyUrl(pathname);
  if (school) {
    return {
      isLegacy: true,
      canonicalSlug: school.slug,
      canonicalPath: `/schools/${school.slug}`,
      schoolName: school.name,
    };
  }

  return {
    isLegacy: false,
    canonicalSlug: null,
    canonicalPath: null,
    schoolName: null,
  };
}
