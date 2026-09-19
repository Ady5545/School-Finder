import React, { useId } from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, disabled, onChange, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none group text-sm',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border border-[var(--color-border-strong)] bg-white transition-all flex items-center justify-center',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary-light)] peer-focus-visible:border-[var(--color-primary)]',
              'peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)]'
            )}
          >
            <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="font-medium text-[var(--color-content)] leading-tight">{label}</span>}
            {description && <span className="text-xs text-[var(--color-content-muted)] mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
