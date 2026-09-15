import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none tracking-tight';

    const variants = {
      primary:
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] border border-[var(--color-primary)] focus-visible:outline-[var(--color-primary)] shadow-warm-xs hover:shadow-warm-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
      secondary:
        'bg-[var(--color-surface-subtle)] text-[var(--color-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-brand-200)] hover:text-[var(--color-primary)] focus-visible:outline-[var(--color-primary)] shadow-warm-2xs hover:shadow-warm-xs active:scale-[0.99]',
      accent:
        'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] border border-[var(--color-primary-hover)] focus-visible:outline-[var(--color-accent)] shadow-warm-xs hover:shadow-warm-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
      outline:
        'border border-[var(--color-border-strong)] bg-white text-[var(--color-content)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-[var(--color-primary)] shadow-warm-2xs hover:shadow-warm-xs active:scale-[0.99]',
      ghost:
        'text-[var(--color-content-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-subtle)] focus-visible:outline-[var(--color-primary)]',
      danger:
        'bg-[var(--color-error)] text-white hover:bg-rose-700 border border-rose-800 focus-visible:outline-[var(--color-error)] shadow-warm-xs active:scale-[0.99]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4.5 py-2 min-h-[42px] gap-2',
      lg: 'text-base px-6 py-2.5 min-h-[48px] gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
