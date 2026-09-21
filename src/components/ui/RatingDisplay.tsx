import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RatingDisplayProps {
  score: number;
  scale?: number;
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  score,
  scale = 5,
  reviewsCount,
  size = 'md',
  showCount = true,
  className,
}) => {
  if (!Number.isFinite(score) || score <= 0 || !reviewsCount || reviewsCount <= 0) {
    return null;
  }

  const roundedScore = Math.round(score * 10) / 10;
  const ariaLabel = `Rating: ${roundedScore} out of ${scale} stars${reviewsCount ? ` from ${reviewsCount} reviews` : ''}`;

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  };

  return (
    <div
      className={cn('inline-flex items-center gap-1.5 select-none', className)}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <div className="flex items-center text-amber-500 shrink-0">
        {[1, 2, 3, 4, 5].map(starIndex => (
          <Star
            key={starIndex}
            className={cn(
              iconSizes[size],
              starIndex <= Math.round(score)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className={cn('text-[var(--color-content)]', textSizes[size])}>
        {roundedScore.toFixed(1)}
      </span>
      {showCount && reviewsCount !== undefined && reviewsCount > 0 && (
        <span className="text-xs text-[var(--color-content-muted)] font-normal">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
