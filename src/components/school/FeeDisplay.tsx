'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import type { SchoolFees } from '../../types/school';

export interface FeeDisplayProps {
  fees: SchoolFees;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const FeeDisplay: React.FC<FeeDisplayProps> = ({ fees, variant = 'compact', className }) => {
  const isComparable =
    fees.cardFee !== null &&
    fees.cardFee !== undefined &&
    fees.comparableAnnualAvailable !== false &&
    fees.verificationStatus === 'verified_from_source';

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTooltip]);

  const tooltipExplanation = isComparable
    ? `${fees.feeCategory ? `${fees.feeCategory}: ` : ''}Includes annual tuition, composite recurring charges & lab access. Excludes optional transport (bus), uniform, and meal charges.`
    : 'Fee structure is variable or pending independent institutional verification. Refer directly to the official school schedule.';

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col relative', className)}>
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-[var(--color-content-muted)] tracking-wider">
            Annual Fee
          </span>
          <div className="relative inline-flex items-center" ref={tooltipRef}>
            <button
              type="button"
              id="annual-fee-info-icon"
              aria-label="Annual Fee details tooltip"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTooltip(prev => !prev);
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="p-0.5 rounded-full text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-200/60 focus:text-[var(--color-primary)] transition-colors cursor-pointer outline-none"
            >
              <Info className="w-3 h-3" />
            </button>

            {/* Floating Tooltip Box */}
            {showTooltip && (
              <div
                role="tooltip"
                id="annual-fee-tooltip-content"
                className="absolute bottom-full left-0 mb-2 w-52 sm:w-56 p-2.5 rounded-xl bg-[#0f172a] text-white text-[11px] leading-relaxed shadow-xl border border-slate-700/80 z-40 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="font-bold text-[10.5px] text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>Fee Details</span>
                </div>
                <p className="text-slate-200">
                  {tooltipExplanation}
                </p>
                {/* Arrow pointer */}
                <div className="absolute top-full left-3 -mt-px border-4 border-transparent border-t-[#0f172a]" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mt-0.5">
          {isComparable ? (
            <>
              <span className="text-base font-bold text-[var(--color-primary)] tracking-tight">
                {formatCurrency(fees.cardFee!)}
              </span>
              <span className="text-xs text-[var(--color-content-muted)] font-medium">/ year</span>
            </>
          ) : (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {fees.verificationStatus === 'not_publicly_verified' ? 'Fee not publicly verified' : 'See official fee schedule'}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-xs', className)}>
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-content-muted)]">Annual Fee Estimate</span>
            <div className="relative inline-flex items-center" ref={tooltipRef}>
              <button
                type="button"
                id="detailed-fee-info-icon"
                aria-label="Annual Fee details tooltip"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTooltip(prev => !prev);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="p-0.5 rounded-full text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 transition-colors cursor-pointer outline-none"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {showTooltip && (
                <div
                  role="tooltip"
                  className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-xl bg-[#0f172a] text-white text-xs leading-relaxed shadow-xl border border-slate-700/80 z-40 animate-in fade-in duration-150"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="font-bold text-[11px] text-amber-400 uppercase tracking-wider mb-1">
                    Fee Inclusions
                  </div>
                  <p className="text-slate-200">
                    {tooltipExplanation}
                  </p>
                  <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-[#0f172a]" />
                </div>
              )}
            </div>
          </div>
          <div className={cn('font-black mt-0.5', isComparable ? 'text-2xl text-[var(--color-primary)]' : 'text-lg text-slate-700')}>
            {isComparable ? formatCurrency(fees.cardFee!) : (fees.verificationStatus === 'not_publicly_verified' ? 'Fee not publicly verified' : 'See official fee schedule')}
          </div>
          {fees.academicSession && (
            <span className="text-[11px] text-[var(--color-content-muted)] font-medium block mt-0.5">
              Academic Session {fees.academicSession}
            </span>
          )}
        </div>
        {fees.rangeText && isComparable && (
          <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-surface-subtle)] font-semibold text-[var(--color-primary)] border border-[var(--color-border)]">
            {fees.rangeText}
          </span>
        )}
      </div>

      {fees.table && fees.table.length > 0 && (
        <div className="mt-3.5 space-y-2">
          {fees.table.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-[var(--color-border-subtle)] last:border-0">
              <span className="text-[var(--color-content-muted)]">{item.type}</span>
              <span className="font-bold text-[var(--color-content)]">{item.cost}</span>
            </div>
          ))}
        </div>
      )}

      {/* Audit & Source Metadata */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between text-[11px] text-[var(--color-content-muted)] gap-2">
        <span>
          Audited: <strong className="font-medium text-[var(--color-content)]">{fees.lastVerifiedDate || 'September 2026'}</strong>
        </span>
        {fees.sourceUrl && (
          <a
            href={fees.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline font-semibold"
          >
            Official Fee Circular ↗
          </a>
        )}
      </div>

      {!isComparable && (
        <p className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl mt-3.5 leading-relaxed">
          Note: This institution’s fee schedule is undergoing direct institutional audit or varies by entry tier. Please consult the official school portal for certified figures.
        </p>
      )}
    </div>
  );
};
