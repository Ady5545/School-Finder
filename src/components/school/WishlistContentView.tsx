'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Heart, Scale, Trash2, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { getSchoolBySlug } from '../../lib/schools';
import { formatCurrency } from '../../lib/utils';
import type { School } from '../../types/school';

export const WishlistContentView: React.FC = () => {
  const { shortlist, clearShortlist, addCompare, clearCompare, addToShortlist } = useSchoolStore();
  const { isAuthenticated, isLoading } = useAuth();

  // Sync with cloud wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/auth/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', list: shortlist }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.wishlist)) {
            data.wishlist.forEach((s: string) => {
              addToShortlist(s);
            });
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto w-full py-12 text-center text-xs text-slate-400">
        Loading saved shortlist...
      </div>
    );
  }

  // Access Control: Wishlist restricted to authenticated parents
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto w-full py-8">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-warm-xs text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4 shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Parent Access Only</span>
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
            Parent Account Required for Shortlists
          </h2>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            Your saved institutions, fee comparisons, and admission deadline alerts are securely associated with your Parent Account to synchronize across your phone and desktop.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto font-bold shadow-warm-xs">
                Sign In to View Shortlist
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto font-bold">
                Create Parent Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Locality: Greater Noida West & Noida Extension • Synchronized with your Parent Account
            </p>
          </div>
        </div>

        {/* Budget Snapshot Strip */}
        <div className="flex flex-wrap items-center gap-4 bg-[var(--color-surface-muted)] px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--color-content-muted)] block">Avg Budget</span>
            <strong className="text-[var(--color-primary)] font-extrabold">{formatCurrency(avgTuition)}/yr</strong>
          </div>
          <div className="h-6 w-px bg-[var(--color-border)]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--color-content-muted)] block">Budget Span</span>
            <strong className="text-[var(--color-accent)] font-bold">{formatCurrency(minTuition)} – {formatCurrency(maxTuition)}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSchools.length >= 2 && (
            <Link href="/compare">
              <Button
                variant="accent"
                size="sm"
                onClick={compareAllSaved}
                leftIcon={<Scale className="w-3.5 h-3.5" />}
                className="text-xs font-bold text-white"
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
