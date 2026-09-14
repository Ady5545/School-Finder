import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSchoolBySlug, getAllSchoolSlugs } from '../../../lib/schools';
import { buildSchoolMetadata, generateSchoolJsonLd } from '../../../lib/seo';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { SchoolImage } from '../../../components/school/SchoolImage';
import { SchoolBadge } from '../../../components/school/SchoolBadge';
import { FeeDisplay } from '../../../components/school/FeeDisplay';
import { AdmissionStatus } from '../../../components/school/AdmissionStatus';
import { RatingDisplay } from '../../../components/ui/RatingDisplay';
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
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-2">
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

          <p className="text-sm text-[var(--color-content-muted)] max-w-3xl leading-relaxed">
            {school.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-content-muted)] pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{school.location.address}</span>
            </div>
            <RatingDisplay score={school.rating.score} reviewsCount={school.rating.reviewsCount} size="sm" />
          </div>
        </div>

        {/* Admission Action Box */}
        <div className="flex flex-col gap-2 shrink-0 bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs min-w-[240px]">
          <AdmissionStatus admissions={school.admissions} />
          {school.contact.website && (
            <a
              href={school.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              <Button variant="primary" size="sm" className="w-full" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Official Portal
              </Button>
            </a>
          )}
          <Link href="/compare">
            <Button variant="outline" size="sm" className="w-full">
              Compare School
            </Button>
          </Link>
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

          {/* Quick Specifications */}
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
              <p className="text-sm font-bold text-[var(--color-content)]">{school.dayOrBoarding}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Age Criteria
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.admissionAge}</p>
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

          {/* Facilities Section */}
          {school.facilities && school.facilities.length > 0 && (
            <section className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[var(--color-content)]">Campus Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {school.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] flex items-center gap-2.5"
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
            <h2 className="text-base font-bold text-[var(--color-content)] mb-3">Fee Structure</h2>
            <FeeDisplay fees={school.fees} variant="detailed" />
          </section>

          {/* Contact Details Card */}
          <section className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[var(--color-content)]">School Contact & Address</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 text-[var(--color-content-muted)]">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{school.location.address}</span>
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
    </div>
  );
}
