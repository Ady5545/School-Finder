'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  ShieldCheck,
  Maximize2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

interface SchoolGalleryProps {
  school: School;
  className?: string;
}

export const SchoolGallery: React.FC<SchoolGalleryProps> = ({ school, className }) => {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  // Collect distinct gallery images
  const galleryImages = React.useMemo(() => {
    const rawList = school.assets?.gallery;
    if (!rawList || rawList.length === 0) {
      return [];
    }
    // Ensure all paths start with slash and remove duplicates
    const normalized = rawList
      .map(p => (p.startsWith('/') ? p : `/${p}`))
      .filter((p, idx, self) => self.indexOf(p) === idx);

    return normalized;
  }, [school.assets]);

  const hasPhotos = galleryImages.length > 0;
  const isRamagyaPending = school.slug === 'ramagya-school-noida-extension';

  // Modal navigation handlers
  const handlePrev = useCallback(() => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1
    );
  }, [activeModalIndex, galleryImages.length]);

  const handleNext = useCallback(() => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) =>
      prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0
    );
  }, [activeModalIndex, galleryImages.length]);

  const handleClose = useCallback(() => {
    setActiveModalIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (activeModalIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalIndex, handleClose, handleNext, handlePrev]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeModalIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalIndex]);

  return (
    <section
      id="school-campus-gallery"
      className={cn('bg-white p-6.5 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-5', className)}
      aria-label={`${school.name} Campus Gallery`}
    >
      {/* Header with Source & Audit Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-content)] tracking-tight">
              Campus Gallery & Infrastructure
            </h2>
          </div>
          <p className="text-xs text-[var(--color-content-muted)] mt-1">
            {hasPhotos
              ? `${galleryImages.length} verified real campus ${galleryImages.length === 1 ? 'photograph' : 'photographs'} of ${school.shortName || school.name}.`
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
          {galleryImages.map((src, index) => (
            <button
              key={src + index}
              id={`gallery-thumb-${index}`}
              type="button"
              onClick={() => setActiveModalIndex(index)}
              className="group relative aspect-4/3 rounded-xl overflow-hidden border border-[var(--color-border)] bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all hover:shadow-warm-sm hover:border-[var(--color-primary)]"
              aria-label={`Enlarge photo ${index + 1} of ${school.name}`}
            >
              <Image
                src={src}
                alt={`${school.name} campus view ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-md transform group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Empty / Verification Pending State */
        <div className="p-6 rounded-xl bg-[#faf8f5] border border-dashed border-[#d9e2ec] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#d9e2ec] flex items-center justify-center text-slate-400 shadow-2xs">
            <Info className="w-6 h-6 text-[#0f253e]" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-sm font-bold text-[var(--color-content)]">
              {isRamagyaPending
                ? 'Official Campus Gallery Under Verification'
                : 'Campus Photographs Pending Official Verification'}
            </h3>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              {isRamagyaPending
                ? 'Admission Pitara strictly publishes genuine, source-verified campus imagery. Rather than copying photos from neighboring campuses, this gallery remains pending until the official administration verifies the latest campus photos.'
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
        <div
          id="gallery-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${school.name} photo lightbox`}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white z-10 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wide text-slate-200">
                {school.name}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-slate-300 font-mono">
                {activeModalIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <button
              id="gallery-modal-close-btn"
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close photo lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Area */}
          <div
            className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[activeModalIndex]}
              alt={`${school.name} campus view ${activeModalIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />

            {/* Previous Button */}
            {galleryImages.length > 1 && (
              <button
                id="gallery-prev-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:-left-12 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {galleryImages.length > 1 && (
              <button
                id="gallery-next-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:-right-12 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption & Source Bar */}
          <div
            className="w-full max-w-2xl text-center text-xs text-slate-300 py-3 z-10 flex flex-col items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Genuine Campus Asset • Source:{' '}
                <strong className="text-white font-medium">
                  {school.assets?.imageSource || `${school.name} Campus`}
                </strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {galleryImages.length > 1
                ? 'Use Left/Right arrow keys to navigate • Esc to exit'
                : 'Press Esc to exit'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
