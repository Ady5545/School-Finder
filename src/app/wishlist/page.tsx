import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { buildPageMetadata } from '../../lib/seo';
import { Heart, ArrowRight } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Shortlisted Schools',
  'Your saved schools and shortlisted institutions for Greater Noida West admissions.',
  '/wishlist'
);

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Shortlist', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 border-b border-[var(--color-border)] mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Your Shortlisted Schools
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Save schools you are interested in, track key admission deadlines, and prepare applications.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <EmptyState
          icon={<Heart className="w-6 h-6 text-rose-500" />}
          title="No shortlisted schools yet"
          description="Click the heart icon on any school card to save it to your personal shortlist."
          actionLabel="Explore Schools"
          actionHref="/schools"
        />
      </div>
    </div>
  );
}
