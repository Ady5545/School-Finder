'use client';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/** Site analytics are enabled without a blocking consent banner. */
export const ConsentAwareAnalytics: React.FC = () => {
  return <><Analytics /><SpeedInsights /></>;
};
