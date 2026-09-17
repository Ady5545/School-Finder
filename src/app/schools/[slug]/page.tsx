import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSchoolBySlug, getAllSchoolSlugs, getAllSchools } from '../../../lib/schools';
import { buildSchoolMetadata, generateSchoolJsonLd } from '../../../lib/seo';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { SchoolImage } from '../../../components/school/SchoolImage';
import { SchoolBadge } from '../../../components/school/SchoolBadge';
import { SchoolHeroVisual } from '../../../components/school/SchoolHeroVisual';
import { FeeDisplay } from '../../../components/school/FeeDisplay';
import { AdmissionStatus } from '../../../components/school/AdmissionStatus';
import { RatingDisplay } from '../../../components/ui/RatingDisplay';
import { SchoolProfileActions } from '../../../components/school/SchoolProfileActions';
import { SchoolCard } from '../../../components/school/SchoolCard';
import { SchoolGallery } from '../../../components/school/SchoolGallery';
import { CampusInteractiveMap } from '../../../components/school/CampusInteractiveMap';
import { SchoolRatingsSection } from '../../../components/school/SchoolRatingsSection';
import { SchoolAdmissionsSection } from '../../../components/school/SchoolAdmissionsSection';
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
  AlertCircle,
  Compass,
} from 'lucide-react';

interface SchoolDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 w-full flex flex-col flex-1">
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

      {/* Duplicate Listing Notice */}
      {school.isDuplicate && school.duplicateOf && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>
            <strong>Note:</strong> This is an alternate directory listing. The primary verified profile is available at{' '}
            <Link href={`/schools/${school.duplicateOf}`} className="font-bold underline text-[var(--color-primary)]">
              Primary School Profile →
            </Link>
          </span>
        </div>
      )}

      {/* Regional Outlier Notice */}
      {school.geographicClassification === 'geographic_outlier' && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
          <strong>Regional Location Notice:</strong> This institution is situated in {school.location.sector} outside core Greater Noida West. It is listed as an expanded regional reference for parents considering broader NCR options.
        </div>
      )}

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
        <div className="w-full lg:w-80 shrink-0 bg-white p-5.5 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-4">
          <div>
            <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider block mb-2">
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
          <SchoolHeroVisual school={school} />

          {/* Quick Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5.5 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Grades
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.gradeRange.raw}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Ratio
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.studentTeacherRatio}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Type
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.dayOrBoarding || 'Day School'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Age Entry
              </span>
              <p className="text-sm font-bold text-[var(--color-content)]">{school.admissionAge || '3+ for Nursery'}</p>
            </div>
          </div>

          {/* About Section */}
          <section className="bg-white p-6.5 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-3.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-content)] tracking-tight">About {school.name}</h2>
            <p className="text-sm text-[var(--color-content-muted)] leading-relaxed">{school.summary}</p>
            {school.achievements && school.achievements.length > 0 && (
              <div className="mt-5 pt-4.5 border-t border-[var(--color-border-subtle)]">
                <h3 className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider mb-2.5">
                  Recognitions & Highlights
                </h3>
                <ul className="space-y-2 text-xs text-[var(--color-content-muted)] list-none p-0">
                  {school.achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Admissions Timelines & Reminders Section */}
          <SchoolAdmissionsSection school={school} />

          {/* Campus Facilities */}
          {school.facilities && school.facilities.length > 0 && (
            <section className="bg-white p-6.5 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-content)] tracking-tight">Campus Infrastructure & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {school.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] flex items-center gap-2.5 hover:border-[var(--color-primary)] transition-colors"
                  >
                    <Building className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span className="text-xs font-semibold text-[var(--color-content)] truncate">
                      {fac.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Real Campus Photo Gallery */}
          <SchoolGallery school={school} />
        </div>


        {/* Right Col: Fees & Contact */}
        <div className="space-y-6">
          {/* Institutional Verification Card */}
          {school.verification && (
            <section className={school.verification.isVerified ? "bg-[#f0fdf4] p-5 rounded-2xl border border-[#bbf7d0] shadow-warm-xs space-y-2.5" : "bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-warm-xs space-y-2.5"}>
              <div className="flex items-center gap-2 font-bold text-xs">
                {school.verification.isVerified ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-900">Source-Verified Institutional Profile</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-900">Institutional Audit Pending</span>
                  </>
                )}
              </div>
              <p className={school.verification.isVerified ? "text-[11px] text-emerald-800 leading-relaxed" : "text-[11px] text-amber-800 leading-relaxed"}>
                {school.verification.isVerified
                  ? `Information, address, and affiliation audited from ${school.verification.sourceName}.`
                  : 'This school directory entry is awaiting direct institutional disclosure. Synthetic attributes have been removed in accordance with Admission Pitara data accuracy standards.'}
              </p>
              {school.verification.cbseAffiliationNumber && (
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-mono text-emerald-900">
                  <span>CBSE Affiliation:</span>
                  <span className="font-bold">{school.verification.cbseAffiliationNumber}</span>
                </div>
              )}
              <div className={school.verification.isVerified ? "text-[10px] text-emerald-700/80" : "text-[10px] text-amber-700/80"}>
                Audited: {school.verification.lastVerified}
              </div>
            </section>
          )}

          {/* Detailed Fees Card */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-[var(--color-content)] tracking-tight">Fee Structure</h2>
              {school.fees.verificationStatus === 'verified_from_source' ? (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-warm-2xs">
                  Audited &amp; Verified
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full shadow-warm-2xs">
                  Audit Pending
                </span>
              )}
            </div>
            <FeeDisplay fees={school.fees} variant="detailed" />
          </section>

          {/* Contact Details Card */}
          <section className="bg-white p-5.5 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-4">
            <h2 className="text-base font-extrabold text-[var(--color-content)] tracking-tight">School Contact & Address</h2>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5 text-[var(--color-content-muted)]">
                <MapPin className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{school.location.address || `${school.location.area}, Greater Noida West`}</span>
              </div>
              {school.contact.phone && (
                <div className="flex items-center gap-2.5 text-[var(--color-content-muted)]">
                  <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <a href={`tel:${school.contact.phone}`} className="hover:text-[var(--color-primary)] font-semibold">
                    {school.contact.phone}
                  </a>
                </div>
              )}
              {school.contact.email && (
                <div className="flex items-center gap-2.5 text-[var(--color-content-muted)]">
                  <Mail className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <a href={`mailto:${school.contact.email}`} className="hover:text-[var(--color-primary)] font-semibold">
                    {school.contact.email}
                  </a>
                </div>
              )}
              {school.contact.website && (
                <div className="flex items-center gap-2.5 text-[var(--color-content-muted)]">
                  <Globe className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <a
                    href={school.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-primary)] font-semibold truncate"
                  >
                    {school.contact.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-600 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">Report Data Correction or Submit Prospectus:</span>
                <span>
                  Parents or staff can email updated fee sheets to{' '}
                  <a
                    href={`mailto:enquiry.admissionpitara@gmail.com?subject=${encodeURIComponent(`Data Correction / Prospectus Update for ${school.name}`)}`}
                    className="font-mono font-bold text-amber-900 underline hover:text-amber-950"
                  >
                    enquiry.admissionpitara@gmail.com
                  </a>
                  .
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Campus Location & Interactive Map Visualizer */}
      <section className="mt-12">
        <CampusInteractiveMap school={school} nearbySchools={similarSchools} />
      </section>

      {/* Verified Parent Community Ratings & Reviews */}
      <SchoolRatingsSection schoolSlug={school.slug} schoolName={school.name} />

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
              View All Schools →
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

