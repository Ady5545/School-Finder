'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, Mail, MapPin, Phone, School as SchoolIcon, ShieldCheck, Sparkles, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import type { School } from '../../types/school';

const FIRST_VISIT_KEY = 'admission_pitara_admission_drawer_seen_v1';

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

export const AdmissionWelcomeDrawer: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolSlug, setSchoolSlug] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [residentialSociety, setResidentialSociety] = useState('');
  const [consent, setConsent] = useState(true);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedSchool = useMemo(
    () => schools.find(school => school.slug === schoolSlug) || null,
    [schools, schoolSlug]
  );

  const isOpenStatus = useMemo(() => {
    const status = (selectedSchool?.admissions?.status || '').toLowerCase();
    return status.includes('open') || status.includes('ongoing') || status.includes('active');
  }, [selectedSchool]);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    try {
      if (window.localStorage.getItem(FIRST_VISIT_KEY) === '1') return;
      window.localStorage.setItem(FIRST_VISIT_KEY, '1');
    } catch {
      // Continue without persistence if storage is unavailable.
    }

    const timer = window.setTimeout(() => setIsOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen || schools.length > 0) return;

    let cancelled = false;
    setIsLoadingSchools(true);

    fetch('/api/schools?_ts=' + Date.now(), { cache: 'no-store' })
      .then(response => response.json())
      .then(data => {
        if (!cancelled && data?.success && Array.isArray(data.schools)) {
          setSchools(data.schools);
        }
      })
      .catch(() => {
        if (!cancelled) setErrorMessage('We could not load the school list right now. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSchools(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, schools.length]);

  const resetAndClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setErrorMessage('');
    setDeliveryNote('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (!selectedSchool) {
      setErrorMessage('Please choose the school you want to contact.');
      return;
    }

    if (!parentName.trim() || !email.trim() || !phone.trim() || !childGrade) {
      setErrorMessage('Please fill in your name, email, phone number and your child’s target class.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!consent) {
      setErrorMessage('Please confirm your consent before sending the request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: selectedSchool.slug,
          schoolName: selectedSchool.name,
          formType: isOpenStatus ? 'admission_registration' : 'admission_preregistration',
          academicSession: selectedSchool.admissions?.session || '2027–28',
          parentName: parentName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          childGrade,
          residentialSociety: residentialSociety.trim() || undefined,
          consent: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message || 'We could not send your admission request. Please try again.');
        return;
      }

      setDeliveryNote(data.deliveryNote || 'Your request has been received by Admission Pitara and the school follow-up is being handled by our team.');
      setIsSuccess(true);
    } catch {
      setErrorMessage('Network error while sending your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={resetAndClose}
      side="right"
      title="Admission Request"
      className="w-[min(96vw,44rem)] bg-white p-0 rounded-l-3xl"
    >
      {isSuccess ? (
        <div className="min-h-full px-5 py-6 sm:px-8 sm:py-8">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#eff6ff_100%)] p-6 sm:p-8">
            <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-emerald-200/35 blur-2xl" />
            <div className="absolute -left-10 bottom-0 w-28 h-28 rounded-full bg-sky-200/30 blur-2xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Request received
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                We’ve got it from here.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Your {isOpenStatus ? 'admission request' : 'pre-registration request'} for <strong>{selectedSchool?.name}</strong> has reached Admission Pitara.
              </p>
              <div className="mt-5 w-full rounded-2xl border border-white/90 bg-white/80 p-4 text-left shadow-sm">
                <p className="text-xs font-extrabold text-slate-900">School follow-up</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{deliveryNote}</p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={resetAndClose}
                className="mt-6 w-full sm:w-auto px-8 font-extrabold text-white"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 pb-7 sm:px-7 sm:pb-8">
          <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0f2d4a_0%,#173f62_50%,#244f70_100%)] px-5 py-6 sm:px-7 sm:py-7 text-white">
            <div className="absolute -right-16 -top-20 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-orange-300/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-sky-100">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Admission Pitara
              </div>
              <h2 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Need help getting started with an admission?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-50/85 max-w-2xl">
                Choose a school, tell us what you’re looking for, and send your request. Admission Pitara receives it first and coordinates the school follow-up.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5">
                  <SchoolIcon className="w-4 h-4 text-amber-300" />
                  <p className="mt-1 text-[11px] font-bold">Pick the school</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <p className="mt-1 text-[11px] font-bold">We receive it</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5">
                  <ArrowRight className="w-4 h-4 text-sky-200" />
                  <p className="mt-1 text-[11px] font-bold">We follow up</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              Your request is handled by Admission Pitara
            </div>
            <p className="mt-1 leading-relaxed text-[11px] text-amber-900/85">
              We receive your details at the Admission Pitara enquiry desk and follow up with the school directly on your behalf.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">School <span className="text-rose-500">*</span></label>
              <div className="relative">
                <SchoolIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <select
                  required
                  value={schoolSlug}
                  onChange={event => setSchoolSlug(event.target.value)}
                  disabled={isLoadingSchools || schools.length === 0}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-9 pr-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:bg-slate-50"
                >
                  <option value="">{isLoadingSchools ? 'Loading schools…' : 'Choose a school'}</option>
                  {schools.map(school => (
                    <option key={school.slug} value={school.slug}>{school.name}</option>
                  ))}
                </select>
              </div>
              {selectedSchool && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedSchool.location?.area || selectedSchool.location?.sector || 'Greater Noida West'}
                  <span className="text-slate-300">•</span>
                  <span className={isOpenStatus ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {selectedSchool.admissions?.status || 'Status available'}
                  </span>
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-800">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs font-extrabold text-slate-700">
                Parent / Guardian name <span className="text-rose-500">*</span>
                <div className="relative mt-1.5">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input required value={parentName} onChange={event => setParentName(event.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-slate-200 pl-9 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10" />
                </div>
              </label>

              <label className="text-xs font-extrabold text-slate-700">
                Email <span className="text-rose-500">*</span>
                <div className="relative mt-1.5">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-200 pl-9 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10" />
                </div>
              </label>

              <label className="text-xs font-extrabold text-slate-700">
                Mobile number <span className="text-rose-500">*</span>
                <div className="relative mt-1.5">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input required type="tel" inputMode="numeric" value={phone} onChange={event => setPhone(event.target.value)} placeholder="10-digit mobile" maxLength={15} className="w-full rounded-2xl border border-slate-200 pl-9 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10" />
                </div>
              </label>

              <label className="text-xs font-extrabold text-slate-700">
                Child’s target class <span className="text-rose-500">*</span>
                <div className="relative mt-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <select required value={childGrade} onChange={event => setChildGrade(event.target.value)} className="w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-9 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10">
                    <option value="">Select class</option>
                    {GRADE_OPTIONS.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                  </select>
                </div>
              </label>
            </div>

            <label className="text-xs font-extrabold text-slate-700">
              Society / Sector <span className="font-medium text-slate-400">(optional)</span>
              <div className="relative mt-1.5">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input value={residentialSociety} onChange={event => setResidentialSociety(event.target.value)} placeholder="e.g. Gaur City 2, Techzone 4" className="w-full rounded-2xl border border-slate-200 pl-9 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10" />
              </div>
            </label>

            <label className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[11px] leading-relaxed text-slate-600 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              <span>I consent to receive admission updates and to have Admission Pitara use these details to communicate with the selected school and coordinate the follow-up.</span>
            </label>

            <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                {selectedSchool
                  ? 'Target session: ' + (selectedSchool.admissions?.session || '2027–28')
                  : 'Choose your school to continue.'}
              </p>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || isLoadingSchools || !selectedSchool}
                className="w-full sm:w-auto min-w-48 font-extrabold text-white"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting
                  ? 'Sending request…'
                  : isOpenStatus
                    ? 'Send Admission Request'
                    : 'Send Pre-registration'}
              </Button>
            </div>
          </form>

          <div className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
            <span>Admission Pitara routes the request using the selected school’s verified contact details where available and keeps the request tied to that school.</span>
          </div>
        </div>
      )}
    </Drawer>
  );
};
