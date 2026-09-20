import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AdmissionsHubView } from '../../components/school/AdmissionsHubView';
import { buildPageMetadata } from '../../lib/seo';
import { Calendar } from 'lucide-react';

export const metadata = buildPageMetadata(
  'School Admissions in Greater Noida | Admission Pitara',
  'Track school admissions in Greater Noida, Greater Noida West and Noida Extension: admission status, registration windows, age criteria, procedures and official school portals.',
  '/admissions'
);

export default function AdmissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Admissions', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 border-b border-[var(--color-border)] mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>School Application Guidance &amp; Current Statuses</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          School Admissions in Greater Noida &amp; Noida Extension
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1 max-w-3xl leading-relaxed">
          Find current admission information for schools across Greater Noida, Greater Noida West, Noida Extension and nearby Noida, including registration windows, age criteria, application procedures and official school portals.
        </p>
      </div>

      <AdmissionsHubView />
    </div>
  );
}
