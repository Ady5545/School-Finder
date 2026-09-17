'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * High-Performance Native Scroll & Progressive Reveal Coordinator
 *
 * Architecture & Safety Directives:
 * 1. 100% Native Document Scrolling:
 *    - Absolutely ZERO scroll event listeners on window or document.
 *    - Completely independent from browser document scrolling.
 * 2. Content Visibility First (Zero Dependency on JS):
 *    - All content is 100% visible (opacity: 1, transform: none) by default in CSS and HTML.
 *    - JS only progressively enhances below-the-fold elements as they scroll into view.
 *    - Elements already inside the initial viewport are NEVER hidden or delayed.
 * 3. High-Performance IntersectionObserver:
 *    - Browser executes intersection checks asynchronously off the main scrolling thread.
 *    - Once revealed, elements stay permanently revealed and unobserved.
 * 4. Respects Accessibility:
 *    - Completely disabled under `prefers-reduced-motion: reduce`.
 */
export const ScrollRevealManager: React.FC = () => {
  const pathname = usePathname();

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
        threshold: 0.1,
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
        // If already armed and observed, do not eagerly reveal in mutationObserver/rescan
        if (el.classList.contains('is-pending')) {
          return;
        }

        // Only reveal immediately if already visible inside initial viewport on mount
        if (rect.top < vh - 20 && rect.bottom > 0) {
          el.classList.remove('is-pending');
          el.classList.add('is-revealed', 'is-settled');
        } else {
          // Strictly below the viewport: arm for progressive reveal on scroll
          el.classList.add('is-pending');
          observer.observe(el);
        }
      });
    };

    // Initial scan on mount and route change
    scanAndObserve();

    // Observe DOM mutations for dynamic client-side lists/tabs (e.g. school filtering)
    let rafId: number | null = null;
    const mutationObserver = new MutationObserver((mutations) => {
      // Ignore attribute mutations (class toggles like is-pending/is-revealed) to prevent recursive scans
      const hasStructuralChanges = mutations.some(m => m.type === 'childList');
      if (!hasStructuralChanges) return;

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

  return null;
};
