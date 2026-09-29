'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, MapPin, Star } from 'lucide-react';

type MostViewedSchool = {
  slug: string;
  name: string;
  area: string;
  sector: string;
  rating: number;
};

export function MostViewedSchools() {
  const [schools, setSchools] = useState<MostViewedSchool[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/public/most-viewed', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!cancelled && data?.success && Array.isArray(data.schools)) {
          setSchools(data.schools);
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  if (schools.length === 0) return null;

  return (
    <section className="mb-8 rounded-2xl border border-[var(--color-border)] bg-white p-4 sm:p-5 shadow-warm-xs">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-content-muted)]">Live directory signal</p>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-content)]">Most viewed schools</h2>
          <p className="text-xs text-[var(--color-content-muted)] mt-1">Schools parents are viewing most on Admission Pitara right now.</p>
        </div>
        <Eye className="w-5 h-5 text-[var(--color-brand-red)] shrink-0" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {schools.slice(0, 4).map((school, index) => (
          <Link
            key={school.slug}
            href={`/schools/${school.slug}`}
            className="group rounded-xl border border-[var(--color-border)] bg-[#faf8f5] p-3.5 hover:border-[var(--color-brand-red-border)] hover:bg-[var(--color-brand-red-soft)] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-black text-[var(--color-content-muted)]">#{index + 1}</span>
            </div>
            <h3 className="mt-2 text-sm font-extrabold text-[var(--color-content)] leading-snug group-hover:text-[var(--color-brand-red)]">
              {school.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--color-content-muted)]">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{school.sector || school.area}</span>
              {school.rating > 0 && <span className="inline-flex items-center gap-1"><Star className="w-3 h-3" />{school.rating.toFixed(1)}</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
