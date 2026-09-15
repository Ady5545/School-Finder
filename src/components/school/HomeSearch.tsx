'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ArrowRight, Sparkles } from 'lucide-react';
import { getAllSchools } from '../../lib/schools';
import type { School } from '../../types/school';
import { cn } from '../../lib/utils';

export const HomeSearch: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSchools(getAllSchools());
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? schools
        .filter(s => {
          const q = query.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.location.area.toLowerCase().includes(q) ||
            s.location.sector.toLowerCase().includes(q) ||
            s.board.some(b => b.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/schools?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/schools');
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-2xl', className)}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white rounded-2xl border border-[var(--color-border-strong)] shadow-lg shadow-slate-900/5 focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary-light)] transition-all p-1.5"
      >
        <div className="pl-3.5 pr-2 text-[var(--color-content-subtle)]">
          <Search className="w-5 h-5 text-[var(--color-primary)]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by school name, sector, board (e.g. DPS, Techzone 4, CBSE)..."
          className="w-full py-2.5 text-sm sm:text-base text-[var(--color-content)] placeholder:text-[var(--color-content-subtle)] bg-transparent outline-none font-medium"
        />
        <button
          type="submit"
          className="shrink-0 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <span>Find Schools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Interactive Autocomplete Suggestions Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[var(--color-border)] shadow-xl z-50 overflow-hidden text-left divide-y divide-[var(--color-border-subtle)]">
          <div className="px-4 py-2.5 bg-[var(--color-surface-muted)] text-[11px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Matching Institutions ({filtered.length})</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
            {filtered.map(school => (
              <div
                key={school.id}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/schools/${school.slug}`);
                }}
                className="px-4 py-3 hover:bg-[var(--color-primary-light)] cursor-pointer transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--color-content)] group-hover:text-[var(--color-primary)] leading-snug">
                    {school.name}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-content-muted)] mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--color-content-subtle)]" />
                      {school.location.area || school.location.sector}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[var(--color-content)]">{school.board.join(', ')}</span>
                  </div>
                </div>

                <div className="shrink-0 text-xs font-semibold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          <div
            onClick={handleSubmit}
            className="px-4 py-3 bg-[var(--color-surface-muted)] hover:bg-[var(--color-surface-subtle)] text-center text-xs font-semibold text-[var(--color-primary)] cursor-pointer transition-colors"
          >
            See all matching results for &ldquo;{query}&rdquo; →
          </div>
        </div>
      )}
    </div>
  );
};
