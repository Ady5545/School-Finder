import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSchoolBySlug, getAllSchoolSlugs, getAllSchools } from '../../../lib/schools';
import { buildSchoolMetadata, generateSchoolJsonLd } from '../../../lib/seo';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { SchoolImage } from '../../../components/school/SchoolImage';
import { SchoolBadge } from '../../../components/school/SchoolBadge';
import { FeeDisplay } from '../../../components/school/FeeDisplay';
import { AdmissionStatus } from '../../../components/school/AdmissionStatus';
import { RatingDisplay } from '../../../components/ui/RatingDisplay';
import { SchoolProfileActions } from '../../../components/school/SchoolProfileActions';
import { SchoolCard } from '../../../components/school/SchoolCard';
import { Button } from '../../../components/ui/Button';
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  GraduationCap,
  Users,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface SchoolDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSchoolSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: SchoolDetailPageProps) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  if (!school) return {};
  return buildSchoolMetadata(school);
}

export default async function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);

  if (!school) {
    notFound();
  }

  const jsonLd = generateSchoolJsonLd(school);
  const allSchools = getAllSchools();

  // Find 3 similar / nearby schools
  const similarSchools = allSchools
    .filter(
      s =>
        s.slug !== school.slug &&
        (s.location.area === school.location.area ||
          s.location.sector === school.location.sector ||
          s.board.some(b => school.board.includes(b)))
    )
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Schools', href: '/schools' },
          { label: school.name, isCurrent: true },
        ]}
        className="mb-6"
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {school.board.map(b => (
              <SchoolBadge key={b} type="board" value={b} />
            ))}
            <SchoolBadge type="schoolType" value={school.schoolType} />
            <SchoolBadge type="verification" value={school.fees.verificationStatus} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--color-content)] tracking-tight">
            {school.name}
          </h1>

          {school.tagline && (
            <p className="text-sm sm:text-base text-[var(--color-content-muted)] max-w-3xl leading-relaxed">
              {school.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-content-muted)] pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{school.location.address || `${school.location.area}, Greater Noida West`}</span>
            </div>
            <RatingDisplay score={school.rating.score} reviewsCount={school.rating.reviewsCount} size="sm" />
          </div>
        </div>

        {/* Admission Action Card */}
        <div className="w-full lg:w-80 shrink-0 bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Admission Status
            </span>
            <AdmissionStatus admissions={school.admissions} />
          </div>

          <SchoolProfileActions school={school} />
        </div>
      </div>

      {/* Main Grid: Visuals & Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left 2 Cols: Imagery, Overview, Facilities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured / Hero Visual */}
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xs">
            <SchoolImage
              src={school.assets.hero || school.assets.featured}
              alt={school.name}
              aspectRatio="video"
              priority
              className="w-full h-64 sm:h-96"
            />
          </div>

          {/* Quick Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Grades
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.gradeRange.raw}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Ratio
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.studentTeacherRatio}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Type
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.dayOrBoarding || 'Day School'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Age Entry
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.admissionAge || '3+ for Nursery'}</p>
            </div>
          </div>

          {/* About Section */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-content)]">About {school.name}</h2>
            <p className="text-sm text-[var(--color-content-muted)] leading-relaxed">{school.summary}</p>
            {school.achievements && school.achievements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider mb-2">
                  Recognitions & Highlights
                </h3>
                <ul className="space-y-1.5 text-xs text-[var(--color-content-muted)] list-none p-0">
                  {school.achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Campus Facilities */}
          {school.facilities && school.facilities.length > 0 && (
            <section className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[var(--color-content)]">Campus Infrastructure & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {school.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"
                  >
                    <Building className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span className="text-xs font-medium text-[var(--color-content)] truncate">
                      {fac.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>


        {/* Right Col: Fees & Contact */}
        <div className="space-y-6">
          {/* Detailed Fees Card */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--color-content)]">Fee Structure</h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <FeeDisplay fees={school.fees} variant="detailed" />
          </section>

          {/* Contact Details Card */}
          <section className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[var(--color-content)]">School Contact & Address</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 text-[var(--color-content-muted)]">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{school.location.address || `${school.location.area}, Greater Noida West`}</span>
              </div>
              {school.contact.phone && (
                <div className="flex items-center gap-2.5 text-[var(--color-content-muted)]">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`tel:${school.contact.phone}`} className="hover:text-[var(--color-primary)]">
                    {school.contact.phone}
                  </a>
                </div>
              )}
              {school.contact.email && (
                <div className="flex items-center gap-2.5 text-[var(--color-content-muted)]">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${school.contact.email}`} className="hover:text-[var(--color-primary)]">
                    {school.contact.email}
                  </a>
                </div>
              )}
              {school.contact.website && (
                <div className="flex items-center gap-2.5 text-[var(--color-content-muted)]">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={school.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-primary)] truncate"
                  >
                    {school.contact.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Similar Schools in Locality */}
      {similarSchools.length > 0 && (
        <section className="mt-14 pt-10 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-content)]">
                Other Schools in {school.location.area || 'Greater Noida West'}
              </h2>
              <p className="text-xs text-[var(--color-content-muted)] mt-1">
                Explore neighboring institutions in the same sector or with similar board curricula.
              </p>
            </div>
            <Link href="/schools" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
              View All 17 Schools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarSchools.map(simSchool => (
              <SchoolCard key={simSchool.id} school={simSchool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

