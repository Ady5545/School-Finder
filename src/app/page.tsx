import React from 'react';
import Link from 'next/link';
import { getAllSchools, getPopularSchools } from '../lib/schools';
import { SchoolCard } from '../components/school/SchoolCard';
import { SearchInput } from '../components/ui/SearchInput';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Compass, Scale, Calendar, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const allSchools = getAllSchools();
  const featuredSchools = getPopularSchools(3);

  return (
    <div className="w-full flex flex-col">
      {/* Hero / Discovery Affordance */}
      <section className="relative w-full bg-gradient-to-b from-white via-white to-[var(--color-surface-muted)] border-b border-[var(--color-border)] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold mb-6 select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
            <span>Parent-First Intelligence • Greater Noida West Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-content)] max-w-3xl leading-[1.15]">
            Make informed school decisions with confidence.
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-content-muted)] mt-4 max-w-2xl leading-relaxed">
            Transparent fee breakdowns, verified curriculum details, admission dates, and side-by-side comparisons for top schools in Greater Noida West & Noida Extension.
          </p>

          {/* Search bar directing to /schools */}
          <form action="/schools" method="GET" className="mt-8 w-full max-w-xl flex flex-col sm:flex-row gap-2.5">
            <SearchInput
              name="q"
              placeholder="Search by school name, sector, board (e.g., DPS, Techzone 4)..."
              className="py-3 text-sm shadow-xs"
            />
            <Button type="submit" variant="primary" size="lg" className="shrink-0 shadow-sm">
              Discover Schools
            </Button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-[var(--color-content-muted)]">
            <span className="font-semibold text-[var(--color-content)]">Quick Explore:</span>
            <Link
              href="/schools?board=CBSE"
              className="px-2.5 py-1 rounded-md bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              CBSE Schools
            </Link>
            <Link
              href="/schools?board=IB"
              className="px-2.5 py-1 rounded-md bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              IB / Cambridge
            </Link>
            <Link
              href="/schools"
              className="px-2.5 py-1 rounded-md bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              All {allSchools.length} Schools
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Foundations */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--color-content)]">17 Verified Schools</h2>
            <p className="text-xs text-[var(--color-content-muted)] mt-1.5 leading-relaxed">
              Complete coverage of prominent institutions across Noida Extension sectors, maintained with verified addresses and coordinates.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--color-content)]">Side-by-Side Comparison</h2>
            <p className="text-xs text-[var(--color-content-muted)] mt-1.5 leading-relaxed">
              Objective comparison across annual fees, student-teacher ratios, sports facilities, and transport availability.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-white shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--color-content)]">Admission Intelligence</h2>
            <p className="text-xs text-[var(--color-content-muted)] mt-1.5 leading-relaxed">
              Session timelines, registration requirements, and age criteria tracked cleanly for parents.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Schools Preview */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-content)] tracking-tight">
              Featured Schools in Greater Noida West
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
              Top institutions with audited data, verified fee ranges, and active admission sessions.
            </p>
          </div>
          <Link href="/schools">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore All {allSchools.length} Schools
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </section>
    </div>
  );
}
