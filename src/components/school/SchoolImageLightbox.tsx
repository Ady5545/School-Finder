'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  source?: string;
}

export interface SchoolImageLightboxProps {
  isOpen: boolean;
  images: LightboxImage[];
  currentIndex: number;
  schoolName: string;
  onClose: () => void;
  onNavigate?: (newIndex: number) => void;
  triggerElement?: HTMLElement | null;
}

export const SchoolImageLightbox: React.FC<SchoolImageLightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  schoolName,
  onClose,
  onNavigate,
  triggerElement,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync activeIndex when currentIndex prop changes
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // Keep track of triggering element for accessible focus return
  useEffect(() => {
    if (isOpen) {
      lastActiveElementRef.current = triggerElement || (document.activeElement as HTMLElement);
    }
  }, [isOpen, triggerElement]);

  const totalImages = images.length;
  const currentImage = images[activeIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    const newIdx = activeIndex > 0 ? activeIndex - 1 : totalImages - 1;
    setActiveIndex(newIdx);
    onNavigate?.(newIdx);
  }, [activeIndex, totalImages, onNavigate]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    const newIdx = activeIndex < totalImages - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIdx);
    onNavigate?.(newIdx);
  }, [activeIndex, totalImages, onNavigate]);

  const handleClose = useCallback(() => {
    onClose();
    // Return focus to triggering button
    if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
      setTimeout(() => {
        lastActiveElementRef.current?.focus();
      }, 50);
    }
  }, [onClose]);

  // Keyboard Navigation & Focus Management
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      } else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Tab') {
        // Trap focus inside modal
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose, handleNext, handlePrev]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Avoid layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen || !mounted || !currentImage) return null;

  const modalContent = (
    <div
      ref={modalRef}
      id="school-image-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${schoolName} High-Resolution Photo Viewer`}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-7xl mx-auto flex items-center justify-between text-white z-20 py-2 sm:py-3 px-2 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 truncate">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-100 truncate max-w-[200px] sm:max-w-md">
              {schoolName}
            </span>
            {totalImages > 1 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-slate-200 font-mono shrink-0">
                {activeIndex + 1} / {totalImages}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            ref={closeBtnRef}
            id="lightbox-close-btn"
            type="button"
            onClick={handleClose}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
            aria-label="Close fullscreen image viewer (Press Escape)"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen High-Resolution Image Container */}
      <div
        className="relative w-full max-w-6xl mx-auto flex-1 flex items-center justify-center my-auto px-2 sm:px-14 min-h-[50vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* High-Resolution Image Viewport */}
        <div className="relative w-full h-[62vh] sm:h-[72vh] md:h-[78vh] flex items-center justify-center">
          <Image
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || `${schoolName} Campus Visual ${activeIndex + 1}`}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {/* Previous Navigation Button */}
        {totalImages > 1 && (
          <button
            ref={prevBtnRef}
            id="lightbox-prev-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white shadow-xl cursor-pointer"
            aria-label="View previous photograph (Left arrow key)"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" aria-hidden="true" />
          </button>
        )}

        {/* Next Navigation Button */}
        {totalImages > 1 && (
          <button
            ref={nextBtnRef}
            id="lightbox-next-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white shadow-xl cursor-pointer"
            aria-label="View next photograph (Right arrow key)"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Bottom Information & Thumbnail Strip */}
      <div
        className="w-full max-w-4xl mx-auto text-center py-2 sm:py-3 z-20 flex flex-col items-center gap-2 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption */}
        {currentImage.caption && (
          <p className="text-xs sm:text-sm font-medium text-slate-200 max-w-2xl truncate">
            {currentImage.caption}
          </p>
        )}

        {/* Optional Thumbnail Strip for Multi-Photo Galleries */}
        {totalImages > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 px-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={img.src + idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                  onNavigate?.(idx);
                }}
                className={cn(
                  'relative w-11 h-8 sm:w-14 sm:h-10 rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer',
                  idx === activeIndex
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-80 hover:border-white/40'
                )}
                aria-label={`Switch to photo ${idx + 1}`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Audit & Navigation Instructions */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Source:{' '}
              <strong className="text-white font-medium">
                {currentImage.source || `${schoolName} Campus Record`}
              </strong>
            </span>
          </div>

          <span className="text-slate-400 hidden sm:inline">•</span>

          <span className="text-slate-400">
            {totalImages > 1
              ? 'Navigate: Left / Right arrow keys • Close: Esc or tap outside'
              : 'Close: Esc or tap outside'}
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
