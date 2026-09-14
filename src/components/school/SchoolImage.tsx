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
        <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
          <SchoolIcon className="w-8 h-8 stroke-[1.5] mb-1" aria-hidden="true" />
          <span className="text-[11px] font-medium text-slate-500 line-clamp-1">{alt}</span>
        </div>
      )}
    </div>
  );
};
