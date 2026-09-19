import React, { useId } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, placeholder, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[var(--color-content)] select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2 pr-10 text-sm text-[var(--color-content)] transition-colors focus:border-[var(--color-primary)] focus:outline-none disabled:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed cursor-pointer',
              error && 'border-[var(--color-error)]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 w-4 h-4 text-[var(--color-content-subtle)] pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && <span className="text-xs text-[var(--color-error)]">{error}</span>}
        {!error && helperText && <span className="text-xs text-[var(--color-content-muted)]">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
