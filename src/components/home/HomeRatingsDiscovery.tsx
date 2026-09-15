'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, MessageSquare, ArrowRight, Sparkles, CheckCircle2, User, School as SchoolIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { getSchoolBySlug } from '../../lib/schools';
import { cn } from '../../lib/utils';

interface RatingItem {
  id: string;
  schoolSlug: string;
  userName: string;
  userChildGrade?: string;
  score: number;
  title?: string;
  comment: string;
  verifiedParent: boolean;
  createdAt: string;
  categories?: {
    academics?: number;
    infrastructure?: number;
    faculty?: number;
    safety?: number;
  };
}

export const HomeRatingsDiscovery: React.FC = () => {
  const [recentRatings, setRecentRatings] = useState<RatingItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRecentRatings() {
      try {
        const res = await fetch('/api/schools/popularity');
        if (res.ok) {
          const data = await res.json();
          // We can also fetch recent ratings from a lightweight endpoint or summary
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRecentRatings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-[#f7f5f0] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Verified Parent Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              What parents think
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed">
              Explore genuine parent ratings and share your own experience of a school.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/schools">
              <Button
                variant="primary"
                size="md"
                className="bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Rate a School
              </Button>
            </Link>
          </div>
        </div>

        {/* Verification Guarantee Pill */}
        <div className="mb-8 p-4 bg-white/80 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2 text-stone-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strict Authenticity Standard: Only email-verified parent accounts can submit ratings.</span>
          </div>
          <div className="text-stone-500 text-[11px] sm:text-right">
            Zero sponsored reviews • No anonymous spam
          </div>
        </div>

        {/* Editorial Community Invitation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Transparent Evaluation Criteria */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              4-Pillar School Feedback
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Reviews cover Academics, Campus Infrastructure, Faculty Quality, and Student Safety with individual scores.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-stone-600">
              <span className="px-2 py-0.5 bg-stone-100 rounded-md">Academics</span>
              <span className="px-2 py-0.5 bg-stone-100 rounded-md">Infrastructure</span>
              <span className="px-2 py-0.5 bg-stone-100 rounded-md">Faculty</span>
              <span className="px-2 py-0.5 bg-stone-100 rounded-md">Safety</span>
            </div>
          </div>

          {/* Card 2: Honest Community Growth */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Community Experience
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Parent ratings are beginning to grow across Greater Noida West schools. Be among the first to share your constructive experience.
            </p>
            <div className="pt-2">
              <Link href="/schools" className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1">
                <span>Browse schools to review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Editorial Independence */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Unbiased & Independent
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Admission Pitara does not accept payment from schools for rankings or preferred rating placements.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-medium text-stone-500">
                100% Parent-driven transparency
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
