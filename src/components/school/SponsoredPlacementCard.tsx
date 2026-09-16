'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { getSchoolBySlug } from '../../lib/schools';
import type { School } from '../../types/school';

interface PromoData {
  id: string;
  schoolSlug: string;
  campaignName: string;
  placementType: string;
  title: string;
  description: string;
  badgeLabel: string;
  ctaText: string;
  ctaLink: string;
}

export const SponsoredPlacementCard: React.FC<{ placement?: string; className?: string }> = ({
  placement = 'homepage_hero',
  className = '',
}) => {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPromo() {
      try {
        const res = await fetch(`/api/promotions?placement=${encodeURIComponent(placement)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.promotions && data.promotions.length > 0 && isMounted) {
            const first = data.promotions[0];
            setPromo(first);
            const foundSchool = getSchoolBySlug(first.schoolSlug);
            if (foundSchool) setSchool(foundSchool);

            // Log impression
            fetch('/api/promotions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ campaignId: first.id, action: 'impression' }),
            }).catch(() => {});
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadPromo();
    return () => {
      isMounted = false;
    };
  }, [placement]);

  if (!promo || !school) return null;

  const handleClick = () => {
    fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: promo.id, action: 'click' }),
    }).catch(() => {});
  };

  return (
    <div
      className={`w-full rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#0f2b48] via-[#163a60] to-[#1e4875] text-white border border-[#2b5885] shadow-lg relative overflow-hidden ${className}`}
    >
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-400 text-slate-950 shadow-xs">
              <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
              <span>{promo.badgeLabel || 'Sponsored'}</span>
            </span>
            <span className="text-xs text-blue-200/80 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{school.location.sector || school.location.area}</span>
            </span>
            <span className="text-xs text-blue-300/60 hidden sm:inline">•</span>
            <span className="text-xs text-blue-200/80 hidden sm:inline">{school.board ? school.board.join(', ') : 'CBSE'}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight">
            {promo.title}
          </h3>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            {promo.description}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0 border-t border-white/10 md:border-t-0">
          <Link
            href={promo.ctaLink || `/schools/${school.slug}`}
            onClick={handleClick}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            <span>{promo.ctaText || 'View Admissions & Campus'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
