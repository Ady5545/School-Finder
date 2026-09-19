'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, Clock, ArrowRight, Mail, Check, X, Bookmark, Sparkles } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useSchoolStore } from '../../lib/schoolStore';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { checkShortlistDeadlines, dismissAlert, getDismissedAlertIds, type AdmissionDeadlineAlert } from '../../lib/notifications';
import { cn } from '../../lib/utils';

export const NotificationCenter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { shortlist } = useSchoolStore();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync dismissed IDs
  useEffect(() => {
    setDismissed(getDismissedAlertIds());
  }, [isOpen]);

  // Close when clicked outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Compute urgent alerts for shortlisted schools
  const { allAlerts, urgentAlerts } = useMemo(() => {
    if (!isAuthenticated || !shortlist.length) {
      return { allAlerts: [], urgentAlerts: [] };
    }
    return checkShortlistDeadlines(shortlist);
  }, [isAuthenticated, shortlist]);

  // Filter out dismissed alerts for badge count
  const activeUrgentAlerts = useMemo(() => {
    return urgentAlerts.filter(a => !dismissed.includes(a.slug));
  }, [urgentAlerts, dismissed]);

  // Don't render notification bell if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    dismissAlert(slug);
    setDismissed(prev => [...prev, slug]);
  };

  const handleSendEmailAlert = async () => {
    if (!user.email) {
      showToast('No email address registered for your account.', 'error');
      return;
    }
    if (urgentAlerts.length === 0) {
      showToast('No upcoming deadlines within 7 days to alert.', 'info');
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/notifications/admission-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          parentName: user.name,
          shortlist,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(
          data.devMode
            ? `Admission alert preview logged for ${user.email}`
            : `Admission alert email sent to ${user.email}!`,
          'success'
        );
      } else {
        showToast(data.error || 'Failed to dispatch email alert.', 'error');
      }
    } catch {
      showToast('Network error while requesting email alert.', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Admission Notifications (${activeUrgentAlerts.length} urgent)`}
        className={cn(
          'relative p-2 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center',
          isOpen
            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] ring-2 ring-[var(--color-brand-200)]'
            : activeUrgentAlerts.length > 0
            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-brand-100)] border border-[var(--color-brand-200)] shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        )}
      >
        <Bell className={cn('w-4 h-4', activeUrgentAlerts.length > 0 && 'animate-pulse text-[var(--color-primary)]')} />
        
        {/* Urgent Badge */}
        {activeUrgentAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
            {activeUrgentAlerts.length}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2.5 w-[330px] sm:w-[380px] bg-white rounded-2xl border border-[var(--color-border-strong)] shadow-warm-xl z-50 overflow-hidden text-left animate-in fade-in-50 zoom-in-95 duration-150 divide-y divide-[var(--color-border-subtle)]">
          {/* Header */}
          <div className="p-4 bg-[var(--color-surface-muted)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[var(--color-content)] uppercase tracking-wider">
                  Admission Deadline Alerts
                </h3>
                <p className="text-[11px] text-[var(--color-content-muted)]">
                  Shortlisted schools closing within 7 days
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
            {shortlist.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-[var(--color-content)]">Your shortlist is empty</p>
                <p className="text-[11px] text-[var(--color-content-muted)]">
                  Save schools in Greater Noida West to track their 7-day admission deadlines automatically.
                </p>
                <Link href="/schools" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" className="mt-2 text-xs">
                    Browse Schools
                  </Button>
                </Link>
              </div>
            ) : urgentAlerts.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-emerald-800">All Shortlisted Deadlines are on Track</p>
                <p className="text-[11px] text-[var(--color-content-muted)]">
                  None of your {shortlist.length} saved schools have admission cutoffs in the next 7 days.
                </p>
              </div>
            ) : (
              urgentAlerts.map(alert => {
                const isDismissed = dismissed.includes(alert.slug);
                return (
                  <div
                    key={alert.slug}
                    className={cn(
                      'p-4 transition-colors relative flex flex-col gap-2',
                      isDismissed ? 'bg-slate-50 opacity-60' : 'bg-white hover:bg-amber-50/40'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[var(--color-content)] leading-tight">
                          {alert.schoolName}
                        </span>
                        <span className="text-[11px] text-[var(--color-content-muted)] mt-0.5">
                          {alert.area} • {alert.verifiedFee ? `Audited Fee: ₹${alert.verifiedFee.toLocaleString('en-IN')}/yr` : 'Verified Admissions'}
                        </span>
                      </div>

                      {/* Days remaining badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black shrink-0">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {alert.daysRemaining <= 0 ? 'Closes Today!' : `${alert.daysRemaining}d left`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500 font-medium">
                        Cutoff: <strong>{alert.formattedDeadline}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        {!isDismissed && (
                          <button
                            type="button"
                            onClick={e => handleDismiss(e, alert.slug)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                          >
                            Dismiss
                          </button>
                        )}
                        <Link
                          href={`/schools/${alert.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Email Alert Action */}
          {urgentAlerts.length > 0 && (
            <div className="p-3 bg-[var(--color-surface-muted)] flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-medium truncate">
                Alerts to: <strong className="text-slate-700">{user.email}</strong>
              </span>
              <Button
                size="sm"
                variant="accent"
                onClick={handleSendEmailAlert}
                disabled={isSendingEmail}
                leftIcon={<Mail className="w-3 h-3" />}
                className="text-xs font-bold py-1 px-3 shrink-0"
              >
                {isSendingEmail ? 'Sending...' : 'Email Alerts'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
