import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageSquareQuote,
  Scale,
  Compass,
  Lock,
  Building2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export function WhyAdmissionPitara() {
  const pillars = [
    {
      id: 'transparent-data',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'Data Integrity',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      title: 'Transparent School Information',
      description:
        'We present structured school details clearly, explicitly distinguishing verified records from information pending public verification or unavailable. Missing facts are never filled with synthetic estimates.',
      linkHref: '/schools',
      linkLabel: 'View verified directory',
    },
    {
      id: 'parent-reviews',
      icon: MessageSquareQuote,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Verified Community',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      title: 'Real Parent Reviews',
      description:
        'Ratings and feedback come exclusively from authenticated parent accounts. Parents can choose to publish feedback anonymously while internal account association protects against fraudulent reviews.',
      linkHref: '/schools',
      linkLabel: 'Explore parent ratings',
    },
    {
      id: 'clear-comparisons',
      icon: Scale,
      iconBg: 'bg-blue-50 text-blue-900 border-blue-200',
      badge: 'Unbiased Evaluation',
      badgeStyle: 'bg-blue-50 text-blue-900 border-blue-200',
      title: 'Side-by-Side Comparisons',
      description:
        'Compare multiple schools side-by-side across annual fee schedules, CBSE/ICSE/IB boards, sports and lab infrastructure, student-teacher ratios, and active admission criteria without promotional bias.',
      linkHref: '/compare',
      linkLabel: 'Compare schools now',
    },
    {
      id: 'admission-focused',
      icon: Compass,
      iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
      badge: 'Structured Journey',
      badgeStyle: 'bg-sky-50 text-sky-800 border-sky-200',
      title: 'Admission-Focused Discovery',
      description:
        'Designed specifically around the actual parent decision journey—from initial local campus discovery and fee breakdown to side-by-side comparison, deadline alerts, and shortlisting.',
      linkHref: '/admissions',
      linkLabel: 'Check admission timelines',
    },
    {
      id: 'privacy-conscious',
      icon: Lock,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'Data Protection',
      badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
      title: 'Privacy-Conscious Accounts',
      description:
        'Parent accounts use secure server-side authorization and strict data handling. We store only what is needed for your saved shortlists and reviews, with no exact location collection.',
      linkHref: '/privacy',
      linkLabel: 'Read privacy policy',
    },
    {
      id: 'local-discovery',
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Grounded Coverage',
      badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      title: 'Practical Local Directory',
      description:
        'Focused on practical, ground-level school search for families in Greater Noida West and Noida Extension. Our directory reflects actual institutional presences across local sectors.',
      linkHref: '/schools',
      linkLabel: 'Browse local sectors',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#faf8f5] border-y border-[var(--color-border)] reveal-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-slate-800 text-xs font-semibold mb-4 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span>Parent-First School Discovery</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Why Parents Rely on Admission Pitara
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Built as an independent resource so families can research, compare, and shortlist schools with clarity.
          </p>
        </div>

        {/* 6 Core Product Truth Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                data-reveal-delay={(idx % 3) + 1}
                className="p-7 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-2xs hover:shadow-warm-md hover:-translate-y-1 transition-all flex flex-col justify-between h-full group reveal-on-scroll"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs ${pillar.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${pillar.badgeStyle}`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[var(--color-primary)] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={pillar.linkHref}
                    className="text-xs font-bold text-[#0f172a] hover:text-[var(--color-primary)] inline-flex items-center gap-1.5 group/link"
                  >
                    <span>{pillar.linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1 text-slate-400 group-hover/link:text-[var(--color-primary)]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Promise Callout Box */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-white border border-[var(--color-border-strong)] shadow-warm-xs max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0f2d4a] text-white flex items-center justify-center shrink-0 shadow-warm-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                Our Editorial Principle
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Admission Pitara is an independent informational platform. We do not charge parents for search, sell personal contact details to coaching centers, or rank schools based on commercial sponsorships. Organic directory listings remain unbiassed and transparent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
