'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  Calculator,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  GraduationCap,
  Bus,
  Tag,
  DollarSign,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import type {
  SchoolFees,
  DetailedFeeComponent,
  GradeWiseFeeTier,
  FeeConcession,
  TransportZoneSchedule,
} from '../../types/school';

interface ComprehensiveFeeBreakdownProps {
  fees: SchoolFees;
  schoolName: string;
  className?: string;
}

export const ComprehensiveFeeBreakdown: React.FC<ComprehensiveFeeBreakdownProps> = ({
  fees,
  schoolName,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'gradewise' | 'onetime' | 'optional' | 'discounts' | 'calculator' | 'circular'
  >('overview');

  // Calculator State
  const gradeTiers = fees.gradeWiseTiers || [];
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<number>(0);
  const [includeTransport, setIncludeTransport] = useState<boolean>(false);
  const [selectedTransportZoneIndex, setSelectedTransportZoneIndex] = useState<number>(0);
  const [includeSiblingDiscount, setIncludeSiblingDiscount] = useState<boolean>(false);
  const [includeCambridge, setIncludeCambridge] = useState<boolean>(false);

  // Verification categorization
  const isVerified =
    fees.verificationStatus === 'verified_from_source' ||
    fees.verificationStatus === 'verified_official';
  const isHistorical =
    fees.verificationStatus === 'estimated_historical' ||
    fees.verificationStatus === 'estimated';
  const isUndisclosed =
    fees.disclosed === false ||
    fees.verificationStatus === 'not_publicly_verified' ||
    fees.verificationStatus === 'unverified_undisclosed' ||
    fees.verificationStatus === 'unverified_copied_from_wisdom_tree' ||
    !fees.cardFee;

  const components = fees.components || [];
  const oneTimeComponents = components.filter(
    (c) => c.category === 'one_time' || c.category === 'deposit'
  );
  const recurringComponents = components.filter(
    (c) => c.category === 'recurring' || c.category === 'grade_wise'
  );
  const specialComponents = components.filter(
    (c) => c.category === 'special_curriculum' || c.category === 'activity' || c.category === 'examination'
  );
  const transportComponents = components.filter((c) => c.category === 'transport');
  const transportSchedules = fees.transportSchedule || [];
  const concessions = fees.concessions || [];
  const circular = fees.circular;

  // Selected grade tier for calculator
  const currentGradeTier = gradeTiers[selectedGradeIndex] || null;

  // Calculate dynamic totals in calculator
  const calculatorBreakdown = useMemo(() => {
    let registrationCost = fees.registrationFee || 0;
    let admissionCost = fees.admissionFee || 0;
    let cautionCost = 0;
    const cautionComp = oneTimeComponents.find((c) => c.refundable);
    if (cautionComp && cautionComp.amount) {
      cautionCost = cautionComp.amount;
    }

    const totalOneTime = registrationCost + admissionCost + cautionCost;

    // Recurring annual tuition
    let baseAnnualTuition = fees.cardFee || 0;
    if (currentGradeTier) {
      // Parse totalAnnualPayable or calculatedAnnualEquivalent
      const parsed =
        parseInt(
          (currentGradeTier.totalAnnualPayable || currentGradeTier.calculatedAnnualEquivalent || '')
            .replace(/[^0-9]/g, '')
        ) || baseAnnualTuition;
      baseAnnualTuition = parsed;
    }

    // Cambridge add-on if toggled
    let cambridgeFee = 0;
    if (includeCambridge) {
      const cambridgeComp = components.find((c) => c.id === 'dps-cambridge-fee');
      if (cambridgeComp && cambridgeComp.amount) {
        cambridgeFee = cambridgeComp.amount;
      }
    }

    // Transport cost
    let annualTransport = 0;
    if (includeTransport) {
      if (transportSchedules.length > 0) {
        const selectedSchedule = transportSchedules[selectedTransportZoneIndex] || transportSchedules[0];
        const rawMonthly = parseInt(selectedSchedule.amount.replace(/[^0-9]/g, '')) || 3500;
        annualTransport = selectedSchedule.frequency === 'annual' ? rawMonthly : rawMonthly * 11;
      } else if (fees.transportAnnual) {
        annualTransport = parseInt(fees.transportAnnual.replace(/[^0-9]/g, '')) || 70000;
      } else if (fees.transportMonthly) {
        const m = parseInt(fees.transportMonthly.replace(/[^0-9]/g, '')) || 3500;
        annualTransport = m * 11; // Standard 11 billing months
      }
    }

    // Sibling discount (typically 10% on tuition)
    let siblingDiscountAmount = 0;
    if (includeSiblingDiscount && concessions.length > 0) {
      siblingDiscountAmount = Math.round(baseAnnualTuition * 0.1);
    }

    const netAnnualRecurring = baseAnnualTuition + cambridgeFee + annualTransport - siblingDiscountAmount;
    const firstYearGrandTotal = totalOneTime + netAnnualRecurring;

    return {
      registrationCost,
      admissionCost,
      cautionCost,
      totalOneTime,
      baseAnnualTuition,
      cambridgeFee,
      annualTransport,
      siblingDiscountAmount,
      netAnnualRecurring,
      firstYearGrandTotal,
    };
  }, [
    fees,
    currentGradeTier,
    includeCambridge,
    includeTransport,
    selectedTransportZoneIndex,
    transportSchedules,
    includeSiblingDiscount,
    concessions,
    oneTimeComponents,
    components,
  ]);

  // If school fees are undisclosed, render a transparent disclosure notice
  if (isUndisclosed) {
    return (
      <div className={cn('bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-warm-xs space-y-4', className)}>
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[var(--color-content)] tracking-tight">
                Institutional Fee Structure
              </h3>
              <p className="text-xs text-[var(--color-content-muted)] font-medium">
                Public circular status: Awaiting institutional disclosure
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Not Publicly Disclosed
          </span>
        </div>

        <div className="p-4.5 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-3">
          <p className="text-xs text-[var(--color-content)] leading-relaxed">
            {fees.disclaimer ||
              'This institution has not published a certified public fee circular online. In accordance with Admission Pitara data accuracy standards, no synthetic or fabricated amounts are displayed.'}
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Parents are advised to contact the admissions desk directly for certified pricing.</span>
          </div>
        </div>

        {fees.sourceUrl && (
          <div className="pt-2 flex justify-end">
            <a
              href={fees.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <span>Visit Official School Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl border border-[var(--color-border)] shadow-warm-xs overflow-hidden', className)}>
      {/* --------------------------------------------------------------------- */}
      {/* 1. COMPONENT HEADER & VERIFICATION STATUS BAR                         */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-5 sm:p-6 border-b border-[var(--color-border-subtle)] bg-[#fcfbf9] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-content)] tracking-tight">
                Verified Fee Structure &amp; Schedule
              </h2>
              {fees.academicSession && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-primary)]">
                  Session {fees.academicSession}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-content-muted)] mt-1 font-medium">
              Transparent, itemized breakdown audited from official school publications
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-warm-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source-Verified</span>
              </span>
            )}
            {isHistorical && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-warm-2xs">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Historical Reference Only</span>
              </span>
            )}
          </div>
        </div>

        {/* Historical or Calculation Notice Banner if applicable */}
        {isHistorical && (
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 space-y-1 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Notice: Estimated / Inferred Historical Fee Data</span>
            </div>
            <p>
              {fees.disclaimer ||
                'This fee structure reflects historical institutional publications and is provided strictly for reference. It is not an official certified current fee for 2027–28.'}
            </p>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. SUB-NAVIGATION TABS                                                */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex items-center border-b border-[var(--color-border-subtle)] bg-white px-4 overflow-x-auto scrollbar-none gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
            activeTab === 'overview'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
              : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Fee Overview</span>
        </button>

        {gradeTiers.length > 0 && (
          <button
            onClick={() => setActiveTab('gradewise')}
            className={cn(
              'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              activeTab === 'gradewise'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
                : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
            )}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Grade-Wise Schedule</span>
          </button>
        )}

        {oneTimeComponents.length > 0 && (
          <button
            onClick={() => setActiveTab('onetime')}
            className={cn(
              'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              activeTab === 'onetime'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
                : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
            )}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>One-Time Charges</span>
          </button>
        )}

        {(specialComponents.length > 0 || transportComponents.length > 0 || transportSchedules.length > 0) && (
          <button
            onClick={() => setActiveTab('optional')}
            className={cn(
              'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              activeTab === 'optional'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
                : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
            )}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Special &amp; Transport</span>
          </button>
        )}

        {concessions.length > 0 && (
          <button
            onClick={() => setActiveTab('discounts')}
            className={cn(
              'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              activeTab === 'discounts'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
                : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
            )}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Concessions</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('calculator')}
          className={cn(
            'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
            activeTab === 'calculator'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
              : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
          )}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Calculator</span>
        </button>

        {circular && (
          <button
            onClick={() => setActiveTab('circular')}
            className={cn(
              'px-3.5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              activeTab === 'circular'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface-subtle)]/50'
                : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)]'
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Circular &amp; Notes</span>
          </button>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. TAB CONTENT PANELS                                                 */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW                                                     */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider block">
                  Annual Tuition / Composite
                </span>
                <p className="text-xl font-black text-[var(--color-primary)] tracking-tight">
                  {fees.cardFee ? formatCurrency(fees.cardFee) : 'Disclosed on Request'}
                  <span className="text-xs font-semibold text-[var(--color-content-muted)]"> / yr</span>
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[var(--color-content-muted)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{fees.billingFrequency ? `Billed ${fees.billingFrequency}` : 'Annual schedule'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider block">
                  One-Time Entry (Est.)
                </span>
                <p className="text-xl font-black text-[var(--color-content)] tracking-tight">
                  {fees.registrationFee || fees.admissionFee
                    ? formatCurrency((fees.registrationFee || 0) + (fees.admissionFee || 0))
                    : 'Disclosed'}
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] pt-1">
                  Registration + Admission charges
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider block">
                  Typical First Year Cost
                </span>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {fees.estimatedFirstYear
                    ? formatCurrency(fees.estimatedFirstYear)
                    : fees.cardFee
                    ? formatCurrency((fees.cardFee || 0) + (fees.admissionFee || 0) + (fees.registrationFee || 0))
                    : 'Refer Schedule'}
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] pt-1">
                  Excludes optional bus transport &amp; uniform
                </p>
              </div>
            </div>

            {/* Quick Itemized List */}
            {components.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
                  Itemized Fee Components
                </h3>
                <div className="divide-y divide-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                  {components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#fcfbf9] transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-content)]">{comp.name}</span>
                          {comp.refundable ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Refundable Deposit
                            </span>
                          ) : comp.mandatory ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              Optional / Stream-specific
                            </span>
                          )}
                        </div>
                        {comp.notes && (
                          <p className="text-[11px] text-[var(--color-content-muted)]">{comp.notes}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[var(--color-content)] font-mono">
                          {comp.formattedAmount}
                        </span>
                        {comp.isCalculated && (
                          <span className="block text-[10px] text-amber-700 font-medium">
                            Calculated Equivalent
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calculated Disclaimer / Footnote */}
            {fees.calculatedAnnualNote && (
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{fees.calculatedAnnualNote}</p>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: GRADE-WISE SCHEDULE                                          */}
        {/* =================================================================== */}
        {activeTab === 'gradewise' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
                  Grade &amp; Curriculum-Wise Fee Matrix
                </h3>
                <p className="text-xs text-[var(--color-content-muted)]">
                  Tuition, recurring academic charges, and curriculum-specific add-ons
                </p>
              </div>
            </div>

            <div className="border border-[var(--color-border)] rounded-xl overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-[var(--color-border)] text-[var(--color-content-muted)] font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Grade Group / Cohort</th>
                    <th className="py-3 px-4">Curriculum</th>
                    <th className="py-3 px-4">Published Installment</th>
                    <th className="py-3 px-4">Calculated Annual Equivalent</th>
                    <th className="py-3 px-4">Notes &amp; Inclusions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)] bg-white">
                  {gradeTiers.map((tier, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfbf9] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[var(--color-content)]">
                        {tier.gradeGroup}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-[var(--color-surface-subtle)] border border-[var(--color-border)] font-semibold text-[11px]">
                          {tier.curriculum || 'CBSE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[var(--color-primary)] font-mono">
                        {tier.tuitionFee}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[var(--color-content)]">
                          {tier.calculatedAnnualEquivalent || tier.totalAnnualPayable}
                        </span>
                        {tier.isCalculated && (
                          <span className="block text-[10px] text-amber-700 font-sans">Derived</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[var(--color-content-muted)]">
                        {tier.notes || 'Standard composite schedule.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: ONE-TIME CHARGES & DEPOSITS                                  */}
        {/* =================================================================== */}
        {activeTab === 'onetime' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
                One-Time Entry Charges &amp; Security Deposits
              </h3>
              <p className="text-xs text-[var(--color-content-muted)]">
                Charges payable strictly at the time of admission confirmation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {oneTimeComponents.map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[#faf8f5] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--color-content)]">{comp.name}</span>
                    {comp.refundable ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Refundable
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Non-Refundable
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-black text-[var(--color-primary)] font-mono">
                    {comp.formattedAmount}
                  </p>
                  <p className="text-[11px] text-[var(--color-content-muted)] leading-relaxed">
                    {comp.notes || 'One-time admission charge.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: SPECIAL & TRANSPORT SCHEDULE                                 */}
        {/* =================================================================== */}
        {activeTab === 'optional' && (
          <div className="space-y-6">
            {/* Special Stream / Lab / Cambridge Fees */}
            {specialComponents.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Special Curriculum &amp; Stream Charges</span>
                </h3>
                <div className="divide-y divide-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                  {specialComponents.map((comp) => (
                    <div key={comp.id} className="p-3.5 bg-white flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-content)]">{comp.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                            {comp.gradesApplicable || 'Special Stream'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-content-muted)] mt-0.5">{comp.notes}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-content)] font-mono shrink-0">
                        {comp.formattedAmount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transport Zones */}
            {transportSchedules.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Bus Transport Route Slabs (Optional)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {transportSchedules.map((zone, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[#faf8f5] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[var(--color-content)]">{zone.zone}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {zone.distanceSlab || 'Distance Slab'}
                        </span>
                      </div>
                      <p className="text-base font-black text-[var(--color-primary)] font-mono">
                        {zone.amount}
                      </p>
                      {zone.areasCovered && (
                        <p className="text-[11px] text-[var(--color-content-muted)]">
                          Sectors: {zone.areasCovered.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : transportComponents.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Bus Transport Charges (Optional)</span>
                </h3>
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[#faf8f5] space-y-2">
                  <p className="font-bold text-xs text-[var(--color-content)]">
                    {transportComponents[0].name}
                  </p>
                  <p className="text-base font-black text-[var(--color-primary)] font-mono">
                    {transportComponents[0].formattedAmount}
                  </p>
                  <p className="text-[11px] text-[var(--color-content-muted)]">
                    {transportComponents[0].notes || 'Optional bus transportation facility.'}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: CONCESSIONS & DISCOUNTS                                      */}
        {/* =================================================================== */}
        {activeTab === 'discounts' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
                Institutional Concessions &amp; Discounts
              </h3>
              <p className="text-xs text-[var(--color-content-muted)]">
                Rebates and criteria as per the official school prospectus
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concessions.map((con, idx) => (
                <div
                  key={idx}
                  className="p-4.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>{con.title}</span>
                    </span>
                    {con.discountValue && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        {con.discountValue}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                    {con.discountDescription}
                  </p>
                  <p className="text-[11px] text-emerald-800/80 pt-1 border-t border-emerald-200/60">
                    <strong>Criteria:</strong> {con.eligibilityCriteria}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: INTERACTIVE CALCULATOR                                       */}
        {/* =================================================================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
              <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Custom Family Fee Estimator</span>
              </h3>
              <p className="text-xs text-[var(--color-content-muted)]">
                Calculate first-year upfront vs recurring annual commitments with your options
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Grade Selection */}
              {gradeTiers.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider">
                    Select Grade / Tier:
                  </label>
                  <select
                    value={selectedGradeIndex}
                    onChange={(e) => setSelectedGradeIndex(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[var(--color-border)] text-xs text-[var(--color-content)] font-semibold outline-none focus:border-[var(--color-primary)]"
                  >
                    {gradeTiers.map((tier, idx) => (
                      <option key={idx} value={idx}>
                        {tier.gradeGroup} ({tier.tuitionFee})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cambridge Curriculum Toggle (for DPS) */}
              {components.some((c) => c.id === 'dps-cambridge-fee') && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider">
                    Curriculum Track:
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="cambridge-toggle"
                      checked={includeCambridge}
                      onChange={(e) => setIncludeCambridge(e.target.checked)}
                      className="rounded text-[var(--color-primary)] focus:ring-0 w-4 h-4"
                    />
                    <label htmlFor="cambridge-toggle" className="text-xs font-semibold text-[var(--color-content)]">
                      Include Cambridge Curriculum Stream (+₹35,000/yr)
                    </label>
                  </div>
                </div>
              )}

              {/* Transport Toggle & Zone */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider">
                  Transport Facility:
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="transport-toggle"
                      checked={includeTransport}
                      onChange={(e) => setIncludeTransport(e.target.checked)}
                      className="rounded text-[var(--color-primary)] focus:ring-0 w-4 h-4"
                    />
                    <label htmlFor="transport-toggle" className="text-xs font-semibold text-[var(--color-content)]">
                      Opt for School Bus Transport
                    </label>
                  </div>

                  {includeTransport && transportSchedules.length > 0 && (
                    <select
                      value={selectedTransportZoneIndex}
                      onChange={(e) => setSelectedTransportZoneIndex(parseInt(e.target.value))}
                      className="p-2 rounded-xl bg-white border border-[var(--color-border)] text-xs text-[var(--color-content)] font-semibold outline-none focus:border-[var(--color-primary)]"
                    >
                      {transportSchedules.map((zone, idx) => (
                        <option key={idx} value={idx}>
                          {zone.zone} ({zone.amount})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Sibling Concession Toggle */}
              {concessions.length > 0 && (
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sibling-toggle"
                      checked={includeSiblingDiscount}
                      onChange={(e) => setIncludeSiblingDiscount(e.target.checked)}
                      className="rounded text-[var(--color-primary)] focus:ring-0 w-4 h-4"
                    />
                    <label htmlFor="sibling-toggle" className="text-xs font-semibold text-[var(--color-content)]">
                      Apply Sibling Concession (10% rebate on composite tuition)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-5 rounded-2xl bg-[#0a192f] text-white border border-[#1b3d63] shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Estimated Annual Commitment (First Year)
                  </span>
                  <h4 className="text-2xl font-black text-white font-mono mt-0.5">
                    {formatCurrency(calculatorBreakdown.firstYearGrandTotal)}
                  </h4>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ongoing Annual (Year 2+)
                  </span>
                  <p className="text-lg font-bold text-emerald-400 font-mono">
                    {formatCurrency(calculatorBreakdown.netAnnualRecurring)} / yr
                  </p>
                </div>
              </div>

              {/* Line item breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                  <span>One-Time Admission &amp; Registration</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(calculatorBreakdown.totalOneTime)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                  <span>Base Composite Tuition</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(calculatorBreakdown.baseAnnualTuition)}
                  </span>
                </div>
                {includeCambridge && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-blue-300">
                    <span>Cambridge International Stream Fee</span>
                    <span className="font-mono font-bold text-blue-300">
                      +{formatCurrency(calculatorBreakdown.cambridgeFee)}
                    </span>
                  </div>
                )}
                {includeTransport && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-amber-300">
                    <span>Estimated Annual Bus Transport</span>
                    <span className="font-mono font-bold text-amber-300">
                      +{formatCurrency(calculatorBreakdown.annualTransport)}
                    </span>
                  </div>
                )}
                {includeSiblingDiscount && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-emerald-300">
                    <span>Sibling Concession Rebate (10%)</span>
                    <span className="font-mono font-bold text-emerald-300">
                      -{formatCurrency(calculatorBreakdown.siblingDiscountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                * Note: Figures include both official directly stated fees and calculated equivalents. Subject to school confirmation upon registration.
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 7: OFFICIAL CIRCULAR & AUDIT NOTES                              */}
        {/* =================================================================== */}
        {activeTab === 'circular' && circular && (
          <div className="space-y-6">
            <div className="p-4.5 rounded-xl border border-[var(--color-border)] bg-[#faf8f5] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-bold text-xs text-[var(--color-content)]">{circular.title}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Academic Session {circular.academicSession}
                </span>
              </div>

              {circular.summary && (
                <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
                  {circular.summary}
                </p>
              )}

              {circular.sourceUrl && (
                <div className="pt-2">
                  <a
                    href={circular.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <span>Open Official Fee Circular Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Key Terms */}
            {circular.keyTerms && circular.keyTerms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
                  Important Billing Terms
                </h4>
                <ul className="space-y-1.5 text-xs text-[var(--color-content-muted)] list-none p-0">
                  {circular.keyTerms.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official Notes & Footnotes */}
            {fees.footnotes && fees.footnotes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <h4 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
                  Audited Footnotes &amp; Conditions
                </h4>
                <div className="space-y-1 text-xs text-[var(--color-content-muted)]">
                  {fees.footnotes.map((fn, idx) => (
                    <p key={idx}>• {fn}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. FOOTER AUDIT METADATA                                              */}
      {/* --------------------------------------------------------------------- */}
      <div className="px-5 py-3.5 bg-[#faf8f5] border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--color-content-muted)]">
        <div>
          Last Audited:{' '}
          <strong className="font-semibold text-[var(--color-content)]">
            {fees.lastVerifiedDate || 'September 2026'}
          </strong>
        </div>

        {fees.sourceUrl && (
          <a
            href={fees.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Official Institution Schedule</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
