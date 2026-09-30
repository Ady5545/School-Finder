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
import { getAllSchools, getCanonicalSchools } from '../../lib/schools';
import { formatCurrency, cn } from '../../lib/utils';
import type { School, DetailedFeeComponent, FeeConcession } from '../../types/school';
import { trackClientCompare } from '../../lib/tracker';

export const SchoolComparisonView: React.FC<{ initialSchools?: School[] }> = ({ initialSchools = [] }) => {
  const { compareList, addCompare, removeCompare, clearCompare, isInShortlist, toggleShortlist } =
    useSchoolStore();
  const [allSchools, setAllSchools] = useState<School[]>(initialSchools);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/schools?_ts=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (!cancelled && data?.success && Array.isArray(data.schools)) setAllSchools(data.schools); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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