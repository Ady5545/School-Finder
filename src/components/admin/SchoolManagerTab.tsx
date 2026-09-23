'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit3, ExternalLink, Plus, RefreshCw, Search, ShieldCheck, Archive, Database, Loader2 } from 'lucide-react';
import type { School } from '../../data/schoolsData';
import { SchoolEditorModal } from './SchoolEditorModal';

interface SchoolRow {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  sector?: string;
  address?: string;
  board?: string;
  verifiedFee?: string;
  isArchived?: boolean;
  status?: string;
  isDuplicate?: boolean;
  affiliationNumber?: string | null;
  verificationStatus?: string;
  completeness?: { score: number; level: string };
  views?: number;
  saves?: number;
  reviewsCount?: number;
  averageRating?: number;
  contact?: School['contact'];
  admissions?: School['admissions'];
  assets?: School['assets'];
  coordinates?: School['location']['coordinates'];
}

export function SchoolManagerTab() {
  const [rows, setRows] = useState<SchoolRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSchool, setEditorSchool] = useState<Partial<School> | null>(null);
  const [editorIsNew, setEditorIsNew] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('status', statusFilter);
      if (search.trim()) params.set('q', search.trim());
      if (verificationFilter !== 'all') params.set('verification', verificationFilter);
      params.set('_ts', String(Date.now()));

      const response = await fetch('/api/admin/schools?' + params.toString(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Could not load the school registry.');
      }

      setRows(Array.isArray(data.schools) ? data.schools : []);
      setLastLoadedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the school registry.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, statusFilter, verificationFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 180);
    return () => window.clearTimeout(timer);
  }, [load]);

  const openNew = () => {
    setEditorSchool(null);
    setEditorIsNew(true);
    setEditorOpen(true);
  };

  const openEdit = async (slug: string) => {
    setLoadingSlug(slug);
    setError(null);
    try {
      const response = await fetch('/api/admin/schools/' + encodeURIComponent(slug) + '?_ts=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.school) {
        throw new Error(data.message || 'Could not load this school record.');
      }
      setEditorSchool(data.school);
      setEditorIsNew(false);
      setEditorOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this school record.');
    } finally {
      setLoadingSlug(null);
    }
  };

  const onSaved = useCallback(async () => {
    setEditorOpen(false);
    setEditorSchool(null);
    setEditorIsNew(false);
    await load(true);
  }, [load]);

  const activeCount = useMemo(() => rows.filter(row => !row.isArchived && !row.isDuplicate).length, [rows]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-300" />
              <h3 className="text-base font-extrabold text-white font-serif">School Registry & CMS</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              One place to add, edit, archive and maintain every school record. Changes persist in the school database.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastLoadedAt && <span className="hidden sm:inline text-[10px] text-slate-500">Updated {lastLoadedAt.toLocaleTimeString()}</span>}
            <button type="button" onClick={() => void load(true)} disabled={isRefreshing} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#28527d] text-xs font-bold text-slate-200 hover:bg-white/5 disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button type="button" onClick={openNew} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold">
              <Plus className="w-3.5 h-3.5" /> Add School
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_150px_180px] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search school, slug, sector or board..."
              className="w-full rounded-xl border border-[#1d4672] bg-[#091b32] pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-xs text-white outline-none">
            <option value="active">Active schools</option>
            <option value="archived">Archived schools</option>
            <option value="all">All records</option>
          </select>
          <select value={verificationFilter} onChange={e => setVerificationFilter(e.target.value)} className="rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-xs text-white outline-none">
            <option value="all">All verification states</option>
            <option value="verified">Verified official</option>
            <option value="pending">Needs review</option>
          </select>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-700/50 bg-rose-950/40 p-3 text-xs text-rose-200">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="xl:col-span-2 rounded-2xl border border-[#1e4878] bg-[#0f284a] p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin text-amber-300" />
            Loading the persistent school registry…
          </div>
        ) : rows.length === 0 ? (
          <div className="xl:col-span-2 rounded-2xl border border-dashed border-[#28527d] bg-[#0f284a] p-12 text-center">
            <p className="font-bold text-white">No schools match this filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try another search or add a new school.</p>
          </div>
        ) : (
          rows.map(row => (
            <div key={row.slug} className="rounded-2xl border border-[#1e4878] bg-[#0f284a] p-4.5 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white">{row.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{row.address || row.sector || 'Address not set'}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#163a63] text-[10px] font-bold text-slate-200">{row.board || 'No board set'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#163a63] text-[10px] font-bold text-slate-200">{row.verifiedFee || 'Fee not set'}</span>
                    {row.verificationStatus === 'verified_official' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300"><ShieldCheck className="inline w-3 h-3 mr-1" />Verified</span>}
                    {row.isArchived && <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-300"><Archive className="inline w-3 h-3 mr-1" />Archived</span>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Completeness</div>
                  <div className="text-sm font-black text-amber-300">{row.completeness?.score ?? 0}%</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                <Metric label="Views" value={row.views ?? 0} />
                <Metric label="Saves" value={row.saves ?? 0} />
                <Metric label="Reviews" value={row.reviewsCount ?? 0} />
                <Metric label="Rating" value={row.averageRating ? row.averageRating.toFixed(1) : '—'} />
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap justify-between gap-2">
                <Link href={`/schools/${row.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
                  Public profile <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => void openEdit(row.slug)}
                  disabled={loadingSlug === row.slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold disabled:opacity-50"
                >
                  {loadingSlug === row.slug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
                  Edit all data
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-[10px] text-slate-500">Showing {rows.length} records · {activeCount} active canonical-style records in this result.</p>

      <SchoolEditorModal
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditorSchool(null);
          setEditorIsNew(false);
        }}
        onSaved={onSaved}
        schoolToEdit={editorSchool}
        isNew={editorIsNew}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#0a1e38] border border-white/5 py-2">
      <p className="text-[9px] text-slate-500 uppercase">{label}</p>
      <p className="text-xs font-bold text-slate-200 mt-0.5">{value}</p>
    </div>
  );
}
