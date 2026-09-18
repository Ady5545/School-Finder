import React from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import type { SchoolAdmissions } from '../../types/school';

export interface AdmissionStatusProps {
  admissions: SchoolAdmissions;
  className?: string;
  showDate?: boolean;
}

export function formatAdmissionStatus(rawStatus?: string, session?: string): string {
  if (!rawStatus) return 'Enquire for Dates';
  const lower = rawStatus.toLowerCase().trim();
  const sessionLabel = session ? ` (${session})` : '';

  if (lower === 'open' || lower === 'admissions open') return `Admissions Open${sessionLabel || ' (2027–28)'}`;
  if (lower === 'pre_registration' || lower === 'pre-registration') return `Pre-Registration Open${sessionLabel || ' (2027–28)'}`;
  if (lower === 'not_open' || lower === 'not open') return `Admissions Not Yet Open${sessionLabel}`;
  if (lower === 'expected') return 'Admissions Expected Soon';
  if (lower === 'not_publicly_confirmed' || lower === 'pending') return 'Schedule Pending Confirmation';
  if (lower === 'closed') return 'Admissions Closed';
  if (lower === 'closing-soon' || lower === 'closing soon') return 'Closing Soon';
  // Replace simple hyphens in academic years with proper typographical en-dashes (e.g., 2027-28 -> 2027–28)
  return rawStatus.replace(/(\d{4})-(\d{2,4})/, '$1–$2');
}

export const AdmissionStatus: React.FC<AdmissionStatusProps> = ({
  admissions,
  className,
  showDate = true,
}) => {
  const rawStatus = admissions?.status || '';
  const statusLower = rawStatus.toLowerCase();
  const canonicalSession = admissions?.session || admissions?.academicYear;
  
  const isOpen = statusLower.includes('open') || statusLower.includes('ongoing') || statusLower.includes('active');
  const isClosingSoon = statusLower.includes('closing') || statusLower.includes('last chance');
  const isPending = statusLower.includes('pending') || statusLower.includes('inquire') || statusLower.includes('contact') || statusLower.includes('release');

  const displayStatus = formatAdmissionStatus(rawStatus, canonicalSession);

  const badgeVariant = isOpen ? 'success' : isClosingSoon ? 'warning' : 'default';

  return (
    <div className={cn('inline-flex flex-wrap items-center gap-1.5 max-w-full', className)}>
      <Badge
        variant={badgeVariant}
        size="sm"
        hasDot={isOpen || isClosingSoon}
        className={cn(
          'text-[10.5px] sm:text-[11px] font-semibold tracking-tight',
          'px-2 py-0.5 sm:px-2.5 sm:py-0.5',
          'leading-tight text-center whitespace-normal sm:whitespace-nowrap',
          'max-w-full inline-flex items-center justify-center',
          isPending && 'bg-amber-50/80 text-amber-900 border-amber-200/90 font-medium'
        )}
      >
        <span>{displayStatus}</span>
      </Badge>
      {showDate && admissions.date && (
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-content-muted)] shrink-0">
          <Calendar className="w-3 h-3 text-[var(--color-content-subtle)]" aria-hidden="true" />
          <span>{admissions.date}</span>
        </span>
      )}
    </div>
  );
};
