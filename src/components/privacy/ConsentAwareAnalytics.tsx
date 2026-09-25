'use client';

import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { COOKIE_CONSENT_KEY } from './CookieConsent';

type ConsentState = 'granted' | 'essential' | null;

export const ConsentAwareAnalytics: React.FC = () => {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    try {
      setConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentState);
    } catch {
      setConsent(null);
    }

    const handleConsent = (event: Event) => {
      setConsent((event as CustomEvent<ConsentState>).detail);
    };

    window.addEventListener('admission-pitara-consent', handleConsent);
    return () => window.removeEventListener('admission-pitara-consent', handleConsent);
  }, []);

  if (consent !== 'granted') return null;
  return <><Analytics /><SpeedInsights /></>;
};
