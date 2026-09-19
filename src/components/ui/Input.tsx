import React, { useId } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--color-content)] select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--color-content-subtle)] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2 text-sm text-[var(--color-content)] transition-colors placeholder:text-[var(--color-content-subtle)] focus:border-[var(--color-primary)] focus:outline-none disabled:bg-[var(--color-surface-subtle)] disabled:text-[var(--color-content-subtle)] disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[var(--color-content-subtle)] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span id={errorId} className="text-xs text-[var(--color-error)]" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-xs text-[var(--color-content-muted)]">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
