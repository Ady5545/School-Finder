'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ArrowRight, Sparkles, X, ChevronRight, Compass } from 'lucide-react';
import { getAllSchools } from '../../lib/schools';
import type { School } from '../../types/school';
import { cn } from '../../lib/utils';

import { trackClientSearch } from '../../lib/tracker';

interface LocationSuggestion {
  name: string;
  count: number;
  type: 'sector' | 'area';
}

export const HomeSearch: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Extract unique locations/sectors from canonical schools
  const allLocations = useMemo<LocationSuggestion[]>(() => {
    if (!schools.length) return [];
    const map = new Map<string, { count: number; type: 'sector' | 'area' }>();
    
    schools.forEach(school => {
      const sector = school.location.sector?.trim();
      if (sector) {
        const current = map.get(sector) || { count: 0, type: 'sector' };
        current.count += 1;
        map.set(sector, current);
      }
      const area = school.location.area?.trim();
      if (area && area !== sector && !map.has(area)) {
        const current = map.get(area) || { count: 0, type: 'area' };
        current.count += 1;
        map.set(area, current);
      }
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      type: data.type,
    }));
  }, [schools]);

  const cleanQuery = query.trim().toLowerCase();

  // Predictive Matching: Locations
  const matchingLocations = useMemo(() => {
    if (!cleanQuery) return allLocations.slice(0, 4);
    return allLocations
      .filter(loc => loc.name.toLowerCase().includes(cleanQuery))
      .slice(0, 4);
  }, [allLocations, cleanQuery]);

  // Predictive Matching: Schools (by name, alternate names, short name, sector, board)
  const matchingSchools = useMemo(() => {
    if (!cleanQuery) return schools.slice(0, 5);
    return schools
      .filter(s => {
        const nameMatch = s.name.toLowerCase().includes(cleanQuery);
        const shortMatch = s.shortName?.toLowerCase().includes(cleanQuery);
        const altMatch = s.alternateNames?.some(alt => alt.toLowerCase().includes(cleanQuery));
        const sectorMatch = (s.location?.sector || '').toLowerCase().includes(cleanQuery);
        const areaMatch = (s.location?.area || '').toLowerCase().includes(cleanQuery);
        const boards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
        const boardMatch = boards.some(b => b.toLowerCase().includes(cleanQuery));
        return nameMatch || shortMatch || altMatch || sectorMatch || areaMatch || boardMatch;
      })
      .slice(0, 5);
  }, [schools, cleanQuery]);

  // Total selectable predictive items in list
  const totalItems = matchingLocations.length + matchingSchools.length;

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        if (selectedIndex < matchingLocations.length) {
          const loc = matchingLocations[selectedIndex];
          handleSelectLocation(loc.name);
        } else {
          const school = matchingSchools[selectedIndex - matchingLocations.length];
          handleSelectSchool(school.slug);
        }
      } else {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectSchool = (slug: string) => {
    setIsOpen(false);
    router.push(`/schools/${slug}`);
  };

  const handleSelectLocation = (locationName: string) => {
    setIsOpen(false);
    trackClientSearch(locationName, locationName);
    router.push(`/schools?q=${encodeURIComponent(locationName)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      trackClientSearch(query.trim());
      router.push(`/schools?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/schools');
    }
  };

  // Helper to highlight matching text in suggestions
  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-amber-950 font-black px-1 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white rounded-2xl border-2 border-[var(--color-border-strong)] shadow-warm-md hover:shadow-warm-lg focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary-light)] transition-all p-1.5"
      >
        <div className="pl-3.5 pr-2 text-[var(--color-primary)]">
          <Search className="w-5 h-5 text-[var(--color-primary)]" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search schools, sector, board (e.g. DPS, Techzone 4)..."
          className="w-full py-2.5 text-xs sm:text-base text-[var(--color-content)] placeholder:text-[var(--color-content-muted)]/70 bg-transparent outline-none font-medium tracking-tight"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="shrink-0 px-3.5 sm:px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-150 flex items-center gap-1.5 sm:gap-2 shadow-warm-xs hover:shadow-warm-sm active:scale-[0.98] cursor-pointer min-h-[40px]"
        >
          <span>Find</span>
          <span className="hidden sm:inline">Schools</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
        </button>
      </form>

      {/* Real-time Predictive Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2.5 bg-white rounded-2xl border border-[var(--color-border-strong)] shadow-warm-xl z-50 overflow-hidden text-left divide-y divide-[var(--color-border-subtle)] animate-in fade-in-50 duration-150">
          {/* Header Banner */}
          <div className="px-4 py-2.5 bg-[var(--color-surface-muted)] text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--color-border)]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{cleanQuery ? 'Predictive Suggestions' : 'Popular Sectors & Campuses'}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-content-muted)]">
              {matchingLocations.length + matchingSchools.length} suggestions
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
            {/* Category 1: Location & Sector Suggestions */}
            {matchingLocations.length > 0 && (
              <div className="bg-[#faf8f5]/60">
                <div className="px-4 py-1.5 text-[10px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>Sectors &amp; Localities in Greater Noida West</span>
                </div>
                {matchingLocations.map((loc, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={`loc-${loc.name}`}
                      onClick={() => handleSelectLocation(loc.name)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'px-4.5 py-2.5 cursor-pointer transition-colors flex items-center justify-between gap-3 group',
                        isSelected ? 'bg-[var(--color-primary-light)]' : 'hover:bg-[var(--color-surface-subtle)]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-[var(--color-content)] group-hover:text-[var(--color-primary)]">
                            {highlightMatch(loc.name, cleanQuery)}
                          </span>
                          <span className="text-[11px] text-[var(--color-content-muted)]">
                            {loc.count} verified {loc.count === 1 ? 'campus' : 'campuses'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-content-muted)] font-medium">
                        <span className="text-[11px] hidden sm:inline">Search Sector</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category 2: School Name Suggestions */}
            {matchingSchools.length > 0 && (
              <div>
                <div className="px-4 py-1.5 text-[10px] font-bold text-[var(--color-content-muted)] uppercase tracking-wider flex items-center gap-1 bg-white">
                  <Building className="w-3 h-3 text-[var(--color-primary)]" />
                  <span>Verified Campuses</span>
                </div>
                {matchingSchools.map((school, schoolIdx) => {
                  const itemIndex = matchingLocations.length + schoolIdx;
                  const isSelected = selectedIndex === itemIndex;
                  return (
                    <div
                      key={school.id}
                      onClick={() => handleSelectSchool(school.slug)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={cn(
                        'px-4.5 py-3 cursor-pointer transition-colors flex items-center justify-between gap-3 group',
                        isSelected ? 'bg-[var(--color-primary-light)]' : 'hover:bg-slate-50'
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--color-content)] group-hover:text-[var(--color-primary)] leading-snug">
                          {highlightMatch(school.name, cleanQuery)}
                        </span>
                        <div className="flex items-center gap-2.5 text-xs text-[var(--color-content-muted)] mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                            {school.location.sector || school.location.area}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-[var(--color-content)] bg-[var(--color-surface-subtle)] px-1.5 py-0.2 rounded text-[11px]">
                            {Array.isArray(school.board) ? school.board.join(', ') : school.board || 'CBSE'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-semibold text-[11px]">
                            {school.fees.annualDisplay || (school.fees.cardFee ? `₹${school.fees.cardFee.toLocaleString('en-IN')}/yr` : 'Disclosed on request')}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-xs font-bold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 group-hover:translate-x-0.5">
                        <span>Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No matches fallback */}
            {matchingLocations.length === 0 && matchingSchools.length === 0 && (
              <div className="px-4 py-8 text-center space-y-2">
                <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-[var(--color-content)]">
                  No matching schools or sectors found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-[var(--color-content-muted)] max-w-xs mx-auto">
                  Try searching by known sectors like &ldquo;Techzone 4&rdquo;, &ldquo;Knowledge Park 5&rdquo;, or &ldquo;CBSE&rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div
            onClick={handleSubmit}
            className="px-4 py-2.5 bg-[var(--color-surface-muted)] hover:bg-[var(--color-accent-light)] text-center text-xs font-bold text-[var(--color-accent)] cursor-pointer transition-colors border-t border-[var(--color-border)] flex items-center justify-center gap-1.5"
          >
            <span>Explore all results for &ldquo;{query || 'Greater Noida West'}&rdquo;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};

