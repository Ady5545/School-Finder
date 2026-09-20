import React from 'react';
import type { SchoolFees } from '../../types/school';
import { getCardAnnualFeeDisplay } from '../../lib/cardFeePresentation';
import { cn } from '../../lib/utils';

interface CardFeeDisplayProps {
  slug: string;
  fees: SchoolFees;
  className?: string;
}

export const CardFeeDisplay: React.FC<CardFeeDisplayProps> = ({ slug, fees, className }) => {
  const value = getCardAnnualFeeDisplay(slug, fees);

  return (
    <div className={cn('flex flex-col min-w-0', className)}>
      <span className="text-[10px] uppercase font-bold text-[var(--color-content-muted)] tracking-wider">
        Annual Fee
      </span>
      <span className="text-sm sm:text-[15px] font-black text-[var(--color-content)] mt-0.5 whitespace-nowrap">
        {value}
      </span>
    </div>
  );
};
