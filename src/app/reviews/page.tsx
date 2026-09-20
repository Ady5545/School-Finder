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
          <span>Admission Pitara feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-content)] tracking-tight">
          Reviews that help parents decide
        </h1>
        <p className="text-sm text-[var(--color-content-muted)] max-w-2xl">
          Explore published parent reviews for the schools in our directory, then share your own experience from the school profile. At the bottom, you can also review Admission Pitara itself.
        </p>
        <p className="text-xs text-[var(--color-content-muted)] max-w-2xl">
          You can post anonymously to other visitors. See our{' '}
          <Link href="/privacy" className="underline hover:text-[var(--color-primary)]">
            Privacy Policy
          </Link>{' '}
          for how reviews are stored and moderated.
        </p>
      </div>

      <SchoolReviewsDirectory />

      <div className="pt-12 mt-10 border-t border-[var(--color-border)]">
        <SchoolRatingsSection
          schoolSlug="__platform__"
          schoolName="Admission Pitara"
          apiEndpoint="/api/platform-reviews"
          trackView={false}
        />
      </div>
    </div>
  );
}
