'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Calendar, Trash2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Power } from 'lucide-react';
import { Button } from '../ui/Button';
import type { AdmissionReminder } from '../../lib/authStore';

export const ParentRemindersCard: React.FC = () => {
  const [reminders, setReminders] = useState<AdmissionReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadReminders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reminders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reminders)) {
          setReminders(data.reminders);
        }
      }
    } catch (err) {
      console.error('Failed to load parent reminders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'disabled') => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch('/api/auth/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderId: id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminders(prev =>
          prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setActionMessage({
          type: 'success',
          text: `Reminder ${newStatus === 'active' ? 'activated' : 'paused'}.`,
        });
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to update status.' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network error updating reminder.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/auth/reminders?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminders(prev => prev.filter(r => r.id !== id));
        setActionMessage({ type: 'success', text: 'Reminder removed.' });
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to delete reminder.' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network error deleting reminder.' });
    }
  };

  const formatTimingText = (timing: string) => {
    switch (timing) {
      case '7_days_before':
        return '7 Days Before';
      case '3_days_before':
        return '3 Days Before';
      case '1_day_before':
        return '1 Day Before';
      case 'on_date':
        return 'On the Date';
      default:
        return timing;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">
              Admission Reminders &amp; Alerts
            </h2>
            <p className="text-xs text-slate-500">
              Verified milestone dates and deadline notifications sent to your email.
            </p>
          </div>
        </div>

        <Link href="/schools">
          <Button variant="outline" size="sm" className="text-xs font-bold bg-white border-slate-300" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Explore School Deadlines
          </Button>
        </Link>
      </div>

      {actionMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
          Loading admission reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-[#faf8f5] border border-stone-200/80 space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-5 h-5" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-[#0f172a]">No Admission Reminders Set</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              When viewing school admission schedules, click <strong>Remind Me</strong> on any verified deadline date to receive automated email notifications.
            </p>
          </div>
          <Link href="/schools" className="inline-block pt-2">
            <Button variant="accent" size="sm" className="text-white text-xs font-bold">
              Browse Verified Directory
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map(rem => (
            <div
              key={rem.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                rem.status === 'active'
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/schools/${rem.schoolSlug}`}
                    className="text-sm font-bold text-[#0f172a] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {rem.schoolName}
                  </Link>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                      rem.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {rem.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                  <span className="font-semibold text-slate-800">{rem.milestoneLabel}</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-700">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(rem.targetDate)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200">
                    Alert: {formatTimingText(rem.timing)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(rem.id, rem.status)}
                  className={`p-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    rem.status === 'active'
                      ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={rem.status === 'active' ? 'Pause Reminder' : 'Resume Reminder'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{rem.status === 'active' ? 'Pause' : 'Activate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(rem.id)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
