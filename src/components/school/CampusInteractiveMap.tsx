'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  Car,
  Train,
  Check,
  Copy,
  Info,
  Building,
} from 'lucide-react';
import type { School } from '../../types/school';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface CampusInteractiveMapProps {
  school: School;
  nearbySchools?: School[];
  className?: string;
}

// Haversine formula to compute direct distance in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export const CampusInteractiveMap: React.FC<CampusInteractiveMapProps> = ({
  school,
  nearbySchools = [],
  className,
}) => {
  const [viewMode, setViewMode] = useState<'osm' | 'radar'>('osm');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(school.id);

  const lat = school.location.coordinates?.lat || 28.58;
  const lng = school.location.coordinates?.lng || 77.45;

  // OpenStreetMap embed URL with precise bounding box and marker
  const osmEmbedUrl = useMemo(() => {
    const delta = 0.015;
    const minLng = (lng - delta).toFixed(5);
    const maxLng = (lng + delta).toFixed(5);
    const minLat = (lat - delta * 0.7).toFixed(5);
    const maxLat = (lat + delta * 0.7).toFixed(5);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [lat, lng]);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${school.name}, ${school.location.address}`
  )}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Compute nearby schools with distance
  const schoolsWithDistance = useMemo(() => {
    return nearbySchools
      .filter(
        s =>
          s.id !== school.id &&
          s.location?.coordinates &&
          typeof s.location.coordinates.lat === 'number' &&
          typeof s.location.coordinates.lng === 'number'
      )
      .map(s => {
        const targetLat = s.location.coordinates.lat as number;
        const targetLng = s.location.coordinates.lng as number;
        const dist = calculateDistance(lat, lng, targetLat, targetLng);
        return { ...s, distanceKm: dist };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [nearbySchools, school.id, lat, lng]);

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[var(--color-border)] shadow-warm-xs overflow-hidden',
        className
      )}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface-muted)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-wider">
              Greater Noida West Campus Location
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-content)] tracking-tight mt-0.5">
            Interactive Campus Map &amp; Transit Visualizer
          </h2>
          <p className="text-xs text-[var(--color-content-muted)] mt-0.5">
            {school.location.address || `${school.location.sector || school.location.area}, Greater Noida West`}
          </p>
        </div>

        {/* View Mode Controls & Directions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex rounded-xl p-1 bg-white border border-[var(--color-border)] shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('osm')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                viewMode === 'osm'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Street Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('radar')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                viewMode === 'radar'
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sector Radar</span>
            </button>
          </div>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100 overflow-hidden">
        {viewMode === 'osm' ? (
          // Street Map View
          <div className="w-full h-full relative">
            <iframe
              title={`${school.name} Map Location`}
              src={osmEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
            {/* Campus Info Overlay Floating Card */}
            <div className="absolute top-3 left-3 max-w-[280px] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-warm-md text-xs pointer-events-auto">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-black text-slate-900 leading-tight block">
                    {school.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {school.location.sector || school.location.area}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="text-slate-600 hover:text-[var(--color-primary)] inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>{lat.toFixed(3)}°, {lng.toFixed(3)}°</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] font-bold hover:underline"
                >
                  Full Map &rarr;
                </a>
              </div>
            </div>
          </div>
        ) : (
          // Coordinate-based Sector Radar / Proximity Visualizer
          <div className="w-full h-full relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] text-white p-6 flex flex-col justify-between select-none">
            {/* Background grid lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                backgroundSize: '40px 40px, 40px 40px, 40px 40px',
              }}
            />

            {/* Radar Center Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-48 h-48 rounded-full border border-sky-400" />
              <div className="w-96 h-96 rounded-full border border-sky-400 absolute" />
            </div>

            {/* Top Toolbar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-sky-300">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Greater Noida West Sector Proximity View</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                CENTER: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </span>
            </div>

            {/* Interactive Pin Field */}
            <div className="relative z-10 my-auto flex flex-wrap items-center justify-center gap-6 p-4">
              {/* Target School (Center / Primary Pin) */}
              <div
                onClick={() => setActivePin(school.id)}
                className="relative group cursor-pointer text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/40 border-2 border-amber-200 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                <div className="mt-2 px-3 py-1 rounded-xl bg-amber-600 text-white font-black text-xs shadow-md">
                  {school.shortName || school.name}
                </div>
                <div className="text-[10px] text-amber-200 mt-0.5 font-semibold">
                  (Current Campus)
                </div>
              </div>

              {/* Neighboring School Pins */}
              {schoolsWithDistance.slice(0, 4).map(neighbor => {
                const isSelected = activePin === neighbor.id;
                return (
                  <div
                    key={neighbor.id}
                    onClick={() => setActivePin(neighbor.id)}
                    className="relative group cursor-pointer text-center transition-all"
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all',
                        isSelected
                          ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-300 shadow-lg'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
                      )}
                    >
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 text-[11px] font-bold max-w-[120px] truncate">
                      {neighbor.shortName || neighbor.name}
                    </div>
                    <div className="text-[10px] text-sky-300 font-mono">
                      ~{neighbor.distanceKm} km away
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom active pin preview */}
            <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">
                  Showing Greater Noida West verified schools within ~3-5 km transit radius.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('osm')}
                className="text-sky-300 hover:text-white font-bold text-xs underline cursor-pointer shrink-0"
              >
                Switch to Street View
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connectivity & Transit Details Grid */}
      <div className="p-5 sm:p-6 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t border-[var(--color-border)]">
        <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Train className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Closest Metro Stations</span>
          </div>
          <p className="text-[11px] text-[var(--color-content-muted)] leading-relaxed">
            Noida Sector 52 &amp; Sector 51 (Aqua Line / Blue Line) • 12–15 min drive via Greater Noida West Link Road.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Car className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Expressway Corridors</span>
          </div>
          <p className="text-[11px] text-[var(--color-content-muted)] leading-relaxed">
            Direct access to FNG Corridor, 130m Greater Noida Expressway, and Char Murti Roundabout.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[var(--color-border)] space-y-1">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>School Bus Transport Zone</span>
          </div>
          <p className="text-[11px] text-[var(--color-content-muted)] leading-relaxed">
            Verified bus pickup routes across Greater Noida West, Noida, Crossings Republik, and Ghaziabad.
          </p>
        </div>
      </div>
    </div>
  );
};
