import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SchoolRatingsSection } from '../../components/school/SchoolRatingsSection';
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
          <span>Parent Feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-content)] tracking-tight">
          Reviews of Admission Pitara
        </h1>
        <p className="text-sm text-[var(--color-content-muted)] max-w-2xl">
          This page is for reviewing the platform itself — how useful it was, whether the fee
          and admissions data helped, anything we got wrong. Looking to review a specific
          school instead? Head to that school&apos;s profile page — every listing has its own
          reviews section.{' '}
          <Link href="/schools" className="font-semibold text-[var(--color-primary)] hover:underline">
            Browse schools →
          </Link>
        </p>
        <p className="text-xs text-[var(--color-content-muted)] max-w-2xl">
          You can post anonymously to other visitors. See our{' '}
          <Link href="/privacy" className="underline hover:text-[var(--color-primary)]">
            Privacy Policy
          </Link>{' '}
          for how reviews are stored and moderated.
        </p>
      </div>

      <div className="pt-8">
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
