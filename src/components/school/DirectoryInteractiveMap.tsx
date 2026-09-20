'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  ChevronDown,
  RotateCcw,
  Sliders,
  Sparkles,
  Info,
  Check,
  LocateFixed,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { School } from '../../types/school';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { RatingDisplay } from '../ui/RatingDisplay';
import { isSafeStoredSchoolCoordinate } from '../../lib/locationSafety';

export interface ProximityAnchor {
  id: string;
  label: string;
  sector: string;
  coords: { lat: number; lng: number };
}

export const POPULAR_PROXIMITY_AREAS: ProximityAnchor[] = [
  {
    id: 'char-murti',
    label: 'Gaur Chowk / Char Murti Circle',
    sector: 'Gaur City / Char Murti',
    coords: { lat: 28.604, lng: 77.430 },
  },
  {
    id: 'sector-16b',
    label: 'Sector 16B (Gaur City 1 & 2 / Eco Village)',
    sector: 'Sector 16B',
    coords: { lat: 28.608, lng: 77.438 },
  },
  {
    id: 'techzone-4',
    label: 'Techzone 4 (Cherry County area)',
    sector: 'Techzone 4',
    coords: { lat: 28.595, lng: 77.442 },
  },
  {
    id: 'sector-1',
    label: 'Sector 1 (Nirala Estate / Ace City)',
    sector: 'Sector 1',
    coords: { lat: 28.585, lng: 77.448 },
  },
  {
    id: 'sector-4',
    label: 'Sector 4 (Gaur City 2 / Gaur Saundaryam)',
    sector: 'Sector 4',
    coords: { lat: 28.614, lng: 77.435 },
  },
  {
    id: 'kp-5',
    label: 'Knowledge Park 5 (Surajpur / Link Road)',
    sector: 'Knowledge Park 5',
    coords: { lat: 28.578, lng: 77.458 },
  },
  {
    id: 'techzone-7',
    label: 'Techzone 7',
    sector: 'Techzone 7',
    coords: { lat: 28.582, lng: 77.480 },
  },
];

export const RADIUS_OPTIONS = [
  { label: 'Within 3 km', value: 3 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 8 km', value: 8 },
  { label: 'Within 15 km', value: 15 },
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

interface DirectoryInteractiveMapProps {
  schools: School[];
  selectedProximityArea: string;
  selectedRadiusKm: number | null;
  onProximityChange: (
    area: string,
    radiusKm: number | null,
    coords?: { lat: number; lng: number } | null
  ) => void;
  activeSchoolSlug?: string | null;
  onSelectSchool?: (school: School) => void;
  onClose?: () => void;
  className?: string;
}

export const DirectoryInteractiveMap: React.FC<DirectoryInteractiveMapProps> = ({
  schools,
  selectedProximityArea,
  selectedRadiusKm,
  onProximityChange,
  activeSchoolSlug,
  onSelectSchool,
  onClose,
  className,
}) => {
  const [mapMode, setMapMode] = useState<'interactive' | 'osm'>('interactive');
  const [selectedPinSlug, setSelectedPinSlug] = useState<string | null>(activeSchoolSlug || null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [customUserCoords, setCustomUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Sync external active school
  useEffect(() => {
    if (activeSchoolSlug) {
      setSelectedPinSlug(activeSchoolSlug);
    }
  }, [activeSchoolSlug]);

  // Active anchor coordinates
  const activeAnchor = useMemo(() => {
    if (customUserCoords && selectedProximityArea === 'my-location') {
      return {
        id: 'my-location',
        label: 'Your Current Location',
        sector: 'My Location',
        coords: customUserCoords,
      };
    }
    return POPULAR_PROXIMITY_AREAS.find(a => a.id === selectedProximityArea) || null;
  }, [selectedProximityArea, customUserCoords]);

  // Only explicitly verified stored coordinates are eligible for directory markers.
  // Missing or false verification flags are treated conservatively and excluded.
  const schoolsWithCoordinates = useMemo(() => {
    return schools.filter(
      (s): s is School & { location: { coordinates: { lat: number; lng: number; isVerified: true } } } =>
        isSafeStoredSchoolCoordinate(s.location?.coordinates)
    );
  }, [schools]);

  // Compute school distances relative to active anchor
  const schoolsWithDistance = useMemo(() => {
    return schoolsWithCoordinates.map(s => {
      const lat: number = s.location.coordinates.lat;
      const lng: number = s.location.coordinates.lng;
      let distanceKm: number | null = null;

      if (activeAnchor) {
        distanceKm = calculateDistance(
          activeAnchor.coords.lat,
          activeAnchor.coords.lng,
          lat,
          lng
        );
      }

      return {
        school: s,
        lat,
        lng,
        distanceKm,
        isWithinRadius:
          selectedRadiusKm !== null && distanceKm !== null
            ? distanceKm <= selectedRadiusKm
            : true,
      };
    });
  }, [schoolsWithCoordinates, activeAnchor, selectedRadiusKm]);

  // Find currently selected school pin details
  const activePinSchool = useMemo(() => {
    if (!selectedPinSlug) return null;
    return schoolsWithDistance.find(item => item.school.slug === selectedPinSlug) || null;
  }, [selectedPinSlug, schoolsWithDistance]);

  // Bounding box for canvas projection
  const bounds = useMemo(() => {
    // Focused bounds for Greater Noida West & adjacent clusters
    // We calibrate so Greater Noida West (lat 28.56 - 28.62, lng 77.42 - 77.49) sits prominently
    return {
      minLat: 28.45,
      maxLat: 28.63,
      minLng: 77.38,
      maxLng: 77.52,
    };
  }, []);

  // Project lat/lng to percentage coordinates (x: 0-100%, y: 0-100%)
  const getCanvasPos = (lat: number, lng: number) => {
    const latSpan = bounds.maxLat - bounds.minLat;
    const lngSpan = bounds.maxLng - bounds.minLng;
    // Invert lat for Y so North is at the top
    const y = Math.max(5, Math.min(95, ((bounds.maxLat - lat) / latSpan) * 100));
    const x = Math.max(5, Math.min(95, ((lng - bounds.minLng) / lngSpan) * 100));
    return { x, y };
  };

  // OpenStreetMap embed URL
  const osmEmbedUrl = useMemo(() => {
    let centerLat = 28.59;
    let centerLng = 77.45;
    if (activeAnchor) {
      centerLat = activeAnchor.coords.lat;
      centerLng = activeAnchor.coords.lng;
    }
    const delta = 0.04;
    const minLng = (centerLng - delta).toFixed(4);
    const maxLng = (centerLng + delta).toFixed(4);
    const minLat = (centerLat - delta * 0.7).toFixed(4);
    const maxLat = (centerLat + delta * 0.7).toFixed(4);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;
  }, [activeAnchor]);

  // Handle Geolocation
  const handleUseMyLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCustomUserCoords(coords);
        onProximityChange('my-location', selectedRadiusKm || 5, coords);
      },
      err => {
        setIsLocating(false);
        setLocationError(
          err.code === 1
            ? 'Location access was denied. You can still pick your sector below.'
            : 'Unable to detect location. Please choose your area from the list.'
        );
      },
      { timeout: 8000 }
    );
  };

  const handleResetProximity = () => {
    setSelectedPinSlug(null);
    setLocationError(null);
    onProximityChange('', null, null);
  };

  // Number of schools within current filter
  const schoolsInRadiusCount = useMemo(() => {
    if (!selectedRadiusKm || !activeAnchor) return schools.length;
    return schoolsWithDistance.filter(s => s.isWithinRadius).length;
  }, [selectedRadiusKm, activeAnchor, schoolsWithDistance, schools.length]);

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[var(--color-border)] shadow-warm-sm overflow-hidden mb-6',
        className
      )}
    >
      {/* Compact Supporting Map Header */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-[var(--color-content)] truncate">
                Campus Map
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {schoolsWithCoordinates.length} mapped
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-content-muted)] hidden sm:block truncate">
              {activeAnchor ? `Anchored near ${activeAnchor.label}` : 'Interactive Greater Noida West sectors & campuses'}
            </p>
            {schools.some(school => !isSafeStoredSchoolCoordinate(school.location?.coordinates)) && (
              <p className="text-[10px] text-amber-700 mt-0.5 hidden sm:block">
                Some school locations are intentionally omitted until their coordinates are verified.
              </p>
            )}
          </div>
        </div>

        {/* Map Mode Selector & Optional Close Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="inline-flex rounded-lg p-0.5 bg-white border border-[var(--color-border)] shadow-2xs">
            <button
              type="button"
              onClick={() => setMapMode('interactive')}
              className={cn(
                'px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                mapMode === 'interactive'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Compass className="w-3 h-3" />
              <span>Sectors</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('osm')}
              className={cn(
                'px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                mapMode === 'osm'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Layers className="w-3 h-3" />
              <span>Streets</span>
            </button>
          </div>

          {(selectedProximityArea || selectedRadiusKm) && (
            <button
              type="button"
              onClick={handleResetProximity}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-colors cursor-pointer"
              title="Reset proximity"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[var(--color-border)] bg-white text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close Map"
              title="Close Map"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Proximity Quick Area Bar */}
      <div className="px-3.5 py-2 border-b border-[var(--color-border-subtle)] bg-slate-50/70 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-[var(--color-content-muted)] font-medium text-[11px]">
          <span>Sector:</span>
        </div>

        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <select
            value={selectedProximityArea}
            onChange={e => {
              const val = e.target.value;
              if (val === 'my-location') {
                handleUseMyLocation();
              } else {
                const anchor = POPULAR_PROXIMITY_AREAS.find(a => a.id === val);
                onProximityChange(val, selectedRadiusKm || 5, anchor?.coords || null);
              }
            }}
            className="w-full px-2.5 py-1 pr-6 rounded-lg border border-[var(--color-border-strong)] bg-white text-[11px] font-bold text-[var(--color-content)] cursor-pointer outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">All Greater Noida West (Select Sector)</option>
            {customUserCoords && (
              <option value="my-location">📍 My Location</option>
            )}
            {POPULAR_PROXIMITY_AREAS.map(a => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Quick Locate Me Button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className={cn(
            'px-2 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs',
            selectedProximityArea === 'my-location'
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-white text-[var(--color-content)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
          )}
          title="Detect nearby schools using device location"
        >
          <LocateFixed className={cn('w-3 h-3', isLocating && 'animate-spin text-amber-500')} />
          <span>{isLocating ? 'Detecting...' : 'Near Me'}</span>
        </button>

        {/* Distance Radius Pills */}
        {selectedProximityArea && (
          <div className="flex items-center gap-1">
            <span className="font-bold text-[var(--color-content-muted)] text-[10px] mr-0.5">Radius:</span>
            {RADIUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onProximityChange(selectedProximityArea, opt.value, activeAnchor?.coords || null)}
                className={cn(
                  'px-2 py-0.5 rounded-md font-bold text-[10px] transition-all cursor-pointer',
                  selectedRadiusKm === opt.value
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-white border border-[var(--color-border)] text-slate-600 hover:text-slate-900'
                )}
              >
                {opt.label.replace('Within ', '')}
              </button>
            ))}
          </div>
        )}

        {/* Proximity Result Tag */}
        {selectedProximityArea && selectedRadiusKm && (
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {schoolsInRadiusCount} schools in {selectedRadiusKm}km
          </span>
        )}
      </div>

      {locationError && (
        <div className="mx-3.5 mt-2 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center justify-between">
          <span>{locationError}</span>
          <button
            type="button"
            onClick={() => setLocationError(null)}
            className="text-rose-500 hover:text-rose-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Map Canvas Display */}
      <div className="relative w-full h-[300px] sm:h-[350px] bg-[#f2f4f8] overflow-hidden select-none">
        {mapMode === 'osm' ? (
          /* OpenStreetMap Real-world Map View */
          <div className="relative w-full h-full">
            <iframe
              title="OpenStreetMap Greater Noida West Schools"
              src={osmEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-warm-xs text-xs">
              <span className="font-bold text-[var(--color-content)]">
                Showing all {schools.length} Greater Noida West campuses
              </span>
              <span className="text-[10px] text-slate-500 block">
                Click "Street Map / Sector Navigator" to toggle spatial mode.
              </span>
            </div>
          </div>
        ) : (
          /* Interactive Geographic Sector Canvas & Radar Navigator */
          <div className="relative w-full h-full bg-[#f9fafc] overflow-hidden">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f9fafc 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0, 16px 16px',
              }}
            />

            {/* Geographical Arterial Highway Lines (Simulated road corridors for context) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Vikas Marg / Hindon Bridge corridor */}
              <line x1="10%" y1="18%" x2="90%" y2="28%" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6 4" />
              {/* Noida Extension - Surajpur Bypass */}
              <line x1="28%" y1="12%" x2="65%" y2="92%" stroke="#cbd5e1" strokeWidth="2" />
              {/* Expressway Link */}
              <line x1="15%" y1="75%" x2="85%" y2="85%" stroke="#cbd5e1" strokeWidth="1.5" />
            </svg>

            {/* Sector Cluster Regions */}
            <div className="absolute top-[12%] left-[20%] text-[11px] font-black uppercase tracking-wider text-slate-400/80 pointer-events-none border border-dashed border-slate-300/80 rounded-2xl px-4 py-2">
              Sector 16B Cluster (7 Schools)
            </div>
            <div className="absolute top-[28%] left-[34%] text-[11px] font-black uppercase tracking-wider text-slate-400/80 pointer-events-none border border-dashed border-slate-300/80 rounded-2xl px-4 py-2">
              Techzone 4 Cluster (3 Schools)
            </div>
            <div className="absolute top-[42%] left-[45%] text-[11px] font-black uppercase tracking-wider text-slate-400/80 pointer-events-none border border-dashed border-slate-300/80 rounded-2xl px-4 py-2">
              Knowledge Park 5 Cluster (3 Schools)
            </div>

            {/* Proximity Focal Point & Radius Circle */}
            {activeAnchor && (
              (() => {
                const anchorPos = getCanvasPos(activeAnchor.coords.lat, activeAnchor.coords.lng);
                return (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-500 ease-out"
                    style={{ left: `${anchorPos.x}%`, top: `${anchorPos.y}%` }}
                  >
                    {/* Pulsing focal radar ring */}
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500 animate-ping absolute -inset-0 m-auto" />
                    <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white relative z-20">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    {/* Focal point tooltip */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-900/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md border border-amber-700">
                      📍 {activeAnchor.sector}
                    </div>
                  </div>
                );
              })()
            )}

            {/* School Pins for all Schools */}
            {schoolsWithDistance.map(({ school, lat, lng, distanceKm, isWithinRadius }) => {
              const pos = getCanvasPos(lat, lng);
              const isSelected = selectedPinSlug === school.slug;
              const isDimmed = selectedRadiusKm !== null && !isWithinRadius;

              return (
                <div
                  key={school.id}
                  className={cn(
                    'absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300',
                    isDimmed ? 'opacity-35 hover:opacity-100 scale-85' : 'opacity-100 scale-100',
                    isSelected && 'z-30 scale-110'
                  )}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPinSlug(school.slug);
                      if (onSelectSchool) {
                        onSelectSchool(school);
                      }
                    }}
                    className={cn(
                      'group/pin relative flex flex-col items-center cursor-pointer transition-all duration-200 outline-none'
                    )}
                    aria-label={`View map details for ${school.name}`}
                  >
                    {/* Distance Badge on pin if proximity is active */}
                    {distanceKm !== null && !isDimmed && (
                      <span className="mb-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-tight bg-amber-600 text-white shadow-xs whitespace-nowrap">
                        {distanceKm === 0 ? 'Here' : `${distanceKm} km`}
                      </span>
                    )}

                    {/* Pin Icon Bubble */}
                    <div
                      className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-warm-md border-2 transition-transform duration-200 group-hover/pin:scale-115',
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-200 ring-4 ring-amber-400/30'
                          : isWithinRadius && activeAnchor
                          ? 'bg-[var(--color-primary)] text-white border-emerald-300 ring-2 ring-emerald-400/30'
                          : 'bg-[var(--color-primary)] text-white border-white hover:bg-[var(--color-primary-hover)]'
                      )}
                    >
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    </div>

                    {/* Compact Label */}
                    <span
                      className={cn(
                        'mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight whitespace-nowrap max-w-[120px] truncate shadow-2xs border transition-colors',
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-500 font-black shadow-warm-sm'
                          : 'bg-white/95 text-[var(--color-content)] border-slate-200/90 group-hover/pin:bg-white group-hover/pin:border-slate-400'
                      )}
                    >
                      {school.shortName || school.name}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Active School Selected Popover Card */}
            {activePinSchool && (
              <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-80 bg-white/98 backdrop-blur-md p-4 rounded-2xl border border-[var(--color-border)] shadow-warm-lg z-40 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {activePinSchool.school.location.sector}
                      </span>
                      {activePinSchool.distanceKm !== null && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {activePinSchool.distanceKm} km away
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-extrabold text-[var(--color-content)] tracking-tight line-clamp-1 mt-1">
                      {activePinSchool.school.name}
                    </h4>
                    <p className="text-[11px] text-[var(--color-content-muted)] line-clamp-1 mt-0.5">
                      {Array.isArray(activePinSchool.school.board) ? activePinSchool.school.board.join(', ') : activePinSchool.school.board || 'CBSE'} • {activePinSchool.school.fees.rangeText || 'Verified Fees Available'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPinSlug(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating and Ratio Strip */}
                <div className="mt-2.5 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <RatingDisplay score={activePinSchool.school.rating.score} size="sm" showCount={false} />
                    <span className="text-[11px] font-bold text-slate-500">
                      ({activePinSchool.school.rating.reviewsCount})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Ratio: {activePinSchool.school.studentTeacherRatio}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/schools/${activePinSchool.school.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${activePinSchool.school.name}, ${activePinSchool.school.location.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-600" />
                    <span>Route</span>
                  </a>
                </div>
              </div>
            )}

            {/* Bottom Quick Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-warm-xs text-[11px] flex items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] inline-block" />
                <span>{schools.length} Institutions</span>
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Selected Pin</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
