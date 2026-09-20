import React from 'react';
import Link from 'next/link';
import { LoginForm } from '../../../components/auth/LoginForm';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { buildPageMetadata } from '../../../lib/seo';
import { ShieldCheck, BookmarkCheck, Scale } from 'lucide-react';

export const metadata = {
  ...buildPageMetadata(
    'Parent Sign In',
    'Sign in to your Admission Pitara parent account to access saved school shortlists, fee comparisons, and admission trackers in Greater Noida.',
    '/auth/login'
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-12 bg-radial-hero">
      <div className="w-full max-w-md mb-6 text-center flex flex-col items-center">
        <Link href="/" className="inline-block mb-3">
          <BrandLogo size="md" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--color-content)] tracking-tight">
          Parent Account Sign In
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] max-w-sm mt-1">
          Pick up your Greater Noida school search, saved compare trays, and admission milestones.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1"><BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />Saved Shortlist</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-sky-600" />Comparison Trays</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />Verified Profile</span>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}
