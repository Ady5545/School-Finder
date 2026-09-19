'use client';

import React, { useState, useEffect } from 'react';
import {
  Copy,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Archive,
  ArrowRight,
  ExternalLink,
  Edit,
  ShieldCheck,
} from 'lucide-react';

interface DuplicateCandidate {
  primarySchool: { slug: string; name: string; sector: string };
  secondarySchool: { slug: string; name: string; sector: string };
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  suggestedAction: 'merge' | 'alias' | 'review';
}

interface DuplicateManagerTabProps {
  onEditSchool: (slug: string) => void;
  onRefreshDirectory: () => void;
}

export function DuplicateManagerTab({ onEditSchool, onRefreshDirectory }: DuplicateManagerTabProps) {
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchDuplicates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/duplicates');
      const data = await res.json();
      if (data.success) {
        setDuplicates(data.duplicates);
      }
    } catch (err) {
      console.error('Failed to load duplicates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleArchiveSecondary = async (secondarySlug: string, primarySlug: string) => {
    if (!confirm(`Archive duplicate record '${secondarySlug}' in favor of canonical '${primarySlug}'?`)) {
      return;
    }

    setActionInProgress(secondarySlug);
    try {
      const res = await fetch(`/api/admin/schools/${secondarySlug}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: `De-duplicated in favor of canonical school '${primarySlug}'`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Archived ${secondarySlug} successfully.`);
        fetchDuplicates();
        onRefreshDirectory();
      } else {
        alert(data.message || 'Failed to archive record');
      }
    } catch (err) {
      alert('Network error while archiving');
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading && duplicates.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
        <p className="text-xs">Scanning school database for duplicates and aliases...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Copy className="w-4 h-4 text-amber-400" />
            Duplicate & Alias Integrity Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated fuzzy name matching and affiliation number cross-checking to prevent fractured parent reviews and duplicate listings.
          </p>
        </div>
        <button
          onClick={fetchDuplicates}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-scan Database</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {duplicates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0a1c33] border border-[#1b3e66] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white font-serif">Zero Duplicate Conflicts</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All 55 canonical schools in Greater Noida West maintain distinct affiliation numbers, unique slugs, and clean name vectors.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {duplicates.map((item, idx) => {
            const confBadge =
              item.confidence === 'high'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : item.confidence === 'medium'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-500/10 text-slate-300 border-slate-500/30';

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0b2038] border border-[#1d4672] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${confBadge}`}>
                    {item.confidence} Confidence Duplicate Candidate
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Suggested Action:</span>
                    <span className="text-[11px] font-bold text-amber-400 uppercase">
                      {item.suggestedAction}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary School */}
                  <div className="p-3.5 rounded-xl bg-[#07172a] border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Canonical / Primary Record
                    </span>
                    <h5 className="font-bold text-white text-xs">{item.primarySchool.name}</h5>
                    <p className="text-[11px] text-slate-400">{item.primarySchool.sector}</p>
                    <p className="text-[10px] font-mono text-slate-400">{item.primarySchool.slug}</p>
                    <div className="pt-2">
                      <button
                        onClick={() => onEditSchool(item.primarySchool.slug)}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Inspect Primary</span>
                      </button>
                    </div>
                  </div>

                  {/* Secondary School */}
                  <div className="p-3.5 rounded-xl bg-[#07172a] border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Secondary / Potential Duplicate
                    </span>
                    <h5 className="font-bold text-white text-xs">{item.secondarySchool.name}</h5>
                    <p className="text-[11px] text-slate-400">{item.secondarySchool.sector}</p>
                    <p className="text-[10px] font-mono text-slate-400">{item.secondarySchool.slug}</p>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onEditSchool(item.secondarySchool.slug)}
                        className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Inspect Secondary</span>
                      </button>
                      <button
                        disabled={actionInProgress === item.secondarySchool.slug}
                        onClick={() => handleArchiveSecondary(item.secondarySchool.slug, item.primarySchool.slug)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Archive className="w-3 h-3" />
                        <span>Archive Redundant</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="p-2.5 rounded-lg bg-[#07172a]/60 border border-white/5 text-[11px] text-slate-300">
                  <span className="font-bold text-slate-400">Match Indicators: </span>
                  {item.reasons.join(' • ')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
