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

export const AdmissionStatus: React.FC<AdmissionStatusProps> = ({
  admissions,
  className,
  showDate = true,
}) => {
  const statusLower = (admissions.status || '').toLowerCase();
  const isOpen = statusLower.includes('open') || statusLower.includes('ongoing') || statusLower.includes('active');

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Badge variant={isOpen ? 'success' : 'default'} size="sm" hasDot={isOpen}>
        {admissions.status || 'Enquire for Dates'}
      </Badge>
      {showDate && admissions.date && (
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-content-muted)]">
          <Calendar className="w-3 h-3 text-[var(--color-content-subtle)]" aria-hidden="true" />
          <span>{admissions.date}</span>
        </span>
      )}
    </div>
  );
};
