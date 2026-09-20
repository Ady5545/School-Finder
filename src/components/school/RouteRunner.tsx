'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

type LatLng = [number, number]; // [lat, lng]

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
}

function bearingDeg(a: LatLng, b: LatLng): number {
  const lat1 = (a[0] * Math.PI) / 180, lat2 = (b[0] * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function makeIcon(emoji: string, bearing: number) {
  return L.divIcon({
    className: 'school-run-runner-marker',
    html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;transform:rotate(${bearing}deg);filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))"><span style="display:inline-block;transform:rotate(${-bearing}deg);font-size:22px;line-height:1">${emoji}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export type RouteRunnerHandle = { totalKm: number };

/**
 * Animates a marker along the *actual* routed road/footpath geometry
 * (the same coordinate array drawn as the polyline), not a straight line
 * between origin and school. Distance travelled is computed by summing
 * real haversine segment lengths, so progress and ETA stay honest even on
 * a winding road.
 */
export default function RouteRunner({
  coordinates, // [lng, lat][] as returned by the routing provider
  playing,
  speedKmPerSec,
  emoji,
  onProgress,
  resetKey,
}: {
  coordinates: [number, number][];
  playing: boolean;
  speedKmPerSec: number;
  emoji: string;
  onProgress: (info: { coveredKm: number; totalKm: number; fraction: number; done: boolean }) => void;
  resetKey: string;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const rafRef = useRef<number | null>(null);
  const coveredKmRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

  const points: LatLng[] = coordinates.map(([lng, lat]) => [lat, lng]);
  const segLens = points.slice(1).map((p, i) => haversineKm(points[i], p));
  const totalKm = segLens.reduce((a, b) => a + b, 0);

  const positionAt = (km: number): { pos: LatLng; bearing: number } => {
    if (points.length === 0) return { pos: [0, 0], bearing: 0 };
    if (points.length === 1 || km <= 0) return { pos: points[0], bearing: 0 };
    let remaining = km;
    for (let i = 0; i < segLens.length; i++) {
      const len = segLens[i];
      if (remaining <= len || i === segLens.length - 1) {
        const t = len > 0 ? Math.min(1, remaining / len) : 1;
        const a = points[i], b = points[i + 1];
        const pos: LatLng = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        return { pos, bearing: bearingDeg(a, b) };
      }
      remaining -= len;
    }
    return { pos: points[points.length - 1], bearing: 0 };
  };

  // Reset progress whenever the underlying route changes (new school/mode selected).
  useEffect(() => {
    coveredKmRef.current = 0;
    lastTsRef.current = null;
    const { pos, bearing } = positionAt(0);
    if (markerRef.current) {
      markerRef.current.setLatLng(pos);
      markerRef.current.setIcon(makeIcon(emoji, bearing));
    } else if (points.length) {
      markerRef.current = L.marker(pos, { icon: makeIcon(emoji, bearing), zIndexOffset: 1000 }).addTo(map);
    }
    onProgress({ coveredKm: 0, totalKm, fraction: 0, done: totalKm === 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!playing || totalKm === 0) { lastTsRef.current = null; if (rafRef.current) cancelAnimationFrame(rafRef.current); return; }

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dtSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      coveredKmRef.current = Math.min(totalKm, coveredKmRef.current + dtSec * speedKmPerSec);
      const { pos, bearing } = positionAt(coveredKmRef.current);
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
        markerRef.current.setIcon(makeIcon(emoji, bearing));
      }
      const fraction = totalKm > 0 ? coveredKmRef.current / totalKm : 1;
      const done = coveredKmRef.current >= totalKm;
      onProgress({ coveredKm: coveredKmRef.current, totalKm, fraction, done });
      if (!done) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speedKmPerSec, totalKm]);

  return null;
}
