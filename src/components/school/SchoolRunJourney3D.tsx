'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CarFront, Footprints, Play, RotateCcw, Sparkles } from 'lucide-react';

type Point = { lat: number; lng: number; label: string };
type RouteLeg = { distanceKm: number; durationMin: number; coordinates: [number, number][]; provider: string } | null;
type RouteSchool = {
  slug: string;
  name: string;
  shortName?: string;
  sector?: string;
  point: Point;
  driving: RouteLeg;
  walking: RouteLeg;
};

type JourneyMode = 'drive' | 'walk';
type PlotPoint = { x: number; y: number };

function sampleCoordinates(coordinates: [number, number][], maxPoints = 90): [number, number][] {
  if (coordinates.length <= maxPoints) return coordinates;
  const result: [number, number][] = [];
  const step = (coordinates.length - 1) / (maxPoints - 1);
  for (let i = 0; i < maxPoints; i += 1) {
    result.push(coordinates[Math.round(i * step)]);
  }
  return result;
}

function projectRoute(coordinates: [number, number][]): PlotPoint[] {
  if (coordinates.length < 2) return [{ x: 120, y: 320 }, { x: 880, y: 120 }];

  const points = sampleCoordinates(coordinates).map(function (pair) {
    return { lng: pair[0], lat: pair[1] };
  });
  const minLng = Math.min.apply(null, points.map(p => p.lng));
  const maxLng = Math.max.apply(null, points.map(p => p.lng));
  const minLat = Math.min.apply(null, points.map(p => p.lat));
  const maxLat = Math.max.apply(null, points.map(p => p.lat));
  const lngSpan = Math.max(maxLng - minLng, 0.000001);
  const latSpan = Math.max(maxLat - minLat, 0.000001);

  return points.map(function (point) {
    return {
      x: 120 + ((point.lng - minLng) / lngSpan) * 760,
      y: 320 - ((point.lat - minLat) / latSpan) * 220,
    };
  });
}

function toPath(points: PlotPoint[]): string {
  return points.map(function (point, index) {
    return (index === 0 ? 'M ' : 'L ') + point.x.toFixed(1) + ' ' + point.y.toFixed(1);
  }).join(' ');
}

function chooseMode(school: RouteSchool): JourneyMode {
  const drivingDistance = school.driving && Number.isFinite(school.driving.distanceKm)
    ? school.driving.distanceKm
    : Number.POSITIVE_INFINITY;
  return drivingDistance <= 2.2 ? 'walk' : 'drive';
}

function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || !Number.isFinite(minutes)) return 'Route time unavailable';
  if (minutes < 60) return String(minutes) + ' min';
  return String(Math.floor(minutes / 60)) + 'h ' + String(minutes % 60) + 'm';
}

function ParentFigure({ flip = false, accent = '#0f4c81' }: { flip?: boolean; accent?: string }) {
  return (
    <g transform={flip ? 'translate(44 0)' : undefined}>
      <circle cx="24" cy="16" r="9" fill="#f1c6a8" />
      <path d="M15 38 Q24 26 33 38 L31 66 L17 66 Z" fill={accent} />
      <path d="M18 37 Q12 44 11 55" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      <path d="M30 37 Q37 44 38 54" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      <g className="school-run-leg school-run-leg-a">
        <path d="M20 63 L16 83" stroke="#2f3a48" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g className="school-run-leg school-run-leg-b">
        <path d="M28 63 L34 82" stroke="#2f3a48" strokeWidth="6" strokeLinecap="round" />
      </g>
      <ellipse cx="25" cy="86" rx="18" ry="4" fill="rgba(15,76,129,.16)" />
    </g>
  );
}

function WalkingCouple() {
  return (
    <g className="school-run-walkers">
      <g transform="translate(-52 -84)">
        <ParentFigure accent="#0f4c81" />
      </g>
      <g transform="translate(12 -84)">
        <ParentFigure flip accent="#f28b5b" />
      </g>
    </g>
  );
}

function RoadCar() {
  return (
    <g className="school-run-car">
      <ellipse cx="0" cy="29" rx="76" ry="12" fill="rgba(15,76,129,.18)" />
      <g transform="translate(-74 -40)">
        <path d="M15 53 L24 28 Q28 17 44 15 L102 15 Q118 18 128 31 L140 54 Z" fill="url(#carBody)" stroke="#dce5ee" strokeWidth="3" />
        <path d="M42 20 L61 20 L67 39 L35 39 Z" fill="#b7d1e6" stroke="#edf6ff" strokeWidth="2" />
        <path d="M72 20 L100 20 Q111 22 120 38 L72 38 Z" fill="#b7d1e6" stroke="#edf6ff" strokeWidth="2" />
        <path d="M18 53 L138 53" stroke="#f4a261" strokeWidth="5" strokeLinecap="round" />
        <g className="school-run-wheel">
          <circle cx="42" cy="56" r="17" fill="#202733" />
          <circle cx="42" cy="56" r="7" fill="#cbd5e1" />
        </g>
        <g className="school-run-wheel">
          <circle cx="112" cy="56" r="17" fill="#202733" />
          <circle cx="112" cy="56" r="7" fill="#cbd5e1" />
        </g>
        <rect x="124" y="37" width="12" height="8" rx="3" fill="#f8fafc" />
        <rect x="2" y="37" width="10" height="9" rx="3" fill="#fff3bf" />
        <rect x="84" y="48" width="28" height="7" rx="3.5" fill="#ffffff" opacity=".85" />
        <text x="98" y="54" textAnchor="middle" fontSize="7" fontWeight="900" fill="#0f4c81">ROXX</text>
      </g>
    </g>
  );
}

function SocietyBuilding() {
  return (
    <g transform="translate(18 235)">
      <ellipse cx="90" cy="74" rx="86" ry="12" fill="rgba(15,76,129,.11)" />
      <path d="M24 72 L24 8 L90 -18 L156 8 L156 72 Z" fill="url(#societyFront)" stroke="#dfe6ee" strokeWidth="3" />
      <path d="M156 8 L179 20 L179 78 L156 72 Z" fill="#d7e2eb" stroke="#c7d3de" strokeWidth="3" />
      <path d="M24 8 L90 -18 L156 8 L90 35 Z" fill="#eef5fa" stroke="#d1dae4" strokeWidth="3" />
      <g fill="#91b2c9">
        <rect x="43" y="18" width="14" height="16" rx="2" />
        <rect x="69" y="10" width="14" height="16" rx="2" />
        <rect x="95" y="18" width="14" height="16" rx="2" />
        <rect x="121" y="10" width="14" height="16" rx="2" />
        <rect x="43" y="45" width="14" height="16" rx="2" />
        <rect x="69" y="37" width="14" height="16" rx="2" />
        <rect x="95" y="45" width="14" height="16" rx="2" />
        <rect x="121" y="37" width="14" height="16" rx="2" />
      </g>
      <text x="90" y="92" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f4c81">YOUR SOCIETY</text>
    </g>
  );
}

function SchoolBuilding() {
  return (
    <g transform="translate(800 130)">
      <ellipse cx="72" cy="180" rx="92" ry="12" fill="rgba(15,76,129,.13)" />
      <path d="M4 176 L4 66 L70 28 L140 66 L140 176 Z" fill="url(#schoolFront)" stroke="#dce6ef" strokeWidth="3" />
      <path d="M140 66 L168 82 L168 182 L140 176 Z" fill="#d8e3ed" stroke="#c6d2de" strokeWidth="3" />
      <path d="M4 66 L70 28 L140 66 L70 94 Z" fill="#f4fbff" stroke="#d5dee7" strokeWidth="3" />
      <rect x="52" y="115" width="40" height="61" rx="5" fill="#d7e6ef" stroke="#b8cbd8" strokeWidth="3" />
      <path d="M21 91 L45 79 L45 107 L21 120 Z" fill="#95bad0" />
      <path d="M101 79 L125 91 L125 120 L101 107 Z" fill="#95bad0" />
      <text x="72" y="205" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f4c81">SCHOOL</text>
    </g>
  );
}

export default function SchoolRunJourney3D({
  origin,
  school,
  animationToken,
}: {
  origin: Point;
  school: RouteSchool;
  animationToken: number;
}) {
  const mode = chooseMode(school);
  const selectedRoute = mode === 'walk' ? (school.walking || school.driving) : school.driving;
  const [running, setRunning] = useState(true);
  const [replayKey, setReplayKey] = useState(animationToken);

  useEffect(function () {
    setReplayKey(animationToken);
    setRunning(true);
  }, [animationToken]);

  const plot = useMemo(function () {
    const coords = selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length
      ? selectedRoute.coordinates
      : [[origin.lng, origin.lat], [school.point.lng, school.point.lat]] as [number, number][];
    const points = projectRoute(coords);
    return { path: toPath(points) };
  }, [origin.lat, origin.lng, school.point.lat, school.point.lng, selectedRoute]);

  const distance = school.driving ? school.driving.distanceKm : null;
  const duration = mode === 'walk'
    ? Math.max(5.5, Math.min(11, (distance || 1) * 2.3))
    : Math.max(6.5, Math.min(12, (distance || 2) * 0.9));
  const distanceText = distance == null ? '—' : distance.toFixed(2) + ' km';
  const durationText = formatDuration(mode === 'walk' && school.walking ? school.walking.durationMin : school.driving && school.driving.durationMin);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(145deg,#f7fbff_0%,#ffffff_56%,#fff7f1_100%)] shadow-[0_24px_70px_rgba(15,76,129,.10)]">
      <style jsx>{`
        .school-run-scene { perspective: 1200px; }
        .school-run-stage { transform: rotateX(7deg); transform-style: preserve-3d; transition: transform .7s ease; }
        .school-run-stage:hover { transform: rotateX(3deg) translateY(-2px); }
        .school-run-grid {
          background-image: linear-gradient(rgba(15,76,129,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,76,129,.06) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 78%, transparent);
        }
        @keyframes schoolRunFloat { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        @keyframes schoolRunGlow { 0%,100% { opacity:.32; transform: scale(.98); } 50% { opacity:.78; transform: scale(1.04); } }
        @keyframes schoolRunBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes schoolRunLegA { 0%,100% { transform: rotate(20deg); } 50% { transform: rotate(-22deg); } }
        @keyframes schoolRunLegB { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(22deg); } }
        @keyframes schoolRunSpin { to { transform: rotate(360deg); } }
        .school-run-float { animation: schoolRunFloat 3.8s ease-in-out infinite; }
        .school-run-glow { animation: schoolRunGlow 2.8s ease-in-out infinite; }
        .school-run-walkers { animation: schoolRunBob .62s ease-in-out infinite; }
        .school-run-leg { transform-box: fill-box; transform-origin: top center; }
        .school-run-leg-a { animation: schoolRunLegA .62s ease-in-out infinite; }
        .school-run-leg-b { animation: schoolRunLegB .62s ease-in-out infinite; }
        .school-run-wheel { animation: schoolRunSpin .7s linear infinite; transform-box: fill-box; transform-origin: center; }
        .school-run-pulse { animation: schoolRunGlow 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .school-run-stage, .school-run-float, .school-run-glow, .school-run-walkers, .school-run-leg-a, .school-run-leg-b, .school-run-wheel, .school-run-pulse { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="relative z-10 flex flex-col gap-4 border-b border-slate-200/80 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-[var(--color-primary)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> 3D family journey
            </div>
            <h3 className="mt-2 text-lg font-black tracking-tight text-[var(--color-content)] sm:text-xl">
              {mode === 'walk' ? 'They walk together' : 'They’re off to school'}
            </h3>
            <p className="mt-1 max-w-2xl text-xs text-[var(--color-content-muted)]">
              {mode === 'walk'
                ? school.name + ' is close enough for a walking run from ' + origin.label + '.'
                : school.name + ' is far enough away that the family takes the car from ' + origin.label + '.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black shadow-sm ' + (mode === 'walk' ? 'border-orange-200 bg-orange-50 text-orange-900' : 'border-sky-200 bg-sky-50 text-sky-900')}>
              {mode === 'walk' ? <Footprints className="h-4 w-4" /> : <CarFront className="h-4 w-4" />}
              {mode === 'walk' ? 'AUTO · WALK' : 'AUTO · DRIVE'}
            </div>
            <button
              type="button"
              onClick={function () {
                setReplayKey(function (value) { return value + 1; });
                setRunning(true);
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Distance</div>
            <div className="mt-1 text-sm font-black text-slate-900">{distanceText}</div>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Travel</div>
            <div className="mt-1 text-sm font-black text-slate-900">{durationText}</div>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Destination</div>
            <div className="mt-1 truncate text-sm font-black text-slate-900">{school.shortName || school.name}</div>
          </div>
        </div>
      </div>

      <div className="school-run-scene relative h-[370px] overflow-hidden sm:h-[440px]">
        <div className="school-run-grid absolute inset-0 opacity-70" />
        <div className="school-run-glow absolute left-[8%] top-[18%] h-28 w-28 rounded-full bg-sky-200/40 blur-2xl" />
        <div className="school-run-pulse absolute right-[12%] top-[20%] h-32 w-32 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="school-run-stage absolute inset-3 sm:inset-5">
          <svg viewBox="0 0 1000 400" className="h-full w-full" role="img" aria-label={'Animated route from ' + origin.label + ' to ' + school.name}>
            <defs>
              <linearGradient id="road" x1="0" x2="1">
                <stop offset="0%" stopColor="#dfe8ef" />
                <stop offset="55%" stopColor="#c8d4df" />
                <stop offset="100%" stopColor="#e7edf2" />
              </linearGradient>
              <linearGradient id="carBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f4f6f8" />
                <stop offset="100%" stopColor="#d7dee6" />
              </linearGradient>
              <linearGradient id="societyFront" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#edf5fa" />
                <stop offset="100%" stopColor="#cbd9e4" />
              </linearGradient>
              <linearGradient id="schoolFront" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d7e5ee" />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0f4c81" floodOpacity=".12" />
              </filter>
            </defs>

            <path d="M 120 305 C 300 242, 385 348, 540 260 S 758 192, 900 128" fill="none" stroke="rgba(15,76,129,.12)" strokeWidth="54" strokeLinecap="round" />
            <path d={plot.path} fill="none" stroke="url(#road)" strokeWidth="42" strokeLinecap="round" filter="url(#softShadow)" />
            <path d={plot.path} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="14 18" strokeLinecap="round" opacity=".72">
              <animate attributeName="stroke-dashoffset" from="0" to="-64" dur="1.6s" repeatCount="indefinite" />
            </path>

            <SocietyBuilding />
            <SchoolBuilding />

            <g transform="translate(198 76)" className="school-run-float">
              <circle cx="0" cy="0" r="22" fill="#eaf5ff" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0f4c81">BASE</text>
            </g>

            <g transform="translate(875 84)" className="school-run-float" style={{ animationDelay: '.8s' }}>
              <circle cx="0" cy="0" r="22" fill="#fff1e8" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="#d56534">GO</text>
            </g>

            {running ? (
              <g key={replayKey}>
                <animateMotion dur={String(duration) + 's'} path={plot.path} rotate="auto" fill="freeze" />
                {mode === 'walk' ? <WalkingCouple /> : <RoadCar />}
              </g>
            ) : null}

            <g transform="translate(500 356)">
              <rect x="-145" y="-16" width="290" height="32" rx="16" fill="rgba(255,255,255,.82)" stroke="rgba(15,76,129,.10)" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="800" fill="#334155">
                {mode === 'walk' ? 'Nearby school · walking mode' : 'Longer school run · driving mode'}
              </text>
            </g>
          </svg>
        </div>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/80 bg-white/72 px-3 py-2 text-[10px] font-black text-slate-600 shadow-sm backdrop-blur">
          {mode === 'walk' ? '👟 Couple walking' : '🚙 White ROXX-style SUV'}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/90 bg-white/78 px-4 py-3 shadow-lg backdrop-blur-xl">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">Journey</div>
            <div className="truncate text-xs font-extrabold text-slate-900">{origin.label + ' → ' + school.name}</div>
          </div>
          <button
            type="button"
            onClick={function () { setRunning(function (value) { return !value; }); }}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-2xl bg-[var(--color-primary)] px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {running ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
}
