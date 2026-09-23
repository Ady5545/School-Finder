'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Archive, Database, Edit3, ExternalLink, Loader2, Plus, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import type { School } from '../../data/schoolsData';
import { SchoolEditorModal } from './SchoolEditorModal';

type Row = {
  id: string; slug: string; name: string; sector?: string; address?: string; board?: string;
  verifiedFee?: string; isArchived?: boolean; verificationStatus?: string; completeness?: { score: number };
  views?: number; saves?: number; reviewsCount?: number; directoryRating?: number;
};

export function SchoolManagerTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [verification, setVerification] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSchool, setEditorSchool] = useState<Partial<School> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editingSlug, setEditingSlug] = useState('');
  const requestController = useRef<AbortController | null>(null);

  const load = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    setError('');
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    try {
      const params = new URLSearchParams({ status, _ts: String(Date.now()) });
      if (search.trim()) params.set('q', search.trim());
      if (verification !== 'all') params.set('verification', verification);
      const res = await fetch('/api/admin/schools?' + params, { signal: controller.signal, cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not load the school registry.');
      setRows(Array.isArray(data.schools) ? data.schools : []);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : 'Could not load the school registry.');
    } finally {
      if (requestController.current === controller) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [search, status, verification]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 180);
    return () => window.clearTimeout(t);
  }, [load]);

  const edit = async (slug: string) => {
    setEditingSlug(slug); setError('');
    try {
      const res = await fetch('/api/admin/schools/' + encodeURIComponent(slug) + '?_ts=' + Date.now(), { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.school) throw new Error(data.message || 'Could not load this school.');
      setEditorSchool(data.school); setIsNew(false); setEditorOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this school.');
    } finally { setEditingSlug(''); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><Database className="w-4 h-4 text-amber-300" /><h3 className="text-base font-extrabold text-white font-serif">School Registry & CMS</h3></div>
            <p className="text-xs text-slate-400 mt-1">Add or edit every school without touching the code. Records are persisted in the school database.</p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && <span className="hidden md:inline text-[10px] text-slate-500">Updated {lastUpdated}</span>}
            <button type="button" onClick={() => void load(true)} disabled={refreshing} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#28527d] text-xs font-bold text-slate-200 hover:bg-white/5">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button type="button" onClick={() => { setEditorSchool(null); setIsNew(true); setEditorOpen(true); }} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold">
              <Plus className="w-3.5 h-3.5" /> Add School
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_150px_180px] gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search school, slug, sector or board…" className="w-full rounded-xl border border-[#1d4672] bg-[#091b32] pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-amber-400" /></div>
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-xs text-white outline-none"><option value="active">Active schools</option><option value="archived">Archived schools</option><option value="all">All records</option></select>
          <select value={verification} onChange={e => setVerification(e.target.value)} className="rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-xs text-white outline-none"><option value="all">All verification states</option><option value="verified">Verified official</option><option value="pending">Needs review</option></select>
        </div>
        {error && <div className="mt-4 rounded-xl border border-rose-700/50 bg-rose-950/40 p-3 text-xs text-rose-200">{error}</div>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {loading ? (
          <div className="xl:col-span-2 rounded-2xl border border-[#1e4878] bg-[#0f284a] p-12 text-center text-slate-400"><Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin text-amber-300" />Loading persistent school records…</div>
        ) : rows.length === 0 ? (
          <div className="xl:col-span-2 rounded-2xl border border-dashed border-[#28527d] bg-[#0f284a] p-12 text-center"><p className="font-bold text-white">No schools match this filter.</p><p className="text-xs text-slate-400 mt-1">Try another filter or add a school.</p></div>
        ) : rows.map(row => (
          <div key={row.slug} className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-4.5 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><h4 className="font-bold text-sm text-white">{row.name}</h4><p className="text-[11px] text-slate-400 mt-1 truncate">{row.address || row.sector || 'Address not set'}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#163a63] text-[10px] font-bold text-slate-200">{row.board || 'Board not set'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#163a63] text-[10px] font-bold text-slate-200">{row.verifiedFee || 'Fee not set'}</span>
                  {row.verificationStatus === 'verified_official' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300"><ShieldCheck className="inline w-3 h-3 mr-1" />Verified</span>}
                  {row.isArchived && <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-300"><Archive className="inline w-3 h-3 mr-1" />Archived</span>}
                </div>
              </div>
              <div className="text-right shrink-0"><div className="text-[9px] text-slate-500 uppercase tracking-wider">Completeness</div><div className="text-sm font-black text-amber-300">{row.completeness?.score ?? 0}%</div></div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4"><Metric label="Views" value={row.views ?? 0} /><Metric label="Saves" value={row.saves ?? 0} /><Metric label="Reviews" value={row.reviewsCount ?? 0} /><Metric label="Directory rating" value={row.directoryRating ? row.directoryRating.toFixed(1) : '—'} /></div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <Link href={`/schools/${row.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">Public profile <ExternalLink className="w-3 h-3" /></Link>
              <button type="button" onClick={() => void edit(row.slug)} disabled={editingSlug === row.slug} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold disabled:opacity-50">{editingSlug === row.slug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />} Edit all data</button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-500">Showing {rows.length} school records in this view.</p>
      <SchoolEditorModal isOpen={editorOpen} onClose={() => { setEditorOpen(false); setEditorSchool(null); setIsNew(false); }} onSaved={async () => { setEditorOpen(false); setEditorSchool(null); setIsNew(false); await load(true); }} schoolToEdit={editorSchool} isNew={isNew} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-[#0a1e38] border border-white/5 py-2 text-center"><p className="text-[9px] text-slate-500 uppercase">{label}</p><p className="text-xs font-bold text-slate-200 mt-0.5">{value}</p></div>;
}
