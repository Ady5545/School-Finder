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
  Map as MapIcon,
  Star,
} from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { BackToTop } from '../ui/BackToTop';
import { DirectoryInteractiveMap, calculateDistance, POPULAR_PROXIMITY_AREAS } from './DirectoryInteractiveMap';
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
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'fee-asc' | 'fee-desc' | 'rating' | 'distance'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(true);

  // Proximity filter states
  const [selectedProximityArea, setSelectedProximityArea] = useState<string>('');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | null>(null);
  const [proximityCoords, setProximityCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeMapSchoolSlug, setActiveMapSchoolSlug] = useState<string | null>(null);

  // Handle proximity change from the map or filter controls
  const handleProximityChange = (
    area: string,
    radiusKm: number | null,
    coords?: { lat: number; lng: number } | null
  ) => {
    setSelectedProximityArea(area);
    setSelectedRadiusKm(radiusKm);
    if (coords !== undefined) {
      setProximityCoords(coords);
    } else if (area) {
      const anchor = POPULAR_PROXIMITY_AREAS.find(a => a.id === area);
      setProximityCoords(anchor ? anchor.coords : null);
    } else {
      setProximityCoords(null);
    }

    // If an area is selected, switch to distance sorting automatically for intuitive user experience
    if (area) {
      setSortBy('distance');
    } else if (sortBy === 'distance') {
      setSortBy('featured');
    }
  };

  // Precompute distances for each school from active proximity coordinates
  const schoolDistances = useMemo(() => {
    const map = new Map<string, number>();
    if (!proximityCoords) return map;

    initialSchools.forEach(s => {
      const lat = s.location.coordinates?.lat;
      const lng = s.location.coordinates?.lng;
      if (typeof lat === 'number' && typeof lng === 'number') {
        const dist = calculateDistance(proximityCoords.lat, proximityCoords.lng, lat, lng);
        map.set(s.id, dist);
      }
    });
    return map;
  }, [initialSchools, proximityCoords]);

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
        if (!s.fees.cardFee || s.fees.comparableAnnualAvailable === false || s.fees.verificationStatus !== 'verified_from_source') {
          return false;
        }
        const annual = s.fees.cardFee;
        if (selectedFeeTier === 'under-100k') return annual <= 100000;
        if (selectedFeeTier === '100k-150k') return annual > 100000 && annual <= 150000;
        if (selectedFeeTier === '150k-200k') return annual > 150000 && annual <= 200000;
        if (selectedFeeTier === 'above-200k') return annual > 200000;
        return true;
      });
    }

    // Proximity radius filter
    if (selectedRadiusKm !== null && proximityCoords) {
      result = result.filter(s => {
        const dist = schoolDistances.get(s.id);
        return dist !== undefined ? dist <= selectedRadiusKm : true;
      });
    }

    // Sort
    if (sortBy === 'distance' && proximityCoords) {
      result.sort((a, b) => (schoolDistances.get(a.id) ?? 999) - (schoolDistances.get(b.id) ?? 999));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'fee-asc') {
      result.sort((a, b) => {
        const feeA = (a.fees.comparableAnnualAvailable !== false && a.fees.cardFee) ? a.fees.cardFee : Infinity;
        const feeB = (b.fees.comparableAnnualAvailable !== false && b.fees.cardFee) ? b.fees.cardFee : Infinity;
        return feeA - feeB;
      });
    } else if (sortBy === 'fee-desc') {
      result.sort((a, b) => {
        const feeA = (a.fees.comparableAnnualAvailable !== false && a.fees.cardFee) ? a.fees.cardFee : -Infinity;
        const feeB = (b.fees.comparableAnnualAvailable !== false && b.fees.cardFee) ? b.fees.cardFee : -Infinity;
        return feeB - feeA;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => ((b.rating?.score || 0) - (a.rating?.score || 0)) || ((b.rating?.reviewsCount || 0) - (a.rating?.reviewsCount || 0)));
    }

    return result;
  }, [initialSchools, searchQuery, selectedBoard, selectedArea, selectedFeeTier, selectedRadiusKm, proximityCoords, schoolDistances, sortBy]);

  const activeFiltersCount =
    (selectedBoard ? 1 : 0) +
    (selectedArea ? 1 : 0) +
    (selectedFeeTier !== 'all' ? 1 : 0) +
    (selectedProximityArea ? 1 : 0) +
    (selectedRadiusKm ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBoard('');
    setSelectedArea('');
    setSelectedFeeTier('all');
    setSelectedProximityArea('');
    setSelectedRadiusKm(null);
    setProximityCoords(null);
    setActiveMapSchoolSlug(null);
    setSortBy('featured');
  };

  return (
    <div className="w-full flex flex-col relative">
      {/* Search and Quick Filters Bar */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 sm:p-5 shadow-warm-xs mb-6">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by school name, sector, board (e.g., DPS, Techzone 4, CBSE)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-sm text-[var(--color-content)] placeholder:text-[var(--color-content-muted)]/70 focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-light)] outline-none transition-all shadow-warm-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown, Rating Toggle, Map Toggle, and View Mode */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* 1-Click Rating Sort Toggle */}
            <button
              type="button"
              id="sort-by-rating-toggle"
              onClick={() => {
                setSortBy(prev => (prev === 'rating' ? 'featured' : 'rating'));
              }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-warm-2xs select-none',
                sortBy === 'rating'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-warm-xs ring-2 ring-amber-200'
                  : 'bg-white text-slate-700 border-[var(--color-border-strong)] hover:border-amber-400 hover:text-amber-800'
              )}
              aria-pressed={sortBy === 'rating'}
              title={
                sortBy === 'rating'
                  ? 'Currently sorted by highest rating (Click to return to Featured)'
                  : 'Sort schools by review rating (highest first)'
              }
            >
              <Star
                className={cn(
                  'w-3.5 h-3.5 transition-transform',
                  sortBy === 'rating' ? 'fill-white text-white scale-110' : 'text-amber-500 fill-amber-500/20'
                )}
              />
              <span>Top Rated</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 md:w-44">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none shadow-warm-2xs"
              >
                <option value="featured">Featured Order</option>
                {proximityCoords && (
                  <option value="distance">Proximity: Nearest First</option>
                )}
                <option value="rating">Rating (Highest)</option>
                <option value="name">Name (A to Z)</option>
                <option value="fee-asc">Fees: Low to High</option>
                <option value="fee-desc">Fees: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Map Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-warm-2xs',
                showMap
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-600 border-[var(--color-border-strong)] hover:text-slate-900'
              )}
              title={showMap ? 'Hide interactive map' : 'Show interactive map of all 17 schools'}
            >
              <MapPin className={cn('w-3.5 h-3.5', showMap ? 'text-amber-600' : 'text-slate-500')} />
              <span>{showMap ? 'Map Active' : 'View Map'}</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[var(--color-border)] rounded-xl p-0.5 bg-[var(--color-surface-subtle)]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                className={cn(
                  'p-1.5 rounded-lg transition-all cursor-pointer',
                  viewMode === 'grid' ? 'bg-white shadow-warm-2xs text-[var(--color-primary)] font-bold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List View"
                className={cn(
                  'p-1.5 rounded-lg transition-all cursor-pointer',
                  viewMode === 'list' ? 'bg-white shadow-warm-2xs text-[var(--color-primary)] font-bold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Ribbon */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3.5 border-t border-[var(--color-border-subtle)] text-xs">
          <span className="font-bold text-[var(--color-content)] flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Board:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedBoard('')}
            className={cn(
              'px-3 py-1 rounded-xl border font-semibold transition-all cursor-pointer',
              !selectedBoard
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-warm-2xs'
                : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-content)]'
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
                'px-3 py-1 rounded-xl border font-semibold transition-all cursor-pointer',
                selectedBoard === board
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-warm-2xs'
                  : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-content)]'
              )}
            >
              {board}
            </button>
          ))}

          <span className="font-bold text-[var(--color-content)] ml-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Sector:</span>
          </span>

          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-warm-2xs"
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
            className="px-3 py-1.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-warm-2xs"
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
              className="ml-auto text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Component for All 17 Schools with Proximity Filtering */}
      {showMap && (
        <DirectoryInteractiveMap
          schools={initialSchools}
          selectedProximityArea={selectedProximityArea}
          selectedRadiusKm={selectedRadiusKm}
          onProximityChange={handleProximityChange}
          activeSchoolSlug={activeMapSchoolSlug}
          onSelectSchool={school => setActiveMapSchoolSlug(school.slug)}
        />
      )}

      {/* Results Header Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-[var(--color-content)]">
            {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent)] font-bold px-2.5 py-0.5 rounded-full border border-[var(--color-accent)]/20">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
          {selectedRadiusKm && proximityCoords && (
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Within {selectedRadiusKm} km
            </span>
          )}
          {sortBy === 'rating' && (
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
              <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
              <span>Top Rated</span>
              <button
                type="button"
                onClick={() => setSortBy('featured')}
                className="ml-1 text-amber-800 hover:text-amber-950 p-0.5 transition-colors cursor-pointer"
                title="Reset to default order"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>

        <span className="text-xs text-[var(--color-content-muted)] font-medium">
          Greater Noida West &amp; Extension
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
            <SchoolCard
              key={school.id}
              school={school}
              distanceKm={schoolDistances.get(school.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No schools match your filters"
          description="Try broadening your sector selection, changing fee ranges, expanding proximity radius, or clearing search criteria to view all available institutions."
          actionLabel="Clear All Filters"
          onAction={resetAllFilters}
        />
      )}

      {/* Floating Action Button: Back to Top */}
      <BackToTop threshold={350} />
    </div>
  );
};

