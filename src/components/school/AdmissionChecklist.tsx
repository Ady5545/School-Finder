'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, ClipboardCheck, FileText } from 'lucide-react';
import type { School } from '../../types/school';

const CHECKLIST = [
  'Confirm the school’s current 2027–28 application window',
  'Keep the child’s birth-date document ready',
  'Keep parent / guardian ID proof ready',
  'Keep current address proof ready',
  'Prepare recent passport-size photographs',
  'Keep the latest report card / school record where applicable',
  'Check whether the school asks for transfer or migration documents',
  'Save the official school application link and fee schedule',
];

export const AdmissionChecklist: React.FC<{ school: School }> = ({ school }) => {
  const storageKey = 'ap-admission-checklist:' + school.slug;
  const [done, setDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setDone(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const completed = useMemo(() => Object.values(done).filter(Boolean).length, [done]);

  const toggle = (index: number) => {
    setDone(prev => {
      const next = { ...prev, [index]: !prev[index] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-warm-xs">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center shrink-0"><ClipboardCheck className="w-5 h-5" /></div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-700">Application checklist</span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">Get your paperwork ready</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Preparation guidance for parents. Schools can ask for different documents, so confirm the final list with {school.name}.</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {CHECKLIST.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(index)}
            className={'w-full rounded-xl border p-3 text-left flex items-center gap-3 transition-colors ' + (done[index] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-white')}
          >
            <span className={'w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ' + (done[index] ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 text-slate-400')}>
              {done[index] ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </span>
            <span className={'text-xs font-semibold ' + (done[index] ? 'text-emerald-900' : 'text-slate-700')}>{item}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-[11px] font-bold text-slate-500">{completed} of {CHECKLIST.length} prepared</div>
    </section>
  );
};
