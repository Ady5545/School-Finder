import React from 'react';
import { CheckCircle2, Eye, FileCheck2, ShieldCheck } from 'lucide-react';

export const DataTrustAdvantage: React.FC = () => (
  <section className="w-full py-16 sm:py-20 bg-white border-y border-[var(--color-border)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Data Trust is a product feature
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] mt-4 tracking-tight">We show the evidence — and the gaps.</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          Parents should be able to tell what came from a documented source, what is calculated, and what is still pending. Admission Pitara now puts that visibility directly into discovery and school profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-9">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <FileCheck2 className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-sm text-slate-900 mt-3">Source-linked facts</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Where the record carries a source, parents can reach it instead of seeing unexplained figures.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <Eye className="w-5 h-5 text-sky-700" />
          <h3 className="font-bold text-sm text-slate-900 mt-3">Pending means pending</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Missing coordinates, unreleased schedules and unverified facts stay visibly unresolved.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <CheckCircle2 className="w-5 h-5 text-amber-700" />
          <h3 className="font-bold text-sm text-slate-900 mt-3">Checked timestamps</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Where the dataset records a verification date, it is surfaced so parents know when a check was last recorded.</p>
        </div>
      </div>
    </div>
  </section>
);
