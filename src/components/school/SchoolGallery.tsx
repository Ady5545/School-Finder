'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Camera,
  ShieldCheck,
  Maximize2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SchoolImageLightbox, LightboxImage } from './SchoolImageLightbox';
import type { School } from '../../types/school';

interface SchoolGalleryProps {
  school: School;
  className?: string;
}

export const SchoolGallery: React.FC<SchoolGalleryProps> = ({ school, className }) => {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const triggerButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Collect distinct gallery images as LightboxImage objects for grid thumbnails
  const galleryImages: LightboxImage[] = useMemo(() => {
    const rawList = school.assets?.gallery;
    if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
      return [];
    }

    const uniquePaths = rawList
      .map((p) => (p.startsWith('/') ? p : `/${p}`))
      .filter((p, idx, self) => self.indexOf(p) === idx);

    return uniquePaths.map((path, idx) => ({
      src: path,
      alt: `${school.name} — Campus Facility & Infrastructure View ${idx + 1}`,
      caption: `${school.name} — Campus Photograph ${idx + 1} of ${uniquePaths.length}`,
      source: school.assets?.imageSource || `${school.name} Official Archive`,
    }));
  }, [school.assets, school.name]);

  // Unified full photo collection for fullscreen lightbox navigation
  const allSchoolImages: LightboxImage[] = useMemo(() => {
    const list: LightboxImage[] = [];
    const heroSrc = school.assets?.hero || school.assets?.featured;
    if (heroSrc) {
      const normalizedHero = heroSrc.startsWith('/') ? heroSrc : `/${heroSrc}`;
      list.push({
        src: normalizedHero,
        alt: `${school.name} Campus Exterior`,
        caption: `${school.name} — Primary Campus Exterior`,
        source: school.assets?.imageSource || `${school.name} Official Archive`,
      });
    }

    galleryImages.forEach((g) => {
      if (!list.some((item) => item.src === g.src)) {
        list.push(g);
      }
    });

    return list.length > 0 ? list : galleryImages;
  }, [galleryImages, school]);

  const hasPhotos = galleryImages.length > 0;
  const isRamagyaPending = school.slug === 'ramagya-school-noida-extension';

  const handleOpenImage = (thumbnailIndex: number) => {
    const clickedImg = galleryImages[thumbnailIndex];
    if (clickedImg) {
      const fullIndex = allSchoolImages.findIndex((item) => item.src === clickedImg.src);
      setActiveModalIndex(fullIndex >= 0 ? fullIndex : thumbnailIndex);
    } else {
      setActiveModalIndex(thumbnailIndex);
    }
  };

  const handleClose = () => {
    setActiveModalIndex(null);
  };

  return (
    <section
      id="school-campus-gallery"
      className={cn(
        'bg-white p-6.5 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-5',
        className
      )}
      aria-label={`${school.name} Campus Gallery`}
    >
      {/* Header with Source & Audit Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-content)] tracking-tight">
              Campus Gallery &amp; Infrastructure
            </h2>
          </div>
          <p className="text-xs text-[var(--color-content-muted)] mt-1">
            {hasPhotos
              ? `${galleryImages.length} verified real campus ${
                  galleryImages.length === 1 ? 'photograph' : 'photographs'
                } of ${school.shortName || school.name}. Click any image to expand fullscreen.`
              : `Campus imagery documentation for ${school.shortName || school.name}.`}
          </p>
        </div>

        {/* Source badge */}
        <div className="flex items-center gap-2">
          {school.assets?.imageSource && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f7fa] border border-[#d9e2ec] text-[11px] font-medium text-[var(--color-content)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{school.assets.imageSource}</span>
              {school.assets.imageVerifiedAt && (
                <span className="text-slate-400">({school.assets.imageVerifiedAt})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {hasPhotos ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {galleryImages.map((img, index) => (
            <button
              key={img.src + index}
              ref={(el) => {
                triggerButtonRefs.current[index] = el;
              }}
              id={`gallery-thumb-${index}`}
              type="button"
              onClick={() => handleOpenImage(index)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--color-border)] bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all hover:shadow-warm-sm hover:border-[var(--color-primary)] cursor-zoom-in"
              aria-label={`Enlarge photograph ${index + 1} of ${galleryImages.length}: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-md transform group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Empty gallery state */
        <div className="p-6 rounded-xl bg-[#faf8f5] border border-dashed border-[#d9e2ec] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#d9e2ec] flex items-center justify-center text-slate-400 shadow-2xs">
            <Info className="w-6 h-6 text-[#0f253e]" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-sm font-bold text-[var(--color-content)]">
              {isRamagyaPending
                ? 'Official Campus Gallery Under Verification'
                : 'Campus gallery'}
            </h3>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              {isRamagyaPending
                ? 'For current campus imagery, visit the school's official website.'
                : 'To maintain strict editorial integrity, Admission Pitara does not use generic stock photos or AI-generated campus placeholders.'}
            </p>
          </div>
          {school.contact?.website && (
            <a
              href={school.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline pt-1"
            >
              <span>Visit Official School Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeModalIndex !== null && hasPhotos && (
        <SchoolImageLightbox
          isOpen={activeModalIndex !== null}
          images={allSchoolImages}
          currentIndex={activeModalIndex}
          schoolName={school.name}
          onClose={handleClose}
          triggerElement={triggerButtonRefs.current[activeModalIndex] || null}
        />
      )}
    </section>
  );
};
