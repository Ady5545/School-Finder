'use client';

import React from 'react';
import { CheckCircle2, ExternalLink, Info, MapPin, ShieldCheck } from 'lucide-react';
import type { School } from '../../types/school';
import { getSchoolTrustSignals } from '../../lib/dataTrust';
import { cn } from '../../lib/utils';

export const DataTrustPanel: React.FC<{ school: School }> = ({ school }) => {
  const signals = getSchoolTrustSignals(school);
  const checkedCount = signals.filter(signal => signal.checked).length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-warm-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
            Admission Pitara Data Trust
          </span>
          <h2 className="text-base font-extrabold text-slate-900 mt-0.5">See what has actually been checked</h2>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            {checkedCount} of {signals.length} evidence areas are checked for this school. Pending areas stay visible instead of being filled with assumptions.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {signals.map(signal => (
          <div
            key={signal.key}
            className={cn(
              'rounded-xl border p-3 flex items-start gap-3',
              signal.checked ? 'border-emerald-100 bg-emerald-50/40' : 'border-amber-100 bg-amber-50/35'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {signal.checked ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : signal.key === 'location' ? (
                <MapPin className="w-4 h-4 text-amber-600" />
              ) : (
                <Info className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{signal.label}</span>
                <span className={cn('text-[9px] font-bold uppercase tracking-wider shrink-0', signal.checked ? 'text-emerald-700' : 'text-amber-700')}>
                  {signal.checked ? 'Checked' : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{signal.detail}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {signal.checkedAt && <span className="text-[10px] text-slate-500">Last checked: {signal.checkedAt}</span>}
                {signal.sourceUrl && (
                  <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 hover:text-sky-900">
                    Source <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
        Trust signals are evidence visibility, not a guarantee. Always confirm the final fee or admission requirement with the school.
      </p>
    </section>
  );
};
