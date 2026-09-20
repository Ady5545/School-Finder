'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import type { School } from '../../types/school';
import { Button } from '../ui/Button';
import { DataTrustBadge } from './DataTrustBadge';

type Criterion = { label: string; matched: boolean };

export const SchoolMatchView: React.FC<{ schools: School[] }> = ({ schools }) => {
  const [board, setBoard] = useState('');
  const [area, setArea] = useState('');
  const [grade, setGrade] = useState('all');
  const [budget, setBudget] = useState('all');
  const [admission, setAdmission] = useState('all');
  const [query, setQuery] = useState('');

  const areas = useMemo(
    () => Array.from(new Set(schools.map(s => s.location?.area).filter(Boolean))).sort(),
    [schools]
  );
  const boards = useMemo(
    () => Array.from(new Set(schools.flatMap(s => Array.isArray(s.board) ? s.board : [s.board]).filter(Boolean))).sort(),
    [schools]
  );

  const coversGrade = (school: School, selected: string) => {
    if (selected === 'all') return true;
    const raw = ((school.gradeRange?.raw || '') + ' ' + (school.gradeRange?.from || '') + ' ' + (school.gradeRange?.to || '')).toLowerCase();
    if (selected === 'nursery') return /nursery|pre|play|montessori|kindergarten/.test(raw);
    if (selected === 'primary') return /class 1|grade 1|class 5|grade 5|primary/.test(raw);
    if (selected === 'secondary') return /class 10|grade 10|secondary|x/.test(raw);
    if (selected === 'senior') return /class 12|grade 12|senior secondary|xii/.test(raw);
    return true;
  };

  const budgetMatch = (school: School, selected: string) => {
    if (selected === 'all') return true;
    const fee = school.fees?.cardFee;
    if (typeof fee !== 'number' || school.fees?.comparableAnnualAvailable === false) return false;
    if (selected === 'under-120') return fee <= 120000;
    if (selected === '120-180') return fee > 120000 && fee <= 180000;
    if (selected === '180-250') return fee > 180000 && fee <= 250000;
    return fee > 250000;
  };

  const admissionMatch = (school: School, selected: string) => {
    if (selected === 'all') return true;
    const status = (school.admissions?.status || '').toLowerCase();
    if (selected === 'open') return /open|ongoing|active/.test(status);
    return /upcoming|pending|pre-registration|pre_registration/.test(status);
  };

  const result = useMemo(() => {
    return schools
      .map(school => {
        const criteria: Criterion[] = [];
        if (board) {
          const boardsForSchool = Array.isArray(school.board) ? school.board : [school.board];
          criteria.push({ label: 'Board', matched: boardsForSchool.includes(board) });
        }
        if (area) criteria.push({ label: 'Area', matched: school.location?.area === area });
        if (grade !== 'all') criteria.push({ label: 'Grade stage', matched: coversGrade(school, grade) });
        if (budget !== 'all') criteria.push({ label: 'Annual fee band', matched: budgetMatch(school, budget) });
        if (admission !== 'all') criteria.push({ label: 'Admission status', matched: admissionMatch(school, admission) });
        if (query) {
          const q = query.toLowerCase().trim();
          criteria.push({
            label: 'Search',
            matched:
              school.name.toLowerCase().includes(q) ||
              (school.location?.area || '').toLowerCase().includes(q) ||
              (school.location?.sector || '').toLowerCase().includes(q),
          });
        }

        const matchedCount = criteria.filter(item => item.matched).length;
        const selectedCount = criteria.length;
        return { school, criteria, matchedCount, selectedCount };
      })
      .filter(item => item.selectedCount === 0 || item.matchedCount > 0)
      .sort((a, b) => b.matchedCount - a.matchedCount || a.school.name.localeCompare(b.school.name));
  }, [schools, board, area, grade, budget, admission, query]);

  const selectedCount = [Boolean(board), Boolean(area), grade !== 'all', budget !== 'all', admission !== 'all', Boolean(query)].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-warm-xs">
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-[0.16em] px-3 py-1">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Transparent School Match
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">Match schools using your actual preferences.</h1>
        <p className="text-sm text-slate-600 mt-3 max-w-3xl leading-relaxed">
          No opaque AI score. Every match is based only on the preferences you select, and the criteria behind the result remain visible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-7">
          <label className="text-xs font-bold text-slate-700">School / locality search
            <input value={query} onChange={e => setQuery(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm" placeholder="DPS, Techzone 4…" />
          </label>
          <label className="text-xs font-bold text-slate-700">Board
            <select value={board} onChange={e => setBoard(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"><option value="">Any board</option>{boards.map(item => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          <label className="text-xs font-bold text-slate-700">Area
            <select value={area} onChange={e => setArea(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"><option value="">Any area</option>{areas.map(item => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          <label className="text-xs font-bold text-slate-700">Grade stage
            <select value={grade} onChange={e => setGrade(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"><option value="all">Any grade</option><option value="nursery">Pre-primary / Nursery</option><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="senior">Senior secondary</option></select>
          </label>
          <label className="text-xs font-bold text-slate-700">Annual fee band
            <select value={budget} onChange={e => setBudget(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"><option value="all">Any fee band</option><option value="under-120">Up to ₹1.2 lakh</option><option value="120-180">₹1.2–1.8 lakh</option><option value="180-250">₹1.8–2.5 lakh</option><option value="above-250">Above ₹2.5 lakh</option></select>
          </label>
          <label className="text-xs font-bold text-slate-700">Admission status
            <select value={admission} onChange={e => setAdmission(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"><option value="all">Any status</option><option value="open">Open / active</option><option value="upcoming">Upcoming / pending</option></select>
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-xs text-slate-500">{selectedCount ? 'Showing schools that satisfy at least one selected preference. Exact matched criteria are shown per school.' : 'Choose preferences above to make the match more meaningful.'}</div>
        {result.map(item => (
          <article key={item.school.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-warm-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">{item.school.name}</h2>
                  <DataTrustBadge school={item.school} compact />
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.school.location.area || item.school.location.sector} · {(Array.isArray(item.school.board) ? item.school.board : [item.school.board]).filter(Boolean).join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 px-2.5 py-1 text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> Matches {item.matchedCount}{selectedCount ? ' / ' + selectedCount : ''}</span>
                <Link href={'/schools/' + item.school.slug}><Button variant="outline" size="sm">Open profile <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
              </div>
            </div>
            {item.criteria.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.criteria.map(criterion => (
                  <span key={criterion.label} className={criterion.matched ? 'inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100' : 'inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200'}>
                    {criterion.label}: {criterion.matched ? 'matches' : 'does not match'}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
};
