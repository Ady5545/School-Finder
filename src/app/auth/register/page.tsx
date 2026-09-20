import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '../../../components/auth/RegisterForm';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { buildPageMetadata } from '../../../lib/seo';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  ...buildPageMetadata(
    'Parent Registration',
    'Create a verified parent account on Admission Pitara to track admission deadlines, fee structures, and school shortlists across Greater Noida.',
    '/auth/register'
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-12 bg-radial-hero">
      <div className="w-full max-w-lg mb-6 text-center flex flex-col items-center">
        <Link href="/" className="inline-block mb-3"><BrandLogo size="md" /></Link>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--color-content)] tracking-tight">Join Greater Noida Parents</h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] max-w-md mt-1">
          Access verified school data, shortlists, comparisons, and admission reminders in one place.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
