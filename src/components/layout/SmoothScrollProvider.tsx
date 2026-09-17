'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * SmoothScrollProvider: Premium Document Scrolling with Lenis
 *
 * Configured for a fluid, controlled, buttery editorial feel:
 * - 0.9s duration with smooth exponential deceleration (no floatiness or rubber-banding)
 * - 100% native touch physics preserved on mobile devices (syncTouch: false)
 * - Zero wheel hijacking or input blocking
 * - Built-in reduced motion fallback
 * - Clean teardown and single RAF loop
 */
export const SmoothScrollProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Instantiate Lenis with a calibrated, responsive curve
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      syncTouch: false, // Maintain native browser touch dynamics on smartphones/tablets
      touchMultiplier: 1,
      wheelMultiplier: 1,
      autoResize: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
      anchors: true,
      prevent: (node) => {
        return (
          node.hasAttribute('data-lenis-prevent') ||
          node.closest('[data-lenis-prevent]') !== null ||
          node.closest('[role="dialog"]') !== null
        );
      },
    });

    lenisRef.current = lenis;

    // Single requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle Next.js route navigation and anchor hashes smoothly
  useEffect(() => {
    if (!lenisRef.current) return;

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash) as HTMLElement | null;
      if (target) {
        lenisRef.current.scrollTo(target, {
          offset: -80,
          immediate: false,
          duration: 0.8,
        });
        return;
      }
    }

    lenisRef.current.scrollTo(0, { immediate: true });
  }, [pathname]);

  const scrollTo = (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};


