import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', hasDot = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center gap-1.5 font-medium rounded-md whitespace-nowrap transition-colors select-none';

    const variants = {
      default: 'bg-[var(--color-surface-subtle)] text-[var(--color-content)] border border-[var(--color-border)]',
      primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-blue-200/50',
      success: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-emerald-200',
      warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border border-amber-200',
      error: 'bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-rose-200',
      info: 'bg-[var(--color-info-bg)] text-[var(--color-info-text)] border border-sky-200',
      outline: 'bg-transparent text-[var(--color-content-muted)] border border-[var(--color-border)]',
    };

    const sizes = {
      sm: 'text-[11px] px-2 py-0.5 leading-tight',
      md: 'text-xs px-2.5 py-1 leading-normal',
    };

    const dotColors = {
      default: 'bg-[var(--color-content-subtle)]',
      primary: 'bg-[var(--color-primary)]',
      success: 'bg-[var(--color-success)]',
      warning: 'bg-[var(--color-warning)]',
      error: 'bg-[var(--color-error)]',
      info: 'bg-[var(--color-info)]',
      outline: 'bg-[var(--color-content-muted)]',
    };

    return (
      <span ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
        {hasDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
