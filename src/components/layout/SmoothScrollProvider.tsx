'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';

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
 * SmoothScrollProvider
 *
 * Desktop gets the premium Lenis wheel experience.
 * Touch devices keep native scrolling so the main thread stays lighter and
 * browser touch physics remain untouched.
 */
export const SmoothScrollProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia?.('(pointer: coarse)').matches;

    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    let active = true;
    let lenis: Lenis | null = null;
    let rafId = 0;

    const init = async () => {
      const { default: LenisConstructor } = await import('lenis');
      if (!active) return;

      lenis = new LenisConstructor({
        duration: 0.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        syncTouch: false,
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

      if (!active) {
        lenis.destroy();
        return;
      }

      lenisRef.current = lenis;

      const raf = (time: number) => {
        if (!active || !lenis) return;
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      const handleResize = () => lenis?.resize();
      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    let removeResize: (() => void) | undefined;
    void init().then((cleanup) => {
      removeResize = cleanup;
    });

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      removeResize?.();
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

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
      const behavior = options?.immediate ? 'auto' : 'smooth';
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior });
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};
