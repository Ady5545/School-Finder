'use client';

import React from 'react';

/**
 * SmoothScrollProvider: Native Browser Document Scrolling
 *
 * Ensures 100% native document scrolling without wheel interception,
 * custom RAF loops, or artificial inertia.
 */
export const SmoothScrollProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

