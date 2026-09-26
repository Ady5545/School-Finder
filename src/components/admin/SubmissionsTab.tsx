'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Edit,
} from 'lucide-react';
import type { SchoolSubmission } from '../../lib/authStore';

interface SubmissionsTabProps {
  onEditSchool: (slug: string) => void;
}

export function SubmissionsTab({ onEditSchool }: SubmissionsTabProps) {
  const [submissions, setSubmissions] = useState<SchoolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<SchoolSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: SchoolSubmission['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSubmissions();
        setSelectedSub(null);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch {
      alert('Network error updating submission');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = submissions.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Inbox className="w-4 h-4 text-amber-400" />
            School Information Correction & Suggestion Queue
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Community and parent-reported fee changes, campus updates, and data discrepancy reports for editorial triage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#071629] border border-[#1d4672] text-xs text-white"
          >
            <option value="all">All Statuses ({submissions.length})</option>
            <option value="new">New / Unreviewed</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved & Applied</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={fetchSubmissions}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="rounded-2xl bg-[#0a1c33] border border-[#1b3e66] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08172c] text-slate-400 border-b border-[#1b3e66]">
              <tr>
                <th className="px-4 py-3">School Target</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Submitter</th>
                <th className="px-4 py-3">Details / Proposed Change</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#153457] text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                    No submissions matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{sub.schoolName || sub.schoolSlug || 'New School'}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{sub.schoolSlug}</span>
                    </td>
                    <td className="px-4 py-3 capitalize font-semibold text-slate-300">
                      {sub.type.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{sub.submitterName || 'Parent'}</p>
                      <p className="text-[10px] text-slate-400">{sub.submitterEmail || 'Anonymous'}</p>
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <p className="line-clamp-2 text-slate-300">{sub.description}</p>
                      {sub.sourceReference && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          Ref: {sub.sourceReference}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === 'new'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : sub.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'in_review'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {sub.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.schoolSlug && (
                          <button
                            onClick={() => onEditSchool(sub.schoolSlug!)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 cursor-pointer"
                            title="Open in School Editor"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setAdminNotes(sub.adminNotes || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dialog */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-[#0c1f38] border border-[#1e4875] rounded-2xl p-5 sm:p-6 space-y-4 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white font-serif">
              Review Correction Proposal
            </h3>

            <div className="p-3.5 rounded-xl bg-[#071629] border border-white/5 space-y-2 text-xs">
              <p>
                <span className="font-bold text-slate-400">Target School:</span>{' '}
                <span className="text-white font-semibold">{selectedSub.schoolName || selectedSub.schoolSlug}</span>
              </p>
              <p>
                <span className="font-bold text-slate-400">Reported By:</span>{' '}
                {selectedSub.submitterName} ({selectedSub.submitterEmail})
              </p>
              <p>
                <span className="font-bold text-slate-400">Submission Details:</span>
              </p>
              <div className="p-2.5 rounded bg-[#091b32] text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedSub.description}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Internal Editorial / Moderator Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Notes on verification steps taken..."
                className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-semibold"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updatingId === selectedSub.id}
                  onClick={() => handleUpdateStatus(selectedSub.id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={updatingId === selectedSub.id}
                  onClick={() => handleUpdateStatus(selectedSub.id, 'in_review')}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-bold cursor-pointer"
                >
                  Mark In Review
                </button>
                <button
                  type="button"
                  disabled={updatingId === selectedSub.id}
                  onClick={() => handleUpdateStatus(selectedSub.id, 'resolved')}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold cursor-pointer shadow-md"
                >
                  Resolve & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
