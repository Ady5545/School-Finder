import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { buildPageMetadata } from '../../lib/seo';
import { Scale, ArrowRight } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Compare Schools',
  'Compare top schools in Greater Noida West side-by-side across fees, curriculum, student-teacher ratio, and sports facilities.',
  '/compare'
);

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Compare Schools', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 border-b border-[var(--color-border)] mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          School Comparison Engine
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Select 2 to 4 schools to compare verified fees, facilities, and academic parameters side-by-side.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <EmptyState
          icon={<Scale className="w-6 h-6 text-[var(--color-primary)]" />}
          title="No schools selected for comparison"
          description="Browse schools in Greater Noida West and click 'Compare' on any school card to begin a side-by-side analysis."
          actionLabel="Browse Schools Directory"
          onAction={() => {}}
        />

        <div className="text-center mt-4">
          <Link href="/schools">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Find Schools to Compare
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
