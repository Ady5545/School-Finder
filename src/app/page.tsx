import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      {/* 1. HERO: DISCOVERY-FIRST, PREMIUM, TRUST-LED                            */}
      {/* ========================================================================= */}
      <section className="relative isolate w-full overflow-hidden bg-[#0b1726] text-white border-b border-slate-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(37,99,235,0.20),transparent_32%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] sm:text-xs font-semibold tracking-wide text-slate-200 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,.65)]" />
                GREATER NOIDA WEST • NOIDA EXTENSION
              </div>

              <p className="mt-7 text-sm sm:text-base font-semibold text-amber-300 tracking-[0.18em] uppercase">
                Every school. Every fee. Every detail.
              </p>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[4.35rem] font-black tracking-[-0.045em] leading-[0.98] text-white">
                Find the right school
                <span className="block text-slate-300">with confidence.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-slate-300">
                Discover schools, compare fees and boards, explore admissions, and build your shortlist — all in one place, organized for parents.
              </p>

              <div className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.08] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <HomeSearch className="w-full" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-white mr-1">Explore:</span>
                <Link href="/schools?board=CBSE" className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 hover:bg-white/10 transition-colors">CBSE</Link>
                <Link href="/schools?board=IB" className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 hover:bg-white/10 transition-colors">IB &amp; Cambridge</Link>
                <Link href="/schools?area=Sector%2016B" className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 hover:bg-white/10 transition-colors">Sector 16B</Link>
                <Link href="/schools?area=Techzone%204" className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 hover:bg-white/10 transition-colors">Techzone 4</Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/schools">
                  <Button variant="accent" size="lg" className="text-white font-bold shadow-lg shadow-black/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore schools
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="outline" size="lg" className="bg-white/95 text-slate-900 border-white/30 hover:bg-white font-bold" rightIcon={<Scale className="w-4 h-4" />}>
                    Compare schools
                  </Button>
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Parent-first discovery</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transparent school information</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No pressure to choose</span>
              </div>
            </div>

            <div className="relative lg:min-h-[560px] flex items-center justify-center">
              <div className="absolute -inset-5 rounded-[2rem] bg-amber-400/10 blur-3xl pointer-events-none" />
              <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-sm">
                <div className="relative aspect-[1.08/1] overflow-hidden">
                  <Image
                    src="/images/gaurs.png"
                    alt="School campus in Greater Noida West featured by Admission Pitara"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover object-center scale-[1.02] transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111e] via-[#07111e]/10 to-transparent" />

                  <div className="absolute left-5 right-5 bottom-5 sm:left-7 sm:right-7 sm:bottom-7">
                    <div className="rounded-2xl border border-white/15 bg-[#07111e]/75 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-300">Built for the school search</p>
                          <p className="mt-1.5 text-lg sm:text-xl font-bold text-white">Explore → Compare → Shortlist → Apply</p>
                        </div>
                        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST STRIP: ONLY CLAIMS THE PRODUCT CAN ACTUALLY SUPPORT             */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#f8f6f1] border-b border-[var(--color-border)] py-7 sm:py-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[var(--color-border)]">
            <div className="text-center px-3">
              <span className="text-2xl sm:text-3xl font-black text-[#0f2d4a] block">{allSchools.length}</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 block">School profiles</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl sm:text-3xl font-black text-[#0f2d4a] block">20+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 block">Comparison fields</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl sm:text-3xl font-black text-[#0f2d4a] block">Fees</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 block">Broken down clearly</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl sm:text-3xl font-black text-[#0f2d4a] block">Admissions</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 block">Status &amp; process</span>
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
              A clearer way to choose a school
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2.5">
              Everything you need to move from a long list of schools to a confident shortlist.
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
            Your school search, finally organized.
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-content-muted)] mt-3 max-w-xl mx-auto leading-relaxed">
            Discover schools, understand the details that matter, and build a shortlist you can trust.
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
