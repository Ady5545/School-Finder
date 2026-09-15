'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  X,
  Check,
  Minus,
  Sparkles,
  ExternalLink,
  Heart,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  GraduationCap,
  IndianRupee,
  MapPin,
  Trophy,
} from 'lucide-react';
import { SchoolImage } from './SchoolImage';
import { RatingDisplay } from '../ui/RatingDisplay';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useSchoolStore } from '../../lib/schoolStore';
import { getAllSchools, getSchoolBySlug } from '../../lib/schools';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

export const SchoolComparisonView: React.FC = () => {
  const { compareList, addCompare, removeCompare, clearCompare, isInShortlist, toggleShortlist } =
    useSchoolStore();
  const allSchools = getAllSchools();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [selectorQuery, setSelectorQuery] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Get full school objects from compareList
  const selectedSchools: School[] = compareList
    .map(slug => getSchoolBySlug(slug))
    .filter((s): s is School => Boolean(s));

  // Available schools not yet in compare
  const availableSchools = allSchools.filter(s => !compareList.includes(s.slug));

  const filteredAvailable = selectorQuery.trim()
    ? availableSchools.filter(
        s =>
          s.name.toLowerCase().includes(selectorQuery.toLowerCase()) ||
          s.location.area.toLowerCase().includes(selectorQuery.toLowerCase())
      )
    : availableSchools;

  // Preset quick comparisons
  const loadPreset = (slugs: string[]) => {
    clearCompare();
    slugs.forEach(slug => {
      const school = getSchoolBySlug(slug);
      if (school) addCompare(slug, school.name);
    });
  };

  if (selectedSchools.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="max-w-xl w-full">
          <EmptyState
            icon={<Scale className="w-8 h-8 text-[var(--color-primary)]" />}
            title="No schools in your comparison list"
            description="Add 2 to 4 schools from the directory or choose one of our curated comparisons below."
            actionLabel="Browse All Schools"
            actionHref="/schools"
          />
        </div>

        {/* Curated Comparison Presets */}
        <div className="mt-10 w-full max-w-4xl bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className="text-base font-bold text-[var(--color-content)]">
              Popular Comparison Presets for Greater Noida West
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:border-[var(--color-accent)] transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  Knowledge Park 5 Giants
                </span>
                <p className="text-xs font-bold text-[var(--color-content)] mt-1.5">
                  DPS KP5 vs Ryan International vs Gaur International
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1">
                  Compare infrastructure, CBSE legacy, and annual fee brackets.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadPreset([
                    'delhi-public-school-knowledge-park-5',
                    'ryan-international-school-greater-noida-west',
                    'gaurs-international-school-greater-noida-west',
                  ])
                }
                className="mt-4 text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Load this comparison →
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:border-[var(--color-accent)] transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  Techzone 4 Corridors
                </span>
                <p className="text-xs font-bold text-[var(--color-content)] mt-1.5">
                  Pacific World School vs BLS World vs Sarvottam
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1">
                  Sports academies, air-conditioned campuses, and student ratios.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadPreset([
                    'pacific-world-school-greater-noida-west',
                    'bls-world-school',
                    'sarvottam-international-school-greater-noida-west',
                  ])
                }
                className="mt-4 text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Load this comparison →
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:border-[var(--color-accent)] transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                  Global Curriculum
                </span>
                <p className="text-xs font-bold text-[var(--color-content)] mt-1.5">
                  Lotus Valley vs The Millennium School vs Aster Public
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1">
                  Progressive pedagogy, experiential learning, and campus amenities.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  loadPreset([
                    'lotus-valley-international-school-noida-extension',
                    'the-millennium-school-greater-noida-west',
                    'aster-public-school-greater-noida-west',
                  ])
                }
                className="mt-4 text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Load this comparison →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Row comparison value difference detector
  const isRowDifferent = (getter: (s: School) => any) => {
    if (selectedSchools.length < 2) return false;
    const first = getter(selectedSchools[0]);
    return selectedSchools.some(s => getter(s) !== first);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)] mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[var(--color-content)]">
            Comparing {selectedSchools.length} of 4 Schools
          </span>
          {selectedSchools.length < 4 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add School</span>
              </button>

              {isSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-[var(--color-border)] shadow-xl z-50 p-2 text-left">
                  <input
                    type="text"
                    placeholder="Search school name..."
                    value={selectorQuery}
                    onChange={e => setSelectorQuery(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-[var(--color-primary)] mb-2"
                    autoFocus
                  />
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
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
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">{s.location.area}</span>
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

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-content)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightDiff}
              onChange={e => setHighlightDiff(e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-0 cursor-pointer"
            />
            <span>Highlight Differences</span>
          </label>

          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-xs">
        <table className="w-full border-collapse text-left">
          <thead>
            {/* School Header Cards Row */}
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
              <th className="p-4 w-48 min-w-44 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider align-top">
                Metric
              </th>
              {selectedSchools.map(school => (
                <th key={school.id} className="p-4 w-72 min-w-64 align-top">
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
                        className="w-full h-32 object-cover"
                      />
                    </div>

                    <Link href={`/schools/${school.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                      <h3 className="text-sm font-extrabold text-[var(--color-content)] line-clamp-2 leading-snug">
                        {school.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-[var(--color-content-muted)] mt-1">
                      <MapPin className="w-3 h-3 text-[var(--color-accent)]" />
                      <span>{school.location.area || school.location.sector}</span>
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
                        <span>{isInShortlist(school.slug) ? 'Saved' : 'Save'}</span>
                      </button>

                      <Link href={`/schools/${school.slug}`} className="flex-1">
                        <Button variant="accent" size="sm" className="w-full text-xs font-bold text-white">
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
            {/* Section 1: Core Institutional Facts */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px]">
                1. Institutional Profile
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.board.join(',')) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Affiliation / Board</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-bold text-[var(--color-primary)]">
                  {s.board.join(', ')}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.gradeRange.raw) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Grades Offered</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium">
                  {s.gradeRange.raw}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.rating.score) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Rating</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <RatingDisplay score={s.rating.score} reviewsCount={s.rating.reviewsCount} size="sm" />
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.studentTeacherRatio) && 'bg-amber-50/50')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Student-Teacher Ratio</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-bold text-slate-800">
                  {s.studentTeacherRatio}
                </td>
              ))}
            </tr>

            {/* Section 2: Verified Fees */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px]">
                2. Fee Structure (Audited)
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.cardFee) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Annual Fee</td>
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
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">
                        See official fee schedule
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.admissionFee) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">One-Time Admission Fee</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium">
                  {s.fees.admissionFee ? formatCurrency(s.fees.admissionFee) : 'Disclosed during admission'}
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.fees.verificationStatus) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Fee Verification Status</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] font-bold capitalize',
                      s.fees.verificationStatus === 'verified_from_source'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {s.fees.verificationStatus === 'verified_from_source' ? 'Verified Source' : 'Under Verification'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Section 3: Facilities & Infrastructure */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px]">
                3. Campus & Facilities
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.facilities.length) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Campus Facilities</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-medium">
                  {s.facilities && s.facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {s.facilities.slice(0, 4).map((fac, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded text-[10px] text-[var(--color-content)]">
                          {fac.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[var(--color-content-muted)]">Indoor/Outdoor Infrastructure</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Section 4: Admissions & Timeline */}
            <tr className="bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
              <td colSpan={selectedSchools.length + 1} className="px-4 py-2.5 font-black text-[var(--color-primary)] uppercase tracking-wider text-[11px]">
                4. Admission Timeline
              </td>
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.admissions.status) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Admission Status</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] font-bold capitalize',
                      s.admissions.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700'
                        : s.admissions.status === 'closing-soon'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {s.admissions.status.replace('-', ' ')}
                  </span>
                </td>
              ))}
            </tr>

            <tr className={cn(highlightDiff && isRowDifferent(s => s.admissions.date) && 'bg-amber-50/70 border-l-2 border-l-[var(--color-accent)]')}>
              <td className="p-4 font-semibold text-[var(--color-content-muted)]">Admissions Date / Window</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4 font-semibold text-[var(--color-content)]">
                  {s.admissions.date || 'Open for 2025–2026'}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-[var(--color-surface-subtle)] border-t border-[var(--color-border)]">
              <td className="p-4 font-bold text-[var(--color-primary)]">Next Steps</td>
              {selectedSchools.map(s => (
                <td key={s.id} className="p-4">
                  <Link href={`/schools/${s.slug}`}>
                    <Button variant="accent" size="sm" className="w-full text-xs font-bold text-white">
                      View Full Details
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
