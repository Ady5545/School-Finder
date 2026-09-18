export type {
  School,
  SchoolLocation,
  SchoolFees,
  FeeItem,
  FeeFrequency,
  FeeVerificationStatus,
  DetailedFeeComponent,
  GradeWiseFeeTier,
  FeeConcession,
  FeeCircularDocument,
  TransportZoneSchedule,
  HistoricalFeeStructure,
  Facility,
  UniformItem,
  SchoolUniforms,
  SchoolAdmissions,
  SchoolContact,
  SchoolRating,
  SchoolAssets,
  SchoolVerification,
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
