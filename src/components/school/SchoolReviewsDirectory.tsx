'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageSquare, Star, PenLine } from 'lucide-react';
import { getAllSchools } from '../../lib/schools';

type Review = { id: string; score: number; title?: string; comment: string; isAnonymous?: boolean; createdAt?: string };
type Summary = { averageRating?: number; totalReviews?: number };

export const SchoolReviewsDirectory: React.FC = () => {
  const schools = getAllSchools();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, { summary: Summary; ratings: Review[] }>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const load = async (slug: string) => {
    if (openSlug === slug) {
      setOpenSlug(null);
      return;
    }
    setOpenSlug(slug);
    if (data[slug]) return;
    setLoading(slug);
    try {
      const res = await fetch('/api/schools/' + encodeURIComponent(slug) + '/ratings', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setData(prev => ({ ...prev, [slug]: { summary: json.summary || {}, ratings: json.ratings || [] } }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="mt-10 space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)]">School reviews</h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">Browse reviews by school. Open a school to see the published reviews and jump to its review form.</p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white divide-y divide-slate-100 overflow-hidden">
        {schools.map(school => {
          const item = data[school.slug];
          const isOpen = openSlug === school.slug;
          return (
            <div key={school.slug}>
              <button type="button" onClick={() => load(school.slug)} className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0"><Star className="w-4 h-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-900 truncate">{school.name}</div>
                  <div className="text-[11px] text-slate-500">{school.location.area || school.location.sector}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-slate-800">{item ? (item.summary.averageRating ? item.summary.averageRating.toFixed(1) + ' / 5' : 'No rating yet') : 'View reviews'}</div>
                  <div className="text-[10px] text-slate-500">{item ? ((item.summary.totalReviews || 0) + ' review' + ((item.summary.totalReviews || 0) === 1 ? '' : 's')) : 'Open to load'}</div>
                </div>
                <ChevronDown className={'w-4 h-4 text-slate-400 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 bg-slate-50/60 border-t border-slate-100">
                  {loading === school.slug ? (
                    <p className="text-xs text-slate-500 py-5">Loading published reviews…</p>
                  ) : (
                    <>
                      {item?.ratings?.length ? (
                        <div className="space-y-3 pt-4">
                          {item.ratings.map(review => (
                            <article key={review.id} className="rounded-xl bg-white border border-slate-200 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-amber-500 text-xs">{'★'.repeat(Math.max(0, Math.min(5, review.score)))}<span className="text-slate-300">{'★'.repeat(Math.max(0, 5 - review.score))}</span></div>
                                <span className="text-[10px] text-slate-500">{review.isAnonymous ? 'Parent review' : 'Verified parent review'}</span>
                              </div>
                              {review.title && <h4 className="font-bold text-sm text-slate-900 mt-2">{review.title}</h4>}
                              <p className="text-xs text-slate-700 leading-relaxed mt-1">{review.comment}</p>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 py-5">No published reviews yet.</p>
                      )}
                      <div className="pt-4 flex flex-wrap gap-2">
                        <Link href={'/schools/' + school.slug + '#reviews'} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold">
                          <PenLine className="w-3.5 h-3.5" /> Write a review
                        </Link>
                        <Link href={'/schools/' + school.slug} className="inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-bold">Open school profile</Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
