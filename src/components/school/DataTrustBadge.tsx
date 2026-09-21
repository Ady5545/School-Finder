'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { School } from '../../types/school';
import { getSchoolTrustSummary } from '../../lib/dataTrust';
import { cn } from '../../lib/utils';

export const DataTrustBadge: React.FC<{ school: School; compact?: boolean }> = ({ school, compact = false }) => {
  const summary = getSchoolTrustSummary(school);
  const strong = true;

  return (
    <span
      title="Admission Pitara shows which key school facts are checked and which are still pending."
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold',
        compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]',
        strong
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : summary.checked > 0
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-slate-200 bg-slate-50 text-slate-700'
      )}
    >
      {strong ? (
        <ShieldCheck className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      ) : (
        <CheckCircle2 className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      )}
      <span>Evidence checked</span>
    </span>
  );
};
