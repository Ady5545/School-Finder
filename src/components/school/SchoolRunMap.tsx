'use client';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Point = { lat: number; lng: number; label: string };
type RouteSchool = { slug: string; name: string; sector?: string; point: Point; driving: { coordinates: [number, number][] } | null; walking: { coordinates: [number, number][] } | null };

function FitBounds({ origin, schools }: { origin: Point; schools: RouteSchool[] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([[origin.lat, origin.lng], ...schools.map(s => [s.point.lat, s.point.lng] as [number, number])]);
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, origin, schools]);
  return null;
}
const originIcon = L.divIcon({ className: 'school-run-origin-marker', html: '<div style="width:34px;height:34px;border-radius:50%;background:#0f4c81;color:white;border:3px solid white;box-shadow:0 3px 12px rgba(15,76,129,.35);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">⌂</div>', iconSize: [34,34], iconAnchor: [17,17] });
const schoolIcon = L.divIcon({ className: 'school-run-school-marker', html: '<div style="width:32px;height:32px;border-radius:50%;background:#f28b5b;color:white;border:3px solid white;box-shadow:0 3px 12px rgba(242,139,91,.35);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">S</div>', iconSize: [32,32], iconAnchor: [16,16] });

export default function SchoolRunMap({ origin, schools, activeSlug, onSelect }: { origin: Point; schools: RouteSchool[]; activeSlug: string | null; onSelect: (slug: string) => void }) {
  const active = schools.find(s => s.slug === activeSlug) || schools[0];
  return <div className="h-[430px] sm:h-[520px] w-full overflow-hidden rounded-2xl border border-[var(--color-border)]">
    <MapContainer center={[origin.lat, origin.lng]} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds origin={origin} schools={schools} />
      <Marker position={[origin.lat, origin.lng]} icon={originIcon}><Popup><strong>Your society</strong><br />{origin.label}</Popup></Marker>
      {schools.map((school, index) => <Marker key={school.slug} position={[school.point.lat, school.point.lng]} icon={schoolIcon} eventHandlers={{ click: () => onSelect(school.slug) }}><Popup><strong>{index + 1}. {school.name}</strong><br />{school.sector || 'Greater Noida'}</Popup></Marker>)}
      {active?.driving?.coordinates?.length ? <Polyline positions={active.driving.coordinates.map(([lng,lat]) => [lat,lng] as [number,number])} pathOptions={{ color: '#0f4c81', weight: 5, opacity: .82 }} /> : null}
      {active?.walking?.coordinates?.length ? <Polyline positions={active.walking.coordinates.map(([lng,lat]) => [lat,lng] as [number,number])} pathOptions={{ color: '#f28b5b', weight: 4, opacity: .9, dashArray: '8 8' }} /> : null}
    </MapContainer>
  </div>;
}