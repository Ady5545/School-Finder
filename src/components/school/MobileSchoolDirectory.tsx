'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, RotateCcw, MapPin, LocateFixed, ArrowUpDown,
  Star, Check, X, ChevronRight, Sparkles,
} from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { DirectoryInteractiveMap, POPULAR_PROXIMITY_AREAS, RADIUS_OPTIONS } from './DirectoryInteractiveMap';
import { Drawer } from '../ui/Drawer';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

interface NearbySuggestion {
  school: School;
  distanceKm: number;
}

interface MobileSchoolDirectoryProps {
  initialSchools: School[];
  distinctBoards: string[];
  distinctAreas: string[];
  filteredSchools: School[];
  nearbySectorSuggestions: NearbySuggestion[];
  sectorSearchLoading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedBoard: string;
  setSelectedBoard: (value: string) => void;
  selectedArea: string;
  setSelectedArea: (value: string) => void;
  selectedSports: string[];
  toggleSport: (value: string) => void;
  availableSports: string[];
  selectedAdmissionStatus: string;
  setSelectedAdmissionStatus: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  siblingOnly: boolean;
  setSiblingOnly: (value: boolean) => void;
  selectedFeeTier: string;
  setSelectedFeeTier: (value: string) => void;
  selectedCurriculum: string;
  setSelectedCurriculum: (value: string) => void;
  availableCurricula: string[];
  selectedTransport: string;
  setSelectedTransport: (value: string) => void;
  selectedTrust: string;
  setSelectedTrust: (value: string) => void;
  sortBy: string;
  setSortBy: (value: 'featured' | 'name' | 'fee-asc' | 'fee-desc' | 'rating' | 'distance') => void;
  activeFiltersCount: number;
  resetAllFilters: () => void;
  showMap: boolean;
  setShowMap: (value: boolean) => void;
  selectedProximityArea: string;
  selectedRadiusKm: number | null;
  proximityCoords: { lat: number; lng: number } | null;
  activeMapSchoolSlug: string | null;
  handleProximityChange: (
    area: string,
    radiusKm: number | null,
    coords?: { lat: number; lng: number } | null
  ) => void;
  handleNearMe: () => void;
  isLocating: boolean;
  setActiveMapSchoolSlug: (value: string | null) => void;
}

export const MobileSchoolDirectory: React.FC<MobileSchoolDirectoryProps> = props => {
  const [filterOpen, setFilterOpen] = useState(false);

  const activeAreaLabel = useMemo(() => {
    if (props.selectedArea) return props.selectedArea;
    if (props.selectedProximityArea === 'my-location') return 'Near me';
    if (props.selectedProximityArea) {
      return POPULAR_PROXIMITY_AREAS.find(a => a.id === props.selectedProximityArea)?.sector || '';
    }
    return '';
  }, [props.selectedArea, props.selectedProximityArea]);

  const activeChips = [
    props.selectedBoard ? props.selectedBoard : null,
    props.selectedArea ? props.selectedArea : null,
    props.selectedAdmissionStatus !== 'all' ? 'Admissions' : null,
    props.selectedFeeTier !== 'all' ? 'Fee' : null,
    props.selectedGrade !== 'all' ? props.selectedGrade.replace('-', ' ') : null,
    props.selectedSports.length ? props.selectedSports.length + ' sport' + (props.selectedSports.length === 1 ? '' : 's') : null,
    props.siblingOnly ? 'Sibling' : null,
    props.selectedTrust !== 'all' ? 'Data check' : null,
  ].filter(Boolean) as string[];

  return (
    <div className="mobile-directory">
      <section className="mobile-directory-hero">
        <div className="mobile-directory-kicker">School discovery</div>
        <h1>Find schools that fit your family.</h1>
        <p>Search by school, sector, board, sports, fees or admissions.</p>

        <div className="mobile-directory-search">
          <Search className="w-[18px] h-[18px] shrink-0 text-[#183b5d]" />
          <input
            id="mobile-school-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            value={props.searchQuery}
            onChange={e => props.setSearchQuery(e.target.value)}
            placeholder="Search schools, sectors, boards..."
            aria-label="Search schools"
          />
          {props.searchQuery && (
            <button type="button" onClick={() => props.setSearchQuery('')} aria-label="Clear search">
              <X className="w-[17px] h-[17px]" />
            </button>
          )}
        </div>

        <div className="mobile-directory-quick-scroll">
          <button type="button" className={cn('mobile-directory-chip', !props.selectedBoard && !props.selectedArea && props.activeFiltersCount === 0 && 'is-active')} onClick={props.resetAllFilters}>All schools</button>
          {props.distinctBoards.slice(0, 4).map(board => (
            <button type="button" key={board} className={cn('mobile-directory-chip', props.selectedBoard === board && 'is-active')} onClick={() => props.setSelectedBoard(props.selectedBoard === board ? '' : board)}>{board}</button>
          ))}
          <button type="button" className={cn('mobile-directory-chip', props.selectedAdmissionStatus === 'open' && 'is-active')} onClick={() => props.setSelectedAdmissionStatus(props.selectedAdmissionStatus === 'open' ? 'all' : 'open')}>Admissions open</button>
          <button type="button" className="mobile-directory-chip" onClick={props.handleNearMe}><LocateFixed className="w-3.5 h-3.5" /> Near me</button>
        </div>
      </section>

      <section className="mobile-directory-toolbar">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[13px] font-black text-[#102238]">{props.filteredSchools.length} {props.filteredSchools.length === 1 ? 'school' : 'schools'}</span>
          {activeAreaLabel && <span className="mobile-directory-context"><MapPin className="w-3 h-3" /> {activeAreaLabel}</span>}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className={cn('mobile-directory-tool', props.showMap && 'is-active')} onClick={() => props.setShowMap(!props.showMap)}>
            <MapPin className="w-4 h-4" /> Map
          </button>
          <button type="button" className={cn('mobile-directory-tool', props.activeFiltersCount > 0 && 'is-active')} onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="w-4 h-4" /> Filter{props.activeFiltersCount > 0 ? ' · ' + props.activeFiltersCount : ''}
          </button>
        </div>
      </section>

      {activeChips.length > 0 && (
        <div className="mobile-directory-active-scroll">
          {activeChips.map((chip, index) => (
            <span key={chip + index} className="mobile-directory-active-chip">{chip}</span>
          ))}
          <button type="button" onClick={props.resetAllFilters} className="mobile-directory-clear">Clear all</button>
        </div>
      )}

      {props.showMap && (
        <section className="mobile-directory-map">
          <DirectoryInteractiveMap
            schools={props.filteredSchools.length ? props.filteredSchools : props.initialSchools}
            selectedProximityArea={props.selectedProximityArea}
            selectedRadiusKm={props.selectedRadiusKm}
            onProximityChange={props.handleProximityChange}
            activeSchoolSlug={props.activeMapSchoolSlug}
            onSelectSchool={school => props.setActiveMapSchoolSlug(school.slug)}
            onClose={() => props.setShowMap(false)}
          />
        </section>
      )}

      <section className="mobile-directory-results">
        {props.filteredSchools.length > 0 ? (
          <div className="mobile-directory-card-list">
            {props.filteredSchools.map(school => <SchoolCard key={school.id} school={school} />)}
          </div>
        ) : props.nearbySectorSuggestions.length > 0 ? (
          <div className="mobile-directory-empty">
            <div className="mobile-directory-empty-icon"><Sparkles className="w-5 h-5" /></div>
            <h2>No exact match — nearby schools are below.</h2>
            <p>We could not find a listed school in that exact sector.</p>
            <div className="mobile-directory-nearby">
              {props.nearbySectorSuggestions.map(item => (
                <Link key={item.school.id} href={'/schools/' + item.school.slug} className="mobile-nearby-row">
                  <div className="min-w-0">
                    <strong>{item.school.name}</strong>
                    <span>{item.school.location.sector || item.school.location.area}</span>
                  </div>
                  <span>{item.distanceKm} km <ChevronRight className="w-4 h-4" /></span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mobile-directory-empty">
            <div className="mobile-directory-empty-icon"><Search className="w-5 h-5" /></div>
            <h2>{props.sectorSearchLoading ? 'Finding nearby schools…' : 'No schools match these filters.'}</h2>
            <p>{props.sectorSearchLoading ? 'Checking the requested sector and nearby verified campuses.' : 'Try a broader search or remove one filter.'}</p>
            <button type="button" onClick={props.resetAllFilters} className="mobile-directory-reset">Reset filters</button>
          </div>
        )}

        <div className="mobile-directory-sort">
          <div className="mobile-sort-label"><ArrowUpDown className="w-3.5 h-3.5" /> Sort results</div>
          <select value={props.sortBy} onChange={e => props.setSortBy(e.target.value as 'featured' | 'name' | 'fee-asc' | 'fee-desc' | 'rating' | 'distance')}>
            <option value="featured">Featured</option>
            {props.proximityCoords && <option value="distance">Nearest first</option>}
            <option value="rating">Top rated</option>
            <option value="name">Name A–Z</option>
            <option value="fee-asc">Fee: low to high</option>
            <option value="fee-desc">Fee: high to low</option>
          </select>
        </div>
      </section>

      <Drawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} title="Filter schools" side="bottom">
        <div className="mobile-filter-sheet">
          <div className="mobile-filter-sheet__top">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] font-black text-[#8a95a3]">Narrow your search</p>
              <h2 className="mt-1 text-[19px] font-black text-[#13273d]">Choose what matters</h2>
            </div>
            {props.activeFiltersCount > 0 && <button type="button" onClick={props.resetAllFilters} className="mobile-filter-clear">Clear</button>}
          </div>

          <div className="mobile-filter-group">
            <label>Board</label>
            <div className="mobile-filter-options">
              <button type="button" className={cn(props.selectedBoard === '' && 'is-selected')} onClick={() => props.setSelectedBoard('')}>All</button>
              {props.distinctBoards.map(board => <button key={board} type="button" className={cn(props.selectedBoard === board && 'is-selected')} onClick={() => props.setSelectedBoard(props.selectedBoard === board ? '' : board)}>{board}</button>)}
            </div>
          </div>

          <div className="mobile-filter-group">
            <label>Area / sector</label>
            <select value={props.selectedArea} onChange={e => props.setSelectedArea(e.target.value)}>
              <option value="">All areas</option>
              {props.distinctAreas.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>

          <div className="mobile-filter-group">
            <label>Admissions</label>
            <div className="mobile-filter-options">
              <button type="button" className={cn(props.selectedAdmissionStatus === 'all' && 'is-selected')} onClick={() => props.setSelectedAdmissionStatus('all')}>Any</button>
              <button type="button" className={cn(props.selectedAdmissionStatus === 'open' && 'is-selected')} onClick={() => props.setSelectedAdmissionStatus('open')}>Open</button>
              <button type="button" className={cn(props.selectedAdmissionStatus === 'pre_registration' && 'is-selected')} onClick={() => props.setSelectedAdmissionStatus('pre_registration')}>Pre-registration</button>
              <button type="button" className={cn(props.selectedAdmissionStatus === 'upcoming' && 'is-selected')} onClick={() => props.setSelectedAdmissionStatus('upcoming')}>Upcoming</button>
            </div>
          </div>

          <div className="mobile-filter-group">
            <label>Grade</label>
            <select value={props.selectedGrade} onChange={e => props.setSelectedGrade(e.target.value)}>
              <option value="all">All grades</option>
              <option value="pre-primary">Nursery / Pre-primary</option>
              <option value="primary">Primary · 1–5</option>
              <option value="middle">Middle · 6–8</option>
              <option value="secondary">Secondary · 9–10</option>
              <option value="senior-secondary">Senior secondary · 11–12</option>
            </select>
          </div>

          <div className="mobile-filter-group">
            <label>Fee range</label>
            <select value={props.selectedFeeTier} onChange={e => props.setSelectedFeeTier(e.target.value)}>
              <option value="all">Any fee</option>
              <option value="under-100k">Under ₹1 lakh</option>
              <option value="100k-150k">₹1–1.5 lakh</option>
              <option value="150k-200k">₹1.5–2 lakh</option>
              <option value="above-200k">Above ₹2 lakh</option>
            </select>
          </div>

          <div className="mobile-filter-group">
            <label>Curriculum</label>
            <select value={props.selectedCurriculum} onChange={e => props.setSelectedCurriculum(e.target.value)}>
              <option value="">Any curriculum</option>
              {props.availableCurricula.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="mobile-filter-group">
            <label>Transport</label>
            <div className="mobile-filter-options">
              <button type="button" className={cn(props.selectedTransport === 'all' && 'is-selected')} onClick={() => props.setSelectedTransport('all')}>Any</button>
              <button type="button" className={cn(props.selectedTransport === 'documented' && 'is-selected')} onClick={() => props.setSelectedTransport('documented')}>Documented</button>
              <button type="button" className={cn(props.selectedTransport === 'undocumented' && 'is-selected')} onClick={() => props.setSelectedTransport('undocumented')}>Not documented</button>
            </div>
          </div>

          <div className="mobile-filter-group">
            <label>Data trust</label>
            <div className="mobile-filter-options">
              <button type="button" className={cn(props.selectedTrust === 'all' && 'is-selected')} onClick={() => props.setSelectedTrust('all')}>Any</button>
              <button type="button" className={cn(props.selectedTrust === 'recent' && 'is-selected')} onClick={() => props.setSelectedTrust('recent')}>Recently checked</button>
              <button type="button" className={cn(props.selectedTrust === 'needs-check' && 'is-selected')} onClick={() => props.setSelectedTrust('needs-check')}>Needs check</button>
            </div>
          </div>

          <div className="mobile-filter-group">
            <label>Sports</label>
            <div className="mobile-filter-options">
              {props.availableSports.map(sport => <button key={sport} type="button" className={cn(props.selectedSports.includes(sport) && 'is-selected')} onClick={() => props.toggleSport(sport)}>{props.selectedSports.includes(sport) && <Check className="w-3.5 h-3.5" />} {sport}</button>)}
            </div>
          </div>

          <button type="button" onClick={() => props.setSiblingOnly(!props.siblingOnly)} className={cn('mobile-filter-toggle', props.siblingOnly && 'is-selected')}>
            <span>Verified sibling concession</span><Check className="w-4 h-4" />
          </button>

          <div className="mobile-filter-group">
            <label>Nearby search</label>
            <div className="mobile-nearby-actions">
              <button type="button" onClick={props.handleNearMe} className="mobile-nearby-action"><LocateFixed className="w-4 h-4" /> {props.isLocating ? 'Locating…' : 'Use my location'}</button>
              {RADIUS_OPTIONS.map(option => (
                <button key={option.value} type="button" disabled={!props.selectedProximityArea} className={cn('mobile-nearby-action', props.selectedRadiusKm === option.value && 'is-selected')} onClick={() => props.handleProximityChange(props.selectedProximityArea, option.value, props.proximityCoords)}>{option.label.replace('Within ', '')}</button>
              ))}
            </div>
          </div>

          <div className="mobile-filter-done">
            <button type="button" onClick={() => setFilterOpen(false)}>{props.filteredSchools.length} schools · Done</button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
