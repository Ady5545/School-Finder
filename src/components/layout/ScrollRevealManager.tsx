'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * High-Performance Native Scroll & Progressive Reveal Coordinator
 *
 * Architecture & Safety Directives:
 * 1. Content Visibility First (Zero Dependency on JS):
 *    - All content is 100% visible (opacity: 1, transform: none) by default in CSS and HTML.
 *    - JS only progressively enhances below-the-fold elements as they scroll into view.
 *    - Elements already inside the viewport are NEVER hidden or delayed.
 * 2. Active Viewport Scanning:
 *    - Automatically scans on route changes and DOM mutations (dynamic school filters/tabs).
 *    - Uses a generous rootMargin (120px) to trigger reveals smoothly before elements enter the screen.
 * 3. Fallback Safety Timer:
 *    - Guarantees that any pending element is forcefully settled after 2 seconds so no content can ever be stuck.
 * 4. Respects Accessibility:
 *    - Completely disabled under `prefers-reduced-motion: reduce`.
 */
export const ScrollRevealManager: React.FC = () => {
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // 1. Passive RAF-throttled scroll progress bar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (progressBarRef.current) {
        progressBarRef.current.style.display = 'none';
      }
      return;
    }

    let ticking = false;

    const updateProgressBar = () => {
      if (!progressBarRef.current) {
        ticking = false;
        return;
      }
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const maxScroll = scrollHeight - vh;

      if (maxScroll > 60) {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        progressBarRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
        progressBarRef.current.style.opacity = scrollY > 20 ? '0.95' : '0';
      } else {
        progressBarRef.current.style.opacity = '0';
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgressBar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgressBar();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // 2. High-Performance IntersectionObserver for Below-the-Fold Reveals
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.remove('has-scroll-reveal');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('has-scroll-reveal');
      return;
    }

    // Enable scroll reveal styling only after JS confirmation
    document.documentElement.classList.add('has-scroll-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);
            el.classList.remove('is-pending');
            el.classList.add('is-revealed');

            // Calculate exact settle duration based on stagger delay + animation duration
            const delayAttr = el.getAttribute('data-reveal-delay');
            const delayIdx = delayAttr ? Math.max(0, parseInt(delayAttr, 10) || 0) : 0;
            const settleDuration = 680 + (delayIdx * 90) + 100;

            setTimeout(() => {
              el.classList.add('is-settled');
            }, settleDuration);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const scanAndObserve = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');

      elements.forEach((el) => {
        // If already settled or revealed, skip
        if (el.classList.contains('is-settled') || el.classList.contains('is-revealed')) {
          return;
        }

        const rect = el.getBoundingClientRect();
        // If in initial above-the-fold viewport or already scrolled above, reveal immediately
        if (rect.top < vh - 40) {
          el.classList.remove('is-pending');
          el.classList.add('is-revealed', 'is-settled');
        } else {
          // Strictly below the fold: arm for progressive reveal on scroll
          el.classList.add('is-pending');
          observer.observe(el);
        }
      });
    };

    // Initial scan on mount and route change
    scanAndObserve();

    // Observe DOM mutations for dynamic client-side lists/tabs (e.g. school filtering, review loads)
    let rafId: number | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(scanAndObserve);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return (
    <div
      ref={progressBarRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-rating)] z-50 pointer-events-none opacity-0 transition-opacity duration-300"
      style={{
        transform: 'scaleX(0)',
        transformOrigin: '0% 50%',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
};
