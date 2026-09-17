'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Lock,
  UserX,
  Clock,
  Filter,
} from 'lucide-react';
import type { SecurityEvent } from '@/lib/authStore';

export function SecurityEventsTab() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security/events?limit=100');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to load security events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = events.filter(e => {
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Security & Intrusion Audit Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable logs of authentication attempts, rate-limit thresholds, token signatures, and account isolation triggers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#071629] border border-[#1d4672] text-xs text-white"
          >
            <option value="all">All Severities ({events.length})</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={fetchEvents}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0a1c33] border border-[#1b3e66] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08172c] text-slate-400 border-b border-[#1b3e66]">
              <tr>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">User Target</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#153457] text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                    No security events recorded.
                  </td>
                </tr>
              ) : (
                filtered.map(evt => {
                  const sevColor =
                    evt.severity === 'critical'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : evt.severity === 'high'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/30';

                  return (
                    <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {evt.type}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sevColor}`}>
                          {evt.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {evt.userEmail || (evt.userId ? <span className="font-mono text-slate-400">{evt.userId}</span> : 'System')}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                        {evt.ip || '127.0.0.1'}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-slate-300 font-mono text-[11px]">
                        {evt.details ? JSON.stringify(evt.details) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">
                        {new Date(evt.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
