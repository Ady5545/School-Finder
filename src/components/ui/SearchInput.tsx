'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onChange, onClear, placeholder = 'Search schools by name, sector, board...', ...props }, ref) => {
    const isControlled = value !== undefined;
    const [internalVal, setInternalVal] = useState('');
    const currentValue = isControlled ? String(value || '') : internalVal;

    const handleClear = () => {
      if (!isControlled) setInternalVal('');
      onClear?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalVal(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={cn('relative flex items-center w-full', containerClassName)}>
        <Search className="absolute left-3.5 w-4 h-4 text-[var(--color-content-subtle)] pointer-events-none" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2.5 text-sm bg-white rounded-xl border border-[var(--color-border)] text-[var(--color-content)] placeholder:text-[var(--color-content-subtle)] transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none shadow-xs',
            className
          )}
          {...props}
        />
        {currentValue.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-[var(--color-content-subtle)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)] cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
