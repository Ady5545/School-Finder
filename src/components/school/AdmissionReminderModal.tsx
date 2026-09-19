'use client';

import React, { useState } from 'react';
import { Bell, Calendar, Check, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ReminderTiming } from '../../lib/authStore';

interface AdmissionReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  schoolName: string;
  milestoneId: string;
  milestoneLabel: string;
  targetDate: string;
  onReminderCreated?: () => void;
  isAuthenticated?: boolean;
}

export const AdmissionReminderModal: React.FC<AdmissionReminderModalProps> = ({
  isOpen,
  onClose,
  schoolSlug,
  schoolName,
  milestoneId,
  milestoneLabel,
  targetDate,
  onReminderCreated,
  isAuthenticated = true,
}) => {
  const [selectedTiming, setSelectedTiming] = useState<ReminderTiming>('3_days_before');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const timingOptions: { id: ReminderTiming; label: string; desc: string }[] = [
    {
      id: '7_days_before',
      label: '7 Days Before',
      desc: 'Ideal for gathering birth certificates, residence proof & documents.',
    },
    {
      id: '3_days_before',
      label: '3 Days Before (Recommended)',
      desc: 'Ensures ample time to complete official online registration.',
    },
    {
      id: '1_day_before',
      label: '1 Day Before',
      desc: 'Last chance alert before admissions window closes.',
    },
    {
      id: 'on_date',
      label: 'On the Exact Date',
      desc: 'Instant notification on the day of milestone.',
    },
  ];

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setErrorMsg('Please sign in or register a free parent account to set admission reminders.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug,
          milestoneId,
          milestoneLabel,
          targetDate,
          timing: selectedTiming,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('✓ Admission reminder set successfully! We will send an email alert to your registered address.');
        if (onReminderCreated) onReminderCreated();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1800);
      } else {
        setErrorMsg(data.message || 'Could not save reminder. Please try again.');
      }
    } catch {
      setErrorMsg('Network error while saving reminder. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = (() => {
    try {
      const d = new Date(targetDate);
      if (isNaN(d.getTime())) return targetDate;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return targetDate;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#0f2d4a] text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                Set Admission Reminder
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {schoolName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Target Milestone Summary */}
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-stone-200/90 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Target Milestone
              </span>
              <p className="text-sm font-bold text-[#0f172a]">{milestoneLabel}</p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Verified Date
              </span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1 justify-end">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </p>
            </div>
          </div>

          {/* Timing Selection Options */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
              When would you like to be notified?
            </label>
            <div className="space-y-2.5">
              {timingOptions.map(opt => {
                const isSelected = selectedTiming === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTiming(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${isSelected ? 'text-[#0f2d4a]' : 'text-slate-800'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sent strictly to your verified parent email
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-white border-slate-300 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="text-white font-bold"
            leftIcon={<Bell className="w-3.5 h-3.5" />}
          >
            Set Reminder
          </Button>
        </div>
      </div>
    </div>
  );
};
