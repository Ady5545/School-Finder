'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Play, Pause, RotateCcw, Gauge, Sparkles } from 'lucide-react';
import RouteRunner from './RouteRunner';
import SchoolRunDiorama from './SchoolRunDiorama';

type Point = { lat: number; lng: number; label: string };
type RouteSchool = {
  slug: string;
  name: string;
  sector?: string;
  point: Point;
  driving: { distanceKm: number; durationMin: number; coordinates: [number, number][] } | null;
  walking: { distanceKm: number; durationMin: number; coordinates: [number, number][] } | null;
};

type JourneyMode = 'driving' | 'walking';
type JourneyChoice = 'auto' | JourneyMode;

function FitBounds({ origin, schools }: { origin: Point; schools: RouteSchool[] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([[origin.lat, origin.lng], ...schools.map(s => [s.point.lat, s.point.lng] as [number, number])]);
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, origin, schools]);
  return null;
}

const originIcon = L.divIcon({
  className: 'school-run-origin-marker',
  html: '<div style="width:34px;height:34px;border-radius:50%;background:#0f4c81;color:white;border:3px solid white;box-shadow:0 3px 12px rgba(15,76,129,.35);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">⌂</div>',
  iconSize: [34,34],
  iconAnchor: [17,17],
});

const schoolIcon = L.divIcon({
  className: 'school-run-school-marker',
  html: '<div style="width:32px;height:32px;border-radius:50%;background:#f28b5b;color:white;border:3px solid white;box-shadow:0 3px 12px rgba(242,139,91,.35);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">S</div>',
  iconSize: [32,32],
  iconAnchor: [16,16],
});

const SPEED_OPTIONS = [
  { label: '1x', playbackSec: 22 },
  { label: '2x', playbackSec: 11 },
  { label: '4x', playbackSec: 5.5 },
];

function formatMin(min: number) {
  if (min < 1) return '<1 min';
  if (min < 60) return `${Math.round(min)} min`;
  return `${Math.floor(min / 60)}h ${Math.round(min % 60)}m`;
}

function recommendedMode(school: RouteSchool | undefined): JourneyMode {
  if (!school) return 'driving';
  const walk = school.walking;
  if (!walk?.coordinates?.length) return 'driving';

  // A short real walking route feels like the intended daily school run;
  // longer trips automatically become the family-car story.
  return walk.distanceKm <= 1.8 || walk.durationMin <= 22 ? 'walking' : 'driving';
}

export default function SchoolRunMap({
  origin,
  schools,
  activeSlug,
  onSelect,
}: {
  origin: Point;
  schools: RouteSchool[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const active = schools.find(s => s.slug === activeSlug) || schools[0];
  const [choice, setChoice] = useState<JourneyChoice>('auto');
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [progress, setProgress] = useState<{ coveredKm: number; totalKm: number; fraction: number; done: boolean }>({
    coveredKm: 0,
    totalKm: 0,
    fraction: 0,
    done: false,
  });

  const autoMode = recommendedMode(active);
  const mode: JourneyMode = choice === 'auto' ? autoMode : choice;
  const route = mode === 'driving' ? active?.driving : active?.walking;
  const hasWalking = !!active?.walking?.coordinates?.length;
  const resetKey = `${active?.slug || 'none'}:${mode}`;

  useEffect(() => {
    setChoice('auto');
    setPlaying(Boolean(active?.driving?.coordinates?.length || active?.walking?.coordinates?.length));
  }, [activeSlug]);

  useEffect(() => {
    if (choice === 'walking' && !hasWalking) setChoice('driving');
  }, [choice, hasWalking]);

  useEffect(() => {
    setPlaying(Boolean(route?.coordinates?.length));
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const playbackSec = SPEED_OPTIONS[speedIdx].playbackSec;
  const speedKmPerSec = route?.coordinates?.length && progress.totalKm > 0 ? progress.totalKm / playbackSec : 0;
  const realDurationMin = route?.durationMin || 0;
  const elapsedRealMin = realDurationMin * progress.fraction;
  const remainingRealMin = Math.max(0, realDurationMin - elapsedRealMin);
  const actualDistanceKm = route?.distanceKm || 0;

  return (
    <div className="space-y-3">
      <SchoolRunDiorama
        originLabel={origin.label}
        schoolName={active?.name || 'your school'}
        distanceKm={actualDistanceKm}
        mode={mode}
        progress={{ fraction: progress.fraction, done: progress.done }}
        playing={playing}
      />

      <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-white">
        <div className="h-[430px] sm:h-[520px] w-full">
          <MapContainer center={[origin.lat, origin.lng]} zoom={13} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds origin={origin} schools={schools} />
            <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
              <Popup>
                <strong>{origin.label === 'Your current location' ? 'Your current location' : 'Your society'}</strong>
                <br />
                {origin.label}
              </Popup>
            </Marker>
            {schools.map((school, index) => (
              <Marker
                key={school.slug}
                position={[school.point.lat, school.point.lng]}
                icon={schoolIcon}
                eventHandlers={{ click: () => onSelect(school.slug) }}
              >
                <Popup>
                  <strong>{index + 1}. {school.name}</strong>
                  <br />
                  {school.sector || 'Greater Noida'}
                </Popup>
              </Marker>
            ))}
            {active?.driving?.coordinates?.length ? (
              <Polyline
                positions={active.driving.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])}
                pathOptions={{ color: '#0f4c81', weight: 5, opacity: mode === 'driving' ? .9 : .28 }}
              />
            ) : null}
            {active?.walking?.coordinates?.length ? (
              <Polyline
                positions={active.walking.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])}
                pathOptions={{ color: '#f28b5b', weight: 4, opacity: mode === 'walking' ? .92 : .3, dashArray: '8 8' }}
              />
            ) : null}
            {route?.coordinates?.length ? (
              <RouteRunner
                coordinates={route.coordinates}
                playing={playing}
                speedKmPerSec={speedKmPerSec || 0.01}
                emoji={mode === 'driving' ? '🚙' : '🚶'}
                resetKey={resetKey}
                onProgress={info =>
                  setProgress(prev =>
                    prev.coveredKm === info.coveredKm && prev.done === info.done ? prev : info
                  )
                }
              />
            ) : null}
          </MapContainer>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-[var(--color-border)] bg-[#faf8f5]">
          <div className="inline-flex rounded-xl border border-[var(--color-border-strong)] bg-white p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setChoice('auto')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] transition-colors ${choice === 'auto' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-content-muted)]'}`}
            >
              <Sparkles className="w-3 h-3" /> Auto
            </button>
            <button
              type="button"
              onClick={() => setChoice('driving')}
              disabled={!active?.driving?.coordinates?.length}
              className={`px-3 py-1.5 rounded-[10px] transition-colors disabled:opacity-40 ${choice === 'driving' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-content-muted)]'}`}
            >
              🚙 Drive
            </button>
            <button
              type="button"
              disabled={!hasWalking}
              onClick={() => setChoice('walking')}
              className={`px-3 py-1.5 rounded-[10px] transition-colors disabled:opacity-40 ${choice === 'walking' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-content-muted)]'}`}
            >
              🚶 Walk
            </button>
          </div>

          <span className="text-[10px] font-bold text-[var(--color-content-muted)]">
            {choice === 'auto' ? (mode === 'walking' ? 'Short route → walking' : 'Longer route → driving') : 'Manual mode'}
          </span>

          <button
            type="button"
            onClick={() => {
              if (progress.done) {
                setProgress(pr => ({ ...pr, coveredKm: 0, fraction: 0, done: false }));
                setPlaying(true);
                return;
              }
              setPlaying(p => !p);
            }}
            disabled={!route?.coordinates?.length}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold px-3.5 py-2 hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? 'Pause' : progress.done ? 'Replay' : 'Run this route'}
          </button>

          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setProgress({ coveredKm: 0, totalKm: progress.totalKm, fraction: 0, done: false });
            }}
            className="p-2 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-content-muted)] hover:text-[var(--color-content)] hover:bg-white"
            aria-label="Reset animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--color-content-muted)]">
            <Gauge className="w-3.5 h-3.5" />
            {SPEED_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSpeedIdx(i)}
                className={`px-2 py-1 rounded-lg ${speedIdx === i ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4 text-xs">
            <div className="min-w-[160px]">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] transition-[width]"
                  style={{ width: `${Math.round(progress.fraction * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] text-[var(--color-content-muted)]">
                {progress.totalKm > 0 ? `${progress.coveredKm.toFixed(2)} / ${progress.totalKm.toFixed(2)} km` : 'Select a route'}
              </div>
            </div>
            {realDurationMin > 0 ? (
              <div className="text-right">
                <div className="font-black text-[var(--color-content)]">{formatMin(remainingRealMin)} left</div>
                <div className="text-[10px] text-[var(--color-content-muted)]">
                  of ~{formatMin(realDurationMin)} at real {mode === 'driving' ? 'drive' : 'walk'} pace
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-4 pb-3 -mt-1 text-[10px] text-[var(--color-content-muted)]">
          The 3D family animation is a visual story of the mapped route. The distance and ETA figures remain tied to the routed coordinates above.
        </div>
      </div>
    </div>
  );
}
