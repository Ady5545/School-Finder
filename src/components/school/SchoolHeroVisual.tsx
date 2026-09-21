'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Maximize2, Camera, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SchoolImageLightbox, LightboxImage } from './SchoolImageLightbox';
import type { School } from '../../types/school';

interface SchoolHeroVisualProps {
  school: School;
  className?: string;
}

const NEUTRAL_PLACEHOLDER = '/assets/images/placeholder-school.svg';

export const SchoolHeroVisual: React.FC<SchoolHeroVisualProps> = ({
  school,
  className,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const heroButtonRef = useRef<HTMLButtonElement>(null);

  const rawHeroSrc = school.assets?.hero || school.assets?.featured;
  const isPending = !rawHeroSrc || hasError;

  const heroImageSrc = isPending
    ? NEUTRAL_PLACEHOLDER
    : rawHeroSrc.startsWith('/')
      ? rawHeroSrc
      : `/${rawHeroSrc}`;

  // Assemble full photo collection for lightbox navigation
  const allSchoolImages: LightboxImage[] = useMemo(() => {
    if (isPending) return [];

    const list: LightboxImage[] = [];

    // Add Primary Hero/Featured Image
    list.push({
      src: heroImageSrc,
      alt: `${school.name} Campus Exterior`,
      caption: `${school.name} — Primary Campus Exterior`,
      source: school.assets?.imageSource || `${school.name} Official Archive`,
    });

    // Add Gallery Images (prevent duplicate hero)
    if (school.assets?.gallery && Array.isArray(school.assets.gallery)) {
      school.assets.gallery.forEach((gPath, idx) => {
        const normalized = gPath.startsWith('/') ? gPath : `/${gPath}`;
        if (normalized !== heroImageSrc) {
          list.push({
            src: normalized,
            alt: `${school.name} Campus Facility ${idx + 1}`,
            caption: `${school.name} — Campus Facility & Infrastructure`,
            source: school.assets?.imageSource || `${school.name} Official Archive`,
          });
        }
      });
    }

    return list;
  }, [heroImageSrc, isPending, school]);

  const photoCount = allSchoolImages.length;

  return (
    <>
      <div
        id="school-hero-visual-card"
        className={cn(
          'relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-warm-sm bg-slate-100 group aspect-[16/9] w-full',
          className
        )}
      >
        {isPending ? (
          /* Non-interactive Photo Pending State */
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={NEUTRAL_PLACEHOLDER}
              alt={`${school.name} — Campus Photograph`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
              className="object-cover opacity-80"
            />
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Campus image</span>
            </div>
          </div>
        ) : (
          /* Interactive Fullscreen Trigger Button */
          <button
            ref={heroButtonRef}
            id="school-hero-expand-btn"
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-full h-full text-left focus:outline-none focus:ring-3 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all block cursor-zoom-in"
            aria-label={`Open fullscreen photo viewer for ${school.name}. ${photoCount} ${photoCount === 1 ? 'photograph' : 'photographs'} available.`}
          >
            <Image
              src={heroImageSrc}
              alt={`${school.name} Campus Exterior`}
              fill
              priority
              quality={90}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
              className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              onError={() => setHasError(true)}
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
              <div className="flex items-center gap-2 text-white text-xs font-semibold drop-shadow-md">
                <Maximize2 className="w-4 h-4 text-white shrink-0" />
                <span>Click to expand high-resolution photograph</span>
              </div>
            </div>

            {/* Expand / Photo count badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/20 transition-transform group-hover:scale-105">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {photoCount > 1 ? `${photoCount} Campus Photos` : 'View Fullscreen'}
              </span>
            </div>

            {/* Source Tag Badge */}
            {school.assets?.imageSource && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[200px]">Verified Campus</span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Lightbox Viewer */}
      {isLightboxOpen && !isPending && (
        <SchoolImageLightbox
          isOpen={isLightboxOpen}
          images={allSchoolImages}
          currentIndex={0}
          schoolName={school.name}
          onClose={() => setIsLightboxOpen(false)}
          triggerElement={heroButtonRef.current}
        />
      )}
    </>
  );
};
