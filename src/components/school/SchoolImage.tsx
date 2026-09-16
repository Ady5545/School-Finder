'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { School as SchoolIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SchoolImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export const SchoolImage: React.FC<SchoolImageProps> = ({
  src,
  alt,
  aspectRatio = 'video',
  className,
  fill = true,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(!src);

  const aspectClasses = {
    video: 'aspect-[16/9]',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  const normalizedSrc = src ? (src.startsWith('/') ? src : `/${src}`) : null;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 flex items-center justify-center select-none',
        aspectClasses[aspectRatio],
        className
      )}
    >
      {!hasError && normalizedSrc ? (
        <Image
          src={normalizedSrc}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-50 via-slate-100 to-amber-50/40 relative">
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-[#0f2d4a] mb-2">
            <SchoolIcon className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[85%]">{alt}</span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 tracking-wide uppercase">
            Admission Pitara Directory
          </span>
        </div>
      )}
    </div>
  );
};
