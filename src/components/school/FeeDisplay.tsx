import React from 'react';
import { formatCurrency, cn } from '../../lib/utils';
import type { SchoolFees } from '../../types/school';

export interface FeeDisplayProps {
  fees: SchoolFees;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const FeeDisplay: React.FC<FeeDisplayProps> = ({ fees, variant = 'compact', className }) => {
  const isAuditPending = fees.verificationStatus === 'unverified_copied_from_wisdom_tree';

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col', className)}>
        <span className="text-[10px] uppercase font-semibold text-[var(--color-content-muted)] tracking-wider">
          Annual Est. Fee
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-base font-bold text-[var(--color-content)] tracking-tight">
            {isAuditPending ? 'Pending Verification' : formatCurrency(fees.cardFee)}
          </span>
          {!isAuditPending && (
            <span className="text-xs text-[var(--color-content-muted)]">/ year</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-[var(--color-border)] bg-white p-4', className)}>
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
        <div>
          <span className="text-xs font-medium text-[var(--color-content-muted)]">Annual Fee Estimate</span>
          <div className="text-xl font-bold text-[var(--color-content)] mt-0.5">
            {isAuditPending ? 'Pending Official Audit' : formatCurrency(fees.cardFee)}
          </div>
        </div>
        {fees.rangeText && (
          <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-surface-subtle)] font-medium text-[var(--color-content-muted)]">
            {fees.rangeText}
          </span>
        )}
      </div>

      {fees.table && fees.table.length > 0 && (
        <div className="mt-3 space-y-2">
          {fees.table.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-50 last:border-0">
              <span className="text-[var(--color-content-muted)]">{item.type}</span>
              <span className="font-semibold text-[var(--color-content)]">{item.cost}</span>
            </div>
          ))}
        </div>
      )}

      {isAuditPending && (
        <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg mt-3">
          Note: This school is undergoing independent fee verification. Official prospectus data will be published once audited.
        </p>
      )}
    </div>
  );
};
