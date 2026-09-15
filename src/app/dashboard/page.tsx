'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { useSchoolStore } from '../../lib/schoolStore';
import { getAllSchools } from '../../lib/schools';
import { SchoolCard } from '../../components/school/SchoolCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  ShieldCheck,
  MapPin,
  Mail,
  Smartphone,
  BookmarkCheck,
  Scale,
  Sparkles,
  LogOut,
  GraduationCap,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { shortlist, compareList, clearShortlist, clearCompare } = useSchoolStore();
  const allSchools = getAllSchools();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
        <p className="mt-3 text-xs text-[var(--color-content-muted)] font-medium">Loading parent dashboard...</p>
      </div>
    );
  }

  // Filter shortlist and comparison schools
  const wishlistedSchools = allSchools.filter(s => shortlist.includes(s.slug));
  const comparedSchools = allSchools.filter(s => compareList.includes(s.slug));

  // Nearby schools based on user locality keyword (e.g. Sector, Techzone, Knowledge Park)
  const localityKey = user.locality.split(',')[0].trim().toLowerCase();
  const nearbySchools = allSchools.filter(s => {
    const schoolArea = (s.location.area || '').toLowerCase();
    const schoolAddress = s.location.address.toLowerCase();
    return schoolArea.includes(localityKey) || schoolAddress.includes(localityKey);
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-50/80 via-amber-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-content)] tracking-tight">
                  {user.name}
                </h1>
                {user.mobileVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Mobile
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-content-muted)] font-medium">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user.locality}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  +91 {user.mobile}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                {user.childGrade && (
                  <span className="inline-flex items-center gap-1 text-sky-800 bg-sky-50 px-2 py-0.5 rounded font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {user.childGrade}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/schools">
              <Button variant="primary" size="sm" rightIcon={<Compass className="w-4 h-4" />}>
                Explore Schools
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-slate-600 hover:text-rose-600"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
          <div className="p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Shortlisted</span>
            <span className="text-xl font-black text-[var(--color-primary)]">{shortlist.length} Schools</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">In Compare Tray</span>
            <span className="text-xl font-black text-sky-700">{compareList.length} Schools</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Local Matches</span>
            <span className="text-xl font-black text-amber-700">{nearbySchools.length} Schools</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Admissions 2026-27</span>
            <span className="text-xl font-black text-emerald-700">Open</span>
          </div>
        </div>
      </div>

      {/* Shortlisted Schools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-black text-[var(--color-content)] tracking-tight">
              My Saved Shortlist ({wishlistedSchools.length})
            </h2>
          </div>
          {wishlistedSchools.length > 0 && (
            <button
              onClick={clearShortlist}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
            >
              Clear Shortlist
            </button>
          )}
        </div>

        {wishlistedSchools.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-content)]">Your shortlist is currently empty</h3>
            <p className="text-xs text-[var(--color-content-muted)] max-w-md mx-auto">
              Save top schools in Greater Noida while browsing to easily compare their verified fee structures and admissions.
            </p>
            <Link href="/schools">
              <Button variant="primary" size="sm">
                Browse 17 Greater Noida Schools
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedSchools.map(school => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}
      </div>

      {/* Compare Tray Section */}
      {comparedSchools.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-black text-[var(--color-content)] tracking-tight">
                Active Comparison Tray ({comparedSchools.length}/4)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                Clear
              </button>
              <Link href="/compare">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Matrix
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparedSchools.map(school => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </div>
      )}

      {/* Localized Recommendations for Parent Locality */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-black text-[var(--color-content)] tracking-tight">
                Recommended for {user.locality}
              </h2>
            </div>
            <p className="text-xs text-[var(--color-content-muted)] mt-0.5">
              Verified schools closest to your sector with direct bus coverage.
            </p>
          </div>
          <Link href="/schools" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(nearbySchools.length > 0 ? nearbySchools : allSchools.slice(0, 3)).map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>
    </div>
  );
}
