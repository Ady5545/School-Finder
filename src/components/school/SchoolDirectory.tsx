'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Star,
  LocateFixed,
  Navigation,
} from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { SponsoredPlacementCard } from './SponsoredPlacementCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { BackToTop } from '../ui/BackToTop';
import {
  DirectoryInteractiveMap,
  calculateDistance,
  POPULAR_PROXIMITY_AREAS,
  RADIUS_OPTIONS,
} from './DirectoryInteractiveMap';
import { useRouter, usePathname } from 'next/navigation';
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
  
  // Default map to false initially so mobile users see immediate school cards without any layout shift
  const [showMap, setShowMap] = useState(false);

  // Proximity filter states
  const [selectedProximityArea, setSelectedProximityArea] = useState<string>('');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | null>(null);
  const [proximityCoords, setProximityCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeMapSchoolSlug, setActiveMapSchoolSlug] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Mobile Filter Sheet Drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // On large desktop screens, open map in supporting sidebar by default
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setShowMap(true);
    }
  }, []);

  // Listen to search changes triggered from Header's integrated search field
  useEffect(() => {
    const handleNavSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (typeof customEvent.detail === 'string') {
        setSearchQuery(customEvent.detail);
      }
    };
    window.addEventListener('nav-search-change', handleNavSearch);
    return () => window.removeEventListener('nav-search-change', handleNavSearch);
  }, []);

  // Sync URL parameters smoothly without full page reloads
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedBoard) params.set('board', selectedBoard);
    if (selectedArea) params.set('area', selectedArea);
    if (selectedFeeTier !== 'all') params.set('fee', selectedFeeTier);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const newUrl = `${pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedBoard, selectedArea, selectedFeeTier, sortBy, pathname]);

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

    if (area) {
      setSortBy('distance');
    } else if (sortBy === 'distance') {
      setSortBy('featured');
    }
  };

  // Near Me handler using native geolocation
  const handleNearMe = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.');
      setTimeout(() => setLocationNotice(null), 4000);
      return;
    }
    setIsLocating(true);
    setLocationNotice(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        handleProximityChange('my-location', selectedRadiusKm || 5, coords);
        setLocationNotice('Proximity set to your current device location.');
        setTimeout(() => setLocationNotice(null), 4000);
      },
      err => {
        setIsLocating(false);
        setLocationNotice(
          err.code === 1
            ? 'Location permission denied. Please choose your sector from the list.'
            : 'Unable to detect location. Please choose your sector.'
        );
        setTimeout(() => setLocationNotice(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
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

    // Partition into Section A (Verified Images) and Section B (Photo Pending)
    const hasPhoto = (s: School) => Boolean(s.assets && s.assets.featured);
    const verifiedSchools = result.filter(s => hasPhoto(s));
    const pendingSchools = result.filter(s => !hasPhoto(s));

    // Secondary sort within each section
    const sortSection = (list: School[]) => {
      const copy = [...list];
      if (sortBy === 'distance' && proximityCoords) {
        copy.sort((a, b) => (schoolDistances.get(a.id) ?? 999) - (schoolDistances.get(b.id) ?? 999));
      } else if (sortBy === 'name') {
        copy.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'fee-asc') {
        copy.sort((a, b) => {
          const feeA = (a.fees.comparableAnnualAvailable !== false && a.fees.cardFee) ? a.fees.cardFee : Infinity;
          const feeB = (b.fees.comparableAnnualAvailable !== false && b.fees.cardFee) ? b.fees.cardFee : Infinity;
          return feeA - feeB;
        });
      } else if (sortBy === 'fee-desc') {
        copy.sort((a, b) => {
          const feeA = (a.fees.comparableAnnualAvailable !== false && a.fees.cardFee) ? a.fees.cardFee : -Infinity;
          const feeB = (b.fees.comparableAnnualAvailable !== false && b.fees.cardFee) ? b.fees.cardFee : -Infinity;
          return feeB - feeA;
        });
      } else if (sortBy === 'rating') {
        copy.sort((a, b) => ((b.rating?.score || 0) - (a.rating?.score || 0)) || ((b.rating?.reviewsCount || 0) - (a.rating?.reviewsCount || 0)));
      }
      return copy;
    };

    return [...sortSection(verifiedSchools), ...sortSection(pendingSchools)];
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

  // Find active location anchor label
  const activeAnchorLabel = useMemo(() => {
    if (selectedProximityArea === 'my-location') return 'Near Me (GPS)';
    if (selectedProximityArea) {
      const anchor = POPULAR_PROXIMITY_AREAS.find(a => a.id === selectedProximityArea);
      return anchor ? anchor.label.split('(')[0].trim() : selectedProximityArea;
    }
    return '';
  }, [selectedProximityArea]);

  return (
    <div className="w-full flex flex-col relative">
      {/* Search and Compact Filters Container */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-3.5 sm:p-4 shadow-warm-xs mb-6">
        {/* Row 1: Prominent Primary School Search Field */}
        <div className="relative w-full">
          <label htmlFor="main-school-search" className="sr-only">
            Search schools, sectors, boards
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary)] pointer-events-none" />
          <input
            id="main-school-search"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search school name, sector, board (e.g., DPS, Techzone 4, CBSE, Ryan)..."
            className="w-full pl-10 pr-24 py-2.5 sm:py-3 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs sm:text-sm text-[var(--color-content)] placeholder:text-[var(--color-content-muted)]/75 focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-light)] outline-none transition-all shadow-warm-2xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1 transition-colors rounded-lg hover:bg-slate-100"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 hidden sm:inline-block">
              {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'}
            </span>
          </div>
        </div>

        {/* Row 2: Desktop Compact Filters Ribbon (>= md) */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
          {/* Left: Filter Controls (Board, Location, Fees) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Board Selector */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-[var(--color-content)] flex items-center gap-1 mr-0.5">
                <Filter className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Board:</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedBoard('')}
                className={cn(
                  'px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer',
                  !selectedBoard
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs'
                    : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-content)]'
                )}
              >
                All
              </button>
              {distinctBoards.map(board => (
                <button
                  key={board}
                  type="button"
                  onClick={() => setSelectedBoard(selectedBoard === board ? '' : board)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer',
                    selectedBoard === board
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs'
                      : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-content)]'
                  )}
                >
                  {board}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Explore by Location: Sector Dropdown & Near Me */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[var(--color-content)] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Location:</span>
              </span>

              {/* Sector selector */}
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-2xs max-w-[150px]"
              >
                <option value="">All Sectors</option>
                {distinctAreas.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              {/* Near Me GPS Control */}
              <button
                type="button"
                onClick={handleNearMe}
                disabled={isLocating}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs',
                  selectedProximityArea === 'my-location'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-slate-700 border-[var(--color-border-strong)] hover:border-amber-400'
                )}
                title="Find schools near your current device location"
              >
                <LocateFixed className={cn('w-3 h-3', isLocating && 'animate-spin')} />
                <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
              </button>

              {/* Radius options if Proximity is active */}
              {selectedProximityArea && (
                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200">
                  {RADIUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleProximityChange(selectedProximityArea, opt.value, proximityCoords)}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer',
                        selectedRadiusKm === opt.value
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      )}
                    >
                      {opt.value} km
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleProximityChange('', null, null)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Clear proximity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Fee Range Selector */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-[var(--color-content)]">Fees:</span>
              <select
                value={selectedFeeTier}
                onChange={e => setSelectedFeeTier(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-2xs"
              >
                <option value="all">Any Fee</option>
                <option value="under-100k">Under ₹1L</option>
                <option value="100k-150k">₹1L – ₹1.5L</option>
                <option value="150k-200k">₹1.5L – ₹2L</option>
                <option value="above-200k">Above ₹2L</option>
              </select>
            </div>
          </div>

          {/* Right: Sort, Map Toggle, View Mode, Reset */}
          <div className="flex items-center gap-2">
            {/* Top Rated 1-click toggle */}
            <button
              type="button"
              id="sort-by-rating-toggle"
              onClick={() => {
                setSortBy(prev => (prev === 'rating' ? 'featured' : 'rating'));
              }}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs select-none',
                sortBy === 'rating'
                  ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-200'
                  : 'bg-white text-slate-700 border-[var(--color-border-strong)] hover:border-amber-400 hover:text-amber-800'
              )}
              aria-pressed={sortBy === 'rating'}
            >
              <Star
                className={cn(
                  'w-3 h-3 transition-transform',
                  sortBy === 'rating' ? 'fill-white text-white' : 'text-amber-500 fill-amber-500/20'
                )}
              />
              <span>Top Rated</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none pl-2.5 pr-6 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer focus:border-[var(--color-primary)] outline-none shadow-2xs"
              >
                <option value="featured">Sort: Featured</option>
                {proximityCoords && (
                  <option value="distance">Sort: Nearest First</option>
                )}
                <option value="rating">Sort: Top Rated</option>
                <option value="name">Sort: Name A-Z</option>
                <option value="fee-asc">Sort: Fees Low-High</option>
                <option value="fee-desc">Sort: Fees High-Low</option>
              </select>
              <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Map Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs',
                showMap
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-[var(--color-border-strong)] hover:border-slate-400'
              )}
            >
              <MapPin className={cn('w-3.5 h-3.5', showMap ? 'text-amber-600' : 'text-slate-500')} />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[var(--color-border)] rounded-lg p-0.5 bg-[var(--color-surface-subtle)]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                className={cn(
                  'p-1 rounded-md transition-all cursor-pointer',
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-[var(--color-primary)] font-bold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List View"
                className={cn(
                  'p-1 rounded-md transition-all cursor-pointer',
                  viewMode === 'list' ? 'bg-white shadow-2xs text-[var(--color-primary)] font-bold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset All Filters button if active */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Notice (Geolocation info/error feedback) */}
        {locationNotice && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between">
            <span>{locationNotice}</span>
            <button type="button" onClick={() => setLocationNotice(null)} className="text-amber-800 hover:text-amber-950">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Mobile Filter Control Bar (< md) */}
        <div className="flex md:hidden items-center gap-2 w-full pt-2.5 mt-2.5 border-t border-[var(--color-border-subtle)]">
          {/* Filter Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all min-h-[42px] cursor-pointer shadow-2xs',
              activeFiltersCount > 0
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-[var(--color-content)] border-[var(--color-border-strong)]'
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Select on Mobile */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] cursor-pointer focus:border-[var(--color-primary)] outline-none min-h-[42px] shadow-2xs"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
              <option value="fee-asc">Fees: Low-High</option>
              <option value="fee-desc">Fees: High-Low</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Map Toggle Button Mobile */}
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className={cn(
              'p-2 rounded-xl border text-xs font-bold transition-all min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer shadow-2xs shrink-0',
              showMap
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-600 border-[var(--color-border-strong)]'
            )}
            aria-label={showMap ? 'Hide interactive map' : 'Show interactive map'}
          >
            <MapPin className={cn('w-4 h-4', showMap ? 'text-amber-600' : 'text-slate-500')} />
          </button>
        </div>

        {/* Active Filter Chips Ribbon (Mobile) */}
        {activeFiltersCount > 0 && (
          <div className="flex md:hidden items-center gap-1.5 mt-2.5 pt-2 border-t border-[var(--color-border-subtle)] overflow-x-auto no-scrollbar text-[11px]">
            <span className="font-bold text-[var(--color-content-muted)] shrink-0 mr-1">Active:</span>
            
            {selectedBoard && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold border border-[var(--color-brand-200)] shrink-0">
                Board: {selectedBoard}
                <button type="button" onClick={() => setSelectedBoard('')} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedArea && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200 shrink-0">
                Sector: {selectedArea}
                <button type="button" onClick={() => setSelectedArea('')} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeAnchorLabel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold border border-amber-300 shrink-0">
                {activeAnchorLabel} {selectedRadiusKm ? `(${selectedRadiusKm}km)` : ''}
                <button type="button" onClick={() => handleProximityChange('', null, null)} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFeeTier !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0">
                Fee: {selectedFeeTier.replace('-', ' ')}
                <button type="button" onClick={() => setSelectedFeeTier('all')} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-300 shrink-0 max-w-[130px] truncate">
                "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')} className="p-0.5 hover:text-rose-600 shrink-0">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-rose-600 font-bold underline shrink-0 ml-1 py-0.5 px-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Filter Sheet Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter Schools"
        side="bottom"
      >
        <div className="flex flex-col gap-5 pb-4">
          {/* Curriculum / Board */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Curriculum / Board
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedBoard('')}
                className={cn(
                  'px-3.5 py-2 rounded-xl border text-xs font-bold transition-all min-h-[40px]',
                  !selectedBoard
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white text-slate-700 border-[var(--color-border-strong)]'
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
                    'px-3.5 py-2 rounded-xl border text-xs font-bold transition-all min-h-[40px]',
                    selectedBoard === board
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white text-slate-700 border-[var(--color-border-strong)]'
                  )}
                >
                  {board}
                </button>
              ))}
            </div>
          </div>

          {/* Explore by Location: Sector & Near Me */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Explore by Location (Greater Noida West)
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] outline-none min-h-[44px]"
              >
                <option value="">All Sectors</option>
                {distinctAreas.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleNearMe}
                disabled={isLocating}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold min-h-[44px] transition-all shrink-0',
                  selectedProximityArea === 'my-location'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-slate-700 border-[var(--color-border-strong)]'
                )}
              >
                <LocateFixed className={cn('w-4 h-4', isLocating && 'animate-spin')} />
                <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
              </button>
            </div>

            {/* Radius options if Near Me is selected */}
            {selectedProximityArea && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Radius:</span>
                {RADIUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleProximityChange(selectedProximityArea, opt.value, proximityCoords)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold border transition-all',
                      selectedRadiusKm === opt.value
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    )}
                  >
                    {opt.value} km
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fee Range Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Audited Annual Fee Range
            </label>
            <select
              value={selectedFeeTier}
              onChange={e => setSelectedFeeTier(e.target.value)}
              className="w-full p-3 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] outline-none min-h-[44px]"
            >
              <option value="all">Any Annual Fee Range</option>
              <option value="under-100k">Under ₹1,00,000 / year</option>
              <option value="100k-150k">₹1,00,000 – ₹1,50,000 / year</option>
              <option value="150k-200k">₹1,50,000 – ₹2,00,000 / year</option>
              <option value="above-200k">Above ₹2,00,000 / year</option>
            </select>
          </div>

          {/* Action Footer in Filter Drawer */}
          <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex-1 py-3 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 font-bold text-xs hover:bg-rose-100 transition-colors text-center min-h-[44px]"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-2 py-3 px-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs shadow-warm-xs text-center min-h-[44px]"
            >
              Show {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'}
            </button>
          </div>
        </div>
      </Drawer>

      {/* Main Results and Supporting Map Layout */}
      {/* Primary rule: Results are ALWAYS rendered first on mobile (order-1) so parents immediately see cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Results Column */}
        <div
          className={cn(
            'flex flex-col order-1 transition-all duration-200',
            showMap ? 'w-full lg:w-7/12 xl:w-2/3' : 'w-full'
          )}
        >
          {/* Results Status Header */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-[var(--color-content)]">
                {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent)] font-bold px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                  {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
              {selectedRadiusKm && proximityCoords && (
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Within {selectedRadiusKm} km
                </span>
              )}
              {sortBy === 'rating' && (
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
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
            
            {/* Mobile Map Toggle Affordance */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                  showMap
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "bg-white text-slate-700 border-[var(--color-border-strong)]"
                )}
              >
                <MapPin className={cn("w-3.5 h-3.5", showMap ? "text-amber-600" : "text-slate-500")} />
                <span>{showMap ? 'Hide Map' : 'View Campus Map'}</span>
              </button>
            </div>
          </div>
          
          {/* Promoted / Sponsored Partner Placement */}
          <SponsoredPlacementCard placement="featured_card" className="mb-6" />

          {/* Results Grid / List */}
          {filteredSchools.length > 0 ? (
            <div
              className={cn(
                'gap-5',
                viewMode === 'grid'
                  ? showMap
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col space-y-4'
              )}
            >
              {filteredSchools.map((school, index) => (
                <div
                  key={school.id}
                  className="reveal-on-scroll"
                  data-reveal-delay={String((index % 3) + 1)}
                >
                  <SchoolCard
                    school={school}
                    distanceKm={schoolDistances.get(school.id)}
                  />
                </div>
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
        </div>
        
        {/* Supporting Map Column (order-2 so on mobile it sits comfortably below the initial results when toggled) */}
        {showMap && (
          <div className="w-full lg:w-5/12 xl:w-1/3 order-2">
            <div className="sticky top-20">
              <DirectoryInteractiveMap
                schools={initialSchools}
                selectedProximityArea={selectedProximityArea}
                selectedRadiusKm={selectedRadiusKm}
                onProximityChange={handleProximityChange}
                activeSchoolSlug={activeMapSchoolSlug}
                onSelectSchool={school => setActiveMapSchoolSlug(school.slug)}
                onClose={() => setShowMap(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button: Back to Top */}
      <BackToTop threshold={350} />
    </div>
  );
};
