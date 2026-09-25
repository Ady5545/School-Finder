import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SchoolRatingsSection } from '../../components/school/SchoolRatingsSection';
import { ReviewsShowcase } from '../../components/school/ReviewsShowcase';
import { SchoolReviewsDirectory } from '../../components/school/SchoolReviewsDirectory';
import { buildPageMetadata } from '../../lib/seo';
import { getAllSchoolsAsync } from '../../lib/schoolsServer';
import { MessageSquare } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Reviews',
  'Read and write verified parent reviews of Admission Pitara. Sign in to share your experience with the platform.',
  '/reviews'
);

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const allSchools = await getAllSchoolsAsync();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Reviews', isCurrent: true }]} className="mb-6" />

      <div className="space-y-3 pb-8 border-b border-[var(--color-border)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Parent reviews</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-content)] tracking-tight">
          Parent Reviews
        </h1>
        <p className="text-sm text-[var(--color-content-muted)] max-w-2xl">
          Explore parent experiences by school, see review summaries, and share your own experience through the existing verified-parent review flow.
        </p>
      </div>

      <ReviewsShowcase />

      <section className="pt-10 mt-8 border-t border-[var(--color-border)]">
        <div className="mb-5">
          <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            About Admission Pitara
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">
            Share your review
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1 max-w-2xl">
            Tell us about your experience with Admission Pitara. Your review is submitted directly through the website.
          </p>
        </div>
        <SchoolRatingsSection
          schoolSlug="__platform__"
          schoolName="Admission Pitara"
          apiEndpoint="/api/platform-reviews"
          showPublishedReviews={false}
          openFormInitially
        />
        <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
          <SchoolReviewsDirectory initialSchools={allSchools} />
        </div>
      </section>
    </div>
  );
}
