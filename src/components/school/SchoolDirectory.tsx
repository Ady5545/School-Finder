'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  MapPin,
  Scale,
  X,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { useSchoolStore } from '../../lib/schoolStore';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

interface SchoolDirectoryProps {
  initialSchools: School[];
  distinctBoards: string[];
  distinctAreas: string[];
  initialQuery?: string;
  initialBoard?: string;
  initialArea?: string;
}

export const SchoolDirectory: React.FC<SchoolDirectoryProps> = ({
  initialSchools,
  distinctBoards,
  distinctAreas,
  initialQuery = '',
  initialBoard = '',
  initialArea = '',
}) => {
  const { compareList, clearCompare, removeCompare } = useSchoolStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedBoard, setSelectedBoard] = useState(initialBoard);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'fee-asc' | 'fee-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter and sort logic
  const filteredSchools = useMemo(() => {
    let result = [...initialSchools];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.location.area.toLowerCase().includes(q) ||
          s.location.sector.toLowerCase().includes(q) ||
          s.board.some(b => b.toLowerCase().includes(q)) ||
          s.tagline?.toLowerCase().includes(q) ||
          s.summary?.toLowerCase().includes(q)
      );
    }

    // Board filter
    if (selectedBoard) {
      result = result.filter(s =>
        s.board.some(b => b.toLowerCase() === selectedBoard.toLowerCase())
      );
    }

    // Area filter
    if (selectedArea) {
      result = result.filter(
        s =>
          s.location.area.toLowerCase() === selectedArea.toLowerCase() ||
          s.location.sector.toLowerCase() === selectedArea.toLowerCase()
      );
    }

    // Fee Tier filter
    if (selectedFeeTier !== 'all') {
      result = result.filter(s => {
        const annual = s.fees.cardFee || 0;
        if (selectedFeeTier === 'under-100k') return annual <= 100000;
        if (selectedFeeTier === '100k-150k') return annual > 100000 && annual <= 150000;
        if (selectedFeeTier === '150k-200k') return annual > 150000 && annual <= 200000;
        if (selectedFeeTier === 'above-200k') return annual > 200000;
        return true;
      });
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'fee-asc') {
      result.sort((a, b) => (a.fees.cardFee || 0) - (b.fees.cardFee || 0));
    } else if (sortBy === 'fee-desc') {
      result.sort((a, b) => (b.fees.cardFee || 0) - (a.fees.cardFee || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0));
    }

    return result;
  }, [initialSchools, searchQuery, selectedBoard, selectedArea, selectedFeeTier, sortBy]);

  const activeFiltersCount =
    (selectedBoard ? 1 : 0) +
    (selectedArea ? 1 : 0) +
    (selectedFeeTier !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBoard('');
    setSelectedArea('');
    setSelectedFeeTier('all');
    setSortBy('featured');
  };

  return (
    <div className="w-full flex flex-col">
      {/* Search and Quick Filters Bar */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by school name, sector, board (e.g., DPS, Techzone 4, CBSE)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-content)] placeholder:text-[var(--color-content-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer focus:border-[var(--color-primary)] outline-none"
              >
                <option value="featured">Featured Order</option>
                <option value="name">Name (A to Z)</option>
                <option value="rating">Rating (Highest)</option>
                <option value="fee-asc">Fees: Low to High</option>
                <option value="fee-desc">Fees: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[var(--color-border)] rounded-xl p-0.5 bg-[var(--color-surface-subtle)]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List View"
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  viewMode === 'list' ? 'bg-white shadow-2xs text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Ribbon */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
          <span className="font-bold text-[var(--color-content)] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Board:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedBoard('')}
            className={cn(
              'px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer',
              !selectedBoard
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-slate-300'
            )}
          >
            All Boards
          </button>

          {distinctBoards.map(board => (
            <button
              key={board}
              type="button"
              onClick={() => setSelectedBoard(selectedBoard === board ? '' : board)}
              className={cn(
                'px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer',
                selectedBoard === board
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-slate-300'
              )}
            >
              {board}
            </button>
          ))}

          <span className="font-bold text-[var(--color-content)] ml-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Sector:</span>
          </span>

          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">All Sectors</option>
            {distinctAreas.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <span className="font-bold text-[var(--color-content)] ml-2">Fees:</span>
          <select
            value={selectedFeeTier}
            onChange={e => setSelectedFeeTier(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)]"
          >
            <option value="all">Any Annual Fee</option>
            <option value="under-100k">Under ₹1,00,000 / yr</option>
            <option value="100k-150k">₹1,00,000 – ₹1,50,000 / yr</option>
            <option value="150k-200k">₹1,50,000 – ₹2,00,000 / yr</option>
            <option value="above-200k">Above ₹2,00,000 / yr</option>
          </select>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-[var(--color-content)]">
            {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <span className="text-xs text-[var(--color-content-muted)] font-medium">
          Greater Noida West & Extension
        </span>
      </div>

      {/* Results Grid / List */}
      {filteredSchools.length > 0 ? (
        <div
          className={cn(
            'gap-6',
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col space-y-4'
          )}
        >
          {filteredSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No schools match your filters"
          description="Try broadening your sector selection, changing fee ranges, or clearing search criteria to view all available institutions."
          actionLabel="Clear All Filters"
          onAction={resetAllFilters}
        />
      )}

      {/* Floating Compare Tray / Indicator */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-xl bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight">
                {compareList.length} {compareList.length === 1 ? 'school' : 'schools'} in comparison
              </span>
              <span className="text-[10px] text-slate-400">
                {compareList.length < 2 ? 'Add at least 2 schools to compare' : 'Ready for side-by-side analysis'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
            <Link href="/compare">
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold"
              >
                Compare Now ({compareList.length})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
