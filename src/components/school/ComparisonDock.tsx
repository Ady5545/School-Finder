'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useSchoolStore } from '../../lib/schoolStore';
import { getSchoolBySlug } from '../../lib/schools';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

export const ComparisonDock: React.FC = () => {
  const { compareList, removeCompare, clearCompare } = useSchoolStore();

  if (compareList.length === 0) {
    return null;
  }

  const schools: School[] = compareList
    .map(slug => getSchoolBySlug(slug))
    .filter((s): s is School => Boolean(s));

  return (
    <aside
      aria-label="School comparison dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-slate-900/95 text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700/80 backdrop-blur-xl transition-all duration-300 animate-subtle-float"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Summary & Selected School Avatars */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 shadow-xs border border-white/10">
            <Scale className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {schools.map(s => (
              <div
                key={s.id}
                className="group relative flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg pl-1.5 pr-1 py-1 text-xs text-slate-200"
              >
                <span className="font-semibold max-w-[100px] truncate">{s.shortName || s.name}</span>
                <button
                  type="button"
                  onClick={() => removeCompare(s.slug)}
                  aria-label={`Remove ${s.name} from comparison`}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 hidden md:inline-block shrink-0">
            ({compareList.length}/4 slots)
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <Link href="/compare">
            <Button
              variant="primary"
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md border border-amber-400/30 flex items-center gap-1.5"
            >
              <span>Compare ({compareList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};
