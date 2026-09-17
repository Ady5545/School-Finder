'use client';

import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'bottom';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (side === 'bottom') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={cn(
            'relative z-10 w-full max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-2xl sm:rounded-t-3xl shadow-2xl flex flex-col border-t border-[var(--color-border)] animate-in slide-in-from-bottom duration-300 pb-safe',
            className
          )}
        >
          {/* Drag handle indicator */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1 shrink-0" aria-hidden="true" />
          
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-subtle)] shrink-0">
            <h2 className="text-base font-bold text-[var(--color-content)]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 -mr-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('fixed inset-y-0 flex max-w-full', side === 'right' ? 'right-0' : 'left-0')}>
        <div
          className={cn(
            'w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col border-l border-[var(--color-border)] animate-in duration-200',
            side === 'right' ? 'slide-in-from-right' : 'slide-in-from-left',
            className
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
            <h2 className="text-base font-bold text-[var(--color-content)]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 -mr-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
