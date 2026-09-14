'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { RatingDisplay } from '../ui/RatingDisplay';
import { SchoolImage } from './SchoolImage';
import { SchoolBadge } from './SchoolBadge';
import { FeeDisplay } from './FeeDisplay';
import { AdmissionStatus } from './AdmissionStatus';
import { LocationDisplay } from './LocationDisplay';
import { useSchoolStore } from '../../lib/schoolStore';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

export interface SchoolCardProps {
  school: School;
  isSaved?: boolean;
  onToggleSave?: (schoolSlug: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (schoolSlug: string) => void;
  className?: string;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  isSaved: propIsSaved,
  onToggleSave,
  isCompared: propIsCompared,
  onToggleCompare,
  className,
}) => {
  const store = useSchoolStore();

  const isSaved = propIsSaved !== undefined ? propIsSaved : store.isInShortlist(school.slug);
  const isCompared = propIsCompared !== undefined ? propIsCompared : store.isInCompare(school.slug);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Card hoverEffect className={cn('group flex flex-col overflow-hidden h-full bg-white border border-[var(--color-border)] shadow-xs hover:shadow-md transition-all duration-200', className)}>
      {/* Featured Image & Overlays */}
      <div className="relative">
        <Link href={`/schools/${school.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
          <SchoolImage
            src={school.assets.featured}
            alt={school.name}
            aspectRatio="video"
            className="w-full h-48 sm:h-52 object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </Link>

        {/* Shortlist Heart Action Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={handleSave}
            aria-label={isSaved ? `Remove ${school.name} from shortlist` : `Save ${school.name} to shortlist`}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs',
              isSaved
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600'
            )}
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-white')} />
          </button>
        </div>

        {/* Board & Rating Pill on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1">
            {school.board.slice(0, 2).map(b => (
              <span
                key={b}
                className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs shadow-xs"
              >
                {b}
              </span>
            ))}
          </div>
          <div className="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
            <RatingDisplay score={school.rating.score} size="sm" showCount={false} />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <LocationDisplay location={school.location} />
            <AdmissionStatus admissions={school.admissions} showDate={false} />
          </div>

          {/* School Name */}
          <Link href={`/schools/${school.slug}`} className="group-hover:text-[var(--color-primary)] transition-colors">
            <h3 className="text-base font-bold text-[var(--color-content)] line-clamp-1 leading-snug">
              {school.name}
            </h3>
          </Link>

          {/* Tagline / Summary */}
          <p className="text-xs text-[var(--color-content-muted)] line-clamp-2 mt-1.5 leading-relaxed">
            {school.tagline || school.summary}
          </p>

          {/* Key Quick Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
            <SchoolBadge type="verification" value={school.fees.verificationStatus} />
            <span className="text-[11px] text-[var(--color-content-muted)] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded font-medium">
              Ratio: {school.studentTeacherRatio}
            </span>
          </div>
        </div>

        {/* Card Footer: Fees & Detail Link */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
          <FeeDisplay fees={school.fees} variant="compact" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCompare}
              className={cn(
                'text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer',
                isCompared
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-content-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              )}
            >
              {isCompared ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Added
                </span>
              ) : (
                'Compare'
              )}
            </button>

            <Link
              href={`/schools/${school.slug}`}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-content)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors"
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

