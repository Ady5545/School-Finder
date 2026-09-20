'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ClipboardList, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { getAllSchools } from '../../lib/schools';
import { APPLICATION_TRACKER_STATUSES, type ApplicationTrackerItem, type ApplicationTrackerStatus } from '../../lib/applicationTracker';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

const statusLabel = (value: ApplicationTrackerStatus) =>
  APPLICATION_TRACKER_STATUSES.find(item => item.value === value)?.label || value;

export const ApplicationTrackerView: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const schools = getAllSchools();
  const [items, setItems] = useState<ApplicationTrackerItem[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationTrackerStatus>('researching');
  const [notes, setNotes] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [busy, setBusy] = useState(false);

  const availableSchools = useMemo(
    () => schools.filter(school => !items.some(item => item.schoolSlug === school.slug)),
    [schools, items]
  );

  const load = async () => {
    const response = await fetch('/api/auth/applications');
    if (!response.ok) return;
    const data = await response.json();
    if (data.success && Array.isArray(data.applications)) setItems(data.applications);
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const addApplication = async () => {
    if (!selectedSchool) {
      showToast('Choose a school first.', 'error');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/auth/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolSlug: selectedSchool, status: selectedStatus, notes, applicationUrl, targetDate }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        showToast(data.message || 'Could not add school.', 'error');
        return;
      }
      setItems(data.applications || []);
      setSelectedSchool('');
      setSelectedStatus('researching');
      setNotes('');
      setApplicationUrl('');
      setTargetDate('');
      showToast('School added to your application tracker.', 'success');
    } catch {
      showToast('Network error while saving tracker.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<ApplicationTrackerItem>) => {
    try {
      const response = await fetch('/api/auth/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await response.json();
      if (response.ok && data.success) setItems(data.applications || []);
      else showToast(data.message || 'Could not update tracker.', 'error');
    } catch {
      showToast('Network error while updating tracker.', 'error');
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm('Remove this school from your application tracker?')) return;
    const response = await fetch('/api/auth/applications?id=' + encodeURIComponent(id), { method: 'DELETE' });
    const data = await response.json();
    if (response.ok && data.success) setItems(data.applications || []);
    else showToast(data.message || 'Could not remove tracker item.', 'error');
  };

  if (isLoading) return <div className="py-16 text-center text-sm text-slate-500">Loading your application tracker…</div>;

  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-7 text-center">
        <ClipboardList className="w-8 h-8 mx-auto text-sky-700" />
        <h1 className="text-xl font-extrabold text-slate-900 mt-3">Track your applications in one place</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">Save application progress, school-specific notes and target dates across visits.</p>
        <Link href="/auth/login" className="inline-flex mt-5"><Button variant="primary">Sign in to continue</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-warm-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center"><ClipboardList className="w-5 h-5" /></div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-700">Application Tracker</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">Move from researching to submitted</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">Track each school’s next step, your notes, the official application link and your target date.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 mt-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900"><Plus className="w-4 h-4" /> Add a school</div>
            <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
              <option value="">Choose a school…</option>
              {availableSchools.map(school => <option key={school.slug} value={school.slug}>{school.name}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as ApplicationTrackerStatus)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
                {APPLICATION_TRACKER_STATUSES.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
              <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" aria-label="Target date" />
            </div>
            <input value={applicationUrl} onChange={e => setApplicationUrl(e.target.value)} placeholder="Official application link (optional)" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm" />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes: documents, calls, questions, next step…" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm min-h-24" />
            <Button type="button" variant="primary" onClick={addApplication} disabled={busy} className="w-full">{busy ? 'Saving…' : 'Add to application tracker'}</Button>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Workflow</div>
            <div className="mt-3 space-y-2">
              {APPLICATION_TRACKER_STATUSES.slice(0, 7).map((status, index) => (
                <div key={status.value} className="flex items-center gap-2 text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center text-[9px] font-bold">{index + 1}</span>
                  <span className="font-semibold text-slate-700">{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {!items.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">No schools are being tracked yet. Add the first one above.</div>
        ) : items.map(item => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-warm-xs">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-extrabold text-slate-900">{item.schoolName}</h2>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">{statusLabel(item.status)}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Updated {new Date(item.updatedAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={'/schools/' + item.schoolSlug} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-primary)] hover:underline">School profile <ArrowRight className="w-3 h-3" /></Link>
                <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" aria-label={'Remove ' + item.schoolName + ' from application tracker'}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                <select value={item.status} onChange={e => updateItem(item.id, { status: e.target.value as ApplicationTrackerStatus })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs">
                  {APPLICATION_TRACKER_STATUSES.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target date</label>
                <input type="date" value={item.targetDate || ''} onChange={e => updateItem(item.id, { targetDate: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Official link</label>
                <div className="mt-1 flex gap-2">
                  <input value={item.applicationUrl || ''} onChange={e => updateItem(item.id, { applicationUrl: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs" placeholder="https://…" />
                  {item.applicationUrl && <a href={item.applicationUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label={'Open application link for ' + item.schoolName}><ExternalLink className="w-4 h-4" /></a>}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Notes</label>
              <textarea value={item.notes || ''} onChange={e => updateItem(item.id, { notes: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs min-h-20" />
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-700 font-semibold"><Check className="w-3.5 h-3.5" /> Your tracker is private to your signed-in parent account.</div>
          </article>
        ))}
      </section>
    </div>
  );
};
