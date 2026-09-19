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
    if (value === 'verified_from_source' || value === 'verified_official') {
      return (
        <Badge variant="success" size="sm" className={cn('bg-emerald-50 text-emerald-800 border-emerald-200 gap-1', className)}>
          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>Verified Fees</span>
        </Badge>
      );
    }
    if (value === 'calculated_from_official') {
      return (
        <Badge variant="info" size="sm" className={cn('bg-blue-50 text-blue-800 border-blue-200 gap-1', className)}>
          <CheckCircle2 className="w-3 h-3 text-blue-600" aria-hidden="true" />
          <span>Calculated Annual</span>
        </Badge>
      );
    }
    if (value === 'estimated_historical' || value === 'estimated') {
      return (
        <Badge variant="warning" size="sm" className={cn('bg-amber-50 text-amber-800 border-amber-200 gap-1', className)}>
          <AlertCircle className="w-3 h-3 text-amber-600" aria-hidden="true" />
          <span>Historical Fee Reference</span>
        </Badge>
      );
    }
    if (value === 'unverified_third_party') {
      return (
        <Badge variant="warning" size="sm" className={cn('bg-amber-50 text-amber-800 border-amber-200 gap-1', className)}>
          <AlertCircle className="w-3 h-3 text-amber-600" aria-hidden="true" />
          <span>Third-Party Fee Reference</span>
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="sm" className={cn('bg-slate-100 text-slate-700 border-slate-200 gap-1', className)}>
        <AlertCircle className="w-3 h-3 text-slate-500" aria-hidden="true" />
        <span>Fee Audit Pending</span>
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
