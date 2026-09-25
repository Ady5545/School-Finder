'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'admission_pitara_cookie_consent';

type ConsentState = 'granted' | 'essential' | null;

export const CookieConsent: React.FC = () => {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY) as ConsentState;
      if (stored === 'granted' || stored === 'essential') {
        setConsent(stored);
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: Exclude<ConsentState, null>) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setConsent(value);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('admission-pitara-consent', { detail: value }));
  };

  if (!visible || consent) return null;

  return (
    <div role="dialog" aria-label="Cookie and analytics preferences" aria-describedby="cookie-consent-description"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[70] lg:bottom-5 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[min(440px,calc(100vw-2rem))]">
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-950">Privacy choices</h2>
            <p id="cookie-consent-description" className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Admission Pitara uses essential storage for site features. With your permission, we also enable anonymous analytics so we can understand which parts of the site are useful. You can change your choice later from this notice.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Read our <Link href="/privacy" className="font-semibold text-[var(--color-primary)] hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => choose('essential')}
            className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">
            Essential only
          </button>
          <button type="button" onClick={() => choose('granted')}
            className="min-h-10 rounded-xl bg-[var(--color-primary)] px-3 py-2 text-xs font-bold text-white transition-colors hover:opacity-95">
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export const COOKIE_CONSENT_KEY = CONSENT_KEY;
