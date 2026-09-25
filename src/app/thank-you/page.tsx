import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = {
  ...buildPageMetadata('Thank You', 'Your Admission Pitara enquiry has been received.', '/thank-you'),
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <div className="w-full flex-1 bg-[#fdfcf9]">
      <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Message received</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Thanks for contacting Admission Pitara.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Your enquiry has been sent to our public contact desk. Keep an eye on your inbox if the team needs more information.
        </p>
        <div className="mt-7 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm">
          <Mail className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
          enquiry.admissionpitara@gmail.com
        </div>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link href="/schools" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5">
            Explore schools <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
