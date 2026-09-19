'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * High-Performance Native Scroll & Progressive Reveal Coordinator
 *
 * Directives:
 * 1. 100% Native Document Scrolling:
 *    - Zero scroll event listeners on window or document.
 *    - Zero layout reads (no getBoundingClientRect during scroll or mutations).
 * 2. Progressive Enhancement:
 *    - Content is 100% visible on SSR, initial HTML render, and JS fallback.
 *    - Uses IntersectionObserver to reveal off-screen elements asynchronously off the main thread.
 * 3. Respects prefers-reduced-motion.
 */
export const ScrollRevealManager: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('has-scroll-reveal');
      return;
    }

    // Enable reveal transitions only when JS is active and motion is allowed
    document.documentElement.classList.add('has-scroll-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);
            el.classList.remove('is-pending');
            el.classList.add('is-revealed');

            // Release transforms after animation completes for clean tactile hover states
            setTimeout(() => {
              el.classList.add('is-settled');
            }, 550);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
      elements.forEach((el) => {
        if (el.classList.contains('is-revealed') || el.classList.contains('is-settled')) {
          return;
        }
        if (!el.classList.contains('is-pending')) {
          el.classList.add('is-pending');
          observer.observe(el);
        }
      });
    };

    // Initial pass
    observeElements();

    // Observe newly mounted nodes without forced reflows
    const mutationObserver = new MutationObserver((mutations) => {
      let hasAddedNodes = false;
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) {
          hasAddedNodes = true;
          break;
        }
      }
      if (hasAddedNodes) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
};
