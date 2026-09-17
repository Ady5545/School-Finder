'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string value into array of digits
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Only accept numeric digits
    const numericOnly = rawVal.replace(/\D/g, '');

    if (!numericOnly) {
      // Clear current digit
      const newDigits = [...digits];
      newDigits[index] = '';
      const newValue = newDigits.join('');
      onChange(newValue);
      return;
    }

    if (numericOnly.length > 1) {
      // User pasted or browser autofilled multiple digits
      const pastedDigits = numericOnly.slice(0, length);
      onChange(pastedDigits);
      if (pastedDigits.length === length) {
        onComplete?.(pastedDigits);
        inputRefs.current[length - 1]?.blur();
      } else {
        inputRefs.current[pastedDigits.length]?.focus();
      }
      return;
    }

    // Single digit entry
    const newDigits = [...digits];
    newDigits[index] = numericOnly[0];
    const newValue = newDigits.join('');
    onChange(newValue);

    if (newValue.length === length) {
      onComplete?.(newValue);
      inputRefs.current[index]?.blur();
    } else if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current box is empty, move back and delete previous
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        const newValue = newDigits.join('');
        onChange(newValue);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newDigits = [...digits];
        newDigits[index] = '';
        const newValue = newDigits.join('');
        onChange(newValue);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericPasted = pastedData.replace(/\D/g, '').slice(0, length);
    if (numericPasted) {
      onChange(numericPasted);
      if (numericPasted.length === length) {
        onComplete?.(numericPasted);
        inputRefs.current[length - 1]?.blur();
      } else {
        inputRefs.current[numericPasted.length]?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-sm">
        {Array.from({ length }, (_, index) => {
          const isFilled = Boolean(digits[index]);
          return (
            <input
              key={index}
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={1}
              value={digits[index]}
              onChange={e => handleChange(index, e)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              aria-label={`Digit ${index + 1} of ${length}`}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-xl border-2 transition-all duration-150 outline-hidden cursor-text select-all ${
                hasError
                  ? 'border-red-400 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                  : isFilled
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] font-extrabold shadow-warm-xs'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]'
              } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
            />
          );
        })}
      </div>
      <p className="text-[11px] text-slate-500 font-medium text-center">
        Enter 6 numeric digits sent to your email
      </p>
    </div>
  );
};
