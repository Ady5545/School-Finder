import React from 'react';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SchoolBadgeProps {
  type: 'board' | 'verification' | 'schoolType' | 'dayBoarding' | 'verified';
  value: string;
  className?: string;
}

export const SchoolBadge: React.FC<SchoolBadgeProps> = ({ type, value, className }) => {
  if (type === 'verified' || value === 'verified_official' || value === 'VERIFIED') {
    return (
      <Badge variant="success" size="sm" className={cn('bg-emerald-50 text-emerald-800 border-emerald-200 gap-1 font-semibold', className)}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>Verified</span>
      </Badge>
    );
  }

  if (type === 'board') {
    return (
      <Badge variant="primary" size="sm" className={className}>
        {value}
      </Badge>
    );
  }

  if (type === 'verification') {
    if (value === 'verified_from_source') {
      return (
        <Badge variant="success" size="sm" className={className}>
          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>Verified Fees</span>
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="sm" className={className}>
        <AlertCircle className="w-3 h-3 text-amber-600" aria-hidden="true" />
        <span>Audit Pending</span>
      </Badge>
    );
  }

  if (type === 'schoolType') {
    return (
      <Badge variant="default" size="sm" className={className}>
        {value}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" size="sm" className={className}>
      {value}
    </Badge>
  );
};
