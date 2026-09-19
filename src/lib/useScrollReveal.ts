'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface ScrollRevealOptions {
  /**
   * Intersection threshold (0.0 to 1.0)
   * @default 0.1
   */
  threshold?: number;
  /**
   * Margin around the root viewport.
   * Positive bottom margin triggers early, negative triggers slightly later.
   * @default '0px 0px -20px 0px'
   */
  rootMargin?: string;
  /**
   * Stagger delay in milliseconds before transition starts
   * @default 0
   */
  delay?: number;
  /**
   * Distance in pixels for the upward slide motion
   * @default 14
   */
  distance?: number;
  /**
   * Duration in milliseconds for the fade + slide transition
   * @default 500
   */
  duration?: number;
  /**
   * Whether to trigger animation only once (recommended for performance)
   * @default true
   */
  once?: boolean;
  /**
   * Disable the reveal behavior completely
   * @default false
   */
  disabled?: boolean;
}

export interface ScrollRevealReturn<T extends HTMLElement = HTMLElement> {
  ref: (node: T | null) => void;
  isRevealed: boolean;
  props: {
    ref: (node: T | null) => void;
    'data-reveal': 'pending' | 'revealed';
    className: string;
    style?: React.CSSProperties;
  };
}

/**
 * useScrollReveal Hook
 *
 * Progressive Enhancement Architecture:
 * - Content is 100% visible on SSR, initial HTML render, and if JavaScript fails.
 * - Respects user's `prefers-reduced-motion` setting.
 * - If the element is already inside the viewport upon mount, it is never hidden.
 * - Only off-screen elements below the fold animate gently upward as they enter the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): ScrollRevealReturn<T> {
  const {
    threshold = 0.01,
    rootMargin = '0px 0px 75px 0px',
    delay = 0,
    distance = 16,
    duration = 600,
    once = true,
    disabled = false,
  } = options;

  const nodeRef = useRef<T | null>(null);
  // Default to true so that content is never invisible during SSR or if JS fails
  const [isRevealed, setIsRevealed] = useState(true);
  const [isArmed, setIsArmed] = useState(false);

  const setRef = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el || disabled || typeof window === 'undefined') {
      setIsRevealed(true);
      return;
    }

    // 1. Accessibility: Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    // 2. Browser feature support: Fall back gracefully without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    // 3. Prevent flash: Check if element is already in or above the current viewport
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Element is already visible to the user — keep it revealed
      setIsRevealed(true);
      return;
    }

    // 4. Element is strictly below the fold: arm it for progressive reveal
    setIsArmed(true);
    setIsRevealed(false);

    let delayTimer: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              delayTimer = setTimeout(() => {
                setIsRevealed(true);
              }, delay);
            } else {
              setIsRevealed(true);
            }

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay, once, disabled]);

  // Compute inline styles for customizable distance, duration, and delay
  const style: React.CSSProperties | undefined = isArmed
    ? {
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
        ...(distance !== 16
          ? ({ '--reveal-distance': `${distance}px` } as React.CSSProperties)
          : {}),
        ...(duration !== 600
          ? ({ '--reveal-duration': `${duration}ms` } as React.CSSProperties)
          : {}),
      }
    : undefined;

  const revealStatus = !isArmed || isRevealed ? 'revealed' : 'pending';

  return {
    ref: setRef,
    isRevealed,
    props: {
      ref: setRef,
      'data-reveal': revealStatus,
      className: `reveal-on-scroll ${revealStatus === 'revealed' ? 'is-revealed' : 'is-pending'}`,
      style,
    },
  };
}
