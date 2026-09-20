'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  X,
  Check,
  Minus,
  Sparkles,
  Heart,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  GraduationCap,
  IndianRupee,
  MapPin,
  Trophy,
  Bus,
  Shirt,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SchoolImage } from './SchoolImage';
import { RatingDisplay } from '../ui/RatingDisplay';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { AdmissionStatus } from './AdmissionStatus';
import { useSchoolStore } from '../../lib/schoolStore';
import { getAllSchools, getPublicSchoolBySlug, getCanonicalSchools } from '../../lib/schools';
import { formatCurrency, cn } from '../../lib/utils';
import type { School, DetailedFeeComponent, FeeConcession } from '../../types/school';

export const SchoolComparisonView: React.FC = () => {
  const { compareList, addCompare, removeCompare, clearCompare, isInShortlist, toggleShortlist } =
    useSchoolStore();
  const allSchools = getAllSchools();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [selectorQuery, setSelectorQuery] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Mobile Comparison Mode state: 'stacked' (vertical metric blocks), 'dual' (2-school side-by-side), or 'table' (swipeable table)
  const [mobileCompMode, setMobileCompMode] = useState<'stacked' | 'dual' | 'table'>('stacked');
  const [dualSchoolA, setDualSchoolA] = useState<number>(0);
  const [dualSchoolB, setDualSchoolB] = useState<number>(1);

  // Get full school objects from compareList
  const selectedSchools: School[] = useMemo(() => {
    return compareList
      .map(slug => getPublicSchoolBySlug(slug))
      .filter((s): s is School => Boolean(s));
  }, [compareList]);

  // URL query parameter synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSchools = urlParams.get('schools');
      if (urlSchools && compareList.length === 0) {
        const slugs = urlSchools.split(',').map(s => s.trim()).filter(Boolean);
        slugs.slice(0, 4).forEach(slug => {
          const s = getPublicSchoolBySlug(slug);
          if (s) addCompare(s.slug, s.name);
        });
      }
    }
  }, [addCompare, compareList.length]);

  // Update URL search params when comparison list changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (compareList.length > 0) {
        url.searchParams.set('schools', compareList.join(','));
      } else {
        url.searchParams.delete('schools');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [compareList]);

  // Available schools not yet in compare
  const availableSchools = useMemo(() => {
    return allSchools.filter(s => !compareList.includes(s.slug));
  }, [allSchools, compareList]);

  const filteredAvailable = useMemo(() => {
    const q = selectorQuery.trim().toLowerCase();
    if (!q) return availableSchools;
    return availableSchools.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.location.area.toLowerCase().includes(q) ||
        s.location.sector.toLowerCase().includes(q) ||
        (Array.isArray(s.alternateNames) && s.alternateNames.some(alt => alt.toLowerCase().includes(q)))
    );
  }, [availableSchools, selectorQuery]);

  // Preset quick comparisons with active canonical slugs
  const loadPreset = (slugs: string[]) => {
    clearCompare();
    slugs.forEach(slug => {
      const school = getPublicSchoolBySlug(slug);
      if (school) addCompare(school.slug, school.name);
    });
  };

  // Helper functions to safely extract canonical data
  const getCautionDeposit = (school: School): { amount: string; refundable: boolean } | null => {
    if (!school.fees?.components || !Array.isArray(school.fees.components)) return null;
    const comp = school.fees.components.find(
      c =>
        c.category === 'deposit' ||
        (c.name && (c.name.toLowerCase().includes('caution') || c.name.toLowerCase().includes('security')))
    );
    if (!comp) return null;
    return {
      amount: comp.formattedAmount || (comp.amount ? formatCurrency(comp.amount) : 'Documented deposit'),
      refundable: comp.refundable !== false,
    };
  };

  const getSiblingConcession = (school: School): FeeConcession | null => {
    if (!school.fees?.concessions || !Array.isArray(school.fees.concessions) || school.fees.concessions.length === 0) {
      return null;
    }
    const sib = school.fees.concessions.find(
      c =>
        c.category === 'sibling' ||
        (c.title && c.title.toLowerCase().includes('sibling')) ||
        (c.discountDescription && c.discountDescription.toLowerCase().includes('sibling'))
    );
    return sib || null;
  };

  const getDocumentedExtras = (school: School): DetailedFeeComponent[] => {
    if (!school.fees?.components || !Array.isArray(school.fees.components)) return [];
    return school.fees.components.filter(
      c =>
        ['activity', 'examination', 'other'].includes(c.category) ||
        (c.name &&
          !c.name.toLowerCase().includes('tuition') &&
          !c.name.toLowerCase().includes('admission fee') &&
          !c.name.toLowerCase().includes('registration') &&
          !c.name.toLowerCase().includes('caution') &&
          !c.name.toLowerCase().includes('security deposit') &&
          !c.name.toLowerCase().includes('transport'))
    );
  };

  // Compute all unique sports across selected schools
  const allComparedSports = useMemo(() => {
    const set = new Set<string>();
    selectedSchools.forEach(s => {
      if (Array.isArray(s.sports)) {
        s.sports.forEach(sport => set.add(sport));
      }
    });
    return Array.from(set).sort();
  }, [selectedSchools]);

  // Best Value helpers - parents want to know which option wins on a metric at
  // a glance, not just that they differ. Only flags a winner when the field is
  // actually a real, comparable number for at least 2 schools (never guesses).
  const bestFeeId = useMemo(() => {
    const comparable = selectedSchools.filter(
      s =>
        s.fees.cardFee !== null &&
        s.fees.cardFee !== undefined &&
        s.fees.comparableAnnualAvailable !== false &&
        s.fees.verificationStatus === 'verified_from_source'
    );
    if (comparable.length < 2) return null;
    return comparable.reduce((min, s) => (s.fees.cardFee! < min.fees.cardFee! ? s : min)).id;
  }, [selectedSchools]);

  const bestRatingId = useMemo(() => {
    const rated = selectedSchools.filter(s => s.rating?.score && s.rating.reviewsCount > 0);
    if (rated.length < 2) return null;
    return rated.reduce((max, s) => (s.rating.score > max.rating.score ? s : max)).id;
  }, [selectedSchools]);

  // Row comparison value difference detector
  const isRowDifferent = (getter: (s: School) => any) => {
    if (selectedSchools.length < 2) return false;
    const first = JSON.stringify(getter(selectedSchools[0]));
    return selectedSchools.some(s => JSON.stringify(getter(s)) !== first);
  };

  if (selectedSchools.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="max-w-xl w-full">
          <div className="max-w-2xl w-full rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-warm-sm">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[var(--color-content)]">Build your comparison</h1>
                <p className="text-sm text-[var(--color-content-muted)] mt-1">Choose up to four schools here — no need to visit the directory first.</p>
              </div>
            </div>
            <div className="mt-5 relative">
              <input
                type="search"
                value={selectorQuery}
                onChange={e => setSelectorQuery(e.target.value)}
                placeholder="Search a school, sector or area…"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-[var(--color-primary)]"
              />
              {selectorQuery && (
                <div className="absolute z-20 top-full mt-2 left-0 right-0 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl p-1">
                  {filteredAvailable.slice(0, 10).map(s => (
                    <button key={s.slug} type="button" onClick={() => { addCompare(s.slug, s.name); setSelectorQuery(''); }} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-900 truncate">{s.name}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{s.location.area || s.location.sector}</span>
                    </button>
                  ))}
                  {filteredAvailable.length === 0 && <p className="px-3 py-4 text-xs text-slate-500 text-center">No matching school found.</p>}
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-3">Selected schools appear in the comparison matrix as you add them.</p>
          </div>
        </div>

        {/* Curated Comparison Presets */}
        <div className="mt-10 w-full max-w-4xl bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className="text-base font-bold text-[var(--color-content)]">
              Start with a useful comparison
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:border-[var(--color-accent)] transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  Knowledge Park 5: everyday choices
                </span>
                <p className="text-xs font-bold text-[var(--color-content)] mt-1.5">
                  Delhi World Public School vs Ryan International vs Gaurs International
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1">
                  Look across location, curriculum, fees, admissions and campus details in one view.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadPreset([
                    'delhi-world-public-school-kp-5',
                    'ryan-international-school-noida-extension',
                    'gaurs-international-school-gaur-city-2',
                  ])
                }
                className="mt-4 text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Compare these schools →
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:border-[var(--color-accent)] transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  Techzone 4: premium campuses
                </span>
                <p className="text-xs font-bold text-[var(--color-content)] mt-1.5">
                  Pacific World vs BLS World vs Sarvottam
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1">
                  A quick side-by-side for curriculum, facilities, fee structure and family-fit details.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadPreset([
                    'pacific-world-school-techzone-4',
                    'bls-world-school',
                    'sarvottam-international-school',
                  ])
                }
                className="mt-4 text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Compare these schools →
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:border-[var(--color-accent)] transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  Global Curriculum &amp; Sports
                </span>
                <p className="text-xs font-bold text-[var(--color-content)] mt-1.5">
                  Lotus Valley vs The Millennium School vs Aster Public
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1">
                  Compare curriculum, annual fee ranges, admissions and documented campus facilities.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadPreset([
                    'lotus-valley-international-school',
                    'the-millennium-school-noida-extension',
                    'aster-public-school-kp5',
                  ])
                }
                className="mt-4 text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Compare these schools →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[var(--color-border)] mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-bold text-[var(--color-content)]">
            Comparing {selectedSchools.length} of 4 Schools
          </span>
          {selectedSchools.length < 4 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add School</span>
              </button>

              {isSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-[var(--color-border)] shadow-xl z-50 p-2 text-left">
                  <input
                    type="text"
                    placeholder="Search school name or sector..."
                    value={selectorQuery}
                    onChange={e => setSelectorQuery(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-[var(--color-primary)] mb-2"
                    autoFocus
                  />
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
                    {filteredAvailable.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          addCompare(s.slug, s.name);
                          setIsSelectorOpen(false);
                          setSelectorQuery('');
                        }}
                        className="w-full text-left px-2.5 py-2 hover:bg-slate-50 text-xs text-slate-800 flex items-center justify-between rounded cursor-pointer"
                      >
                        <span className="font-semibold truncate">{s.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">{s.location.area || s.location.sector}</span>
                      </button>
                    ))}
                    {filteredAvailable.length === 0 && (
                      <p className="text-xs text-slate-400 p-2 text-center">No matching schools</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-content)] cursor-pointer select-none min-h-[36px]">
            <input
              type="checkbox"
              checked={highlightDiff}
              onChange={e => setHighlightDiff(e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-0 cursor-pointer w-4 h-4"
            />
            <span>Highlight Differences</span>
          </label>

          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors min-h-[36px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE SPECIFIC COMPARISON PRESENTATION (< md)                              */}
      {/* ========================================================================= */}
      <div className="flex md:hidden flex-col gap-5">
        {/* Mobile School Switcher Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {selectedSchools.map((school) => (
            <div
              key={school.id}
              className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[var(--color-border)] shadow-warm-2xs shrink-0 max-w-[200px]"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <SchoolImage src={school.assets.featured} alt={school.name} className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{school.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{school.location.area || school.location.sector}</p>
              </div>
              <button
                type="button"
                onClick={() => removeCompare(school.slug)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Mobile View Switcher Mode Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMobileCompMode('stacked')}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-center transition-all cursor-pointer',
              mobileCompMode === 'stacked' ? 'bg-white text-[var(--color-primary)] shadow-warm-2xs font-extrabold' : 'text-slate-600'
            )}
          >
            Metric Breakdown
          </button>
          <button
            type="button"
            onClick={() => setMobileCompMode('dual')}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-center transition-all cursor-pointer',
              mobileCompMode === 'dual' ? 'bg-white text-[var(--color-primary)] shadow-warm-2xs font-extrabold' : 'text-slate-600'
            )}
          >
            Side-by-Side Dual
          </button>
          <button
            type="button"
            onClick={() => setMobileCompMode('table')}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-center transition-all cursor-pointer',
              mobileCompMode === 'table' ? 'bg-white text-[var(--color-primary)] shadow-warm-2xs font-extrabold' : 'text-slate-600'
            )}
          >
            Swipeable Table
          </button>
        </div>

        {/* MODE 1: VERTICAL STACKED METRIC BREAKDOWN */}
        {mobileCompMode === 'stacked' && (
          <div className="space-y-5">
            {/* Section 1: Institutional Profile */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Building className="w-4 h-4 text-[var(--color-primary)]" /> 1. Institutional Profile
              </h3>

              {/* Board & Curriculum */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Affiliation / Board</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[160px]">{s.name}</span>
                        <span className="font-extrabold text-[var(--color-primary)] bg-white px-2 py-0.5 rounded border border-sky-200 text-[11px]">
                          {Array.isArray(s.board) ? s.board.join(', ') : s.board || 'CBSE'}
                        </span>
                      </div>
                      {s.boardNote && <p className="text-[11px] text-slate-600">{s.boardNote}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grades Offered */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Grades Offered</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">{s.name}</span>
                      <span className="font-bold text-slate-800">{s.gradeRange.raw || `${s.gradeRange.from} – ${s.gradeRange.to}`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Teacher Ratio */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Student-Teacher Ratio</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">{s.name}</span>
                      <span className="font-bold text-slate-800">{s.studentTeacherRatio || 'Not publicly verified'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Established Year & Affiliation No */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Establishment &amp; Affiliation</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{s.name}</span>
                      <div className="flex items-center gap-1 text-[11px]">
                        {s.establishedYear && (
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                            Est. {s.establishedYear}
                          </span>
                        )}
                        <span className="text-slate-600 font-medium">
                          {s.affiliationNumber ? `Affil: ${s.affiliationNumber}` : 'Pending registration'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Admissions & Timeline */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Calendar className="w-4 h-4 text-[var(--color-primary)]" /> 2. Admissions &amp; Timeline
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {selectedSchools.map(s => (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <span className="font-bold text-xs text-slate-900 truncate flex-1 min-w-0">{s.name}</span>
                      <AdmissionStatus admissions={s.admissions} showDate={false} className="shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">Cycle:</span> {s.admissions.academicYear || s.admissions.session || '2027–28 Session'}
                    </p>
                    {s.admissions.date && (
                      <p className="text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">Window:</span> {s.admissions.date}
                      </p>
                    )}
                    {s.admissions.process && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        <span className="font-semibold text-slate-700">Process:</span> {s.admissions.process}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Audited Fee Structure */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <IndianRupee className="w-4 h-4 text-emerald-600" /> 3. Fee Structure & Evidence
              </h3>

              {/* Comparable Annual Figure */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Comparable annual directory figure</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => {
                    const isComparable =
                      s.fees.cardFee !== null &&
                      s.fees.cardFee !== undefined &&
                      s.fees.comparableAnnualAvailable !== false &&
                      s.fees.verificationStatus === 'verified_from_source';

                    return (
                      <div key={s.id} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 truncate max-w-[160px]">{s.name}</span>
                        {isComparable ? (
                          <span className="font-black text-emerald-900 text-sm">{formatCurrency(s.fees.cardFee!)}/yr</span>
                        ) : s.fees.rangeText ? (
                          <span className="text-xs font-bold text-emerald-900">{s.fees.rangeText}</span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            Disclosed at admission
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated First-Year Cost */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Estimated First-Year Cost</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">{s.name}</span>
                      <span className="font-black text-emerald-900 text-sm">
                        {typeof s.fees.estimatedFirstYear === 'number'
                          ? formatCurrency(s.fees.estimatedFirstYear)
                          : s.fees.estimatedFirstYearText || 'Not documented'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Shown separately from annual tuition; estimates are not guaranteed payable totals.</p>
              </div>

              {/* Admission & Registration Fee */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Admission &amp; Registration Fee</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[150px]">{s.name}</span>
                        <span className="font-bold text-slate-800">
                          {s.fees.admissionFee ? `Adm: ${formatCurrency(s.fees.admissionFee)}` : 'Adm: Disclosed on inquiry'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Reg Fee: {s.fees.registrationFee ? formatCurrency(s.fees.registrationFee) : 'Nil / Included'}</span>
                        {getCautionDeposit(s) && (
                          <span className="text-amber-800 font-semibold">Caution: {getCautionDeposit(s)!.amount} ({getCautionDeposit(s)!.refundable ? 'Refundable' : 'Deposit'})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tuition / Composite Billing Schedule */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Tuition / Composite Frequency</span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSchools.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{s.name}</span>
                      <span className="text-slate-700 font-medium">
                        {s.fees.tuitionQuarterly ? `₹${s.fees.tuitionQuarterly} / qtr` : (s.fees.tuitionMonthly ? `₹${s.fees.tuitionMonthly} / mo` : 'Quarterly / Monthly')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Sibling Concessions */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Users className="w-4 h-4 text-emerald-600" /> 4. Sibling Concession
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {selectedSchools.map(s => {
                  const sibling = getSiblingConcession(s);
                  return (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[160px]">{s.name}</span>
                        {sibling ? (
                          <span className="bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded text-[11px]">
                            Documented Concession
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Not disclosed</span>
                        )}
                      </div>
                      {sibling && (
                        <p className="text-[11px] text-emerald-800 font-medium">
                          {sibling.discountDescription || sibling.title}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Transport & Commute */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Bus className="w-4 h-4 text-amber-600" /> 5. Transport &amp; Commute
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {selectedSchools.map(s => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[150px]">{s.name}</span>
                    <span className="text-slate-700 font-medium text-right">
                      {s.fees.transportMonthly
                        ? `₹${s.fees.transportMonthly}/mo`
                        : s.fees.transportAnnual
                        ? `₹${s.fees.transportAnnual}/yr`
                        : s.fees.transportSchedule && s.fees.transportSchedule.length > 0
                        ? `${s.fees.transportSchedule.length} distance slabs (Optional)`
                        : 'Distance-based / Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Sports & Athletics */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Trophy className="w-4 h-4 text-amber-600" /> 6. Sports &amp; Athletics
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {selectedSchools.map(s => {
                  const hasSports = Array.isArray(s.sports) && s.sports.length > 0;
                  return (
                    <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate max-w-[170px]">{s.name}</span>
                        {hasSports && (
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            {s.sports!.length} documented sports
                          </span>
                        )}
                      </div>
                      {hasSports ? (
                        <div className="flex flex-wrap gap-1.5">
                          {s.sports!.map(sport => (
                            <span
                              key={sport}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">Not disclosed in public brochure</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 7: Ratings & Actions */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-xs space-y-4">
              <h3 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <GraduationCap className="w-4 h-4 text-[var(--color-primary)]" /> 7. Parent Community &amp; Action
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {selectedSchools.map(s => (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate max-w-[160px]">{s.name}</span>
                      <RatingDisplay score={s.rating.score} reviewsCount={s.rating.reviewsCount} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleShortlist(s.slug, s.name)}
                        className={cn(
                          'p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[38px]',
                          isInShortlist(s.slug)
                            ? 'bg-rose-50 border-rose-300 text-rose-600'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Heart className={cn('w-4 h-4', isInShortlist(s.slug) && 'fill-rose-500')} />
                        <span>{isInShortlist(s.slug) ? 'Saved' : 'Save'}</span>
                      </button>
                      <Link href={`/schools/${s.slug}`} className="flex-1">
                        <Button variant="accent" size="sm" className="w-full text-xs font-bold text-white py-2 min-h-[38px]">
                          View Full School Profile →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: DUAL SIDE-BY-SIDE SELECTOR */}
        {mobileCompMode === 'dual' && selectedSchools.length >= 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-xs font-bold">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">School A</label>
                <select
                  value={dualSchoolA}
                  onChange={e => setDualSchoolA(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs font-bold outline-none"
                >
                  {selectedSchools.map((s, idx) => (
                    <option key={s.id} value={idx}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">School B</label>
                <select
                  value={dualSchoolB}
                  onChange={e => setDualSchoolB(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs font-bold outline-none"
                >
                  {selectedSchools.map((s, idx) => (
                    <option key={s.id} value={idx}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dual Comparison Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[selectedSchools[dualSchoolA] || selectedSchools[0], selectedSchools[dualSchoolB] || selectedSchools[1]].map((school) => {
                const sibling = getSiblingConcession(school);
                const caution = getCautionDeposit(school);
                return (
                  <div key={school.id} className="bg-white p-3 rounded-2xl border border-[var(--color-border)] shadow-warm-2xs flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <div className="h-24 rounded-xl overflow-hidden border border-slate-200">
                        <SchoolImage src={school.assets.featured} alt={school.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">{school.name}</h4>
                      <p className="text-[10px] text-slate-500">{school.location.area || school.location.sector}</p>
                      
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Curriculum</span>
                          <span className="font-bold text-[var(--color-primary)]">
                            {Array.isArray(school.board) ? school.board.join(', ') : school.board || 'CBSE'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Grades</span>
                          <span className="font-semibold text-slate-800">{school.gradeRange.raw}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Comparable Annual</span>
                          <span className="font-extrabold text-emerald-800">
                            {school.fees.cardFee && school.fees.comparableAnnualAvailable !== false ? formatCurrency(school.fees.cardFee) + '/yr' : (school.fees.rangeText || 'Not documented')}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Admission Fee</span>
                          <span className="font-semibold text-slate-700">
                            {school.fees.admissionFee ? formatCurrency(school.fees.admissionFee) : 'Disclosed'}
                          </span>
                        </div>

                        {caution && (
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Caution Deposit</span>
                            <span className="font-semibold text-amber-800">{caution.amount} (Refundable)</span>
                          </div>
                        )}

                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Sibling Discount</span>
                          <span className="font-semibold text-slate-700">
                            {sibling ? sibling.discountDescription || sibling.title : 'Not disclosed'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Sports Amenities</span>
                          <span className="font-semibold text-slate-800">
                            {Array.isArray(school.sports) && school.sports.length > 0
                              ? school.sports.slice(0, 3).join(', ') + (school.sports.length > 3 ? ` +${school.sports.length - 3}` : '')
                              : 'Not disclosed'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Admissions</span>
                          <AdmissionStatus admissions={school.admissions} showDate={false} className="mt-0.5" />
                        </div>
                      </div>
                    </div>

                    <Link href={`/schools/${school.slug}`} className="block pt-2">
                      <Button variant="accent" size="sm" className="w-full text-[11px] font-bold text-white py-2">
                        Profile Details →
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: SWIPEABLE TABLE (Accessible on Mobile) */}
        {mobileCompMode === 'table' && (
          <div className="w-full overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-xs pb-2">
            <p className="p-3 text-[11px] text-slate-500 bg-slate-50 border-b border-slate-200">
              👉 Swipe left/right to compare all {selectedSchools.length} schools horizontally.
            </p>
            <div className="min-w-[600px] p-2">
              <div className="grid grid-cols-4 gap-2">
                {selectedSchools.map(s => (
                  <div key={s.id} className="p-2 border border-slate-200 rounded-xl bg-slate-50/70 space-y-1.5 text-xs">
                    <p className="font-bold text-slate-900 truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{Array.isArray(s.board) ? s.board.join(', ') : s.board}</p>
                    <p className="font-bold text-emerald-800">{s.fees.cardFee ? formatCurrency(s.fees.cardFee) : 'Disclosed'}</p>
                    <Link href={`/schools/${s.slug}`} className="block pt-1">
                      <span className="text-[10px] text-[var(--color-primary)] font-bold underline">View Profile</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP COMPARISON TABLE MATRIX (>= md)                                   */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-xs scrollbar-thin">
        <table className="w-full border-collapse text-left min-w-max">
          <thead>
            {/* School Header Cards Row */}
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
              <th className="p-4 w-52 min-w-[190px] max-w-[210px] text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider align-top sticky left-0 z-20 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border)] shadow-xs">
                Comparison Feature
              </th>
              {selectedSchools.map(school => (
                <th key={school.id} className="p-4 w-64 min-w-[240px] max-w-[300px] align-top">
                  <div className="flex flex-col relative group">
                    <button
                      type="button"
                      onClick={() => removeCompare(school.slug)}
                      aria-label={`Remove ${school.name}`}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative rounded-xl overflow-hidden mb-2.5 border border-[var(--color-border)] shadow-xs">
                      <SchoolImage
                        src={school.assets.featured}
                        alt={school.name}
                        aspectRatio="video"
                        className="w-full h-28 sm:h-32 object-cover"
                      />
                    </div>

                    <Link href={`/schools/${school.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[var(--color-content)] line-clamp-2 leading-snug">
                        {school.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-content-muted)] mt-1">
                      <MapPin className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
                      <span className="truncate">{school.location.area || school.location.sector}</span>
                    </div>

                    {/* Established Year & Affiliation Badges */}
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                      {school.establishedYear && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                          Est. {school.establishedYear}
                        </span>
                      )}
                      {school.affiliationNumber && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-medium">
                          Affil: {school.affiliationNumber}
                        </span>
                      )}
                      {school.verification?.isVerified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[var(--color-border-subtle)]">
                      <button
                        type="button"
                        onClick={() => toggleShortlist(school.slug, school.name)}
                        className={cn(
                          'p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer',
                          isInShortlist(school.slug)
                            ? 'bg-rose-50 border-rose-300 text-rose-600'
                            : 'bg-white border-[var(--color-border-strong)] text-slate-700 hover:bg-[var(--color-surface-subtle)]'
                        )}
                      >
                        <Heart className={cn('w-3.5 h-3.5', isInShortlist(school.slug) && 'fill-rose-500')} />
                        <span className="hidden sm:inline">{isInShortlist(school.slug) ? 'Saved' : 'Save'}</span>
                      </button>

                      <Link href={`/schools/${school.slug}`} className="flex-1">
                        <Button variant="accent" size="sm" className="w-full text-xs font-bold text-white py-1.5">
                          Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--color-border-subtle)] text-xs text-[var(--color-content)]">
            {/* ========================================================================= */}
            {/* SECTION 1: ACADEMIC & INSTITUTIONAL PROFILE                              */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                1. Academic &amp; Institutional Profile
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => Array.isArray(s.board) ? s.board.join(',') : String(s.board || '')) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Affiliation / Board
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <span className="font-bold text-[var(--color-primary)]">
                    {Array.isArray(s.board) ? s.board.join(', ') : s.board || 'CBSE'}
                  </span>
                  {s.boardNote && (
                    <p className="text-[11px] text-slate-600 mt-1 font-normal">{s.boardNote}</p>
                  )}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.gradeRange.raw) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Grade / Class Coverage
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-bold text-slate-900">
                  {s.gradeRange.raw || `${s.gradeRange.from} – ${s.gradeRange.to}`}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.studentTeacherRatio) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Student-Teacher Ratio
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-bold text-slate-800">
                  {s.studentTeacherRatio || 'Not publicly verified'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.schoolType) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                School Type
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium">
                  {s.schoolType || 'Co-Educational'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.dayOrBoarding) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Day / Boarding
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium">
                  {s.dayOrBoarding || 'Day School'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.establishedYear) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Established Year
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium text-slate-800">
                  {s.establishedYear ? `Established in ${s.establishedYear}` : 'Not disclosed'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.affiliationNumber) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Affiliation Number
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium text-slate-800">
                  {s.affiliationNumber ? s.affiliationNumber : 'Pending registration / Not disclosed'}
                </td>
              ))}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 2: ADMISSIONS & TIMELINE                                         */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                2. Admissions &amp; Timeline
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.admissions.status) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Admission Status
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <AdmissionStatus admissions={s.admissions} showDate={false} />
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.admissions.academicYear || s.admissions.session) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Target Session
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-semibold text-slate-800">
                  {s.admissions.academicYear || s.admissions.session || '2027–28 Academic Session'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.admissions.date) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Admissions Window / Date
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium text-[var(--color-content)]">
                  {s.admissions.date || 'Open for 2027–28'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.admissions.process) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Admissions Process
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 text-[11px] text-slate-700 leading-relaxed max-w-[280px]">
                  {s.admissions.process || 'Contact school administration for procedure details.'}
                </td>
              ))}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 3: AUDITED FEE STRUCTURE                                         */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                3. Fee Structure (Audited Source)
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.cardFee) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Annual / Composite Fee
              </td>
              {selectedSchools.map(s => {
                const isComparable =
                  s.fees.cardFee !== null &&
                  s.fees.cardFee !== undefined &&
                  s.fees.comparableAnnualAvailable !== false &&
                  s.fees.verificationStatus === 'verified_from_source';

                return (
                  <td key={s.id} className="p-4">
                    {isComparable ? (
                      <>
                        <span className="text-sm font-extrabold text-[var(--color-primary)]">
                          {formatCurrency(s.fees.cardFee!)}
                        </span>
                        <span className="text-[10px] text-[var(--color-content-muted)] block font-medium">/ year</span>
                        {bestFeeId === s.id && (
                          <span className="inline-flex items-center gap-0.5 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
                            <Check className="w-2.5 h-2.5" /> Lowest here
                          </span>
                        )}
                      </>
                    ) : s.fees.rangeText ? (
                      <div>
                        <span className="text-xs font-bold text-slate-900">{s.fees.rangeText}</span>
                        {s.fees.calculatedAnnualNote && (
                          <span className="text-[10px] text-slate-500 block mt-0.5">{s.fees.calculatedAnnualNote}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">
                        Disclosed in official schedule
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.registrationFee) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Registration Fee (One-Time)
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium text-slate-800">
                  {s.fees.registrationFee ? formatCurrency(s.fees.registrationFee) : (s.fees.registrationFee === 0 ? 'Nil' : 'Included / Not disclosed')}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.admissionFee) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Admission Fee (One-Time)
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium text-slate-800">
                  {s.fees.admissionFee ? formatCurrency(s.fees.admissionFee) : 'Disclosed during admission'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => getCautionDeposit(s)?.amount) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Security / Caution Deposit
              </td>
              {selectedSchools.map(s => {
                const caution = getCautionDeposit(s);
                return (
                  <td key={s.id} className="p-4">
                    {caution ? (
                      <span className="font-semibold text-slate-800">
                        {caution.amount} <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">{caution.refundable ? 'Refundable' : 'Deposit'}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Included in schedule / Nil</span>
                    )}
                  </td>
                );
              })}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.tuitionQuarterly || s.fees.tuitionMonthly) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Tuition / Installment Schedule
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 text-xs font-medium text-slate-800">
                  {s.fees.tuitionQuarterly ? (
                    <div>
                      <span className="font-bold">₹{s.fees.tuitionQuarterly}</span>
                      <span className="text-[10px] text-slate-500 block">per quarter</span>
                    </div>
                  ) : s.fees.tuitionMonthly ? (
                    <div>
                      <span className="font-bold">₹{s.fees.tuitionMonthly}</span>
                      <span className="text-[10px] text-slate-500 block">per month</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">As per grade tier</span>
                  )}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.verificationStatus) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Fee Verification Status
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] font-bold capitalize inline-flex items-center gap-1',
                      s.fees.verificationStatus === 'verified_from_source'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    )}
                  >
                    {s.fees.verificationStatus === 'verified_from_source' ? 'Verified Source' : 'Pending Audit'}
                  </span>
                </td>
              ))}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 4: SIBLING CONCESSIONS                                           */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                4. Sibling Concessions
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => Boolean(getSiblingConcession(s))) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Documented Sibling Discount
              </td>
              {selectedSchools.map(s => {
                const sibling = getSiblingConcession(s);
                return (
                  <td key={s.id} className="p-4">
                    {sibling ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-bold text-[11px] border border-emerald-300">
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Documented Concession</span>
                        </span>
                        <p className="text-[11px] text-emerald-900 font-semibold leading-snug">
                          {sibling.discountDescription || sibling.title}
                        </p>
                        {sibling.eligibilityCriteria && (
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {sibling.eligibilityCriteria}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">
                        Not disclosed in public schedule
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 5: TRANSPORT & COMMUTE                                           */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                5. Transport &amp; Commute
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.transportMonthly || s.fees.transportAnnual || s.fees.transportSchedule?.length) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Transport Charges / Slabs
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium text-slate-800">
                  {s.fees.transportMonthly ? (
                    <div>
                      <span className="font-bold text-slate-900">₹{s.fees.transportMonthly}</span>
                      <span className="text-[10px] text-slate-500 block">per month (Optional)</span>
                    </div>
                  ) : s.fees.transportAnnual ? (
                    <div>
                      <span className="font-bold text-slate-900">₹{s.fees.transportAnnual}</span>
                      <span className="text-[10px] text-slate-500 block">per year (Optional)</span>
                    </div>
                  ) : s.fees.transportSchedule && s.fees.transportSchedule.length > 0 ? (
                    <div>
                      <span className="font-bold text-slate-900">{s.fees.transportSchedule.length} distance zones</span>
                      <span className="text-[10px] text-slate-500 block">Documented slab schedule</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">Distance-based / Optional</span>
                  )}
                </td>
              ))}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 6: UNIFORMS & EXTRA CHARGES                                      */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                6. Uniforms &amp; Documented Extras
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => Boolean(s.uniforms?.boys || s.uniforms?.girls)) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Uniform Guidelines
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 text-[11px] text-slate-700">
                  {s.uniforms?.notes || (s.uniforms?.boys || s.uniforms?.girls ? 'Documented uniform specifications' : 'Standard uniform guidelines apply')}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => getDocumentedExtras(s).length) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Documented Extra Components
              </td>
              {selectedSchools.map(s => {
                const extras = getDocumentedExtras(s);
                return (
                  <td key={s.id} className="p-4 text-[11px]">
                    {extras.length > 0 ? (
                      <div className="space-y-1">
                        {extras.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-1 text-slate-700">
                            <span className="truncate max-w-[140px]">{item.name}</span>
                            <span className="font-bold text-slate-900 shrink-0">{item.formattedAmount || 'At actuals'}</span>
                          </div>
                        ))}
                        {extras.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-semibold block">+{extras.length - 3} more components</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">Covered in composite fee / At actuals</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 7: SPORTS & ATHLETICS (DEDICATED SECTION)                        */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                7. Sports &amp; Athletics Amenities
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => Array.isArray(s.sports) ? s.sports.length : 0) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Documented Sports
              </td>
              {selectedSchools.map(s => {
                const hasSports = Array.isArray(s.sports) && s.sports.length > 0;
                return (
                  <td key={s.id} className="p-4">
                    {hasSports ? (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 inline-block">
                          {s.sports!.length} Sports Documented
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {s.sports!.map(sport => (
                            <span
                              key={sport}
                              className="px-2 py-0.5 rounded-md bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-slate-800 text-[11px] font-medium"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">Not disclosed in public brochure</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Shared vs Unique Sports Feature Matrix (if multiple sports found) */}
            {allComparedSports.length > 0 && selectedSchools.length >= 2 && (
              <tr>
                <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                  Sports Matrix Overview
                </td>
                {selectedSchools.map(s => {
                  const schoolSports = Array.isArray(s.sports) ? s.sports : [];
                  return (
                    <td key={s.id} className="p-4 text-[11px]">
                      <div className="grid grid-cols-1 gap-1 max-h-44 overflow-y-auto no-scrollbar pr-1">
                        {allComparedSports.map(sport => {
                          const hasIt = schoolSports.includes(sport);
                          return (
                            <div
                              key={sport}
                              className={cn(
                                'flex items-center justify-between px-2 py-1 rounded text-[11px]',
                                hasIt ? 'bg-emerald-50/80 text-emerald-950 font-semibold' : 'text-slate-400'
                              )}
                            >
                              <span className="truncate">{sport}</span>
                              {hasIt ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                              ) : (
                                <Minus className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* ========================================================================= */}
            {/* SECTION 8: CAMPUS FACILITIES & INFRASTRUCTURE                            */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                8. Campus &amp; Infrastructure
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.facilities.length) && 'bg-amber-50/70')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Key Facilities
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  {s.facilities && s.facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {s.facilities.slice(0, 5).map((fac, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded text-[10px] text-[var(--color-content)]">
                          {fac.name}
                        </span>
                      ))}
                      {s.facilities.length > 5 && (
                        <span className="text-[10px] text-slate-500 font-semibold px-1 py-0.5">+{s.facilities.length - 5} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[var(--color-content-muted)]">Campus amenities documented</span>
                  )}
                </td>
              ))}
            </tr>

            {/* ========================================================================= */}
            {/* SECTION 9: RATINGS & PARENT COMMUNITY                                    */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-[var(--color-surface-muted)]">
                9. Parent Ratings &amp; Community
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.rating.score) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)] sticky left-0 z-10 bg-white border-r border-[var(--color-border)] shadow-2xs">
                Parent Community Rating
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <RatingDisplay score={s.rating.score} reviewsCount={s.rating.reviewsCount} size="sm" />
                  {bestRatingId === s.id && (
                    <span className="inline-flex items-center gap-0.5 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
                      <Check className="w-2.5 h-2.5" /> Highest here
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* ========================================================================= */}
            {/* ACTION ROW: NEXT STEPS                                                   */}
            {/* ========================================================================= */}
            <tr className="bg-[var(--color-surface-subtle)] border-t border-[var(--color-border)]">
              <td className="p-4 font-bold text-[var(--color-primary)] sticky left-0 z-10 bg-[var(--color-surface-subtle)] border-r border-[var(--color-border)] shadow-2xs">
                Decision Next Steps
              </td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <Link href={`/schools/${s.slug}`}>
                    <Button variant="accent" size="sm" className="w-full text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-warm-xs">
                      <span>Full School Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
