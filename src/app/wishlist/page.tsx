import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { WishlistContentView } from '../../components/school/WishlistContentView';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = {
  ...buildPageMetadata(
  'Shortlisted Schools in Greater Noida West',
  'Your saved schools and shortlisted institutions for Greater Noida West admissions.',
  '/wishlist'
),
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Shortlist', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Your Shortlisted Schools
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Review your saved schools, compare their fees side-by-side, and prepare your application schedule.
        </p>
      </div>

      <WishlistContentView />
    </div>
  );
}

