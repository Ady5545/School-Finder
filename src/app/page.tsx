import React from 'react';
import Link from 'next/link';
import { getAllSchools, getPopularSchools } from '../lib/schools';
import { SchoolCard } from '../components/school/SchoolCard';
import { HomeSearch } from '../components/school/HomeSearch';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  Compass,
  Scale,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Heart,
  MapPin,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function HomePage() {
  const allSchools = getAllSchools();
  const featuredSchools = getPopularSchools(6);

  // Sector breakdown stats
  const sectorCounts: Record<string, number> = {};
  allSchools.forEach(s => {
    const area = s.location.area || s.location.sector || 'Greater Noida West';
    sectorCounts[area] = (sectorCounts[area] || 0) + 1;
  });

  const popularSectors = [
    { name: 'Techzone 4', count: sectorCounts['Techzone 4'] || 4, desc: 'Major school corridor near Gaur City' },
    { name: 'Knowledge Park 5', count: sectorCounts['Knowledge Park 5'] || 3, desc: 'Large institutional campuses' },
    { name: 'Sector 1', count: sectorCounts['Sector 1'] || 2, desc: 'Central Noida Extension zone' },
    { name: 'Sector 16B', count: sectorCounts['Sector 16B'] || 3, desc: 'Close to residential townships' },
    { name: 'Sector 2', count: sectorCounts['Sector 2'] || 2, desc: 'Rapidly emerging education hub' },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero & Search Experience */}
      <section className="relative w-full bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-[var(--color-border)] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Parent Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold mb-6 select-none border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
            <span>Independent & Parent-First School Intelligence • Greater Noida West</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-content)] max-w-3xl leading-[1.12]">
            Find the right school for your child with total clarity.
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-content-muted)] mt-4 max-w-2xl leading-relaxed">
            Transparent fee structures, genuine campus facilities, official admission timelines, and side-by-side comparisons for 17 institutions across Noida Extension.
          </p>

          {/* Interactive Search with Instant Autocomplete */}
          <div className="mt-8 w-full flex justify-center">
            <HomeSearch />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-[var(--color-content-muted)]">
            <span className="font-bold text-[var(--color-content)]">Quick Explore:</span>
            <Link
              href="/schools?board=CBSE"
              className="px-3 py-1 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-medium shadow-2xs"
            >
              CBSE Affiliated
            </Link>
            <Link
              href="/schools?board=IB"
              className="px-3 py-1 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-medium shadow-2xs"
            >
              IB / Cambridge
            </Link>
            <Link
              href="/schools?area=Techzone%204"
              className="px-3 py-1 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-medium shadow-2xs"
            >
              Techzone 4 Hub
            </Link>
            <Link
              href="/schools?area=Knowledge%20Park%205"
              className="px-3 py-1 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-medium shadow-2xs"
            >
              Knowledge Park 5
            </Link>
            <Link
              href="/schools"
              className="px-3 py-1 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all font-semibold shadow-2xs"
            >
              Browse All 17 Schools →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The 5-Step Admission Journey Flow */}
      <section className="w-full py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] mb-2">
            The Admission Pitara Workflow
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
            How parents make confident school choices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-extrabold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>Discover</span>
              </h3>
              <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                Filter by sector, affiliation (CBSE, ICSE, IB), grade span, and verified fees.
              </p>
            </div>
            <Link href="/schools" className="mt-4 text-xs font-semibold text-sky-700 hover:underline inline-flex items-center gap-1">
              Explore catalog →
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-extrabold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Understand</span>
              </h3>
              <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                Inspect annual fee components, student-teacher ratios, labs, and sports infrastructure.
              </p>
            </div>
            <Link href="/schools" className="mt-4 text-xs font-semibold text-amber-700 hover:underline inline-flex items-center gap-1">
              View school profiles →
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Compare</span>
              </h3>
              <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                Evaluate up to 4 schools side-by-side across 20+ parameters with highlight differences.
              </p>
            </div>
            <Link href="/compare" className="mt-4 text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1">
              Compare engine →
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-extrabold text-sm mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>Shortlist</span>
              </h3>
              <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                Save prospective choices to your family wishlist with local persistence across visits.
              </p>
            </div>
            <Link href="/wishlist" className="mt-4 text-xs font-semibold text-rose-700 hover:underline inline-flex items-center gap-1">
              Your shortlist →
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-sm mb-3">
                5
              </div>
              <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Apply</span>
              </h3>
              <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                Track active registration windows, age criteria, documentation, and official portals.
              </p>
            </div>
            <Link href="/admissions" className="mt-4 text-xs font-semibold text-indigo-700 hover:underline inline-flex items-center gap-1">
              Admission status →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Greater Noida West Sector Navigator */}
      <section className="w-full py-12 bg-slate-50/80 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Locality Intelligence</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-content)] tracking-tight">
                Explore by Greater Noida West Sectors
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
                Find premier institutions located right within your commuting perimeter.
              </p>
            </div>
            <Link href="/schools">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Interactive Map & List
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularSectors.map(sec => (
              <Link
                key={sec.name}
                href={`/schools?area=${encodeURIComponent(sec.name)}`}
                className="p-4 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--color-content)] group-hover:text-[var(--color-primary)] transition-colors">
                    {sec.name}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary)] transition-colors">
                    {sec.count} {sec.count === 1 ? 'school' : 'schools'}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-content-muted)] mt-1.5 line-clamp-1">
                  {sec.desc}
                </p>
                <span className="mt-3 text-[11px] font-semibold text-[var(--color-primary)] inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore sector →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Institutions Catalog */}
      <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Institutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
              Featured Schools in Greater Noida West
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
              Detailed curricula, verified fee breakdowns, and parent-reviewed academic environments.
            </p>
          </div>
          <Link href="/schools">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All {allSchools.length} Schools
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </section>

      {/* 5. Trust & Transparency Pledge */}
      <section className="w-full py-14 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Our Parent-First Commitment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                No sponsored rankings. No fake ratings. Just honest school facts.
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xl">
                Unlike commercial lead-generation portals, Admission Pitara does not sell top positions to institutions. Every fee breakdown, student-teacher ratio, and facility audit is verified directly from official disclosures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Audited tuition fee breakdowns with caution notes</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Side-by-side comparison across 20+ parameters</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Official admission forms & registration dates</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Zero commission from parent inquiries</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>Ready to find the ideal school?</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter through Greater Noida West&apos;s leading CBSE, ICSE, and IB schools right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/schools" className="flex-1">
                  <Button variant="primary" size="md" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]">
                    Explore Directory
                  </Button>
                </Link>
                <Link href="/compare" className="flex-1">
                  <Button variant="outline" size="md" className="w-full text-slate-800 bg-white border-slate-300 hover:bg-slate-100">
                    Compare Schools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

