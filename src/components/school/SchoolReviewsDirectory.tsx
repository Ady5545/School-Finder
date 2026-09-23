'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Filter, MessageSquare, PenLine, Search, Star } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { SchoolImage } from './SchoolImage';

type Review = {
  id: string;
  score: number;
  title?: string;
  comment: string;
  isAnonymous?: boolean;
  createdAt?: string;
};

type Summary = {
  averageRating?: number;
  totalReviews?: number;
};

export const SchoolReviewsDirectory: React.FC = () => {
  const [schools, setSchools] = useState<import('../../data/schoolsData').School[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    fetch('/api/schools?_ts=' + Date.now(), { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && Array.isArray(data?.schools)) setSchools(data.schools);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const { isAuthenticated } = useAuth();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [selectedReviewSlug, setSelectedReviewSlug] = useState(schools[0]?.slug || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [data, setData] = useState<Record<string, { summary: Summary; ratings: Review[] }>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const boards = useMemo(
    () =>
      Array.from(
        new Set(
          schools.flatMap(s => (Array.isArray(s.board) ? s.board : [s.board]).filter(Boolean))
        )
      ).sort(),
    [schools]
  );

  const areas = useMemo(
    () =>
      Array.from(
        new Set(
          schools
            .flatMap(s => [s.location.area, s.location.sector])
            .filter((value): value is string => Boolean(value))
        )
      ).sort(),
    [schools]
  );

  const filteredSchools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return schools.filter(school => {
      const schoolBoards = Array.isArray(school.board) ? school.board : [school.board];

      if (
        q &&
        !school.name.toLowerCase().includes(q) &&
        !(school.shortName || '').toLowerCase().includes(q) &&
        !(school.location.area || '').toLowerCase().includes(q) &&
        !(school.location.sector || '').toLowerCase().includes(q)
      ) {
        return false;
      }

      if (boardFilter && !schoolBoards.some(board => board.toLowerCase() === boardFilter.toLowerCase())) {
        return false;
      }

      if (areaFilter && school.location.area !== areaFilter && school.location.sector !== areaFilter) {
        return false;
      }

      return true;
    });
  }, [schools, searchQuery, boardFilter, areaFilter]);

  const load = async (slug: string) => {
    setSelectedReviewSlug(slug);

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
      if (json.success) {
        setData(prev => ({
          ...prev,
          [slug]: { summary: json.summary || {}, ratings: json.ratings || [] },
        }));
      }
    } finally {
      setLoading(null);
    }
  };

  const selectedSchool = schools.find(school => school.slug === selectedReviewSlug) || filteredSchools[0] || schools[0];
  const writeReviewHref = selectedSchool ? '/schools/' + selectedSchool.slug + '#reviews' : '/schools';

  return (
    <section className="mt-10 space-y-6">
      {/* Discovery Header */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-6 shadow-warm-xs">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[11px] font-extrabold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              School reviews
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-content)] tracking-tight mt-3">
              Explore parent experiences by school
            </h2>
            <p className="text-sm text-[var(--color-content-muted)] mt-2 leading-relaxed">
              Browse existing review summaries, open published experiences, and start your own school review without digging through a long directory.
            </p>
          </div>

          <div className="w-full lg:w-[360px] rounded-2xl bg-[#fbf9f5] border border-[var(--color-border)] p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-content-muted)]">
              Ready to share an experience?
            </div>
            <label htmlFor="review-school-selector" className="sr-only">
              Choose a school to review
            </label>
            <select
              id="review-school-selector"
              value={selectedSchool?.slug || ''}
              onChange={event => setSelectedReviewSlug(event.target.value)}
              className="mt-2 w-full px-3 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] outline-none focus:border-[var(--color-primary)]"
            >
              {schools.map(school => (
                <option key={school.slug} value={school.slug}>
                  {school.name}
                </option>
              ))}
            </select>

            {isAuthenticated ? (
              <Link
                href={writeReviewHref}
                className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3.5 py-2.5 text-xs font-extrabold text-white shadow-warm-xs hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              >
                <PenLine className="w-3.5 h-3.5" />
                Write a Review
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-3.5 py-2.5 text-xs font-extrabold text-white shadow-warm-xs hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Sign in to Write a Review
                </Link>
                <p className="text-[11px] text-slate-500 mt-2">
                  Reviews require an authenticated parent account so the existing review safeguards remain intact.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Discovery Filters */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2.5 mt-5 pt-5 border-t border-[var(--color-border-subtle)]">
          <label className="relative">
            <span className="sr-only">Search schools</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search school name or sector..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs text-[var(--color-content)] outline-none focus:border-[var(--color-primary)]"
            />
          </label>

          <label>
            <span className="sr-only">Filter by board</span>
            <select
              value={boardFilter}
              onChange={event => setBoardFilter(event.target.value)}
              className="w-full md:w-44 px-3 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">All boards</option>
              {boards.map(board => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by area</span>
            <select
              value={areaFilter}
              onChange={event => setAreaFilter(event.target.value)}
              className="w-full md:w-52 px-3 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">All areas</option>
              {areas.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* School Review Cards */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="text-sm font-extrabold text-[var(--color-content)]">
          {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} to explore
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter by board or area</span>
        </div>
      </div>

      {filteredSchools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-white p-8 text-center">
          <h3 className="font-bold text-sm text-slate-900">No schools match these filters</h3>
          <p className="text-xs text-slate-500 mt-1.5">Clear a filter to browse the full review directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchools.map(school => {
            const item = data[school.slug];
            const isOpen = openSlug === school.slug;
            const reviewCount = item?.summary.totalReviews ?? school.rating.reviewsCount ?? 0;
            const rating = item?.summary.averageRating ?? school.rating.score ?? 0;

            return (
              <article key={school.slug} className="rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs overflow-hidden">
                <div className="flex gap-3 p-4 sm:p-5">
                  <Link href={'/schools/' + school.slug} className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <SchoolImage src={school.assets.featured} alt={school.name} aspectRatio="square" className="w-full h-full object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={'/schools/' + school.slug} className="font-extrabold text-sm text-[var(--color-content)] hover:text-[var(--color-primary)] leading-snug">
                          {school.name}
                        </Link>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {school.location.area || school.location.sector}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {reviewCount > 0 ? (
                          <>
                            <div className="inline-flex items-center gap-1 text-sm font-black text-slate-900">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {Number(rating || 0).toFixed(1)}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                            </div>
                          </>
                        ) : (
                          <div className="text-[10px] font-bold text-slate-500">No reviews yet</div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(Array.isArray(school.board) ? school.board : [school.board]).filter(Boolean).slice(0, 2).map(board => (
                        <span key={board} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600">
                          {board}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link
                        href={isAuthenticated ? '/schools/' + school.slug + '#reviews' : '/auth/login'}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white text-[11px] font-extrabold"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                        {isAuthenticated
                          ? reviewCount > 0
                            ? 'Write a Review'
                            : 'Be the First to Review'
                          : 'Sign in to Review'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => load(school.slug)}
                        aria-expanded={isOpen}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--color-border-strong)] bg-white text-slate-800 text-[11px] font-extrabold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        View published reviews
                        <ChevronDown className={'w-3.5 h-3.5 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
                      </button>
                    </div>
                  </div>
                </div>

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
                                  <div className="text-amber-500 text-xs">
                                    {'★'.repeat(Math.max(0, Math.min(5, review.score)))}
                                    <span className="text-slate-300">{'★'.repeat(Math.max(0, 5 - review.score))}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500">
                                    {review.isAnonymous ? 'Parent review' : 'Verified parent review'}
                                  </span>
                                </div>
                                {review.title && <h4 className="font-bold text-sm text-slate-900 mt-2">{review.title}</h4>}
                                <p className="text-xs text-slate-700 leading-relaxed mt-1">{review.comment}</p>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 py-5">No published reviews yet.</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
