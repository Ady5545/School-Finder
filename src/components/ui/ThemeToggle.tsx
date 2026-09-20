'use client';

import React, { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

type Theme = 'system' | 'light' | 'dark';

const applyTheme = (theme: Theme) => {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.theme = theme;
};

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = window.localStorage.getItem('admission-pitara-theme') as Theme | null;
    const next = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    setTheme(next);
    applyTheme(next);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (next === 'system') applyTheme('system'); };
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  const cycle = () => {
    const next: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    window.localStorage.setItem('admission-pitara-theme', next);
    applyTheme(next);
  };

  const Icon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;
  const label = theme === 'system' ? 'Theme: System' : theme === 'light' ? 'Theme: Light' : 'Theme: Dark';

  return (
    <button type="button" onClick={cycle} aria-label={label} title={label}
      className={cn('glass-interactive liquid-glass w-9 h-9 rounded-xl flex items-center justify-center text-[var(--color-content-muted)] hover:text-[var(--color-content)]', className)}>
      <Icon className="w-4 h-4" />
    </button>
  );
};
