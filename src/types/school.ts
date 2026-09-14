export type {
  School,
  SchoolLocation,
  SchoolFees,
  FeeItem,
  Facility,
  UniformItem,
  SchoolUniforms,
  SchoolAdmissions,
  SchoolContact,
  SchoolRating,
  SchoolAssets,
  LegacyIdentifiers,
} from '../../data/schoolsData';

export interface SchoolFilterOptions {
  searchQuery?: string;
  board?: string[];
  maxFee?: number;
  area?: string[];
  schoolType?: string[];
  admissionStatus?: string[];
}

export interface SchoolSortOption {
  field: 'name' | 'fee' | 'rating';
  direction: 'asc' | 'desc';
}
