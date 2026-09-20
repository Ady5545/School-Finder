export type ApplicationTrackerStatus =
  | 'researching'
  | 'visit_planned'
  | 'application_started'
  | 'documents_pending'
  | 'submitted'
  | 'school_shortlisted'
  | 'offer_received'
  | 'waitlisted'
  | 'rejected'
  | 'enrolled';

export interface ApplicationTrackerItem {
  id: string;
  schoolSlug: string;
  schoolName: string;
  status: ApplicationTrackerStatus;
  notes?: string;
  applicationUrl?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const APPLICATION_TRACKER_STATUSES: Array<{ value: ApplicationTrackerStatus; label: string }> = [
  { value: 'researching', label: 'Researching' },
  { value: 'visit_planned', label: 'Visit planned' },
  { value: 'application_started', label: 'Application started' },
  { value: 'documents_pending', label: 'Documents pending' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'school_shortlisted', label: 'School shortlisted' },
  { value: 'offer_received', label: 'Offer received' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'rejected', label: 'Not selected' },
  { value: 'enrolled', label: 'Enrolled' },
];
