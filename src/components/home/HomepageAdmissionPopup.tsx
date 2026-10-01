'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { School } from '../../types/school';

const SHOW_DELAY = 2000;
const SHOWN_KEY = 'admission_pitara_admission_popup_shown';

const GRADE_OPTIONS = [
  'Nursery / Pre-School',
  'LKG / KG-1',
  'UKG / KG-2',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export const HomepageAdmissionPopup: React.FC<{ schools: School[] }> = ({ schools }) => {
  const [visible, setVisible] = useState(false);
  const [schoolSlug, setSchoolSlug] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (window.localStorage.getItem(SHOWN_KEY) === '1') return;
    } catch {}

    timer = setTimeout(() => {
      try {
        window.localStorage.setItem(SHOWN_KEY, '1');
      } catch {}
      setVisible(true);
    }, SHOW_DELAY);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const selectedSchool = useMemo(
    () => schools.find((school) => school.slug === schoolSlug),
    [schools, schoolSlug],
  );

  const close = () => setVisible(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSchool) {
      setError('Please choose a school.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setError('');

    const status = (selectedSchool.admissions?.status || '').toLowerCase();
    const isOpen =
      status.includes('open') ||
      status.includes('ongoing') ||
      status.includes('active');

    try {
      const response = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: selectedSchool.slug,
          schoolName: selectedSchool.name,
          formType: isOpen ? 'admission_registration' : 'admission_preregistration',
          academicSession: selectedSchool.admissions?.session || '2027–28',
          parentName: parentName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          childGrade,
          consent: true,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'We could not submit your request. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admission registration"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-[3px]"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close admission registration"
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="px-6 py-9 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-900">Request received</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Your admission request has reached Admission Pitara. We&apos;ll follow up from here.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white"
            >
              Continue exploring
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="pr-8">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Admission Pitara
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                Looking for admission?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Leave your details once and we&apos;ll help with the next step.
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-4 space-y-3">
              <select
                required
                value={schoolSlug}
                onChange={(event) => setSchoolSlug(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">Choose a school</option>
                {schools.map((school) => (
                  <option key={school.slug} value={school.slug}>
                    {school.name}
                  </option>
                ))}
              </select>

              <input
                required
                value={parentName}
                onChange={(event) => setParentName(event.target.value)}
                placeholder="Parent / guardian name"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile number"
                  className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <select
                required
                value={childGrade}
                onChange={(event) => setChildGrade(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">Child&apos;s target class</option>
                {GRADE_OPTIONS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Register admission interest'}
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
              Your details are sent to Admission Pitara for admission follow-up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
