'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useScrollReveal, ScrollRevealOptions } from '../../lib/useScrollReveal';

export interface ScrollRevealProps
  extends React.HTMLAttributes<HTMLElement>,
    ScrollRevealOptions {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Reusable ScrollReveal Client Component
 *
 * Features:
 * - Progressive Enhancement: Renders 100% visible by default in SSR, HTML, and if JS fails.
 * - Viewport Awareness: Elements above the fold are never hidden or delayed.
 * - Subtle Animation: Off-screen elements gently fade in and translate upward as they enter view.
 * - Accessibility: Strictly respects `prefers-reduced-motion: reduce`.
 * - Performance: Unobserves immediately upon entering viewport (single-fire `IntersectionObserver`).
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  distance = 16,
  duration = 600,
  threshold = 0.01,
  rootMargin = '0px 0px 75px 0px',
  once = true,
  disabled = false,
  as: Component = 'div',
  style,
  ...rest
}) => {
  const { props: revealProps } = useScrollReveal<HTMLElement>({
    delay,
    distance,
    duration,
    threshold,
    rootMargin,
    once,
    disabled,
  });

  return (
    <Component
      {...rest}
      ref={revealProps.ref}
      data-reveal={revealProps['data-reveal']}
      className={cn('reveal-on-scroll', revealProps.className, className)}
      style={{
        ...revealProps.style,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};

export { useScrollReveal };
export type { ScrollRevealOptions };
