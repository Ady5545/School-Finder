'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { getAllSchools } from '../../lib/schools';
import { SchoolImage } from './SchoolImage';

type Review = {
  id: string;
  score: number;
  title?: string;
  comment: string;
  userName?: string;
  isAnonymous?: boolean;
  createdAt?: string;
};

type ReviewCard = Review & {
  schoolName: string;
  schoolSlug: string;
  schoolImage?: string;
};

function ReviewCardView({ review, compactSchool = false }: { review: ReviewCard; compactSchool?: boolean }) {
  return (
    <article className="snap-start shrink-0 w-[300px] sm:w-[350px] rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-warm-xs">
      {!compactSchool && (
        <Link href={'/schools/' + review.schoolSlug} className="flex items-center gap-3 mb-4 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            {review.schoolImage ? (
              <SchoolImage src={review.schoolImage} alt={review.schoolName} aspectRatio="square" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-sm text-[var(--color-content)] group-hover:text-[var(--color-primary)] line-clamp-1">{review.schoolName}</div>
            <div className="text-[10px] text-[var(--color-content-muted)]">School review</div>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-[var(--color-primary)] shrink-0" />
        </Link>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-0.5" aria-label={review.score + ' out of 5 stars'}>
          {[1,2,3,4,5].map(star => (
            <Star key={star} className={star <= review.score ? 'w-3.5 h-3.5 text-amber-500 fill-amber-500' : 'w-3.5 h-3.5 text-slate-200'} />
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
          <ShieldCheck className="w-3 h-3" /> Evidence checked
        </span>
      </div>

      {review.title && <h3 className="font-extrabold text-sm text-[var(--color-content)] mt-3 line-clamp-1">{review.title}</h3>}
      <p className="text-xs text-[var(--color-content-muted)] leading-relaxed mt-2 line-clamp-5">{review.comment}</p>

      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] text-[10px] font-bold text-slate-500">
        {review.isAnonymous ? 'Anonymous parent' : (review.userName || 'Parent')}
      </div>
    </article>
  );
}

export const ReviewsShowcase: React.FC = () => {
  const schools = useMemo(() => getAllSchools(), []);
  const [ourReviews, setOurReviews] = useState<Review[]>([]);
  const [schoolReviews, setSchoolReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const platformPromise = fetch('/api/platform-reviews', { cache: 'no-store' }).then(r => r.json());
        const schoolTargets = schools
          .filter(s => (s.rating?.reviewsCount || 0) > 0)
          .slice(0, 12);

        const schoolResults = await Promise.all(
          schoolTargets.map(async school => {
            try {
              const res = await fetch('/api/schools/' + encodeURIComponent(school.slug) + '/ratings', { cache: 'no-store' });
              const data = await res.json();
              return data.success
                ? (data.ratings || []).slice(0, 3).map((review: Review) => ({
                    ...review,
                    schoolName: school.name,
                    schoolSlug: school.slug,
                    schoolImage: school.assets?.featured,
                  }))
                : [];
            } catch {
              return [];
            }
          })
        );

        const platform = await platformPromise;
        if (!mounted) return;

        setOurReviews(platform.success ? (platform.ratings || []).slice(0, 8) : []);
        setSchoolReviews(schoolResults.flat().slice(0, 18));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [schools]);

  return (
    <div className="mt-8 space-y-8">
      <section>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-primary)]">
              <MessageSquare className="w-3.5 h-3.5" /> Our reviews
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">What parents say about Admission Pitara</h2>
          </div>
          <span className="hidden sm:block text-[10px] font-bold text-slate-400">Scroll →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 pr-2 [scrollbar-width:thin]">
          {loading ? (
            <div className="w-full p-8 rounded-2xl bg-white border border-[var(--color-border)] text-center text-xs text-slate-400">Loading reviews…</div>
          ) : ourReviews.length ? (
            ourReviews.map(review => (
              <ReviewCardView
                key={review.id}
                review={{ ...review, schoolName: 'Admission Pitara', schoolSlug: 'reviews' }}
                compactSchool
              />
            ))
          ) : (
            <div className="w-full p-8 rounded-2xl bg-white border border-[var(--color-border)] text-center text-xs text-slate-500">No Admission Pitara reviews yet.</div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-accent)]">
              <ShieldCheck className="w-3.5 h-3.5" /> School reviews
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">What parents say about schools</h2>
          </div>
          <span className="hidden sm:block text-[10px] font-bold text-slate-400">Scroll →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 pr-2 [scrollbar-width:thin]">
          {loading ? (
            <div className="w-full p-8 rounded-2xl bg-white border border-[var(--color-border)] text-center text-xs text-slate-400">Loading school reviews…</div>
          ) : schoolReviews.length ? (
            schoolReviews.map(review => <ReviewCardView key={review.id} review={review} />)
          ) : (
            <div className="w-full p-8 rounded-2xl bg-white border border-[var(--color-border)] text-center text-xs text-slate-500">No published school reviews yet.</div>
          )}
        </div>
      </section>
    </div>
  );
};
