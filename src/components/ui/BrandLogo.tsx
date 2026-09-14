import React from 'react';
import { cn } from '../../lib/utils';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'mark-only';
  theme?: 'dark' | 'light';
  subtext?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'light',
  subtext = 'Greater Noida West',
  className,
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl font-extrabold',
  };

  const subtextSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Brand Vector Emblem (The Pitara - Treasure of School Intelligence) */}
      <div
        className={cn(
          'relative shrink-0 rounded-xl flex items-center justify-center transition-transform shadow-xs',
          iconSizes[size],
          theme === 'light' ? 'bg-[#0f3256] text-white' : 'bg-white text-[#0f3256]'
        )}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-4/5 h-4/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Radiant Sunburst Rays */}
          <g stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
            <line x1="24" y1="6" x2="24" y2="10" />
            <line x1="16" y1="8" x2="18" y2="11" />
            <line x1="32" y1="8" x2="30" y2="11" />
          </g>

          {/* Golden Sun Wisdom */}
          <path
            d="M18 18C18 14.686 20.686 12 24 12C27.314 12 30 14.686 30 18H18Z"
            fill="#fbbf24"
          />

          {/* Pitara Lid */}
          <path
            d="M10 22C10 18.5 13 16 16.5 16H31.5C35 16 38 18.5 38 22V24H10V22Z"
            fill="#d95d39"
          />
          <path
            d="M10 22C10 18.5 13 16 16.5 16H31.5C35 16 38 18.5 38 22"
            stroke="#fed7aa"
            strokeWidth="1"
          />

          {/* Central Ornament */}
          <rect x="21.5" y="16" width="5" height="8" fill="#c2410c" />
          <rect x="21.5" y="16" width="5" height="8" stroke="#fef3c7" strokeWidth="0.8" fill="none" />

          {/* Pitara Trunk */}
          <path
            d="M11 24H37L35.5 38C35.2 39.5 34 40.5 32.5 40.5H15.5C14 40.5 12.8 39.5 12.5 38L11 24Z"
            fill="#c2410c"
          />

          {/* Lock Plaque */}
          <path
            d="M21 24H27V29.5C27 31.157 25.657 32.5 24 32.5C22.343 32.5 21 31.157 21 29.5V24Z"
            fill="#fbbf24"
            stroke="#fef3c7"
            strokeWidth="0.8"
          />
          <circle cx="24" cy="27" r="1" fill="#0f3256" />

          {/* Horizontal Band */}
          <line x1="11" y1="24" x2="37" y2="24" stroke="#fef3c7" strokeWidth="1" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'tracking-tight leading-tight',
                titleSizes[size],
                theme === 'light' ? 'text-[#0f1c2e]' : 'text-white'
              )}
            >
              Admission <span className="text-[#c85a28]">Pitara</span>
            </span>
          </div>
          {subtext && (
            <span
              className={cn(
                'font-medium tracking-wider uppercase',
                subtextSizes[size],
                theme === 'light' ? 'text-[#64748b]' : 'text-slate-300'
              )}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
