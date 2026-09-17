import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '../../../components/auth/RegisterForm';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { buildPageMetadata } from '../../../lib/seo';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = buildPageMetadata(
  'Parent Registration',
  'Create a verified parent account on Admission Pitara to track admission deadlines, fee structures, and school shortlists across Greater Noida.',
  '/auth/register'
);

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-12 bg-radial-hero">
      <div className="w-full max-w-lg mb-6 text-center flex flex-col items-center">
        <Link href="/" className="inline-block mb-3">
          <BrandLogo size="md" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--color-content)] tracking-tight">
          Join Greater Noida Parents
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] max-w-md mt-1">
          Access verified fee breakdowns, compare schools side-by-side, and save your admission shortlist.
        </p>

        {/* Value pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            100% Free for Parents
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            Zero Spam / Mobile Safe
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Verified Greater Noida Schools
          </span>
        </div>
      </div>

      <RegisterForm />
    </div>
  );
}

