import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ShieldCheck, Compass, Users, CheckCircle } from 'lucide-react';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'About Admission Pitara',
  'Learn about the parent-first mission, editorial independence, and methodology behind Admission Pitara.',
  '/about'
);

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'About', isCurrent: true }]} className="mb-6" />

      <div className="space-y-4 pb-8 border-b border-[var(--color-border)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent & Parent-First</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-content)] tracking-tight">
          About Admission Pitara
        </h1>
        <p className="text-base text-[var(--color-content-muted)] leading-relaxed">
          Admission Pitara was created to solve a pressing dilemma faced by every parent moving to Greater Noida West and Noida Extension: finding trustworthy, unbiased, and structured information about local schools.
        </p>
      </div>

      <div className="py-8 space-y-8 text-sm text-[var(--color-content)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--color-content)]">Our Core Philosophy</h2>
          <p className="text-[var(--color-content-muted)]">
            School selection is one of the most critical decisions a family makes. Yet, parents frequently struggle with opaque fee structures, unverified marketing brochures, and scattered admission updates.
          </p>
          <p className="text-[var(--color-content-muted)]">
            Admission Pitara bridges this gap with standardized facts, audited fee ranges, official website references, and transparent institutional profiles.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white space-y-2">
            <Compass className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="font-bold text-sm">Hyper-Local Focus</h3>
            <p className="text-xs text-[var(--color-content-muted)]">
              Covering every major institution across Greater Noida West sectors with exact addresses.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm">Fee Transparency</h3>
            <p className="text-xs text-[var(--color-content-muted)]">
              Audited fee breakdowns with clear labels distinguishing verified sources from pending prospectus audits.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white space-y-2">
            <Users className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm">Parent Advocates</h3>
            <p className="text-xs text-[var(--color-content-muted)]">
              Independent data architecture where organic ratings and fee comparisons are never distorted.
            </p>
          </div>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--color-content)]">Data Integrity & Standards</h2>
          <ul className="space-y-2 text-[var(--color-content-muted)] list-none p-0">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>We never fabricate reviews, testimonials, or ratings for promotional purposes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>All 17 initial school profiles are mapped directly to genuine geographical locations in Greater Noida West.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Official contact lines and websites are provided directly for every school.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
