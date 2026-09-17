'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Edit,
  Building,
} from 'lucide-react';
import type { School } from '../../../data/schoolsData';

interface VerificationSummary {
  total: number;
  completeCount: number;
  adequateCount: number;
  needsAttentionCount: number;
  criticalMissingCount: number;
  healthScore: number;
}

interface VerificationItem {
  slug: string;
  name: string;
  sector: string;
  board: string;
  isArchived: boolean;
  completeness: {
    score: number;
    level: 'complete' | 'adequate' | 'needs_attention' | 'critical_missing';
    items: { key: string; label: string; passed: boolean; weight: number }[];
    missingFields: string[];
  };
}

interface DataVerificationTabProps {
  onEditSchool: (slug: string) => void;
}

export function DataVerificationTab({ onEditSchool }: DataVerificationTabProps) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<VerificationSummary | null>(null);
  const [missingSummary, setMissingSummary] = useState<Record<string, { label: string; count: number; schools: { slug: string; name: string }[] }>>({});
  const [schools, setSchools] = useState<VerificationItem[]>([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [missingKeyFilter, setMissingKeyFilter] = useState<string>('all');

  const fetchVerificationData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data-verification');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setMissingSummary(data.missingSummary);
        setSchools(data.schools);
      }
    } catch (err) {
      console.error('Failed to load verification metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const filteredSchools = schools.filter(s => {
    if (search) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.sector.toLowerCase().includes(q)) return false;
    }
    if (levelFilter !== 'all' && s.completeness.level !== levelFilter) return false;
    if (missingKeyFilter !== 'all') {
      const missingItem = s.completeness.items.find(i => i.key === missingKeyFilter);
      if (!missingItem || missingItem.passed) return false;
    }
    return true;
  });

  if (loading && !summary) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
        <p className="text-xs">Analyzing directory data verification status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Health Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Dataset Health Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-serif">
              {summary?.healthScore || 0}%
            </span>
            <span className="text-xs text-slate-400">weighted audit</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${summary?.healthScore || 0}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c] flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-300">High Completeness</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">
              {summary?.completeCount || 0}
            </span>
            <span className="text-xs text-slate-400">of {summary?.total || 0} schools</span>
          </div>
          <p className="text-[11px] text-emerald-400/80 font-medium">90%+ required attributes</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c] flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-300">Adequate / Verified</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-400">
              {summary?.adequateCount || 0}
            </span>
            <span className="text-xs text-slate-400">schools</span>
          </div>
          <p className="text-[11px] text-sky-400/80 font-medium">Core data points verified</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c] flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-300">Action Required</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">
              {(summary?.needsAttentionCount || 0) + (summary?.criticalMissingCount || 0)}
            </span>
            <span className="text-xs text-slate-400">schools</span>
          </div>
          <p className="text-[11px] text-amber-400/80 font-medium">Missing fee or map pin</p>
        </div>
      </div>

      {/* Missing Attribute Breakdown Cards */}
      <div className="p-5 rounded-2xl bg-[#0b213d] border border-[#1d4775] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Missing Field Frequency Across Greater Noida West
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click a field to filter all schools missing that attribute for quick resolution.
            </p>
          </div>
          {missingKeyFilter !== 'all' && (
            <button
              onClick={() => setMissingKeyFilter('all')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {Object.entries(missingSummary).map(([key, data]) => {
            const isSelected = missingKeyFilter === key;
            return (
              <button
                key={key}
                onClick={() => setMissingKeyFilter(isSelected ? 'all' : key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 text-white shadow-xs'
                    : 'bg-[#08182b] border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate">{data.label}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${data.count > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {data.count}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {data.count === 0 ? '100% Complete' : `${data.count} schools missing`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schools Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search school or sector..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-xs text-white focus:outline-hidden"
          >
            <option value="all">All Completeness Levels</option>
            <option value="complete">Complete (90%+)</option>
            <option value="adequate">Adequate (75-89%)</option>
            <option value="needs_attention">Needs Attention (50-74%)</option>
            <option value="critical_missing">Critical Missing (&lt;50%)</option>
          </select>

          <button
            onClick={fetchVerificationData}
            className="p-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="rounded-2xl bg-[#0a1c33] border border-[#1b3e66] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08172c] text-slate-300 font-semibold border-b border-[#1b3e66]">
              <tr>
                <th className="px-4 py-3">School Name</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Missing Elements</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#153457] text-slate-300">
              {filteredSchools.map(school => {
                const comp = school.completeness;
                const badgeColor =
                  comp.level === 'complete'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : comp.level === 'adequate'
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    : comp.level === 'needs_attention'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                return (
                  <tr key={school.slug} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{school.name}</span>
                        {school.isArchived && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                            Archived
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{school.slug}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-300">{school.sector}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-white">{comp.score}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${
                              comp.score >= 90
                                ? 'bg-emerald-400'
                                : comp.score >= 75
                                ? 'bg-sky-400'
                                : comp.score >= 50
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${comp.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}`}>
                        {comp.level.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {comp.missingFields.length === 0 ? (
                        <span className="text-[11px] text-emerald-400 font-medium">All 9 verified</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {comp.missingFields.slice(0, 3).map(f => (
                            <span
                              key={f}
                              className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px]"
                            >
                              {f}
                            </span>
                          ))}
                          {comp.missingFields.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{comp.missingFields.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onEditSchool(school.slug)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold transition-all text-xs cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
