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

  const admissionAction = useMemo(() => {
    const status = (selectedSchool?.admissions?.status || '').toLowerCase();
    const isOpen =
      status.includes('open') ||
      status.includes('ongoing') ||
      status.includes('active');

    return {
      isOpen,
      label: isOpen ? 'Registration open' : 'Pre-registration',
      button: isOpen ? 'Send registration request' : 'Pre-register now',
    };
  }, [selectedSchool]);

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
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/90 bg-[#f5f6f7] shadow-[18px_18px_42px_rgba(15,23,42,0.16),-14px_-14px_34px_rgba(255,255,255,0.95)]">
        <button
          type="button"
          onClick={close}
          aria-label="Close admission registration"
          className="absolute right-4 top-4 z-10 rounded-full border border-white/90 bg-[#f5f6f7] p-2 text-slate-400 shadow-[4px_4px_10px_rgba(15,23,42,0.10),-3px_-3px_8px_rgba(255,255,255,0.95)] transition hover:text-slate-700 hover:shadow-[inset_3px_3px_7px_rgba(15,23,42,0.10),inset_-3px_-3px_7px_rgba(255,255,255,0.95)]"
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
                className="w-full rounded-2xl border border-white/90 bg-[#f5f6f7] px-3 py-2.5 text-sm text-slate-900 outline-none shadow-[inset_4px_4px_9px_rgba(15,23,42,0.09),inset_-4px_-4px_9px_rgba(255,255,255,0.95)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
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
                className="w-full rounded-2xl border border-white/90 bg-[#f5f6f7] px-3 py-2.5 text-sm text-slate-900 outline-none shadow-[inset_4px_4px_9px_rgba(15,23,42,0.09),inset_-4px_-4px_9px_rgba(255,255,255,0.95)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                <option value="">Child&apos;s target class</option>
                {GRADE_OPTIONS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>

              {selectedSchool && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/90 bg-[#f5f6f7] px-3.5 py-3 shadow-[6px_6px_13px_rgba(15,23,42,0.09),-6px_-6px_13px_rgba(255,255,255,0.95)]">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Admission status</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">{selectedSchool.admissions?.status || 'Status being checked'}</p>
                  </div>
                  <span className={admissionAction.isOpen ? 'rounded-xl bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-800 shadow-[inset_2px_2px_5px_rgba(15,23,42,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]' : 'rounded-xl bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-900 shadow-[inset_2px_2px_5px_rgba(15,23,42,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]'}>
                    {admissionAction.label}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !selectedSchool}
                className="w-full rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-black text-white shadow-[7px_7px_14px_rgba(15,23,42,0.16),-4px_-4px_10px_rgba(255,255,255,0.45)] transition hover:-translate-y-0.5 hover:shadow-[9px_9px_17px_rgba(15,23,42,0.18),-5px_-5px_11px_rgba(255,255,255,0.48)] active:translate-y-0 active:shadow-[inset_4px_4px_9px_rgba(0,0,0,0.18),inset_-3px_-3px_7px_rgba(255,255,255,0.20)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Sending…' : selectedSchool ? admissionAction.button : 'Choose a school first'}
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
              Choose the school first. Admission Pitara automatically selects registration or pre-registration from its current admission status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
