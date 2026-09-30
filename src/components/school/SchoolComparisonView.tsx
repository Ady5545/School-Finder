'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  X,
  Check,
  Minus,
  Sparkles,
  Heart,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  GraduationCap,
  IndianRupee,
  MapPin,
  Trophy,
  Bus,
  Shirt,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SchoolImage } from './SchoolImage';
import { RatingDisplay } from '../ui/RatingDisplay';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { AdmissionStatus } from './AdmissionStatus';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { getAllSchools, getCanonicalSchools } from '../../lib/schools';
import { formatCurrency, cn } from '../../lib/utils';
import type { School, DetailedFeeComponent, FeeConcession } from '../../types/school';
import { trackClientCompare } from '../../lib/tracker';

export const SchoolComparisonView: React.FC<{ initialSchools?: School[] }> = ({ initialSchools = [] }) => {
  const { compareList, addCompare, removeCompare, clearCompare, isInShortlist, toggleShortlist } =
    useSchoolStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [allSchools, setAllSchools] = useState<School[]>(initialSchools);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/schools?_ts=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (!cancelled && data?.success && Array.isArray(data.schools)) setAllSchools(data.schools); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (isAuthLoading) {
    return (
      <div className="max-w-2xl mx-auto w-full py-12 text-center text-xs text-slate-500">
        Loading your private comparison workspace…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto w-full py-8">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-warm-xs text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4">
            <Scale className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Parent Access Only</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
            Parent Account Required for Comparisons
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            Compare schools privately and keep your selected schools with your Parent Account across visits and devices.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto font-bold">Sign In to Compare</Button>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto font-bold">Create Parent Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [selectorQuery, setSelectorQuery] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Mobile Comparison Mode state: 'stacked' (vertical metric blocks), 'dual' (2-school side-by-side), or 'table' (swipeable table)
  const [mobileCompMode, setMobileCompMode] = useState<'stacked' | 'dual' | 'table'>('stacked');
  const [dualSchoolA, setDualSchoolA] = useState<number>(0);
  const [dualSchoolB, setDualSchoolB] = useState<number>(1);

  // Get full school objects from compareList
  const selectedSchools: School[] = useMemo(() => {
    return compareList
      .map(slug => allSchools.find(s => s.slug === slug))
      .filter((s): s is School => Boolean(s));
  }, [compareList, allSchools]);

  const trackedCompareKeyRef = useRef('');
  const compareTelemetryKey = selectedSchools.map(s => s.slug).join('|');

  useEffect(() => {
    if (selectedSchools.length < 2 || !compareTelemetryKey) return;
    if (trackedCompareKeyRef.current === compareTelemetryKey) return;
    trackedCompareKeyRef.current = compareTelemetryKey;
    trackClientCompare(selectedSchools.map(s => s.slug));
  }, [compareTelemetryKey, selectedSchools]);

  // URL query parameter synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSchools = urlParams.get('schools');
      if (urlSchools && compareList.length === 0) {
        const slugs = urlSchools.split(',').map(s => s.trim()).filter(Boolean);
        slugs.slice(0, 4).forEach(slug => {
          const s = allSchools.find(s => s.slug === slug);