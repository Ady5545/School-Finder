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
  subtext = 'GREATER NOIDA WEST',
  className,
}) => {
  const iconSizes = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm font-bold',
    md: 'text-lg font-black',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
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
      {/* Brand Vector Emblem (The Pitara Treasure Box with Radiant Golden Sunbeams) */}
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center transition-transform shadow-xs overflow-hidden bg-[#0f253e]',
          iconSizes[size]
        )}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-4/5 h-4/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Radiant Golden Sunburst Rays */}
          <g stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round">
            <line x1="24" y1="5" x2="24" y2="10" />
            <line x1="16" y1="8" x2="19" y2="12" />
            <line x1="32" y1="8" x2="29" y2="12" />
          </g>

          {/* Golden Sun Wisdom / Glow arch */}
          <path
            d="M18 17C18 13.686 20.686 11 24 11C27.314 11 30 13.686 30 17H18Z"
            fill="#f59e0b"
          />

          {/* Pitara Lid (Curved Chest Top in Terracotta/Rust) */}
          <path
            d="M11 22C11 17.5 14.5 15 18 15H30C33.5 15 37 17.5 37 22V24H11V22Z"
            fill="#a64019"
          />

          {/* Horizontal Golden Band / Latch Rim */}
          <rect x="10" y="23" width="28" height="2" fill="#f59e0b" rx="1" />

          {/* Pitara Trunk (Tapered Chest Base in Terracotta/Rust) */}
          <path
            d="M12 24.5H36L34.2 38.5C34 39.9 32.8 41 31.4 41H16.6C15.2 41 14 39.9 13.8 38.5L12 24.5Z"
            fill="#8e3311"
          />

          {/* Golden U-shaped Lock Clasp / Plaque */}
          <path
            d="M21 21.5H27V28C27 29.657 25.657 31 24 31C22.343 31 21 29.657 21 28V21.5Z"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="0.6"
          />
          {/* Keyhole / Latch Center */}
          <circle cx="24" cy="26" r="1.3" fill="#0f253e" />
          <path d="M23.3 26.5L24.7 26.5L24.4 28.8H23.6L23.3 26.5Z" fill="#0f253e" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                'tracking-tight leading-tight',
                titleSizes[size],
                theme === 'light' ? 'text-[#0f172a]' : 'text-white'
              )}
            >
              Admission <span className={theme === 'light' ? 'text-[#dc2626]' : 'text-[#ef4444]'}>Pitara</span>
            </span>
          </div>
          {subtext && (
            <span
              className={cn(
                'font-bold tracking-[0.22em] uppercase mt-0.5',
                subtextSizes[size],
                theme === 'light' ? 'text-[#52657e]' : 'text-slate-300'
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
