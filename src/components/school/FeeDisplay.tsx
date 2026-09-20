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

function cleanFeeText(value: string): string {
  return value
    .replace(/\s*\((?:calculated|calculated from[^)]*|calculated annual)[^)]*\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function hasMonthlyMarker(value: string): boolean {
  return /\/\s*month|per\s+month|monthly/i.test(value);
}

function hasQuarterlyMarker(value: string): boolean {
  return /\/\s*quarter|per\s+quarter|quarterly/i.test(value);
}

function hasAnnualMarker(value: string): boolean {
  return /\/\s*year|per\s+year|annual(?:ly)?|per\s+annum|yearly/i.test(value);
}

function isPlainAnnualValue(value: string): boolean {
  return /^₹?\s*[\d,]+(?:\s*[–-]\s*₹?\s*[\d,]+)?$/i.test(value.trim());
}

type FeePresentationKind = 'annual' | 'monthly' | 'quarterly' | 'details' | 'unavailable';

interface FeePresentation {
  kind: FeePresentationKind;
  label: string;
  value: string;
}

function getFeePresentation(fees: SchoolFees): FeePresentation {
  const rawTuitionAnnual = typeof fees.tuitionAnnual === 'string' ? fees.tuitionAnnual : '';
  const rawAnnualDisplay = typeof fees.annualDisplay === 'string' ? fees.annualDisplay : '';
  const rawRangeText = typeof fees.rangeText === 'string' ? fees.rangeText : '';
  const tuitionAnnual = cleanFeeText(rawTuitionAnnual);
  const annualDisplay = cleanFeeText(rawAnnualDisplay);
  const rangeText = cleanFeeText(rawRangeText);
  const tuitionMonthly = typeof fees.tuitionMonthly === 'string' ? cleanFeeText(fees.tuitionMonthly) : '';
  const tuitionQuarterly = typeof fees.tuitionQuarterly === 'string' ? cleanFeeText(fees.tuitionQuarterly) : '';
  const tuitionAnnualCalculated = /calculated|derived/i.test(rawTuitionAnnual);
  const annualDisplayCalculated = /calculated|derived/i.test(rawAnnualDisplay);
  const rangeTextCalculated = /calculated|derived/i.test(rawRangeText);

  if (
    tuitionAnnual &&
    !hasMonthlyMarker(tuitionAnnual) &&
    !hasQuarterlyMarker(tuitionAnnual) &&
    (hasAnnualMarker(tuitionAnnual) || isPlainAnnualValue(tuitionAnnual))
  ) {
    const isCalculated = tuitionAnnualCalculated;
    return { kind: 'annual', label: isCalculated ? 'Annual Fee (calculated)' : 'Annual Fee', value: tuitionAnnual };
  }

  if (
    annualDisplay &&
    !hasMonthlyMarker(annualDisplay) &&
    !hasQuarterlyMarker(annualDisplay) &&
    (hasAnnualMarker(annualDisplay) || isPlainAnnualValue(annualDisplay))
  ) {
    const isCalculated = annualDisplayCalculated;
    return { kind: 'annual', label: isCalculated ? 'Annual Fee (calculated)' : 'Annual Fee', value: annualDisplay };
  }

  if (
    fees.billingFrequency === 'annual' &&
    typeof fees.cardFee === 'number' &&
    Number.isFinite(fees.cardFee)
  ) {
    return { kind: 'annual', label: 'Annual Fee', value: formatCurrency(fees.cardFee) };
  }

  if (rangeText && hasAnnualMarker(rangeText) && !hasMonthlyMarker(rangeText) && !hasQuarterlyMarker(rangeText)) {
    const isCalculated = rangeTextCalculated;
    return { kind: 'annual', label: isCalculated ? 'Annual Fee (calculated)' : 'Annual Fee', value: rangeText };
  }

  if (tuitionMonthly) {
    return { kind: 'monthly', label: 'Monthly Fee', value: tuitionMonthly };
  }

  const monthlyText = [annualDisplay, rangeText].find(value => value && hasMonthlyMarker(value));
  if (monthlyText) {
    return { kind: 'monthly', label: 'Monthly Fee', value: monthlyText };
  }

  if (tuitionQuarterly) {
    return { kind: 'quarterly', label: 'Quarterly Fee', value: tuitionQuarterly };
  }

  const quarterlyText = [annualDisplay, rangeText].find(value => value && hasQuarterlyMarker(value));
  if (quarterlyText) {
    return { kind: 'quarterly', label: 'Quarterly Fee', value: quarterlyText };
  }

  const detailText = fees.feeDisplayOverride || rangeText || annualDisplay;
  if (
    typeof detailText === 'string' &&
    detailText.trim() &&
    !/not publicly disclosed|not disclosed/i.test(detailText)
  ) {
    return { kind: 'details', label: 'Fee details available', value: cleanFeeText(detailText) };
  }

  return { kind: 'unavailable', label: 'Not publicly disclosed', value: '' };
}

export const FeeDisplay: React.FC<FeeDisplayProps> = ({ fees, variant = 'compact', className }) => {
  const presentation = getFeePresentation(fees);
  const isHistorical =
    fees.verificationStatus === 'estimated_historical' ||
    fees.verificationStatus === 'estimated';
  const verificationStatus = String(fees.verificationStatus || '').toLowerCase();
  const isSourceUnverified = [
    'user_supplied',
    'user_supplied_latest',
    'unverified_third_party',
    'pending_audit',
    'not_publicly_verified',
    'partially_verified',
  ].includes(verificationStatus);
  const isUndisclosed =
    presentation.kind === 'unavailable' ||
    fees.disclosed === false ||
    verificationStatus === 'unverified_undisclosed';
  const displayLabel = isHistorical ? 'Historical ' + presentation.label : presentation.label;

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

  const tooltipExplanation = isUndisclosed
    ? 'Fee structure is not published publicly. Direct inquiry with the school admission office is required.'
    : isHistorical
    ? displayLabel + ' shown for reference only. It is not certified for the 2027–28 cycle.'
    : (fees.feeCategory ? fees.feeCategory + ': ' : '') + presentation.label + ' shown from the available source data. Optional transport (bus), uniform, and meal charges may be separate.';
  const transparencyNote = isSourceUnverified
    ? 'This fee information has not been independently verified by Admission Pitara.'
    : '';

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col relative', className)}>
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-[var(--color-content-muted)] tracking-wider">
            {displayLabel}
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
          {presentation.kind === 'unavailable' ? (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Not publicly disclosed
            </span>
          ) : isHistorical ? (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {presentation.value}
            </span>
          ) : (
            <span className="text-base font-bold text-[var(--color-primary)] tracking-tight">
              {presentation.value}
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
              {displayLabel}
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
              presentation.kind === 'annual'
                ? 'text-2xl text-[var(--color-primary)]'
                : presentation.kind === 'unavailable'
                ? 'text-base text-slate-700'
                : 'text-xl text-[var(--color-primary)]'
            )}
          >
            {presentation.kind === 'unavailable' ? 'Not publicly disclosed' : presentation.value}
          </div>

          {fees.academicSession && (
            <span className="text-[11px] text-[var(--color-content-muted)] font-medium block mt-0.5">
              Academic Session {fees.academicSession}
            </span>
          )}
          {transparencyNote && (
            <span className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 px-2.5 py-1 rounded-md inline-block mt-2">
              {transparencyNote}
            </span>
          )}
        </div>

        {presentation.kind === 'annual' && fees.rangeText && hasAnnualMarker(fees.rangeText) && (
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
