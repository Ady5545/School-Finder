'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSmoothScroll } from '../layout/SmoothScrollProvider';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 350,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    scrollTo(0, { duration: 0.8 });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top of school directory"
      className={cn(
        'fixed bottom-6 right-6 z-40 p-3 rounded-full',
        'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white',
        'shadow-warm-md hover:shadow-warm-xl',
        'border border-white/20',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 active:scale-95 cursor-pointer',
        'flex items-center gap-1.5 group',
        'animate-in fade-in zoom-in-75 duration-200',
        className
      )}
    >
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
      <span className="text-xs font-bold pr-1 hidden sm:inline tracking-wide">Back to Top</span>
    </button>
  );
};
