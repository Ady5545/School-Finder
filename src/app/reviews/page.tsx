import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SchoolRatingsSection } from '../../components/school/SchoolRatingsSection';
import { SchoolReviewsDirectory } from '../../components/school/SchoolReviewsDirectory';
import { buildPageMetadata } from '../../lib/seo';
import { MessageSquare } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Reviews',
  'Read and write verified parent reviews of Admission Pitara. Sign in to share your experience with the platform.',
  '/reviews'
);

export const dynamic = 'force-dynamic';

export default function ReviewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Reviews', isCurrent: true }]} className="mb-6" />

      <div className="space-y-3 pb-8 border-b border-[var(--color-border)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>School reviews</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-content)] tracking-tight">
          School Reviews
        </h1>
        <p className="text-sm text-[var(--color-content-muted)] max-w-2xl">
          Explore parent experiences by school, see review summaries, and share your own experience through the existing verified-parent review flow.
        </p>
      </div>

      <SchoolReviewsDirectory />

      <section className="pt-12 mt-10 border-t border-[var(--color-border)]">
        <div className="mb-5">
          <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            About Admission Pitara
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">
            Share feedback about the platform
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1 max-w-2xl">
            This is separate from school reviews. Use it to tell us how the Admission Pitara experience can be improved.
          </p>
        </div>
        <SchoolRatingsSection
          schoolSlug="__platform__"
          schoolName="Admission Pitara"
          apiEndpoint="/api/platform-reviews"
          trackView={false}
        />
      </section>
    </div>
  );
}
