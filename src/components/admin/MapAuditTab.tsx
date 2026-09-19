'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Edit,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface MapAuditData {
  totalCanonical: number;
  totalWithCoordinates: number;
  totalMissingCoordinates: number;
  totalOutsideBounds: number;
  duplicateCoordinateClusters: {
    lat: number;
    lng: number;
    schools: { slug: string; name: string; sector: string }[];
  }[];
  missingCoordinatesSchools: {
    slug: string;
    name: string;
    sector: string;
    address: string;
  }[];
  outsideBoundsSchools: {
    slug: string;
    name: string;
    coordinates: { lat: number; lng: number };
    distanceFromWestKm: number;
  }[];
  gnWestBoundingBox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
    center: { lat: number; lng: number };
  };
}

interface MapAuditTabProps {
  onEditSchool: (slug: string) => void;
}

export function MapAuditTab({ onEditSchool }: MapAuditTabProps) {
  const [data, setData] = useState<MapAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'missing' | 'duplicates' | 'bounds'>('missing');

  const fetchMapAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/map-audit');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load map audit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapAudit();
  }, []);

  if (loading && !data) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
        <p className="text-xs">Auditing Greater Noida West map pins & coordinate accuracy...</p>
      </div>
    );
  }

  const bounds = data?.gnWestBoundingBox;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c]">
          <span className="text-xs font-semibold text-slate-300">Valid Map Pins</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-serif">
              {data?.totalWithCoordinates || 0}
            </span>
            <span className="text-xs text-slate-400">of {data?.totalCanonical || 0}</span>
          </div>
          <p className="text-[11px] text-emerald-400/80 font-medium">Mapped on interactive directory</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c]">
          <span className="text-xs font-semibold text-slate-300">Missing Coordinates</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-serif">
              {data?.totalMissingCoordinates || 0}
            </span>
            <span className="text-xs text-slate-400">schools</span>
          </div>
          <p className="text-[11px] text-amber-400/80 font-medium">No pin rendered (clean policy)</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c]">
          <span className="text-xs font-semibold text-slate-300">Clustered Coordinates</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-400 font-serif">
              {data?.duplicateCoordinateClusters.length || 0}
            </span>
            <span className="text-xs text-slate-400">clusters</span>
          </div>
          <p className="text-[11px] text-sky-400/80 font-medium">Shared exact lat/long pairs</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d2644] border border-[#1d4b7c]">
          <span className="text-xs font-semibold text-slate-300">GN West Bound Check</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-serif">
              {data?.totalOutsideBounds === 0 ? '100%' : `${data?.totalOutsideBounds} out`}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/80 font-medium">Lat 28.55-28.65, Lng 77.40-77.52</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#091b32] border border-[#1d4672] w-fit">
        <button
          onClick={() => setActiveSubTab('missing')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'missing'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Missing Coordinates ({data?.totalMissingCoordinates || 0})
        </button>
        <button
          onClick={() => setActiveSubTab('duplicates')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'duplicates'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Shared Clusters ({data?.duplicateCoordinateClusters.length || 0})
        </button>
        <button
          onClick={() => setActiveSubTab('bounds')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeSubTab === 'bounds'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Geographic Bounding Box
        </button>
      </div>

      {/* Missing Tab Content */}
      {activeSubTab === 'missing' && (
        <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Schools Requiring Coordinate Verification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Admission Pitara policy strictly forbids fabricated fallback coordinates.
                Verify official GPS location before setting pins.
              </p>
            </div>
          </div>

          {data?.missingCoordinatesSchools.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              <span>All canonical schools in Greater Noida West have verified coordinates!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data?.missingCoordinatesSchools.map(school => (
                <div
                  key={school.slug}
                  className="p-3.5 rounded-xl bg-[#08182b] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-white text-xs">{school.name}</h4>
                    <p className="text-[11px] text-slate-400">{school.sector}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{school.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${school.name}, ${school.sector}, Greater Noida West`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                      title="Search in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onEditSchool(school.slug)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Set GPS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clustered Tab Content */}
      {activeSubTab === 'duplicates' && (
        <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              Shared Coordinate Clusters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These schools share the exact same latitude/longitude pair (likely generic sector-center pins).
            </p>
          </div>

          <div className="space-y-3">
            {data?.duplicateCoordinateClusters.map((cluster, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#08182b] border border-white/5 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">
                      {cluster.lat.toFixed(5)}, {cluster.lng.toFixed(5)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({cluster.schools.length} schools sharing this pin)
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${cluster.lat},${cluster.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
                  >
                    <span>View Cluster on Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {cluster.schools.map(s => (
                    <div
                      key={s.slug}
                      className="p-2.5 rounded-lg bg-[#0b2038] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.sector}</p>
                      </div>
                      <button
                        onClick={() => onEditSchool(s.slug)}
                        className="p-1 text-slate-400 hover:text-amber-400"
                        title="Adjust specific coordinates"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bounds Tab Content */}
      {activeSubTab === 'bounds' && (
        <div className="p-5 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Greater Noida West Directory Catchment Perimeter
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Defines the authoritative geographic boundaries for core Greater Noida West / Noida Extension.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#08182b] border border-white/5">
              <span className="text-slate-400 text-[11px]">North Latitude</span>
              <p className="font-bold font-mono text-white text-sm mt-1">{bounds?.maxLat}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#08182b] border border-white/5">
              <span className="text-slate-400 text-[11px]">South Latitude</span>
              <p className="font-bold font-mono text-white text-sm mt-1">{bounds?.minLat}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#08182b] border border-white/5">
              <span className="text-slate-400 text-[11px]">West Longitude</span>
              <p className="font-bold font-mono text-white text-sm mt-1">{bounds?.minLng}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#08182b] border border-white/5">
              <span className="text-slate-400 text-[11px]">East Longitude</span>
              <p className="font-bold font-mono text-white text-sm mt-1">{bounds?.maxLng}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
