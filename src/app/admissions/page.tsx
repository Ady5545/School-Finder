import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AdmissionsHubView } from '../../components/school/AdmissionsHubView';
import { buildPageMetadata } from '../../lib/seo';
import { Calendar } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Admissions Hub & Tracker',
  'Track current admission statuses, session schedules, application procedures, and official registration portals across Greater Noida West institutions.',
  '/admissions'
);

export const dynamic = 'force-dynamic';

export default function AdmissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Admissions Hub', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 border-b border-[var(--color-border)] mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Parent Application Guidance &amp; Live Statuses</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Greater Noida West Admissions Hub
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Authoritative admission statuses, documented application procedures, source-verified schedules, and official school registration portals across all institutions.
        </p>
      </div>

      <AdmissionsHubView />
    </div>
  );
}
