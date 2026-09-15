import React from 'react';
import Link from 'next/link';
import { getAllSchools, getPopularSchools } from '../lib/schools';
import { SchoolCard } from '../components/school/SchoolCard';
import { HomeSearch } from '../components/school/HomeSearch';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
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
  Building2,
  BookOpen,
  CheckCircle,
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
    { name: 'Techzone 4', count: sectorCounts['Techzone 4'] || 4, desc: 'Central education corridor near Gaur City' },
    { name: 'Knowledge Park 5', count: sectorCounts['Knowledge Park 5'] || 3, desc: 'Expansive institutional campuses' },
    { name: 'Sector 1', count: sectorCounts['Sector 1'] || 2, desc: 'Well-connected Noida Extension hub' },
    { name: 'Sector 16B', count: sectorCounts['Sector 16B'] || 3, desc: 'Adjacent to major residential townships' },
    { name: 'Sector 2', count: sectorCounts['Sector 2'] || 2, desc: 'Fastest-growing school sector' },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION: Greater Noida Focus, Academic Trust, Refined Composition */}
      <section className="relative w-full bg-gradient-to-b from-[var(--color-surface-muted)] via-[var(--color-surface-subtle)]/40 to-white border-b border-[var(--color-border)] py-16 sm:py-24 overflow-hidden">
        {/* Subtle architectural atmosphere */}
        <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(15,45,74,0.08),transparent)] pointer-events-none" />
        <div data-parallax="0.08" className="absolute top-1/4 right-10 w-96 h-96 bg-[var(--color-accent)]/4 rounded-full blur-3xl pointer-events-none" />
        <div data-parallax="-0.06" className="absolute bottom-0 left-10 w-96 h-96 bg-[var(--color-primary)]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
          <div className="flex flex-col items-center">
            {/* Greater Noida Geographic & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[var(--color-primary)] text-xs font-bold mb-6 select-none border border-[var(--color-border-strong)] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
              <span className="tracking-wide">Greater Noida West &amp; Noida Extension School Directory</span>
              <span className="text-[var(--color-border-strong)]">•</span>
              <span className="text-[var(--color-content-muted)] font-medium">17 Verified Campuses</span>
            </div>

            {/* Master Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-content)] max-w-4xl leading-[1.1] sm:leading-[1.08]">
              Find the right school in Greater Noida with{' '}
              <span className="text-[var(--color-primary)] relative whitespace-nowrap">
                complete clarity
                <span className="absolute left-0 bottom-1 w-full h-2.5 bg-[var(--color-accent-light)] -z-10 rounded-sm border-b-2 border-[var(--color-accent)]" />
              </span>
              .
            </h1>

            {/* Supporting Subtext */}
            <p className="text-sm sm:text-base lg:text-lg text-[var(--color-content-muted)] mt-5 max-w-2xl leading-relaxed">
              Transparent fee breakdowns, authentic facilities, verified boards (CBSE, ICSE, IB), and side-by-side comparisons for 17 institutions across Noida Extension.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="mt-8 w-full flex justify-center">
            <HomeSearch />
          </div>

          {/* Quick Filter Tags with Active State Styles */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-[var(--color-content-muted)]">
            <span className="font-bold text-[var(--color-content)]">Quick Explore:</span>
            <Link
              href="/schools?board=CBSE"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-semibold shadow-2xs active:scale-95"
            >
              CBSE Schools
            </Link>
            <Link
              href="/schools?board=IB"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-semibold shadow-2xs active:scale-95"
            >
              IB / Cambridge
            </Link>
            <Link
              href="/schools?area=Techzone%204"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-semibold shadow-2xs active:scale-95"
            >
              Techzone 4
            </Link>
            <Link
              href="/schools?area=Knowledge%20Park%205"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-semibold shadow-2xs active:scale-95"
            >
              Knowledge Park 5
            </Link>
            <Link
              href="/schools"
              className="px-4 py-1.5 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all font-bold shadow-xs active:scale-95 inline-flex items-center gap-1.5"
            >
              <span>Explore All 17</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Live Trust Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 w-full max-w-4xl text-left">
            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-xs">
              <span className="text-2xl font-black text-[var(--color-primary)] block">17</span>
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider block mt-0.5">
                Verified Campuses
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-xs">
              <span className="text-2xl font-black text-[var(--color-success)] block">100%</span>
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider block mt-0.5">
                Fee Audits Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-xs">
              <span className="text-2xl font-black text-[var(--color-rating)] block">₹85k–2.4L</span>
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider block mt-0.5">
                Annual Fee Range
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[var(--color-border)] shadow-xs">
              <span className="text-2xl font-black text-[var(--color-accent)] block">20+</span>
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider block mt-0.5">
                Comparison Metrics
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 5-STEP WORKFLOW: Discover -> Understand -> Compare -> Shortlist -> Apply */}
      <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal duration={550} distance={14} className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Parent-Centric Methodology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
            How parents make confident school choices
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-2">
            Step-by-step clarity from initial discovery to admission confirmation.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <ScrollReveal duration={500} distance={16} delay={0} className="h-full">
            <div className="h-full p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-xs hover:shadow-md hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-black text-sm mb-3 group-hover:scale-105 transition-transform">
                  01
                </div>
                <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Discover</span>
                </h3>
                <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                  Filter by sector, board (CBSE, ICSE, IB), grade span, and verified fees.
                </p>
              </div>
              <Link href="/schools" className="mt-4 text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore catalog →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal duration={500} distance={16} delay={70} className="h-full">
            <div className="h-full p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-xs hover:shadow-md hover:border-[var(--color-accent)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center font-black text-sm mb-3 group-hover:scale-105 transition-transform">
                  02
                </div>
                <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Understand</span>
                </h3>
                <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                  Inspect annual fee components, student-teacher ratios, labs, and sports infrastructure.
                </p>
              </div>
              <Link href="/schools" className="mt-4 text-xs font-semibold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                View school profiles →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal duration={500} distance={16} delay={140} className="h-full">
            <div className="h-full p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-xs hover:shadow-md hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-sm mb-3 group-hover:scale-105 transition-transform">
                  03
                </div>
                <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Compare</span>
                </h3>
                <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                  Evaluate up to 4 schools side-by-side across 20+ parameters with difference highlighting.
                </p>
              </div>
              <Link href="/compare" className="mt-4 text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Compare engine →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal duration={500} distance={16} delay={210} className="h-full">
            <div className="h-full p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-xs hover:shadow-md hover:border-rose-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-sm mb-3 group-hover:scale-105 transition-transform">
                  04
                </div>
                <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Shortlist</span>
                </h3>
                <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                  Save prospective choices to your family wishlist with local persistence across visits.
                </p>
              </div>
              <Link href="/wishlist" className="mt-4 text-xs font-semibold text-rose-700 hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Your shortlist →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal duration={500} distance={16} delay={280} className="h-full">
            <div className="h-full p-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-xs hover:shadow-md hover:border-sky-500 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-black text-sm mb-3 group-hover:scale-105 transition-transform">
                  05
                </div>
                <h3 className="text-sm font-bold text-[var(--color-content)] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-700" />
                  <span>Apply</span>
                </h3>
                <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
                  Track active registration windows, age criteria, documentation, and official portals.
                </p>
              </div>
              <Link href="/admissions" className="mt-4 text-xs font-semibold text-sky-800 hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Admission status →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. GREATER NOIDA WEST SECTOR NAVIGATOR */}
      <section className="w-full py-16 bg-[var(--color-surface-muted)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal duration={550} distance={14} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Locality Intelligence</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--color-content)] tracking-tight">
                Explore by Greater Noida West Sectors
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
                Find premier institutions located right within your commuting perimeter.
              </p>
            </div>
            <Link href="/schools">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Sectors &amp; Map
              </Button>
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularSectors.map((sec, idx) => (
              <ScrollReveal key={sec.name} duration={500} distance={16} delay={idx * 60} className="h-full">
                <Link
                  href={`/schools?area=${encodeURIComponent(sec.name)}`}
                  className="h-full flex flex-col justify-between p-5 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--color-content)] group-hover:text-[var(--color-primary)] transition-colors">
                        {sec.name}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-content)] group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary)] transition-colors">
                        {sec.count} {sec.count === 1 ? 'school' : 'schools'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-content-muted)] mt-2 line-clamp-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-[var(--color-primary)] inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse {sec.name} →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED INSTITUTIONS CATALOG */}
      <section className="w-full py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal duration={550} distance={14} className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
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
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All {allSchools.length} Schools
            </Button>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </section>

      {/* 5. PARENT-FIRST TRUST & TRANSPARENCY PLEDGE */}
      <section className="w-full py-16 bg-[var(--color-primary)] text-white border-t border-[var(--color-border-strong)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <ScrollReveal duration={550} distance={14} className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-4 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Our Parent-First Commitment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                No sponsored rankings. No fake ratings. Just honest school facts.
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xl">
                Unlike commercial lead-generation portals, Admission Pitara does not sell top positions to institutions. Every fee breakdown, student-teacher ratio, and facility audit is verified directly from official disclosures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">Audited tuition fee breakdowns with caution notes</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">Side-by-side comparison across 20+ parameters</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">Official admission forms &amp; registration dates</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">Zero commission from parent inquiries</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal duration={550} distance={14} delay={90} className="lg:col-span-5 flex flex-col gap-4 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/15">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[var(--color-rating)]" />
                <span>Ready to find the ideal school?</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter through Greater Noida West&apos;s leading CBSE, ICSE, and IB schools right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/schools" className="flex-1">
                  <Button variant="primary" size="md" className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
                    Explore Directory
                  </Button>
                </Link>
                <Link href="/compare" className="flex-1">
                  <Button variant="outline" size="md" className="w-full text-[var(--color-primary)] bg-white border-white hover:bg-slate-100">
                    Compare Schools
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}

