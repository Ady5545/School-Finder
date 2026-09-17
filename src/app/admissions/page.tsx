import React from 'react';
import Link from 'next/link';
import { getAllSchools } from '../../lib/schools';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AdmissionStatus } from '../../components/school/AdmissionStatus';
import { LocationDisplay } from '../../components/school/LocationDisplay';
import { buildPageMetadata } from '../../lib/seo';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Admission Intelligence Tracker',
  'Track current admission statuses, session schedules, and age eligibility for Greater Noida West institutions.',
  '/admissions'
);

export const dynamic = 'force-dynamic';

export default function AdmissionsPage() {
  const schools = getAllSchools();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Admissions', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 border-b border-[var(--color-border)] mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Academic Sessions & Deadlines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Greater Noida West Admission Tracker
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Real-time admission status, eligibility age benchmarks, and direct official application links across all {schools.length} institutions.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] text-[var(--color-content)] font-bold">
              <tr>
                <th scope="col" className="p-4">School</th>
                <th scope="col" className="p-4">Location</th>
                <th scope="col" className="p-4">Board</th>
                <th scope="col" className="p-4">Status</th>
                <th scope="col" className="p-4">Academic Session &amp; Schedule</th>
                <th scope="col" className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-content-muted)]">
              {schools.map(school => (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-content)]">
                    <Link href={`/schools/${school.slug}`} className="hover:text-[var(--color-primary)]">
                      {school.name}
                    </Link>
                  </td>
                  <td className="p-4">
                    <LocationDisplay location={school.location} />
                  </td>
                  <td className="p-4 font-medium">{school.board.join(', ')}</td>
                  <td className="p-4">
                    <AdmissionStatus admissions={school.admissions} showDate={false} />
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="font-semibold text-slate-800">
                      {school.admissions.session || '2026–2027 (Ongoing)'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {school.admissions.timelineDescription || 'Check official school admissions page'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/schools/${school.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
