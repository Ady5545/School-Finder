import type { School } from '../types/school';
import { isSafeStoredSchoolCoordinate } from './locationSafety';

export type DataTrustSignal = {
  key: 'profile' | 'fees' | 'admissions' | 'location';
  label: string;
  detail: string;
  checked: boolean;
  sourceUrl?: string | null;
  checkedAt?: string | null;
};

export function getSchoolTrustSignals(school: School): DataTrustSignal[] {
  const profileVerified = school.verification?.isVerified === true;
  const feeVerified =
    school.fees?.verificationStatus === 'verified_from_source' ||
    school.fees?.isVerified === true;
  const admissionsChecked = Boolean(
    school.admissions?.lastVerifiedDate &&
    (school.admissions?.sourceUrl || school.admissions?.verificationStatus)
  );
  const locationVerified = isSafeStoredSchoolCoordinate(school.location?.coordinates);

  return [
    {
      key: 'profile',
      label: 'School profile',
      detail: profileVerified
        ? 'Name, address and institutional details have an identified source.'
        : 'Institutional details are still awaiting direct verification.',
      checked: profileVerified,
      sourceUrl: school.verification?.sourceUrl || null,
      checkedAt: school.verification?.lastVerified || null,
    },
    {
      key: 'fees',
      label: 'Fee information',
      detail: feeVerified
        ? 'Fee figures are tied to a documented source or verified fee record.'
        : 'Fee information needs an additional source check before being treated as verified.',
      checked: feeVerified,
      sourceUrl: school.fees?.sourceUrl || null,
      checkedAt: school.fees?.lastVerifiedDate || null,
    },
    {
      key: 'admissions',
      label: 'Admissions',
      detail: admissionsChecked
        ? 'The admissions section has a recorded verification date and source context.'
        : 'Specific admissions timing is not fully verified yet.',
      checked: admissionsChecked,
      sourceUrl: school.admissions?.sourceUrl || null,
      checkedAt: school.admissions?.lastVerifiedDate || null,
    },
    {
      key: 'location',
      label: 'Map location',
      detail: locationVerified
        ? 'This map coordinate is used only because the stored location is explicitly marked verified.'
        : 'No verified directory coordinate is currently used for this school.',
      checked: locationVerified,
      checkedAt: null,
    },
  ];
}

export function getSchoolTrustSummary(school: School) {
  const signals = getSchoolTrustSignals(school);
  const checked = signals.filter(signal => signal.checked).length;
  return {
    checked,
    total: signals.length,
    label: 'Evidence checked' as const,
  };
}
