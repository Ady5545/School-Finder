'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  Building2,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Loader2,
  UploadCloud,
} from 'lucide-react';
import type { School } from '../../../data/schoolsData';
import { SchoolEditorModal } from './SchoolEditorModal';

type SchoolRow = School & {
  completeness?: {
    score: number;
    level: string;
  };
  views?: number;
  saves?: number;
  reviewsCount?: number;
  averageRating?: number;
};

export function SchoolManagerTab() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'archived'>('active');
  const [verification, setVerification] = useState<'all' | 'verified' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<SchoolRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [refreshStamp, setRefreshStamp] = useState(() => Date.now());
  const [metricsLoading, setMetricsLoading] = useState(false);
  const requestSerial = useRef(0);
  const metricsCache = useRef<Map<string, {
    views: number;
    saves: number;
    reviewsCount: number;
    averageRating: number;
  }> | null>(null);
  const metricsCacheAt = useRef(0);
  const metricsRequest = useRef<Promise<void> | null>(null);

  const METRICS_CLIENT_TTL_MS = 20_000;

  const mergeCachedMetrics = useCallback((items: SchoolRow[]) => {
    const cache = metricsCache.current;
    if (!cache) return items;
    return items.map(school => {
      const metrics = cache.get(school.slug);
      return metrics ? { ...school, ...metrics } : school;
    });
  }, []);

  const loadSchoolMetrics = useCallback(async () => {
    const now = Date.now();
    if (metricsCache.current && now - metricsCacheAt.current < METRICS_CLIENT_TTL_MS) {
      setSchools(prev => mergeCachedMetrics(prev));
      return;
    }

    if (metricsRequest.current) {
      await metricsRequest.current;
      return;
    }

    setMetricsLoading(true);

    const request = (async () => {
      let lastError: unknown = null;

      for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch('/api/admin/schools/metrics', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Could not load school analytics.');
        }

        const nextCache = new Map<string, {
          views: number;
          saves: number;
          reviewsCount: number;
          averageRating: number;
        }>();

        for (const item of Array.isArray(data.metrics) ? data.metrics : []) {
          nextCache.set(item.slug, {
            views: item.views ?? 0,
            saves: item.saves ?? 0,
            reviewsCount: item.reviewsCount ?? 0,
            averageRating: item.averageRating ?? 0,
          });
        }

        metricsCache.current = nextCache;
        metricsCacheAt.current = Date.now();
        setSchools(prev => mergeCachedMetrics(prev));
        lastError = null;
        break;
        } catch (err) {
          lastError = err;
          if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 350));
        }
      }

      if (lastError) console.error('School analytics load failed:', lastError);
    })();

    metricsRequest.current = request;
    try {
      await request;
    } finally {
      if (metricsRequest.current === request) {
        metricsRequest.current = null;
        setMetricsLoading(false);
      }
    }
  }, [mergeCachedMetrics]);

  const loadSchools = useCallback(async (silent = false) => {
    const requestId = ++requestSerial.current;
    if (!silent) setIsLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.set('status', status);
    if (query.trim()) params.set('q', query.trim());
    if (verification !== 'all') params.set('verification', verification);

    let lastError: unknown = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch('/api/admin/schools?' + params.toString(), {
          cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));

        if (requestId !== requestSerial.current) return;
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Could not load the school registry.');
        }

        const nextSchools = Array.isArray(data.schools) ? data.schools : [];
        setSchools(mergeCachedMetrics(nextSchools));
        setRefreshStamp(Date.now());
        lastError = null;

        // Never block the registry on analytics.
        void loadSchoolMetrics();
        break;
      } catch (err) {
        lastError = err;
        if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    if (requestId !== requestSerial.current) return;
    if (lastError) {
      setError(lastError instanceof Error ? lastError.message : 'Could not load the school registry.');
    }
    setIsLoading(false);
  }, [status, query, verification, loadSchoolMetrics, mergeCachedMetrics]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSchools(), 180);
    return () => window.clearTimeout(timer);
  }, [loadSchools]);

  const filtered = useMemo(() => schools, [schools]);

  const archiveSchool = async (school: SchoolRow) => {
    const reason = window.prompt(`Why are you archiving ${school.name}?`, 'School record no longer represents an active listing');
    if (reason === null) return;
    try {
      const res = await fetch('/api/admin/schools/' + encodeURIComponent(school.slug) + '/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        cache: 'no-store',
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Archive failed.');
      await loadSchools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Archive failed.');
    }
  };

  const handleSaved = (school: School) => {
    setEditing(null);
    setCreating(false);
    setSchools(prev => {
      const idx = prev.findIndex(item => item.slug === school.slug);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...school };
        return next;
      }
      return [...prev, school as SchoolRow];
    });
    void loadSchools(true);
  };

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-5 shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white font-serif">Directory CMS</h2>
                <p className="text-[11px] text-slate-400">Edit existing schools, upload images, or create a new school without touching code.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add school
            </button>
            <button
              type="button"
              onClick={() => void loadSchools()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0d2646] border border-[#1d4b7c] text-slate-200 text-xs font-bold hover:bg-[#133763]"
              title={'Fresh registry load ' + refreshStamp}
            >
              <RefreshCw className={'w-4 h-4 ' + (isLoading ? 'animate-spin text-amber-400' : '')} />
              Refresh data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mt-5">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name, address, sector, board…"
              className="w-full rounded-xl bg-[#091b32] border border-[#1d4672] pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </label>
          <select value={status} onChange={e => setStatus(e.target.value as typeof status)} className="rounded-xl bg-[#091b32] border border-[#1d4672] px-3 py-2.5 text-xs text-white">
            <option value="active">Active records</option>
            <option value="archived">Archived records</option>
            <option value="all">All records</option>
          </select>
          <select value={verification} onChange={e => setVerification(e.target.value as typeof verification)} className="rounded-xl bg-[#091b32] border border-[#1d4672] px-3 py-2.5 text-xs text-white">
            <option value="all">All verification</option>
            <option value="verified">Verified official</option>
            <option value="pending">Needs review</option>
          </select>
        </div>

        {error && <div className="mt-4 rounded-xl border border-rose-800 bg-rose-950/50 p-3 text-xs text-rose-300">{error}</div>}
      </div>

      <div className="text-[11px] text-slate-400 flex items-center gap-2">
        <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
        <span>{filtered.length} records loaded. Changes are saved to the persistent CMS store rather than only this browser session.</span>
        {metricsLoading && (
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            Analytics syncing
          </span>
        )}
      </div>

      {isLoading && schools.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-5 shadow-lg animate-pulse"
            >
              <div className="h-4 w-2/3 rounded bg-[#17385e]" />
              <div className="h-3 w-5/6 rounded bg-[#112e50] mt-2" />
              <div className="grid grid-cols-4 gap-2 mt-5">
                {Array.from({ length: 4 }).map((__, metricIndex) => (
                  <div key={metricIndex} className="h-12 rounded-xl bg-[#0a1e38]" />
                ))}
              </div>
              <div className="h-8 w-28 rounded-xl bg-[#102947] mt-5 ml-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(school => (
            <article key={school.slug} className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-5 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{school.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{school.location?.address || school.location?.sector || 'Address not entered'}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {school.verification?.status === 'verified_official' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[9px] font-black text-emerald-300"><ShieldCheck className="w-3 h-3" />Verified</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-[9px] font-black text-amber-300">Review</span>
                  )}
                  {school.isArchived && <span className="rounded-full bg-slate-500/10 border border-slate-500/20 px-2 py-1 text-[9px] font-black text-slate-400">Archived</span>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="rounded-xl bg-[#0a1e38] border border-white/5 p-2.5 text-center"><div className="text-[9px] text-slate-500 uppercase">Completeness</div><div className="text-sm font-black text-white mt-1">{school.completeness?.score ?? '—'}%</div></div>
                <div className="rounded-xl bg-[#0a1e38] border border-white/5 p-2.5 text-center"><div className="text-[9px] text-slate-500 uppercase">Views</div><div className="text-sm font-black text-blue-300 mt-1">{school.views ?? 0}</div></div>
                <div className="rounded-xl bg-[#0a1e38] border border-white/5 p-2.5 text-center"><div className="text-[9px] text-slate-500 uppercase">Saves</div><div className="text-sm font-black text-rose-300 mt-1">{school.saves ?? 0}</div></div>
                <div className="rounded-xl bg-[#0a1e38] border border-white/5 p-2.5 text-center"><div className="text-[9px] text-slate-500 uppercase">Rating</div><div className="text-sm font-black text-amber-300 mt-1">{school.averageRating ?? school.rating?.score ?? 0}</div></div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-white/5">
                <Link href={'/schools/' + school.slug} target="_blank" className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white">
                  Public profile <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditing(school)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-black hover:bg-amber-400/20"><Edit3 className="w-3.5 h-3.5" />Edit all data</button>
                  {!school.isArchived && <button type="button" onClick={() => void archiveSchool(school)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-black hover:bg-rose-500/20"><Archive className="w-3.5 h-3.5" />Archive</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2b5a88] bg-[#0f284a] p-12 text-center text-sm text-slate-400">No schools match this filter.</div>
      )}

      <SchoolEditorModal
        isOpen={creating || Boolean(editing)}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSaved={handleSaved}
        schoolToEdit={editing}
        isNew={creating}
      />
    </section>
  );
}
