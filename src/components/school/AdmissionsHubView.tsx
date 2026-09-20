'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Bell,
  Scale,
  Heart,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  MapPin,
  GraduationCap,
  ArrowRight,
  Info,
  Building,
  Sparkles,
} from 'lucide-react';
import { getAllSchools } from '../../lib/schools';
import { AdmissionStatus } from './AdmissionStatus';
import { SchoolImage } from './SchoolImage';
import { AdmissionReminderModal } from './AdmissionReminderModal';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import type { School, AdmissionMilestone } from '../../types/school';

export type AdmissionGroupKey = 'all' | 'open' | 'pre_registration' | 'upcoming' | 'inquire' | 'not_disclosed';

export const AdmissionsHubView: React.FC = () => {
  const allSchools = getAllSchools();
  const { compareList, addCompare, removeCompare, isInShortlist, toggleShortlist, openAuthPrompt } =
    useSchoolStore();
  const { isAuthenticated } = useAuth();

  // Filters state
  const [selectedGroup, setSelectedGroup] = useState<AdmissionGroupKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // Reminder Modal state
  const [activeReminder, setActiveReminder] = useState<{
    schoolSlug: string;
    schoolName: string;
    milestoneId: string;
    milestoneLabel: string;
    targetDate: string;
  } | null>(null);

  // Grouping helper function
  const getAdmissionStatusGroup = (s: School): AdmissionGroupKey => {
    const raw = (s.admissions?.status || '').toLowerCase().trim();
    if (!raw || raw === 'not_disclosed' || raw === 'unknown') return 'not_disclosed';
    if (raw === 'pre_registration' || raw === 'pre-registration') return 'pre_registration';
    if (
      raw === 'open' ||
      raw === 'open_2027_2028' ||
      raw.includes('admissions open') ||
      raw.includes('open for')
    ) {
      return 'open';
    }
    if (
      raw.includes('soon') ||
      raw.includes('pending') ||
      raw === 'expected' ||
      raw === 'admissions_opening_soon'
    ) {
      return 'upcoming';
    }
    if (
      raw.includes('inquire') ||
      raw.includes('enquire') ||
      raw.includes('contact') ||
      raw.includes('schedule pending')
    ) {
      return 'inquire';
    }
    return 'not_disclosed';
  };

  // Group count calculations
  const counts = useMemo(() => {
    const c = {
      all: allSchools.length,
      open: 0,
      pre_registration: 0,
      upcoming: 0,
      inquire: 0,
      not_disclosed: 0,
    };
    allSchools.forEach(s => {
      const g = getAdmissionStatusGroup(s);
      c[g]++;
    });
    return c;
  }, [allSchools]);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return allSchools.filter(s => {
      // Group filter
      if (selectedGroup !== 'all' && getAdmissionStatusGroup(s) !== selectedGroup) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesArea = s.location.area.toLowerCase().includes(q);
        const matchesSector = s.location.sector.toLowerCase().includes(q);
        const matchesAlt =
          Array.isArray(s.alternateNames) &&
          s.alternateNames.some(alt => alt.toLowerCase().includes(q));
        if (!matchesName && !matchesArea && !matchesSector && !matchesAlt) return false;
      }

      // Board filter
      if (selectedBoard !== 'all') {
        const boards = Array.isArray(s.board) ? s.board : [s.board || 'CBSE'];
        const matches = boards.some(b => b.toLowerCase().includes(selectedBoard.toLowerCase()));
        if (!matches) return false;
      }

      // Grade filter
      if (selectedGrade !== 'all') {
        const rawGrade = (s.gradeRange.raw || '').toLowerCase();
        if (selectedGrade === 'nursery' && !rawGrade.includes('nur') && !rawGrade.includes('play')) return false;
        if (selectedGrade === 'primary' && !rawGrade.includes('1') && !rawGrade.includes('i')) return false;
        if (selectedGrade === 'secondary' && !rawGrade.includes('12') && !rawGrade.includes('xii') && !rawGrade.includes('10')) return false;
      }

      return true;
    });
  }, [allSchools, selectedGroup, searchQuery, selectedBoard, selectedGrade]);

  // Grouped schools map for 'grouped' view
  const groupedSchools = useMemo(() => {
    const map: Record<AdmissionGroupKey, School[]> = {
      all: [],
      open: [],
      pre_registration: [],
      upcoming: [],
      inquire: [],
      not_disclosed: [],
    };

    filteredSchools.forEach(s => {
      const g = getAdmissionStatusGroup(s);
      map[g].push(s);
    });

    return map;
  }, [filteredSchools]);

  // Section Group Definition
  const groupSections: {
    key: AdmissionGroupKey;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badgeColor: string;
  }[] = [
    {
      key: 'open',
      title: 'Admissions Open',
      subtitle: 'Schools currently accepting applications, inquiries, or registration forms for upcoming sessions.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    },
    {
      key: 'pre_registration',
      title: 'Pre-Registration Open',
      subtitle: 'Institutions offering early parent interest registration and document submission ahead of formal admissions.',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    },
    {
      key: 'upcoming',
      title: 'Upcoming / Pending Release',
      subtitle: 'Admissions schedule expected shortly based on documented school notices or official release calendars.',
      icon: <Calendar className="w-5 h-5 text-sky-600" />,
      badgeColor: 'bg-sky-100 text-sky-950 border-sky-300',
    },
    {
      key: 'inquire',
      title: 'Inquire with School',
      subtitle: 'Admissions schedules require direct school administration or reception inquiry for current seat availability.',
      icon: <HelpCircle className="w-5 h-5 text-indigo-600" />,
      badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-300',
    },
    {
      key: 'not_disclosed',
      title: 'Status Not Disclosed',
      subtitle: 'Admissions status is not publicly verified in source documentation. Inquire directly with the institution.',
      icon: <AlertCircle className="w-5 h-5 text-slate-500" />,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Top Controls & Status Group Selector Ribbon */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 sm:p-5 shadow-warm-xs space-y-4">
        {/* Status Group Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border min-h-[38px]',
              selectedGroup === 'all'
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            )}
          >
            <span>All Institutions</span>
            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px]', selectedGroup === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800')}>
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('open')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border min-h-[38px]',
              selectedGroup === 'open'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admissions Open</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-200/80 text-emerald-950">
              {counts.open}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('pre_registration')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border min-h-[38px]',
              selectedGroup === 'pre_registration'
                ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
            )}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pre-Registration</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-200/80 text-amber-950">
              {counts.pre_registration}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('upcoming')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border min-h-[38px]',
              selectedGroup === 'upcoming'
                ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                : 'bg-sky-50 text-sky-950 border-sky-200 hover:bg-sky-100'
            )}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Upcoming / Pending</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-200/80 text-sky-950">
              {counts.upcoming}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('inquire')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border min-h-[38px]',
              selectedGroup === 'inquire'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                : 'bg-indigo-50 text-indigo-950 border-indigo-200 hover:bg-indigo-100'
            )}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Inquire with School</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-200/80 text-indigo-950">
              {counts.inquire}
            </span>
          </button>
        </div>

        {/* Filter Bar Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search school name or sector..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all min-h-[38px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Board Filter */}
          <select
            value={selectedBoard}
            onChange={e => setSelectedBoard(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all cursor-pointer min-h-[38px]"
          >
            <option value="all">All Curriculum Boards</option>
            <option value="cbse">CBSE</option>
            <option value="cambridge">Cambridge / CAIE / IB</option>
            <option value="state board">State Board / UP Board</option>
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all cursor-pointer min-h-[38px]"
          >
            <option value="all">All Grade Levels</option>
            <option value="nursery">Pre-Primary / Nursery / KG</option>
            <option value="primary">Primary (Class 1 to 5)</option>
            <option value="secondary">Middle &amp; High (Class 6 to 12)</option>
          </select>

        </div>
      </div>

      {/* VIEW MODE 1: GROUPED SECTIONS BY STATUS */}
      <div className="space-y-8">
          {groupSections.map(sec => {
            const sectionSchools = groupedSchools[sec.key];
            if (sectionSchools.length === 0) return null;

            return (
              <div key={sec.key} className="space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-slate-100 border border-slate-200">
                      {sec.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold text-[var(--color-content)] tracking-tight">
                          {sec.title}
                        </h2>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold border', sec.badgeColor)}>
                          {sectionSchools.length} {sectionSchools.length === 1 ? 'School' : 'Schools'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-content-muted)] mt-0.5">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admission Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionSchools.map(school => (
                    <AdmissionCard
                      key={school.id}
                      school={school}
                      compareList={compareList}
                      addCompare={addCompare}
                      removeCompare={removeCompare}
                      isInShortlist={isInShortlist}
                      toggleShortlist={toggleShortlist}
                      onSetReminder={milestone => {
                        if (!isAuthenticated) {
                          openAuthPrompt({
                            slug: school.slug,
                            name: school.name,
                            image: school.assets.featured,
                            area: school.location.area,
                          });
                          return;
                        }
                        setActiveReminder({
                          schoolSlug: school.slug,
                          schoolName: school.name,
                          milestoneId: milestone.id,
                          milestoneLabel: milestone.label,
                          targetDate: milestone.date,
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filteredSchools.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-[var(--color-border)] shadow-warm-xs space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No schools match your search parameters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try resetting your curriculum board or grade filter to view available institutions in Greater Noida West.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBoard('all');
                  setSelectedGrade('all');
                  setSelectedGroup('all');
                }}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      {/* Admission Reminder Modal Integration */}
      {activeReminder && (
        <AdmissionReminderModal
          isOpen={Boolean(activeReminder)}
          onClose={() => setActiveReminder(null)}
          schoolSlug={activeReminder.schoolSlug}
          schoolName={activeReminder.schoolName}
          milestoneId={activeReminder.milestoneId}
          milestoneLabel={activeReminder.milestoneLabel}
          targetDate={activeReminder.targetDate}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

/* Individual Compact Admission Card Component */
interface AdmissionCardProps {
  school: School;
  compareList: string[];
  addCompare: (slug: string, name: string) => void;
  removeCompare: (slug: string) => void;
  isInShortlist: (slug: string) => boolean;
  toggleShortlist: (slug: string, name: string) => void;
  onSetReminder: (milestone: AdmissionMilestone) => void;
}

const AdmissionCard: React.FC<AdmissionCardProps> = ({
  school,
  compareList,
  addCompare,
  removeCompare,
  isInShortlist,
  toggleShortlist,
  onSetReminder,
}) => {
  const isCompared = compareList.includes(school.slug);
  const isSaved = isInShortlist(school.slug);

  // Preserve canonical session without auto-relabeling
  const canonicalSession =
    school.admissions.session || school.admissions.academicYear || 'Session Recorded';

  // Check if session or date is historical
  const isHistorical =
    school.admissions.lastVerifiedDate?.toLowerCase().includes('2024') ||
    school.admissions.lastVerifiedDate?.toLowerCase().includes('2023') ||
    (school.admissions.date && school.admissions.date.includes('2024'));

  // Get canonical milestones if present
  const milestones: AdmissionMilestone[] = useMemo(() => {
    if (Array.isArray(school.admissions.milestones) && school.admissions.milestones.length > 0) {
      return school.admissions.milestones;
    }
    // If date string exists but no milestones array, create a single milestone object if date is valid
    if (school.admissions.date && !school.admissions.date.includes('Open')) {
      return [
        {
          id: `m_${school.slug}_1`,
          label: 'Application Window',
          date: school.admissions.date,
          notes: 'Source-recorded date window',
        },
      ];
    }
    return [];
  }, [school]);

  // Check if canonical application URL exists
  const hasOfficialPortal =
    Boolean(school.admissions.sourceUrl) &&
    school.admissions.sourceUrl!.startsWith('http');

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-warm-2xs hover:shadow-warm-xs transition-all flex flex-col justify-between space-y-3 relative group">
      <div className="space-y-3">
        {/* Top Header: Image + School Identity */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
            <SchoolImage
              src={school.assets.featured}
              alt={school.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <Link href={`/schools/${school.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug truncate">
                {school.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
              <span className="truncate">{school.location.area || school.location.sector}</span>
            </div>
          </div>
        </div>

        {/* Board & Grade Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 border border-sky-200 text-[10px] font-extrabold">
            {Array.isArray(school.board) ? school.board.join(', ') : school.board || 'CBSE'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold">
            {school.gradeRange.raw || `${school.gradeRange.from} – ${school.gradeRange.to}`}
          </span>
        </div>

        {/* Status & Session Row */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-1">
            <AdmissionStatus admissions={school.admissions} showDate={false} />
            <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
              {canonicalSession}
            </span>
          </div>

          {school.admissions.timelineDescription && (
            <p className="text-[11px] text-slate-600 leading-snug pt-1">
              {school.admissions.timelineDescription}
            </p>
          )}

          {isHistorical && (
            <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-1 rounded">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Historical cycle record — confirm current dates with reception</span>
            </div>
          )}
        </div>

        {/* Documented Application Procedure */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Documented Procedure
          </span>
          <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
            {school.admissions.process || 'Application procedure not disclosed in public schedule.'}
          </p>
        </div>

        {/* Documented Milestones & Reminders */}
        {milestones.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Documented Milestones
            </span>
            <div className="space-y-1">
              {milestones.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200/80 text-[11px]"
                >
                  <div className="overflow-hidden mr-2">
                    <span className="font-bold text-amber-950 block truncate">{m.label}</span>
                    <span className="text-[10px] text-amber-800">{m.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSetReminder(m)}
                    className="px-2 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-2xs"
                    title="Set email reminder for this milestone"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Remind</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source & Verification Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            <span>
              {school.admissions.sourceUrl
                ? 'Source: Official School Portal'
                : 'Source: School Disclosure'}
            </span>
          </span>
          {school.admissions.lastVerifiedDate && (
            <span>Verified: {school.admissions.lastVerifiedDate}</span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => (isCompared ? removeCompare(school.slug) : addCompare(school.slug, school.name))}
          className={cn(
            'p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[36px]',
            isCompared
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          )}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>

        <button
          type="button"
          onClick={() => toggleShortlist(school.slug, school.name)}
          className={cn(
            'p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[36px]',
            isSaved
              ? 'bg-rose-50 border-rose-300 text-rose-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', isSaved && 'fill-rose-500')} />
          <span>{isSaved ? 'Saved' : 'Shortlist'}</span>
        </button>

        {/* Official Application Portal Link (ONLY if canonical sourceUrl exists) */}
        {hasOfficialPortal ? (
          <a
            href={school.admissions.sourceUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2"
          >
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold py-2 bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Official Admissions Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        ) : (
          <Link href={`/schools/${school.slug}`} className="col-span-2">
            <Button
              variant="accent"
              size="sm"
              className="w-full text-xs font-bold py-2 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>View School Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
