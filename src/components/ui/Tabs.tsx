'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  return (
    <div
      role="tablist"
      aria-label="Navigation tabs"
      className={cn(
        'flex items-center gap-1 overflow-x-auto no-scrollbar',
        variant === 'underline' && 'border-b border-white/60 bg-white/18 backdrop-blur-md rounded-t-xl',
        variant === 'pills' && 'glass-chip p-1 rounded-xl',
        className
      )}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer select-none',
              variant === 'underline' && [
                'py-3 px-4 border-b-2 -mb-[1px]',
                isActive
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-semibold'
                  : 'border-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content)] hover:border-[var(--color-border-strong)]',
              ],
              variant === 'pills' && [
                'py-1.5 px-3.5 rounded-xl glass-interactive',
                isActive
                  ? 'liquid-glass bg-white/72 text-[var(--color-primary)] font-semibold shadow-sm backdrop-blur-xl'
                  : 'text-[var(--color-content-muted)] hover:text-[var(--color-content)]',
              ]
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full font-semibold',
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-content-muted)]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
