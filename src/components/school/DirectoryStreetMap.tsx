'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { School } from '../../types/school';

type MappedSchool = {
  school: School;
  lat: number;
  lng: number;
  distanceKm: number | null;
  isWithinRadius: boolean;
};

type Point = { lat: number; lng: number; label: string };

function FitBounds({ schools, activeAnchor }: { schools: MappedSchool[]; activeAnchor: Point | null }) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = schools.map(s => [s.lat, s.lng]);
    if (activeAnchor) points.push([activeAnchor.lat, activeAnchor.lng]);
    if (!points.length) return;

    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
    }
  }, [map, schools, activeAnchor]);

  return null;
}

const schoolIcon = L.divIcon({
  className: 'admission-pitara-directory-school-marker',
  html: '<div style="width:30px;height:30px;border-radius:50%;background:#0f4c81;color:white;border:3px solid white;box-shadow:0 3px 12px rgba(15,76,129,.30);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px">S</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const selectedSchoolIcon = L.divIcon({
  className: 'admission-pitara-directory-selected-marker',
  html: '<div style="width:34px;height:34px;border-radius:50%;background:#f28b5b;color:white;border:3px solid white;box-shadow:0 3px 14px rgba(242,139,91,.34);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px">S</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const anchorIcon = L.divIcon({
  className: 'admission-pitara-directory-anchor-marker',
  html: '<div style="width:28px;height:28px;border-radius:50%;background:#f59e0b;color:white;border:3px solid white;box-shadow:0 3px 12px rgba(245,158,11,.30);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px">•</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function DirectoryStreetMap({
  schools,
  activeSlug,
  activeAnchor,
  onSelect,
}: {
  schools: MappedSchool[];
  activeSlug?: string | null;
  activeAnchor: Point | null;
  onSelect?: (school: School) => void;
}) {
  const center: [number, number] = schools.length
    ? [schools[0].lat, schools[0].lng]
    : activeAnchor
      ? [activeAnchor.lat, activeAnchor.lng]
      : [28.59, 77.44];

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds schools={schools} activeAnchor={activeAnchor} />

        {activeAnchor && (
          <Marker position={[activeAnchor.lat, activeAnchor.lng]} icon={anchorIcon}>
            <Popup>
              <strong>{activeAnchor.label}</strong>
              <br />
              Distance anchor
            </Popup>
          </Marker>
        )}

        {schools.map(item => {
          const isSelected = item.school.slug === activeSlug;
          const isDimmed = !item.isWithinRadius;
          return (
            <Marker
              key={item.school.slug}
              position={[item.lat, item.lng]}
              icon={isSelected ? selectedSchoolIcon : schoolIcon}
              opacity={isDimmed ? 0.35 : 1}
              eventHandlers={{ click: () => onSelect?.(item.school) }}
            >
              <Popup>
                <strong>{item.school.name}</strong>
                <br />
                {item.school.location.address}
                <br />
                <span>{item.lat.toFixed(6)}, {item.lng.toFixed(6)}</span>
                {item.distanceKm !== null ? <><br />{item.distanceKm === 0 ? 'Here' : `${item.distanceKm} km from anchor`}</> : null}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute left-3 bottom-3 z-[400] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-warm-xs backdrop-blur-sm">
        <div className="text-[11px] font-black text-[var(--color-content)]">
          {schools.length} exact campus pins
        </div>
        <div className="text-[10px] text-slate-500">
          Pin positions use the stored latitude &amp; longitude directly.
        </div>
      </div>
    </div>
  );
}
