'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Building, User, Mail, Phone, GraduationCap, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

interface AdmissionRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  mode?: 'register' | 'preregister';
}

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

export const AdmissionRegisterModal: React.FC<AdmissionRegisterModalProps> = ({
  isOpen,
  onClose,
  school,
  mode: propMode,
}) => {
  const rawStatus = school.admissions?.status || '';
  const statusLower = rawStatus.toLowerCase();
  const isOpenStatus = statusLower.includes('open') || statusLower.includes('ongoing') || statusLower.includes('active');

  const mode = propMode || (isOpenStatus ? 'register' : 'preregister');
  const isPreReg = mode === 'preregister';

  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [residentialSociety, setResidentialSociety] = useState('');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!parentName.trim() || !email.trim() || !phone.trim() || !childGrade) {
      setErrorMessage('Please fill in all required fields (Parent Name, Email, Phone, and Child Grade).');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!consent) {
      setErrorMessage('Please confirm your consent to receive admission updates.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: school.slug,
          schoolName: school.name,
          formType: isPreReg ? 'admission_preregistration' : 'admission_registration',
          academicSession: school.admissions?.session || '2027–28',
          parentName: parentName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          childGrade,
          residentialSociety: residentialSociety.trim() || undefined,
          consent: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data.message || 'Failed to submit registration. Please try again.');
      }
    } catch {
      setErrorMessage('Network error occurred. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative overflow-hidden max-h-[90vh] flex flex-col animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admission-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Confirmation State */
          <div className="py-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 id="admission-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isPreReg ? 'Pre-Registration Confirmed' : 'Registration Received'}
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
              <p className="font-semibold text-slate-900">
                {isPreReg
                  ? `Thank you for pre-registering interest for ${school.name} (Academic Session 2027–28).`
                  : `Your interest registration for ${school.name} has been successfully recorded.`}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {isPreReg
                  ? "Admission Pitara will notify you by email as soon as official 2027–28 admission dates, interaction schedules, and criteria are published."
                  : "Our team will assist you with admission timeline updates, criteria guidance, and process details."}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                <strong>Important Notice:</strong> This is an Admission Pitara parent guidance service. Official admission formalities, campus interactions, and final enrollment decisions are managed directly by the school.
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleModalClose}
              className="w-full font-bold mt-2"
            >
              Done
            </Button>
          </div>
        ) : (
          /* Registration Form */
          <div className="overflow-y-auto pr-1 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admission Pitara Parent Guidance</span>
              </div>
              <h2 id="admission-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isPreReg ? 'Pre-register for 2027–28' : 'Register on Admission Pitara'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Target Institution: <span className="font-bold text-slate-800">{school.name}</span>
              </p>
            </div>

            {/* Scope / Transparency Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11.5px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Parent Advisory Notice</span>
              </div>
              <p className="leading-relaxed">
                {isPreReg
                  ? "Register your interest with Admission Pitara and we'll contact you when relevant 2027–28 admission information becomes available."
                  : "Register your interest with Admission Pitara and we'll help you connect with the school and navigate the admission process."}
              </p>
              <p className="text-[10.5px] text-amber-800/90 font-medium">
                * Note: This is an Admission Pitara registration for updates and guidance, not the school&apos;s official admission application.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Parent Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent / Guardian Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Child's Grade & Society Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Child&apos;s Target Grade <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      required
                      value={childGrade}
                      onChange={e => setChildGrade(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-slate-900 bg-white"
                    >
                      <option value="">Select Grade</option>
                      {GRADE_OPTIONS.map(g => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Society / Sector (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={residentialSociety}
                      onChange={e => setResidentialSociety(e.target.value)}
                      placeholder="e.g. Gaur City 2, Eco Village"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Session Tag */}
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-semibold">Target Academic Session:</span>
                <span className="font-bold text-[var(--color-primary)] font-mono">
                  {school.admissions?.session || '2027–28'}
                </span>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span>
                  I consent to receive admission updates, dates, and guidance from Admission Pitara for {school.name}.
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full font-bold shadow-warm-xs"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : isPreReg
                      ? 'Submit Pre-Registration for 2027–28'
                      : 'Register on Admission Pitara'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
