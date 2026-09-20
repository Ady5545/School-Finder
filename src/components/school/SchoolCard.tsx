'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowRight, Check, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { RatingDisplay } from '../ui/RatingDisplay';
import { SchoolImage } from './SchoolImage';
import { CardFeeDisplay } from './CardFeeDisplay';
import { AdmissionStatus } from './AdmissionStatus';
import { LocationDisplay } from './LocationDisplay';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

export interface SchoolCardProps {
  school: School;
  isSaved?: boolean;
  onToggleSave?: (schoolSlug: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (schoolSlug: string) => void;
  distanceKm?: number;
  className?: string;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  isSaved: propIsSaved,
  onToggleSave,
  isCompared: propIsCompared,
  onToggleCompare,
  distanceKm,
  className,
}) => {
  const router = useRouter();
  const store = useSchoolStore();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const isSaved = propIsSaved !== undefined ? propIsSaved : store.isInShortlist(school.slug);
  const isCompared = propIsCompared !== undefined ? propIsCompared : store.isInCompare(school.slug);
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      store.openAuthPrompt({
        slug: school.slug,
        name: school.name,
        image: school.assets.featured,
        area: school.location.area,
      });
      return;
    }

    if (onToggleSave) {
      onToggleSave(school.slug);
    } else {
      store.toggleShortlist(school.slug, school.name);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(school.slug);
    } else {
      store.toggleCompare(school.slug, school.name);
    }
  };

  return (
    <Card hoverEffect reveal={false} className={cn('group flex flex-col overflow-hidden h-full bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] rounded-2xl shadow-warm-xs hover:shadow-warm-lg hover:-translate-y-1.5 transition-all duration-300 ease-out tactile-card', className)}>
      {/* Featured Image & Overlays */}
      <div className="relative overflow-hidden">
        <Link href={`/schools/${school.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
          <SchoolImage
            src={school.assets.featured}
            alt={school.name}
            aspectRatio="video"
            className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Gradient shadow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e33]/70 via-transparent to-black/25 pointer-events-none opacity-85 group-hover:opacity-95 transition-opacity" />

        {school.recordType === 'upcoming' && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-white/95 text-[var(--color-primary)] border border-white/70 shadow-warm-sm text-[11px] font-extrabold uppercase tracking-wider">
            Upcoming School
          </div>
        )}

        {/* Shortlist Heart Action Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={handleSave}
            aria-label={isSaved ? `Remove ${school.name} from shortlist` : `Save ${school.name} to shortlist`}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-warm-xs active:scale-90 min-w-[40px] min-h-[40px]',
              isSaved
                ? 'bg-rose-500 text-white hover:bg-rose-600 ring-2 ring-rose-300/60 shadow-warm-sm'
                : 'bg-white text-[var(--color-content-muted)] hover:bg-white hover:text-rose-600 border border-[var(--color-border)] hover:scale-105 shadow-2xs'
            )}
          >
            <Heart className={cn('w-4.5 h-4.5 transition-transform', isSaved ? 'fill-white scale-110' : 'group-hover/heart:scale-110')} />
          </button>
        </div>

        {/* Board & Rating Pill on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[]).slice(0, 2).map(b => (
              <span
                key={b}
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#0a1e33] text-white border border-white/20 shadow-warm-2xs tracking-wide"
              >
                {b}
              </span>
            ))}
          </div>
          <div className="bg-white px-2.5 py-0.5 rounded-md shadow-warm-2xs border border-[var(--color-border)]">
            <RatingDisplay score={school.rating.score} size="sm" showCount={false} />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Status */}
          <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
            <LocationDisplay location={school.location} className="min-w-0 flex-1" />
            <AdmissionStatus admissions={school.admissions} showDate={false} className="shrink-0" />
          </div>

          {/* School Name */}
          <Link href={`/schools/${school.slug}`} className="group/title block">
            <h3 className="text-[17px] font-bold text-[var(--color-content)] group-hover/title:text-[var(--color-primary)] transition-colors line-clamp-1 leading-snug tracking-tight">
              {school.name}
            </h3>
          </Link>

          {/* Tagline / Summary */}
          <p className="text-xs text-[var(--color-content-muted)] line-clamp-2 mt-1.5 leading-relaxed">
            {school.tagline || school.summary}
          </p>

          {/* Key Quick Detail */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
            <span className="text-[11px] text-[var(--color-content-muted)] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded-md font-semibold border border-[var(--color-border)]">
              Ratio: {school.studentTeacherRatio}
            </span>
            {distanceKm !== undefined && (
              <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold border border-amber-200 flex items-center gap-1 shadow-2xs">
                <MapPin className="w-3 h-3 text-amber-600" />
                {distanceKm === 0 ? 'In area' : `${distanceKm} km`}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Fees & Detail Link */}
        <div className="mt-4 -mx-4.5 -mb-4.5 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4.5 bg-[#fbf9f5] rounded-b-2xl border-t border-[var(--color-border)] flex items-center justify-between gap-2">
          <CardFeeDisplay slug={school.slug} fees={school.fees} />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCompare}
              className={cn(
                'text-xs px-3 py-2 rounded-xl border font-semibold transition-all duration-200 cursor-pointer active:scale-95 shadow-warm-2xs min-h-[38px]',
                isCompared
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold'
                  : 'border-[var(--color-border-strong)] bg-white text-[var(--color-content)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] font-semibold'
              )}
            >
              {isCompared ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3] text-[var(--color-primary)]" /> Added
                </span>
              ) : (
                'Compare'
              )}
            </button>

            <Link
              href={`/schools/${school.slug}`}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-[var(--color-border-strong)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all duration-200 hover:scale-105 active:scale-95 shadow-warm-2xs min-w-[38px] min-h-[38px]"
              aria-label={`View details for ${school.name}`}
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

