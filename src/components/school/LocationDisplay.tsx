import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SchoolLocation } from '../../types/school';

export interface LocationDisplayProps {
  location: SchoolLocation;
  variant?: 'compact' | 'full';
  className?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  variant = 'compact',
  className,
}) => {
  const displayText =
    variant === 'compact'
      ? `${location.sector || location.area || 'Greater Noida West'}, ${location.city}`
      : location.address;

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs text-[var(--color-content-muted)]', className)}>
      <MapPin className="w-3.5 h-3.5 text-[var(--color-content-subtle)] shrink-0" aria-hidden="true" />
      <span className="truncate max-w-[260px]" title={location.address}>
        {displayText}
      </span>
    </div>
  );
};
