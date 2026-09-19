import React from 'react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', children, disabled, type = 'button', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-[var(--color-primary)] shadow-sm',
      secondary:
        'bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-blue-100 focus-visible:outline-[var(--color-primary)]',
      outline:
        'border border-[var(--color-border)] bg-white text-[var(--color-content-muted)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)] focus-visible:outline-[var(--color-primary)]',
      ghost:
        'text-[var(--color-content-muted)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)] focus-visible:outline-[var(--color-primary)]',
    };

    const sizes = {
      sm: 'w-8 h-8 min-w-[32px] min-h-[32px] text-xs',
      md: 'w-10 h-10 min-w-[40px] min-h-[40px] text-sm',
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px] text-base',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
