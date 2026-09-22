'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Bell, CheckCircle2 } from 'lucide-react';
import { getAllSchools } from '../../lib/schools';
import { cn } from '../../lib/utils';

export const AdmissionInterestForm: React.FC = () => {
  const schools = getAllSchools();
  const [schoolSlug, setSchoolSlug] = useState('');
  const [mode, setMode] = useState<'register' | 'pre_register'>('pre_register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [sent, setSent] = useState(false);

  const selected = useMemo(() => schools.find(s => s.slug === schoolSlug), [schools, schoolSlug]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !name.trim() || !email.trim()) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: selected.slug,
          schoolName: selected.name,
          formType: mode === 'register' ? 'admission_registration' : 'admission_preregistration',
          academicSession: selected.admissions?.session || '2027–28',
          parentName: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          childGrade: childGrade || 'Not provided',
          consent: true,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'We could not submit your request. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      setErrorMessage('Network error while submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white shadow-warm-sm overflow-hidden">
      <div className="p-6 sm:p-8 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_55%,#f4f8fb_100%)] border-b border-[var(--color-border)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">One place for parent interest</p>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">Register interest for 2027–28</h2>
            <p className="text-sm text-[var(--color-content-muted)] mt-1 max-w-2xl">
              Tell us which school you are interested in and give us the details we need. We will receive your request, follow it up with the school, and help move your admission interest forward.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" onClick={() => setMode('register')} className={cn('p-4 rounded-2xl border text-left transition-all', mode === 'register' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50')}>
            <span className="font-black text-sm text-slate-900">Registration interest</span>
            <span className="block text-xs text-slate-600 mt-1">For schools currently showing an open / registration status.</span>
          </button>
          <button type="button" onClick={() => setMode('pre_register')} className={cn('p-4 rounded-2xl border text-left transition-all', mode === 'pre_register' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50')}>
            <span className="font-black text-sm text-slate-900">Pre-register</span>
            <span className="block text-xs text-slate-600 mt-1">For schools whose formal 2027–28 window has not opened yet.</span>
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">School</label>
          <select required value={schoolSlug} onChange={e => setSchoolSlug(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white">
            <option value="">Choose a school</option>
            {schools.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
          {selected && <p className="text-[11px] text-slate-500 mt-1.5">Current directory status: <strong>{selected.admissions.status}</strong></p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-slate-700">Parent name<input required value={name} onChange={e => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Your name" /></label>
          <label className="text-xs font-bold text-slate-700">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="you@example.com" /></label>
          <label className="text-xs font-bold text-slate-700">Phone<input required value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="10-digit mobile number" /></label>
          <label className="text-xs font-bold text-slate-700">Child's class<input required value={childGrade} onChange={e => setChildGrade(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="e.g. Grade 3" /></label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-500 max-w-xl">Your details are sent directly to Admission Pitara. We receive your request and will follow up with the school on your behalf.</p>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-black hover:-translate-y-0.5 transition-all shadow-sm">
            {submitting ? 'Sending...' : mode === 'register' ? 'Send registration interest' : 'Send pre-registration'} <ArrowRight className="w-3.5 h-3.5" /></button>
        </div>

        {sent && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Your request has been received by Admission Pitara. We’ll take it from here and follow up with the school.</div>}
      </form>
    </section>
  );
};
