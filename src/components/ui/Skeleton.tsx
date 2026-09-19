import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rounded' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  width,
  height,
  style,
  ...props
}) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    rectangular: 'rounded-none',
  };

  return (
    <div
      role="status"
      aria-label="Loading content"
      className={cn(
        'animate-pulse bg-slate-200/80 transition-colors',
        variants[variant],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
