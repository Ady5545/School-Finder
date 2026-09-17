'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '../../lib/utils';

export interface SchoolImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

const NEUTRAL_PLACEHOLDER = '/assets/images/placeholder-school.svg';

export const SchoolImage: React.FC<SchoolImageProps> = ({
  src,
  alt,
  aspectRatio = 'video',
  className,
  fill = true,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    video: 'aspect-[16/9]',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  const isInvalid = !src || hasError;
  const imageSource = isInvalid
    ? NEUTRAL_PLACEHOLDER
    : src.startsWith('/')
      ? src
      : `/${src}`;

  const isPlaceholder = imageSource === NEUTRAL_PLACEHOLDER;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 flex items-center justify-center select-none',
        aspectClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={imageSource}
        alt={isPlaceholder ? `${alt} — Official Verification Pending` : alt}
        fill={fill}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          'object-cover',
          !isPlaceholder && 'transition-transform duration-300 group-hover:scale-105'
        )}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
      />
      {isPlaceholder && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-semibold tracking-wide uppercase pointer-events-none">
          Photo Pending
        </div>
      )}
    </div>
  );
};

