'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Bell, ShieldCheck, CheckCircle2, Clock, ExternalLink, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { AdmissionReminderModal } from './AdmissionReminderModal';
import type { School, AdmissionMilestone } from '@data/schoolsData';

interface SchoolAdmissionsSectionProps {
  school: School;
}

export const SchoolAdmissionsSection: React.FC<SchoolAdmissionsSectionProps> = ({ school }) => {
  const [activeModalMilestone, setActiveModalMilestone] = useState<AdmissionMilestone | null>(null);
  const [userReminders, setUserReminders] = useState<Record<string, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const milestones = school.admissions?.milestones || [];
  const hasVerifiedMilestones = milestones.length > 0;

  useEffect(() => {
    async function checkAuthAndReminders() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            // Fetch existing user reminders
            const remRes = await fetch('/api/auth/reminders');
            if (remRes.ok) {
              const remData = await remRes.json();
              if (remData.success && Array.isArray(remData.reminders)) {
                const map: Record<string, boolean> = {};
                remData.reminders.forEach((r: { schoolSlug: string; milestoneId: string; status: string }) => {
                  if (r.schoolSlug === school.slug && r.status === 'active') {
                    map[r.milestoneId] = true;
                  }
                });
                setUserReminders(map);
              }
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    checkAuthAndReminders();
  }, [school.slug]);

  const handleReminderCreated = () => {
    if (activeModalMilestone) {
      setUserReminders(prev => ({ ...prev, [activeModalMilestone.id]: true }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="bg-white p-6 sm:p-7 rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Official Schedule &amp; Process
          </span>
          <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
            Admissions &amp; Registration Timelines
          </h2>
        </div>

        {school.admissions?.sourceUrl && (
          <a
            href={school.admissions.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2d4a] hover:text-[var(--color-primary)] bg-slate-50 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Admission Session & Process Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#faf8f5] border border-stone-200/90 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Academic Session
          </span>
          <p className="text-sm font-bold text-[#0f172a]">
            {school.admissions?.session || '2026–2027'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#faf8f5] border border-stone-200/90 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Current Status
          </span>
          <p className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{school.admissions?.status || 'Admissions Active'}</span>
          </p>
        </div>
      </div>

      {/* Procedure Text */}
      {school.admissions?.process && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            Admission Procedure
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
            {school.admissions.process}
          </p>
        </div>
      )}

      {/* Verified Milestones & Reminders */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Verified Timeline Milestones</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Automated Parent Email Reminders
          </span>
        </div>

        {hasVerifiedMilestones ? (
          <div className="space-y-3">
            {milestones.map((m: AdmissionMilestone) => {
              const isSet = Boolean(userReminders[m.id]);
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0f172a]">{m.label}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Date
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(m.date)}
                      </span>
                      {m.notes && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{m.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant={isSet ? 'outline' : 'accent'}
                    size="sm"
                    onClick={() => setActiveModalMilestone(m)}
                    className={
                      isSet
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shrink-0 text-xs font-bold'
                        : 'text-white font-bold shrink-0 text-xs shadow-warm-xs'
                    }
                    leftIcon={isSet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Bell className="w-3.5 h-3.5" />}
                  >
                    {isSet ? 'Reminder Active' : 'Remind Me'}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">2027–2028 Specific Schedule Pending Official Release</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Specific deadline dates for this school are awaiting official publication. Admission Pitara strictly presents verified institutional data and does not construct estimated timelines. Check back or visit the school&apos;s official portal above.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {activeModalMilestone && (
        <AdmissionReminderModal
          isOpen={Boolean(activeModalMilestone)}
          onClose={() => setActiveModalMilestone(null)}
          schoolSlug={school.slug}
          schoolName={school.name}
          milestoneId={activeModalMilestone.id}
          milestoneLabel={activeModalMilestone.label}
          targetDate={activeModalMilestone.date}
          onReminderCreated={handleReminderCreated}
          isAuthenticated={isAuthenticated}
        />
      )}
    </section>
  );
};
