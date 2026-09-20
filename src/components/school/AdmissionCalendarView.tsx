'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, ExternalLink } from 'lucide-react';
import type { School } from '../../types/school';
import { formatAdmissionStatus } from './AdmissionStatus';

export const AdmissionCalendarView: React.FC<{ schools: School[] }> = ({ schools }) => {
  const entries = useMemo(
    () =>
      schools
        .flatMap(school =>
          (school.admissions?.milestones || [])
            .filter(milestone => Boolean(milestone.date))
            .filter(() => {
              const cycle = String(school.admissions?.academicYear || school.admissions?.session || '');
              return !cycle || /2027/.test(cycle);
            })
            .map(milestone => ({ school, milestone }))
        )
        .sort((a, b) => a.milestone.date.localeCompare(b.milestone.date)),
    [schools]
  );

  const months = useMemo(() => {
    const grouped = new Map<string, typeof entries>();
    entries.forEach(entry => {
      const key = entry.milestone.date.slice(0, 7);
      const list = grouped.get(key) || [];
      list.push(entry);
      grouped.set(key, list);
    });
    return Array.from(grouped.entries());
  }, [entries]);

  const [selectedMonth, setSelectedMonth] = useState(months[0]?.[0] || '');

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white shadow-warm-xs p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-sky-700"><CalendarDays className="w-3.5 h-3.5" /> 2027–28 admissions calendar</div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">Verified dates, one view</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl">Only dated milestones already present in the directory appear here. Missing dates remain missing rather than being estimated.</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[10px] text-amber-900">
          {entries.length ? entries.length + (entries.length === 1 ? ' recorded milestone' : ' recorded milestones') : 'No dated milestones are recorded yet'}
        </div>
      </div>

      {months.length ? (
        <>
          <div className="flex gap-2 overflow-x-auto mt-5 pb-1">
            {months.map(([key]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedMonth(key)}
                className={'px-3 py-1.5 rounded-lg border text-[11px] font-bold shrink-0 ' + (selectedMonth === key ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300')}
              >
                {new Date(key + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {(months.find(entry => entry[0] === selectedMonth)?.[1] || []).map(entry => (
              <div key={entry.school.slug + ':' + entry.milestone.id} className="rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <Link href={'/schools/' + entry.school.slug} className="text-sm font-bold text-slate-900 hover:text-[var(--color-primary)]">{entry.school.name}</Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="font-bold text-emerald-800">{new Date(entry.milestone.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>{entry.milestone.label}</span>
                    <span>{formatAdmissionStatus(entry.school.admissions?.status || 'Status pending')}</span>
                  </div>
                  {entry.milestone.notes && <p className="text-[11px] text-slate-500 mt-1">{entry.milestone.notes}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.school.admissions?.sourceUrl && <a href={entry.school.admissions.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50">Official source <ExternalLink className="w-3 h-3" /></a>}
                  <Link href={'/schools/' + entry.school.slug} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white text-[11px] font-bold"><Clock3 className="w-3 h-3" /> Set reminder</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-5 text-xs text-amber-900">
          No school has a dated 2027–28 milestone in the current dataset. Individual school profiles will show a pending state until an official schedule is available.
        </div>
      )}
    </section>
  );
};
