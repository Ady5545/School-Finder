'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  Calendar,
} from 'lucide-react';
import type { PlatformAnnouncement } from '../../lib/authStore';

export function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [ctaText, setCtaText] = useState('Explore Now');
  const [ctaLink, setCtaLink] = useState('/schools');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [targetAudience, setTargetAudience] = useState<'all' | 'unregistered' | 'registered' | 'parents_only'>('all');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          ctaText,
          ctaLink,
          priority,
          targetAudience,
          startDate,
          endDate,
          status: 'active',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Announcement published successfully.');
        setShowCreateModal(false);
        setTitle('');
        setBody('');
        fetchAnnouncements();
      } else {
        alert(data.message || 'Creation failed');
      }
    } catch {
      alert('Network error creating announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'archived' : 'published';
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAnnouncements(announcements.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Delete announcement error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            Platform Announcements & Editorial Banners
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast time-sensitive admission alerts, survey notices, or platform updates to parents across Greater Noida West.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {loading && announcements.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Loading active announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-[#0a1c33] rounded-2xl border border-[#1b3e66]">
            No announcements created yet. Click &apos;New Announcement&apos; to publish a banner.
          </div>
        ) : (
          announcements.map(ann => (
            <div
              key={ann.id}
              className="p-4 rounded-xl bg-[#0b2038] border border-[#1d4672] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-xs">{ann.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ann.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'}`}>
                    {ann.status.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {ann.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{ann.body}</p>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1 font-mono">
                  <span>Audience: {ann.targetAudience}</span>
                  <span>Active: {ann.startDate} to {ann.endDate}</span>
                  <span>Author: {ann.createdBy}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(ann.id, ann.status)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  {ann.status === 'published' ? 'Archive' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0c1f38] border border-[#1e4875] rounded-2xl p-6 space-y-4 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white font-serif">Publish Announcement Banner</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white"
                  placeholder="e.g. 2025-2026 Greater Noida West Admission Portal Open"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Content Body *</label>
                <textarea
                  rows={3}
                  required
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white leading-relaxed"
                  placeholder="Provide concise details for parents..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">CTA Target Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={e => setCtaLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as typeof priority)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value as typeof targetAudience)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white"
                  >
                    <option value="all">All Visitors</option>
                    <option value="registered">Registered Parents</option>
                    <option value="unregistered">Unregistered Guests</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
