import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SchoolComparisonView } from '../../components/school/SchoolComparisonView';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Compare Schools in Greater Noida West',
  'Compare top schools in Greater Noida West side-by-side across fees, curriculum, student-teacher ratio, and sports facilities.',
  '/compare'
);

export const dynamic = 'force-dynamic';

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Compare Schools', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Side-by-Side School Comparison
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Evaluate up to 4 schools across tuition fees, curriculum, student-teacher ratios, and sports amenities with difference highlights.
        </p>
      </div>

      <SchoolComparisonView />
    </div>
  );
}

