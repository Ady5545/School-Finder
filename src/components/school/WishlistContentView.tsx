'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Scale, Trash2, ArrowRight, Sparkles, Building, IndianRupee } from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { useSchoolStore } from '../../lib/schoolStore';
import { getSchoolBySlug } from '../../lib/schools';
import { formatCurrency } from '../../lib/utils';
import type { School } from '../../types/school';

export const WishlistContentView: React.FC = () => {
  const { shortlist, clearShortlist, addCompare, clearCompare } = useSchoolStore();

  const savedSchools: School[] = shortlist
    .map(slug => getSchoolBySlug(slug))
    .filter((s): s is School => Boolean(s));

  const compareAllSaved = () => {
    clearCompare();
    savedSchools.slice(0, 4).forEach(s => addCompare(s.slug, s.name));
  };

  if (savedSchools.length === 0) {
    return (
      <div className="max-w-2xl mx-auto w-full py-8">
        <EmptyState
          icon={<Heart className="w-8 h-8 text-rose-500" />}
          title="Your shortlist is empty"
          description="Click the heart icon on any school card across the directory or search results to keep track of prospective schools for your family."
          actionLabel="Browse Schools Directory"
          actionHref="/schools"
        />
      </div>
    );
  }

  // Calculate annual tuition stats
  const validTuitions = savedSchools
    .map(s => s.fees.cardFee || 0)
    .filter(t => t > 0);
  const avgTuition =
    validTuitions.length > 0
      ? Math.round(validTuitions.reduce((a, b) => a + b, 0) / validTuitions.length)
      : 0;
  const minTuition = validTuitions.length > 0 ? Math.min(...validTuitions) : 0;
  const maxTuition = validTuitions.length > 0 ? Math.max(...validTuitions) : 0;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Shortlist Summary Workspace Card */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-2xs">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[var(--color-content)]">
                {savedSchools.length} {savedSchools.length === 1 ? 'School' : 'Schools'} in Family Shortlist
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                Personalized
              </span>
            </div>
            <p className="text-xs text-[var(--color-content-muted)] mt-1">
              Locality: Greater Noida West & Noida Extension • Data preserved across browser sessions
            </p>
          </div>
        </div>

        {/* Budget Snapshot Strip */}
        <div className="flex flex-wrap items-center gap-4 bg-[var(--color-surface-muted)] px-4 py-2.5 rounded-xl border border-[var(--color-border-subtle)] text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Budget</span>
            <strong className="text-slate-800 font-extrabold">{formatCurrency(avgTuition)}/yr</strong>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget Span</span>
            <strong className="text-slate-800 font-bold">{formatCurrency(minTuition)} – {formatCurrency(maxTuition)}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSchools.length >= 2 && (
            <Link href="/compare">
              <Button
                variant="primary"
                size="sm"
                onClick={compareAllSaved}
                leftIcon={<Scale className="w-3.5 h-3.5" />}
                className="text-xs font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
              >
                Compare Shortlist
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={clearShortlist}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Grid of Saved Schools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedSchools.map(school => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  );
};
