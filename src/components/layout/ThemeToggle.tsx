'use client';
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const THEME_STORAGE_KEY = 'admission-pitara-theme';

// Kept in sync with the inline script in layout.tsx (see THEME_INIT_SCRIPT below) -
// that script runs before paint so there's no flash of the wrong theme; this
// function is what the toggle button itself uses once React has hydrated.
function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private browsing / storage disabled - theme just won't persist across visits.
  }
}

export function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // ignore
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Inlined into <head> in layout.tsx as a blocking script so the correct
// theme is set on the very first paint, before React hydrates.
export const THEME_INIT_SCRIPT = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':null);if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    setTheme(getInitialTheme());
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      // Only follow the system if the person hasn't explicitly chosen a theme here.
      let hasExplicitChoice = false;
      try { hasExplicitChoice = !!window.localStorage.getItem(THEME_STORAGE_KEY); } catch { /* ignore */ }
      if (!hasExplicitChoice) {
        const next = media?.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        setTheme(next);
      }
    };
    media?.addEventListener?.('change', onSystemChange);
    return () => media?.removeEventListener?.('change', onSystemChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)] transition-colors ${className}`}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
