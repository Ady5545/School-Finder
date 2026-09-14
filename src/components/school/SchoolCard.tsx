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
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
  className,
}) => {
  return (
    <Card hoverEffect className={cn('group flex flex-col overflow-hidden h-full', className)}>
      {/* Featured Image & Overlays */}
      <div className="relative">
        <Link href={`/schools/${school.slug}`} tabIndex={-1} aria-hidden="true">
          <SchoolImage
            src={school.assets.featured}
            alt={school.name}
            aspectRatio="video"
            className="w-full h-48 sm:h-52"
          />
        </Link>

        {/* Action Pills */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onToggleSave && (
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(school.slug);
              }}
              aria-label={isSaved ? `Remove ${school.name} from shortlist` : `Save ${school.name} to shortlist`}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs',
                isSaved
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-600'
              )}
            >
              <Heart className={cn('w-4 h-4', isSaved && 'fill-white')} />
            </button>
          )}
        </div>

        {/* Board & Rating Pill on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1">
            {school.board.slice(0, 2).map(b => (
              <span
                key={b}
                className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-900/75 text-white backdrop-blur-xs shadow-xs"
              >
                {b}
              </span>
            ))}
          </div>
          <div className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
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
            <span className="text-[11px] text-[var(--color-content-muted)] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded">
              Grades: {school.gradeRange.raw}
            </span>
          </div>
        </div>

        {/* Card Footer: Fees & Detail Link */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
          <FeeDisplay fees={school.fees} variant="compact" />

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(school.slug)}
                className={cn(
                  'text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer',
                  isCompared
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-content-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-content)]'
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
            )}

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
