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
      <div className="max-w-2xl mx-auto w-full">
        <EmptyState
          icon={<Heart className="w-8 h-8 text-rose-500" />}
          title="Your shortlist is empty"
          description="Click the heart icon on any school card across the directory or search results to keep track of prospective schools."
          actionLabel="Browse Schools Directory"
          actionHref="/schools"
        />
      </div>
    );
  }

  // Calculate average annual tuition
  const validTuitions = savedSchools
    .map(s => s.fees.cardFee || 0)
    .filter(t => t > 0);
  const avgTuition =
    validTuitions.length > 0
      ? Math.round(validTuitions.reduce((a, b) => a + b, 0) / validTuitions.length)
      : 0;

  return (
    <div className="w-full flex flex-col">
      {/* Shortlist Summary Metrics Bar */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 sm:p-6 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[var(--color-content)]">
              {savedSchools.length} {savedSchools.length === 1 ? 'School' : 'Schools'} in Family Shortlist
            </h2>
            <div className="flex items-center gap-3 text-xs text-[var(--color-content-muted)] mt-0.5">
              <span>Avg Annual Tuition: <strong className="text-slate-800">{formatCurrency(avgTuition)}</strong></span>
              <span>•</span>
              <span>Locality: Greater Noida West</span>
            </div>
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
                className="text-xs font-bold"
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
            <span>Clear Shortlist</span>
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
