'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  id?: string;
  text: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export const Tooltip: React.FC<TooltipProps> = ({
  id,
  text,
  label = 'More information',
  className,
  children,
  align = 'center',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const autoId = useId();
  const tooltipId = id || `tooltip-${autoId}`;

  // Close on Escape or click outside
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const alignmentClasses = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <span ref={containerRef} className={cn('relative inline-flex items-center align-middle', className)}>
      <button
        type="button"
        id={`${tooltipId}-trigger`}
        aria-label={label}
        aria-expanded={isVisible}
        aria-describedby={isVisible ? tooltipId : undefined}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setIsVisible(prev => !prev);
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={e => {
          // If focus moves outside the container, close
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsVisible(false);
          }
        }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-stone-200/90 hover:bg-stone-300 text-stone-600 hover:text-stone-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-1 focus:ring-amber-700/60 select-none shadow-xs ml-1.5 cursor-pointer shrink-0"
      >
        {children || '?'}
      </button>

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute bottom-full mb-2 z-50 pointer-events-auto',
            'w-64 sm:w-72 p-2.5 rounded-lg text-[11px] leading-relaxed',
            'bg-stone-900 text-stone-100 shadow-xl border border-stone-800',
            'animate-in fade-in zoom-in-95 duration-150',
            alignmentClasses[align]
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            {text}
            {/* Subtle arrow pointer */}
            <div
              className={cn(
                'absolute -bottom-3 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-stone-900',
                align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-3' : 'right-3'
              )}
            />
          </div>
        </div>
      )}
    </span>
  );
};
