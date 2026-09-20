import React from 'react';
import Link from 'next/link';
import { getAllSchools } from '../lib/schools';
import { HomeSearch } from '../components/school/HomeSearch';
import { HomeSchoolShowcase } from '../components/school/HomeSchoolShowcase';
import { HomeRatingsDiscovery } from '../components/home/HomeRatingsDiscovery';
import { WhyAdmissionPitara } from '../components/home/WhyAdmissionPitara';
import { SponsoredPlacementCard } from '../components/school/SponsoredPlacementCard';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  Scale,
  Calendar,
  ArrowRight,
  Heart,
  Search,
  CheckCircle2,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'School Admissions in Greater Noida West | Admission Pitara',
  description:
    'Find schools and admission information in Greater Noida West and Noida Extension. Compare fees, boards, facilities, school profiles and current admission details.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'School Admissions in Greater Noida West | Admission Pitara',
    description:
      'Find schools and admission information in Greater Noida West and Noida Extension. Compare fees, boards, facilities, school profiles and current admission details.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Admissions in Greater Noida West | Admission Pitara',
    description:
      'Find schools and admission information in Greater Noida West and Noida Extension. Compare fees, boards, facilities, school profiles and current admission details.',
  },
};

export default function HomePage() {

  const allSchools = getAllSchools();

  return (
    <div className="w-full flex flex-col bg-[#fdfcf9] text-[var(--color-content)]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: EXACT REPLICATION FROM USER IMAGE 1                      */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-gradient-to-b from-[#f2f6fa] via-[#f8fafc] to-[#fdfcf9] border-b border-[var(--color-border)] pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Subtle grid pattern and soft primary glow for refined aesthetic */}
        <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-radial-hero pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full flex flex-col items-center text-center">
            {/* Top Pill Badge matching Image 1 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-800 text-xs sm:text-[13px] font-medium mb-6 sm:mb-8 border border-[#e5dfd5] shadow-xs backdrop-blur-md mx-auto">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#c2410c] shrink-0" />
              <span className="font-semibold text-slate-900">Greater Noida West &amp; Noida Extension School Directory</span>
              <span className="text-slate-400 mx-0.5">•</span>
              <span className="text-slate-600 font-normal">{allSchools.length} Schools Listed</span>
            </div>

            {/* Main Confident Headline matching Image 1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-black tracking-tight text-[#0f172a] leading-[1.14] sm:leading-[1.10] w-full max-w-4xl lg:max-w-5xl text-center mx-auto">
              Find the right school in Greater<br className="hidden sm:inline" /> Noida with{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-[#0f2d4a]">complete clarity.</span>
                <span className="absolute left-0 bottom-0.5 sm:bottom-1 w-full h-[3px] sm:h-[4px] bg-[#c2410c] rounded-full" />
              </span>
            </h1>

            {/* Supporting Subtitle matching Image 1 */}
            <p className="text-base sm:text-lg text-slate-600 mt-5 sm:mt-6 leading-relaxed max-w-2xl sm:max-w-3xl text-center mx-auto">
              Transparent fee breakdowns, authentic facilities, board details (CBSE, ICSE, IB),<br className="hidden sm:inline" />
              and side-by-side comparisons for {allSchools.length} institutions across Noida Extension.
            </p>

            {/* Search Bar */}
            <div className="mt-8 sm:mt-10 w-full max-w-4xl mx-auto">
              <HomeSearch className="w-full" />
            </div>

            {/* Quick Explore Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-[var(--color-content-muted)] max-w-4xl mx-auto">
              <span className="font-bold text-[var(--color-content)] mr-1">Quick Explore:</span>
              <Link
                href="/schools?board=CBSE"
                className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] hover:border-amber-400 hover:text-amber-800 hover:bg-amber-50/70 transition-all font-semibold shadow-warm-2xs"
              >
                CBSE
              </Link>
              <Link
                href="/schools?board=IB"
                className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] hover:border-amber-400 hover:text-amber-800 hover:bg-amber-50/70 transition-all font-semibold shadow-warm-2xs"
              >
                IB &amp; Cambridge
              </Link>
              <Link
                href="/schools?area=Sector%2016B"
                className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-semibold shadow-warm-2xs"
              >
                Sector 16B
              </Link>
              <Link
                href="/schools?area=Techzone%204"
                className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] hover:border-amber-400 hover:text-amber-800 hover:bg-amber-50/70 transition-all font-semibold shadow-warm-2xs"
              >
                Techzone 4
              </Link>
              <Link
                href="/schools?area=Knowledge%20Park%205"
                className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all font-semibold shadow-warm-2xs"
              >
                Knowledge Park 5
              </Link>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-[var(--color-border-subtle)] w-full max-w-4xl mx-auto">
              <Link href="/schools">
                <Button variant="primary" size="lg" className="text-white font-bold shadow-warm-xs hover:shadow-warm-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore All {allSchools.length} Listed Schools
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="lg" className="bg-white hover:bg-slate-50 font-bold border-[var(--color-border-strong)] hover:border-amber-500 hover:text-amber-800" rightIcon={<Scale className="w-4 h-4" />}>
                  Compare Schools Side-by-Side
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PROMOTED / SPONSORED PARTNER BANNER (IF ACTIVE CAMPAIGN CONFIGURED)       */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 reveal-on-scroll">
        <SponsoredPlacementCard placement="homepage_hero" />
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPACT PROOF STRIP (SINGLE HORIZONTAL BENCHMARK SECTION)              */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#f4f7fb] border-b border-[var(--color-border)] py-8 sm:py-10 reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
            <div className="text-center pt-3 sm:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--color-primary)] block tracking-tight">
                {allSchools.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-content)] mt-1 block">
                School Directory
              </span>
            </div>

            <div className="text-center pt-3 sm:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-700 block tracking-tight">
                100%
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-content)] mt-1 block">
                Fee Audits
              </span>
            </div>

            <div className="text-center pt-3 sm:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-600 block tracking-tight">
                20+
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-content)] mt-1 block">
                Comparison Metrics
              </span>
            </div>

            <div className="text-center pt-3 sm:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--color-primary)] block tracking-tight">
                81
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-content)] mt-1 block">
                Schools Tracked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. METHODOLOGY: PARENT-CENTRIC METHODOLOGY                                 */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 bg-[#f8fafc] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center reveal-on-scroll">
            {/* Top Badge matching Image 3 */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50/90 border border-blue-100 text-blue-900 text-xs font-semibold mb-4 mx-auto shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Parent-Centric Methodology</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight">
              How parents make confident school choices
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2.5">
              Step-by-step clarity from initial discovery to admission confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {/* 01 Discover */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-warm-2xs hover:shadow-warm-md hover:-translate-y-1 transition-all flex flex-col justify-between h-full reveal-on-scroll" data-reveal-delay="1">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#1e40af] font-bold text-xs mb-5">
                  01
                </div>
                <div className="flex items-center gap-2 text-[#0f172a] mb-3">
                  <Compass className="w-4 h-4 text-slate-800 shrink-0" />
                  <h3 className="text-base font-bold text-[#0f172a]">Discover</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Filter by sector, board (CBSE, ICSE, IB), grade span, and fee verification status.
                </p>
              </div>
              <Link
                href="/schools"
                className="mt-6 pt-4 text-xs font-bold text-slate-900 hover:text-blue-900 inline-flex items-center gap-1 group/link"
              >
                <span>Explore catalog</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>

            {/* 02 Understand */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-warm-2xs hover:shadow-warm-md hover:-translate-y-1 transition-all flex flex-col justify-between h-full reveal-on-scroll" data-reveal-delay="2">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#fff7ed] text-[#9a3412] font-bold text-xs mb-5">
                  02
                </div>
                <div className="flex items-center gap-2 text-[#0f172a] mb-3">
                  <Layers className="w-4 h-4 text-[#c2410c] shrink-0" />
                  <h3 className="text-base font-bold text-[#0f172a]">Understand</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Inspect annual fee components, student-teacher ratios, labs, and sports infrastructure.
                </p>
              </div>
              <Link
                href="/schools"
                className="mt-6 pt-4 text-xs font-bold text-[#c2410c] hover:text-orange-900 inline-flex items-center gap-1 group/link"
              >
                <span>View school profiles</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>

            {/* 03 Compare */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-warm-2xs hover:shadow-warm-md hover:-translate-y-1 transition-all flex flex-col justify-between h-full reveal-on-scroll" data-reveal-delay="3">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#065f46] font-bold text-xs mb-5">
                  03
                </div>
                <div className="flex items-center gap-2 text-[#0f172a] mb-3">
                  <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-base font-bold text-[#0f172a]">Compare</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Evaluate up to 4 schools side-by-side across 20+ parameters with difference highlighting.
                </p>
              </div>
              <Link
                href="/compare"
                className="mt-6 pt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 group/link"
              >
                <span>Compare engine</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>

            {/* 04 Shortlist */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-warm-2xs hover:shadow-warm-md hover:-translate-y-1 transition-all flex flex-col justify-between h-full reveal-on-scroll" data-reveal-delay="4">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#fff1f2] text-[#9f1239] font-bold text-xs mb-5">
                  04
                </div>
                <div className="flex items-center gap-2 text-[#0f172a] mb-3">
                  <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                  <h3 className="text-base font-bold text-[#0f172a]">Shortlist</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Save prospective choices to your family wishlist with local persistence across visits.
                </p>
              </div>
              <Link
                href="/wishlist"
                className="mt-6 pt-4 text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 group/link"
              >
                <span>Your shortlist</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>

            {/* 05 Apply */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-warm-2xs hover:shadow-warm-md hover:-translate-y-1 transition-all flex flex-col justify-between h-full reveal-on-scroll" data-reveal-delay="5">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#f0f9ff] text-[#0369a1] font-bold text-xs mb-5">
                  05
                </div>
                <div className="flex items-center gap-2 text-[#0f172a] mb-3">
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                  <h3 className="text-base font-bold text-[#0f172a]">Apply</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Track active registration windows, age criteria, documentation, and official portals.
                </p>
              </div>
              <Link
                href="/admissions"
                className="mt-6 pt-4 text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 group/link"
              >
                <span>Admission status</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN SECTION: SCHOOL DISCOVERY SHOWCASE                                */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 text-left reveal-on-scroll">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-content)] tracking-tight">
            Explore schools
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-content-muted)] mt-1.5">
            Compare campuses using the same transparent criteria.
          </p>
        </div>

        {/* Dynamic Showcase with Equal Visual Status */}
        <HomeSchoolShowcase schools={allSchools} />
      </section>

      {/* ========================================================================= */}
      {/* 5. WHAT PARENTS THINK: VERIFIED REVIEWS & RATINGS DISCOVERY               */}
      {/* ========================================================================= */}
      <HomeRatingsDiscovery />

      {/* ========================================================================= */}
      {/* 6. WHY ADMISSION PITARA: POLISHED 6-PILLAR TRUST & DISCOVERY SECTION      */}
      {/* ========================================================================= */}
      <WhyAdmissionPitara />

      {/* ========================================================================= */}
      {/* 6. FINAL COMPACT CTA                                                      */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[#f0f5fa] border-t border-[var(--color-border)] reveal-on-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-content)] tracking-tight">
            Find the right school with clarity.
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-content-muted)] mt-3 max-w-xl mx-auto leading-relaxed">
            Explore Greater Noida schools, compare what matters, and build your shortlist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/schools" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto text-white font-bold shadow-warm-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore schools
              </Button>
            </Link>
            <Link href="/compare" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white font-bold border border-[var(--color-border-strong)] hover:border-[var(--color-primary)]" rightIcon={<Scale className="w-4 h-4" />}>
                Compare schools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
