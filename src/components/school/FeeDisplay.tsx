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

function getConsistentAnnualDisplay(fees: SchoolFees): string {
  const candidates = [fees.tuitionAnnual, fees.annualDisplay, fees.rangeText].filter(Boolean) as string[];
  const annual = candidates.find(value => /year|annual|calculated/i.test(value) && !/avg\.?\)/i.test(value));
  if (annual) {
    return annual
      .replace(/\s*\((?:calculated|calculated from[^)]*|calculated annual)[^)]*\)/gi, '')
      .replace(/\s*\/\s*year/gi, ' / year')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  const exact = candidates.find(value => !/avg\.?\)/i.test(value));
  return exact ? exact.replace(/\s*\(avg\.?\)/gi, '').trim() : '';
}

export const FeeDisplay: React.FC<FeeDisplayProps> = ({ fees, variant = 'compact', className }) => {
  const annualDisplay = getConsistentAnnualDisplay(fees) || (
    fees.billingFrequency === 'annual' && fees.cardFee
      ? formatCurrency(fees.cardFee)
      : ''
  );

  // Card pricing is deliberately normalized to an annual exact/range figure when the dataset supports one.
  const isComparable =
    fees.disclosed !== false &&
    fees.comparableAnnualAvailable !== false &&
    Boolean(annualDisplay);

  const isHistorical =
    fees.verificationStatus === 'estimated_historical' ||
    fees.verificationStatus === 'estimated';

  const isUndisclosed =
    fees.disclosed === false ||
    fees.verificationStatus === 'not_publicly_verified' ||
    fees.verificationStatus === 'unverified_undisclosed' ||
    fees.verificationStatus === 'unverified_copied_from_wisdom_tree' ||
    !fees.cardFee;

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
    : isHistorical
    ? 'Fee figures reflect historical 2023–24 institutional data and are provided for indicative reference only. Not certified for 2027–28.'
    : 'Fee structure is not published publicly. Direct inquiry with the school admission office is required.';

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
                setShowTooltip((prev) => !prev);
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
                className="absolute bottom-full left-0 mb-2 w-56 sm:w-60 p-2.5 rounded-xl bg-[#0f172a] text-white text-[11px] leading-relaxed shadow-xl border border-slate-700/80 z-40 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="font-bold text-[10.5px] text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>Fee Details &amp; Scope</span>
                </div>
                <p className="text-slate-200">{tooltipExplanation}</p>
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
                {annualDisplay}
              </span>
            </>
          ) : isHistorical ? (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {annualDisplay || fees.rangeText || 'Historical Reference'}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Not publicly disclosed
            </span>
          )}
        </div>
      </div>
    );
  }

  // Detailed Sidebar Card Variant
  const componentsToDisplay = fees.components || [];

  return (
    <div className={cn('rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-xs space-y-4', className)}>
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-content-muted)]">
              {isHistorical ? 'Historical Fee Reference' : 'Annual Fee Estimate'}
            </span>
            <div className="relative inline-flex items-center" ref={tooltipRef}>
              <button
                type="button"
                id="detailed-fee-info-icon"
                aria-label="Annual Fee details tooltip"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTooltip((prev) => !prev);
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
                  <p className="text-slate-200">{tooltipExplanation}</p>
                  <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-[#0f172a]" />
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              'font-black mt-0.5',
              isComparable
                ? 'text-2xl text-[var(--color-primary)]'
                : isHistorical
                ? 'text-lg text-amber-900'
                : 'text-base text-slate-700'
            )}
          >
            {isComparable
              ? annualDisplay
              : isHistorical
              ? fees.rangeText || 'Historical Reference'
              : 'Not publicly disclosed'}
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

      {/* Component Item Table */}
      {componentsToDisplay.length > 0 ? (
        <div className="space-y-1.5 divide-y divide-[var(--color-border-subtle)]">
          {componentsToDisplay.slice(0, 4).map((item) => (
            <div key={item.id} className="flex justify-between text-xs py-1.5 first:pt-0">
              <span className="text-[var(--color-content-muted)]">{item.name}</span>
              <span className="font-bold text-[var(--color-content)] font-mono">{item.formattedAmount}</span>
            </div>
          ))}
        </div>
      ) : fees.table && fees.table.length > 0 ? (
        <div className="space-y-1.5 divide-y divide-[var(--color-border-subtle)]">
          {fees.table.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs py-1.5 first:pt-0">
              <span className="text-[var(--color-content-muted)]">{item.type}</span>
              <span className="font-bold text-[var(--color-content)]">{item.cost}</span>
            </div>
          ))}
        </div>
      ) : null}

      {isHistorical && (
        <p className="text-[11px] text-amber-800 bg-amber-50/90 border border-amber-200 p-2.5 rounded-xl leading-relaxed">
          <strong>Note:</strong> Historical reference only. Certified current pricing must be verified directly with school administration.
        </p>
      )}

      {isUndisclosed && (
        <p className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 p-2.5 rounded-xl leading-relaxed">
          This institution has not released a public fee schedule. Consult admissions for official prospectus.
        </p>
      )}
    </div>
  );
};
