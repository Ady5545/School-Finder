import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
      'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-[var(--color-primary)] shadow-sm active:scale-[0.99]',
      secondary:
        'bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-blue-100/80 focus-visible:outline-[var(--color-primary)] active:scale-[0.99]',
      outline:
        'border border-[var(--color-border)] bg-white text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)] focus-visible:outline-[var(--color-primary)]',
      ghost:
        'text-[var(--color-content-muted)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)] focus-visible:outline-[var(--color-primary)]',
      danger:
        'bg-[var(--color-error)] text-white hover:bg-rose-700 focus-visible:outline-[var(--color-error)] shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2 min-h-[42px] gap-2',
      lg: 'text-base px-5 py-2.5 min-h-[48px] gap-2.5',
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
