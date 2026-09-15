'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface ParallaxNode {
  element: HTMLElement;
  factor: number;
  maxOffset: number;
  currentOffset: number;
  targetOffset: number;
}

/**
 * Global ScrollRevealManager & Lenis Smooth Scrolling Engine
 *
 * Architecture:
 * 1. Fluid Momentum Scrolling via Lenis:
 *    - Normalizes discrete mouse-wheel notches into buttery, natural momentum.
 *    - Exponential deceleration curve for a luxury, fluid feel without sluggishness.
 *    - Strictly preserves native touch scrolling on mobile (syncTouch: false).
 *    - Ignores dialogs and modals ([data-lenis-prevent], [role="dialog"]).
 *    - Bypassed entirely when `prefers-reduced-motion` is active.
 * 2. Progressive Enhancement Scroll Reveals:
 *    - Default CSS state is 100% visible (opacity: 1, transform: none) on SSR/initial load.
 *    - Above-the-fold elements are immediately marked 'settled' with zero animation or delay.
 *    - Only elements strictly below the fold are placed in 'pending' state.
 *    - Anticipatory trigger (rootMargin: '0px 0px 75px 0px') starts the reveal before the
 *      element enters the viewport so it is already gliding into place, eliminating sudden pops.
 *    - Staggers groups of sibling cards slightly (70ms intervals) for a natural wave effect.
 *    - Transitions to 'settled' state after completion so hover states are immediately responsive.
 * 3. Micro-Parallax & Top Scroll Progress:
 *    - Clamped depth offsets (max ±16px) for decorative background nodes.
 *    - Ultra-subtle, non-intrusive 2px top gradient scroll progress line.
 */
export const ScrollRevealManager: React.FC = () => {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const parallaxNodesRef = useRef<ParallaxNode[]>([]);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Accessibility check: immediately abort and keep everything native if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (progressBarRef.current) {
        progressBarRef.current.style.display = 'none';
      }
      return;
    }

    // 1. Initialize Lenis Smooth Momentum Scrolling
    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        syncTouch: false, // strictly preserve native touch scrolling on mobile
        wheelMultiplier: 0.95,
        touchMultiplier: 1.0,
        autoRaf: true,
        prevent: (node) => node.closest('[data-lenis-prevent], [role="dialog"], [aria-modal="true"]') !== null,
      });

      lenisRef.current = lenis;

      // Make lenis accessible globally for any programmatic smooth scrolling
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    } catch {
      // Graceful fallback to native scroll if Lenis fails to initialize
      lenis = null;
    }

    // 2. Parallax Nodes Setup
    const setupParallaxElements = () => {
      const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
      const nodes: ParallaxNode[] = [];

      parallaxEls.forEach((el) => {
        const rawFactor = parseFloat(el.getAttribute('data-parallax') || '0.05');
        const factor = isNaN(rawFactor) ? 0.05 : Math.max(-0.15, Math.min(0.15, rawFactor));
        const rawMax = parseFloat(el.getAttribute('data-parallax-max') || '16');
        const maxOffset = isNaN(rawMax) ? 16 : Math.max(4, Math.min(32, rawMax));

        nodes.push({
          element: el,
          factor,
          maxOffset,
          currentOffset: 0,
          targetOffset: 0,
        });
      });

      parallaxNodesRef.current = nodes;
    };

    setupParallaxElements();

    // 3. Scroll Frame Coordinator (Progress Bar & Parallax)
    const updateScrollMetrics = (scrollY: number, maxScroll: number) => {
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Update progress bar
      if (progressBarRef.current) {
        if (maxScroll > 40) {
          const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
          progressBarRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
          progressBarRef.current.style.opacity = scrollY > 20 ? '0.9' : '0';
        } else {
          progressBarRef.current.style.opacity = '0';
        }
      }

      // Process subtle parallax nodes
      const vCenter = vh / 2;
      const nodes = parallaxNodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rect = node.element.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) continue;

        const elemCenter = rect.top + rect.height / 2;
        const distFromCenter = elemCenter - vCenter;
        const offset = Math.max(-node.maxOffset, Math.min(node.maxOffset, -distFromCenter * node.factor));
        node.element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
    };

    // Bind Lenis scroll listener or native scroll listener
    if (lenis) {
      lenis.on('scroll', (e: { scroll: number; limit: number }) => {
        updateScrollMetrics(e.scroll, e.limit);
      });
    }

    const handleNativeScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - vh;
      updateScrollMetrics(scrollY, maxScroll);
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', setupParallaxElements, { passive: true });

    // Initial pass
    handleNativeScroll();

    // 4. Anticipatory Scroll Reveal System with Staggering
    if ('IntersectionObserver' in window) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries.filter((entry) => entry.isIntersecting);

          intersecting.forEach((entry, idx) => {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);

            // Calculate subtle stagger delay if multiple sibling items enter in the same batch
            const customDelay = el.getAttribute('data-reveal-delay');
            let delayMs = 0;
            if (customDelay) {
              delayMs = parseInt(customDelay, 10);
            } else if (intersecting.length > 1) {
              // Subtle stagger: 65ms per item in this batch, max 260ms
              delayMs = Math.min(idx * 65, 260);
            }

            if (delayMs > 0) {
              el.style.setProperty('--reveal-delay', `${delayMs}ms`);
            }

            el.setAttribute('data-reveal', 'revealed');
            el.classList.remove('is-pending');
            el.classList.add('is-revealed');

            // After animation transition completes, transition to 'settled'
            // so hover effects and active states operate with zero delay or interference
            const durationMs = 600 + delayMs + 60;
            setTimeout(() => {
              el.setAttribute('data-reveal', 'settled');
              el.classList.remove('is-revealed');
              el.classList.add('is-settled');
              el.style.removeProperty('--reveal-delay');
              el.style.willChange = 'auto';
            }, durationMs);
          });
        },
        {
          threshold: 0.01,
          rootMargin: '0px 0px 75px 0px', // Anticipate 75px before entering viewport
        }
      );

      observerRef.current = observer;

      const setupRevealElements = () => {
        const elements = document.querySelectorAll<HTMLElement>('[data-reveal], .reveal-on-scroll');
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        elements.forEach((el) => {
          const currentStatus = el.getAttribute('data-reveal');
          if (
            currentStatus === 'revealed' ||
            currentStatus === 'settled' ||
            el.classList.contains('is-revealed') ||
            el.classList.contains('is-settled')
          ) {
            return;
          }

          const rect = el.getBoundingClientRect();

          // Above-the-fold or already visible: mark settled immediately so zero content is hidden
          if (rect.top < viewportHeight + 40) {
            el.setAttribute('data-reveal', 'settled');
            el.classList.remove('is-pending');
            el.classList.add('is-settled');
          } else {
            // Off-screen element below the fold: progressively reveal
            el.setAttribute('data-reveal', 'pending');
            el.classList.add('is-pending');
            observer.observe(el);
          }
        });
      };

      setupRevealElements();
      const timer = setTimeout(setupRevealElements, 120);

      // Watch for dynamically rendered items
      let mutationFrameId: number | null = null;
      const mutationObserver = new MutationObserver(() => {
        if (mutationFrameId) cancelAnimationFrame(mutationFrameId);
        mutationFrameId = requestAnimationFrame(setupRevealElements);
      });

      if (document.body) {
        mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      return () => {
        clearTimeout(timer);
        if (mutationFrameId) cancelAnimationFrame(mutationFrameId);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        observer.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener('scroll', handleNativeScroll);
        window.removeEventListener('resize', setupParallaxElements);
        if (lenis) {
          lenis.destroy();
          lenisRef.current = null;
        }
      };
    }

    return () => {
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', setupParallaxElements);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [pathname]);

  // Reset scroll position on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
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
