import React from 'react';
import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-white/50 my-6',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-content-muted)] mb-3.5">
        {icon || <Inbox className="w-6 h-6 stroke-[1.5]" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-[var(--color-content)] tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-content-muted)] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
