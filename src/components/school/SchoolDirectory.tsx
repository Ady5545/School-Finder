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
  initialSports?: string[];
  initialAdmissionStatus?: string;
  initialGrade?: string;
  initialSiblingOnly?: boolean;
  initialFeeTier?: string;
  initialSortBy?: string;
}

export const SchoolDirectory: React.FC<SchoolDirectoryProps> = ({
  initialSchools,
  distinctBoards,
  distinctAreas,
  initialQuery = '',
  initialBoard = '',
  initialArea = '',
  initialSports = [],
  initialAdmissionStatus = 'all',
  initialGrade = 'all',
  initialSiblingOnly = false,
  initialFeeTier = 'all',
  initialSortBy = 'featured',
}) => {
  const { compareList, clearCompare, removeCompare } = useSchoolStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedBoard, setSelectedBoard] = useState(initialBoard);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedSports, setSelectedSports] = useState<string[]>(initialSports);
  const [selectedAdmissionStatus, setSelectedAdmissionStatus] = useState<string>(initialAdmissionStatus);
  const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
  const [siblingOnly, setSiblingOnly] = useState<boolean>(initialSiblingOnly);
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>(initialFeeTier);
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'fee-asc' | 'fee-desc' | 'rating' | 'distance'>(
    (initialSortBy as any) || 'featured'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Default map to false initially so mobile users see immediate school cards without any layout shift
  const [showMap, setShowMap] = useState(false);

  // Sports Popover Dropdown state for desktop
  const [isSportsMenuOpen, setIsSportsMenuOpen] = useState(false);
  const sportsMenuRef = React.useRef<HTMLDivElement>(null);

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

  // Dynamically derive available sports from canonical dataset
  const availableSports = useMemo(() => {
    const set = new Set<string>();
    initialSchools.forEach(s => {
      if (Array.isArray(s.sports)) {
        s.sports.forEach(sp => {
          if (sp && sp.trim()) set.add(sp.trim());
        });
      }
    });
    return Array.from(set).sort();
  }, [initialSchools]);

  // Close desktop sports dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sportsMenuRef.current && !sportsMenuRef.current.contains(event.target as Node)) {
        setIsSportsMenuOpen(false);
      }
    };
    if (isSportsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSportsMenuOpen]);

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
    if (selectedSports.length > 0) params.set('sports', selectedSports.join(','));
    if (selectedAdmissionStatus !== 'all') params.set('admission', selectedAdmissionStatus);
    if (selectedGrade !== 'all') params.set('grade', selectedGrade);
    if (siblingOnly) params.set('sibling', 'true');
    if (selectedFeeTier !== 'all') params.set('fee', selectedFeeTier);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const newUrl = `${pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [
    searchQuery,
    selectedBoard,
    selectedArea,
    selectedSports,
    selectedAdmissionStatus,
    selectedGrade,
    siblingOnly,
    selectedFeeTier,
    sortBy,
    pathname,
  ]);

  // Toggle sport selection
  const toggleSport = (sport: string) => {
    setSelectedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  // Helper to match admission status
  const matchesAdmissionStatus = (school: School, status: string): boolean => {
    if (!status || status === 'all') return true;
    const admStatus = (school.admissions?.status || '').toLowerCase();
    if (status === 'open') {
      return admStatus.includes('open');
    }
    if (status === 'pre_registration') {
      return admStatus.includes('pre_registration') || admStatus.includes('pre-registration');
    }
    if (status === 'upcoming') {
      return admStatus.includes('opening_soon') || admStatus.includes('pending') || admStatus.includes('upcoming');
    }
    if (status === 'inquire') {
      return admStatus.includes('inquire');
    }
    return true;
  };

  // Helper to match grade coverage
  const coversGrade = (school: School, grade: string): boolean => {
    if (!grade || grade === 'all') return true;
    const raw = (school.gradeRange?.raw || '').toLowerCase();
    const to = (school.gradeRange?.to || '').toLowerCase();
    const from = (school.gradeRange?.from || '').toLowerCase();

    let maxGrade = 12;
    if (to.includes('8') || raw.includes('8')) maxGrade = 8;
    else if (to.includes('10') || raw.includes('10')) maxGrade = 10;
    else if (to.includes('12') || raw.includes('12') || to.includes('xii') || raw.includes('xii')) maxGrade = 12;

    let minGrade = 0;
    if (from.includes('1') && !from.includes('10') && !from.includes('11') && !from.includes('12')) minGrade = 1;

    if (grade === 'pre-primary' || grade === 'nursery') {
      return from.includes('nursery') || from.includes('play') || from.includes('montessori') || raw.includes('nursery') || raw.includes('pre');
    }
    if (grade === 'primary') return minGrade <= 1 && maxGrade >= 5;
    if (grade === 'middle') return maxGrade >= 8;
    if (grade === 'secondary') return maxGrade >= 10;
    if (grade === 'senior-secondary') return maxGrade >= 12;
    return true;
  };

  // Helper to match sibling concession
  const hasSiblingConcession = (school: School): boolean => {
    if (!school.fees || !Array.isArray(school.fees.concessions)) return false;
    return school.fees.concessions.some(c => {
      const cat = c.category || '';
      const title = c.title || '';
      const desc = c.discountDescription || '';
      const elig = c.eligibilityCriteria || '';
      const text = `${cat} ${title} ${desc} ${elig}`.toLowerCase();
      return (
        cat === 'sibling' ||
        text.includes('sibling') ||
        text.includes('second child') ||
        text.includes('real brother') ||
        text.includes('sister')
      );
    });
  };

  // Helper to match search query across name, alternateNames, location, board, tagline, summary, sports
  const matchesSearch = (school: School, query: string): boolean => {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    const boards = Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[];
    const altNames = Array.isArray(school.alternateNames) ? school.alternateNames : [];
    const sports = Array.isArray(school.sports) ? school.sports : [];

    return (
      school.name.toLowerCase().includes(q) ||
      altNames.some(an => an.toLowerCase().includes(q)) ||
      (school.location?.area || '').toLowerCase().includes(q) ||
      (school.location?.sector || '').toLowerCase().includes(q) ||
      (school.location?.city || '').toLowerCase().includes(q) ||
      boards.some(b => b.toLowerCase().includes(q)) ||
      (school.tagline || '').toLowerCase().includes(q) ||
      (school.summary || '').toLowerCase().includes(q) ||
      sports.some(sp => sp.toLowerCase().includes(q))
    );
  };

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
      if (
        s.location.coordinates?.isVerified === true &&
        typeof lat === 'number' &&
        typeof lng === 'number'
      ) {
        const dist = calculateDistance(proximityCoords.lat, proximityCoords.lng, lat, lng);
        map.set(s.id, dist);
      }
    });
    return map;
  }, [initialSchools, proximityCoords]);

  // Filter and sort logic
  const filteredSchools = useMemo(() => {
    let result = [...initialSchools];

    // 1. Search Query Filter (name, altNames, location, board, tagline, summary, sports)
    if (searchQuery.trim()) {
      result = result.filter(s => matchesSearch(s, searchQuery));
    }

    // 2. Board Filter
    if (selectedBoard) {
      result = result.filter(s => {
        const boards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
        return boards.some(b => b.toLowerCase() === selectedBoard.toLowerCase());
      });
    }

    // 3. Area / Sector Filter
    if (selectedArea) {
      result = result.filter(
        s =>
          s.location.area.toLowerCase() === selectedArea.toLowerCase() ||
          s.location.sector.toLowerCase() === selectedArea.toLowerCase()
      );
    }

    // 4. Sports & Athletics Filter (Multi-select: schools matching all selected sports)
    if (selectedSports.length > 0) {
      result = result.filter(s => {
        const sports = Array.isArray(s.sports) ? s.sports : [];
        if (sports.length === 0) return false;
        return selectedSports.every(sp => sports.includes(sp));
      });
    }

    // 5. Admissions Status Filter
    if (selectedAdmissionStatus !== 'all') {
      result = result.filter(s => matchesAdmissionStatus(s, selectedAdmissionStatus));
    }

    // 6. Grade / Class Level Filter
    if (selectedGrade !== 'all') {
      result = result.filter(s => coversGrade(s, selectedGrade));
    }

    // 7. Sibling Concession Filter
    if (siblingOnly) {
      result = result.filter(s => hasSiblingConcession(s));
    }

    // 8. Fee Tier Filter
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

    // 9. Proximity Radius Filter
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

    const combined = [...sortSection(verifiedSchools), ...sortSection(pendingSchools)];

    // Default directory order keeps schools with disclosed annual fees first.
    // Schools without a public annual figure stay at the end, with Ryan last as requested.
    if (sortBy === 'featured') {
      const publicPriority = (school: School) => {
        if (school.slug === 'ryan-international-school-noida-extension') return 2;
        return school.fees?.annualDisplay ? 0 : 1;
      };
      combined.sort((a, b) => publicPriority(a) - publicPriority(b));
    }

    return combined;
  }, [
    initialSchools,
    searchQuery,
    selectedBoard,
    selectedArea,
    selectedSports,
    selectedAdmissionStatus,
    selectedGrade,
    siblingOnly,
    selectedFeeTier,
    selectedRadiusKm,
    proximityCoords,
    schoolDistances,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedBoard ? 1 : 0) +
    (selectedArea ? 1 : 0) +
    (selectedSports.length > 0 ? selectedSports.length : 0) +
    (selectedAdmissionStatus !== 'all' ? 1 : 0) +
    (selectedGrade !== 'all' ? 1 : 0) +
    (siblingOnly ? 1 : 0) +
    (selectedFeeTier !== 'all' ? 1 : 0) +
    (selectedProximityArea ? 1 : 0) +
    (selectedRadiusKm ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBoard('');
    setSelectedArea('');
    setSelectedSports([]);
    setSelectedAdmissionStatus('all');
    setSelectedGrade('all');
    setSiblingOnly(false);
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
            Search schools, sectors, boards, sports
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary)] pointer-events-none" />
          <input
            id="main-school-search"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search school name, alternate name, sector, board, sports (e.g., DPS, Swimming, CBSE, Techzone 4)..."
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
        <div className="hidden md:flex flex-wrap items-center justify-between gap-2.5 mt-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
          {/* Left Controls: Board, Sector, Grade, Admissions, Fees, Sports, Sibling */}
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
                  'px-2 py-1 rounded-lg border font-semibold transition-all cursor-pointer text-xs',
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
                    'px-2 py-1 rounded-lg border font-semibold transition-all cursor-pointer text-xs',
                    selectedBoard === board
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs'
                      : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-content)]'
                  )}
                >
                  {board}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* Explore by Location: Sector Dropdown & Near Me */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[var(--color-content)] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Sector:</span>
              </span>

              {/* Sector selector */}
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-2xs max-w-[130px]"
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
                  'flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs',
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

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* Grade / Class Filter */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-[var(--color-content)]">Grade:</span>
              <select
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-2xs"
              >
                <option value="all">All Grades</option>
                <option value="pre-primary">Pre-Primary / Nursery</option>
                <option value="primary">Primary (Class 1–5)</option>
                <option value="middle">Middle (Class 6–8)</option>
                <option value="secondary">Secondary (Class 9–10)</option>
                <option value="senior-secondary">Senior Secondary (11–12)</option>
              </select>
            </div>

            {/* Admissions Status Filter */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-[var(--color-content)]">Admissions:</span>
              <select
                value={selectedAdmissionStatus}
                onChange={e => setSelectedAdmissionStatus(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-2xs"
              >
                <option value="all">All Statuses</option>
                <option value="open">Admissions Open</option>
                <option value="pre_registration">Pre-Registration</option>
                <option value="upcoming">Upcoming / Pending</option>
                <option value="inquire">Inquire with School</option>
              </select>
            </div>

            {/* Fee Tier Selector */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-[var(--color-content)]">Fees:</span>
              <select
                value={selectedFeeTier}
                onChange={e => setSelectedFeeTier(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[var(--color-border-strong)] bg-white text-xs font-semibold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)] shadow-2xs"
              >
                <option value="all">Any Fee</option>
                <option value="under-100k">Under ₹1L</option>
                <option value="100k-150k">₹1L – ₹1.5L</option>
                <option value="150k-200k">₹1.5L – ₹2L</option>
                <option value="above-200k">Above ₹2L</option>
              </select>
            </div>

            {/* Sports Filter Popover Dropdown */}
            <div className="relative" ref={sportsMenuRef}>
              <button
                type="button"
                onClick={() => setIsSportsMenuOpen(!isSportsMenuOpen)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs',
                  selectedSports.length > 0
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white text-slate-700 border-[var(--color-border-strong)] hover:border-[var(--color-primary)]'
                )}
                aria-expanded={isSportsMenuOpen}
              >
                <span>Sports {selectedSports.length > 0 ? `(${selectedSports.length})` : ''}</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform', isSportsMenuOpen && 'rotate-180')} />
              </button>

              {isSportsMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-warm-lg border border-[var(--color-border)] p-3 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-border-subtle)]">
                    <span className="text-xs font-bold text-[var(--color-content)]">Sports & Athletics</span>
                    {selectedSports.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSports([])}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar py-1">
                    {availableSports.map(sport => {
                      const isSelected = selectedSports.includes(sport);
                      return (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => toggleSport(sport)}
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-left transition-colors cursor-pointer',
                            isSelected
                              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          )}
                        >
                          <div
                            className={cn(
                              'w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0',
                              isSelected
                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                                : 'border-slate-300 bg-white'
                            )}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">{sport}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sibling Concession 1-click Filter Toggle */}
            <button
              type="button"
              onClick={() => setSiblingOnly(!siblingOnly)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs select-none',
                siblingOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-[var(--color-border-strong)] hover:border-emerald-500 hover:text-emerald-900'
              )}
              title="Filter schools providing verified sibling fee concessions"
            >
              <Check className={cn('w-3 h-3', siblingOnly ? 'text-white' : 'text-slate-400')} />
              <span>Sibling Concession</span>
            </button>
          </div>

          {/* Right Controls: Sort, Top Rated, Map Toggle, View Mode, Reset */}
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

        {/* Active Filter Chips Ribbon (Desktop & Mobile) */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[var(--color-border-subtle)] overflow-x-auto no-scrollbar text-[11px]">
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

            {selectedGrade !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-bold border border-blue-200 shrink-0">
                Grade: {selectedGrade === 'pre-primary' ? 'Pre-Primary' : selectedGrade === 'senior-secondary' ? 'Senior Sec (11-12)' : selectedGrade.charAt(0).toUpperCase() + selectedGrade.slice(1)}
                <button type="button" onClick={() => setSelectedGrade('all')} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedAdmissionStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 font-bold border border-purple-200 shrink-0">
                Admissions: {selectedAdmissionStatus === 'open' ? 'Open' : selectedAdmissionStatus === 'pre_registration' ? 'Pre-Reg' : selectedAdmissionStatus === 'upcoming' ? 'Upcoming' : 'Inquire'}
                <button type="button" onClick={() => setSelectedAdmissionStatus('all')} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSports.map(sport => (
              <span key={sport} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 shrink-0">
                Sport: {sport}
                <button type="button" onClick={() => toggleSport(sport)} className="p-0.5 hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {siblingOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0">
                Sibling Concession
                <button type="button" onClick={() => setSiblingOnly(false)} className="p-0.5 hover:text-rose-600">
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
              className="text-rose-600 font-bold underline shrink-0 ml-1 py-0.5 px-1 cursor-pointer hover:text-rose-800"
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
        <div className="flex flex-col gap-4 pb-4">
          {/* Curriculum / Board */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Curriculum / Board
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedBoard('')}
                className={cn(
                  'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all min-h-[38px]',
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
                    'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all min-h-[38px]',
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

          {/* Grade / Class Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Grade / Class Level
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] outline-none min-h-[42px]"
            >
              <option value="all">All Grades</option>
              <option value="pre-primary">Pre-Primary / Nursery</option>
              <option value="primary">Primary (Class 1–5)</option>
              <option value="middle">Middle (Class 6–8)</option>
              <option value="secondary">Secondary (Class 9–10)</option>
              <option value="senior-secondary">Senior Secondary (Class 11–12)</option>
            </select>
          </div>

          {/* Admissions Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Admissions Status
            </label>
            <select
              value={selectedAdmissionStatus}
              onChange={e => setSelectedAdmissionStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] outline-none min-h-[42px]"
            >
              <option value="all">All Admissions Statuses</option>
              <option value="open">Admissions Open</option>
              <option value="pre_registration">Pre-Registration</option>
              <option value="upcoming">Upcoming / Schedule Pending</option>
              <option value="inquire">Inquire with School</option>
            </select>
          </div>

          {/* Sports & Athletics Multi-Select */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
                Sports & Athletics
              </label>
              {selectedSports.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSports([])}
                  className="text-[11px] font-bold text-rose-600"
                >
                  Clear ({selectedSports.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {availableSports.map(sport => {
                const isSelected = selectedSports.includes(sport);
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all',
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                        : 'bg-white text-slate-700 border-slate-300'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{sport}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sibling Concession Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Fee Concessions
            </label>
            <button
              type="button"
              onClick={() => setSiblingOnly(!siblingOnly)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all min-h-[42px]',
                siblingOnly
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                  : 'bg-white text-slate-700 border-[var(--color-border-strong)]'
              )}
            >
              <span>Sibling Concession Available</span>
              <div
                className={cn(
                  'w-5 h-5 rounded-md flex items-center justify-center border transition-colors',
                  siblingOnly ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                )}
              >
                {siblingOnly && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          </div>

          {/* Explore by Location: Sector & Near Me */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Location (Greater Noida West)
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] outline-none min-h-[42px]"
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
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold min-h-[42px] transition-all shrink-0',
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
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Radius:</span>
                {RADIUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleProximityChange(selectedProximityArea, opt.value, proximityCoords)}
                    className={cn(
                      'px-2 py-0.5 rounded-lg text-xs font-bold border transition-all',
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider block">
              Audited Annual Fee Range
            </label>
            <select
              value={selectedFeeTier}
              onChange={e => setSelectedFeeTier(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-content)] outline-none min-h-[42px]"
            >
              <option value="all">Any Annual Fee Range</option>
              <option value="under-100k">Under ₹1,00,000 / year</option>
              <option value="100k-150k">₹1,00,000 – ₹1,50,000 / year</option>
              <option value="150k-200k">₹1,50,000 – ₹2,00,000 / year</option>
              <option value="above-200k">Above ₹2,00,000 / year</option>
            </select>
          </div>

          {/* Action Footer in Filter Drawer */}
          <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex-1 py-2.5 px-3 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 font-bold text-xs hover:bg-rose-100 transition-colors text-center min-h-[42px]"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-2 py-2.5 px-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs shadow-warm-xs text-center min-h-[42px]"
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
              description="No schools match all your active search and filter criteria. Try clearing some filters or broadening your search parameters."
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
