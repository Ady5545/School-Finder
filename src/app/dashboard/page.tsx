'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { useSchoolStore } from '../../lib/schoolStore';
import { getAllSchools } from '../../lib/schools';
import { SchoolCard } from '../../components/school/SchoolCard';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Select } from '../../components/ui/Select';
import {
  ShieldCheck,
  MapPin,
  Mail,
  BookmarkCheck,
  Scale,
  Sparkles,
  LogOut,
  GraduationCap,
  Compass,
  ArrowRight,
  AlertTriangle,
  Clock,
  Send,
  Trash2,
  Settings,
  Check,
} from 'lucide-react';
import { checkShortlistDeadlines } from '../../lib/notifications';
import { useToast } from '../../components/ui/Toast';

const SEARCH_LOCALITIES = [
  { value: 'Greater Noida West', label: 'Greater Noida West (Entire Area)' },
  { value: 'Sector 16B', label: 'Sector 16B / Gaur City 2' },
  { value: 'Sector 4', label: 'Sector 4 / Gaur City 1' },
  { value: 'Techzone 4', label: 'Techzone 4' },
  { value: 'Knowledge Park 5', label: 'Knowledge Park 5' },
  { value: 'Sector 1', label: 'Sector 1' },
  { value: 'Sector 2', label: 'Sector 2' },
  { value: 'Sector 3', label: 'Sector 3' },
  { value: 'Sector 10', label: 'Sector 10' },
  { value: 'Sector 12', label: 'Sector 12' },
  { value: 'Sector 16C', label: 'Sector 16C' },
  { value: 'Zeta 1', label: 'Zeta 1' },
  { value: 'Delta & Gamma Sectors', label: 'Delta / Gamma Sectors' },
  { value: 'Other Locality', label: 'Other Sector / Locality' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const { shortlist, compareList, clearShortlist, clearCompare } = useSchoolStore();
  const { showToast } = useToast();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEditingLocality, setIsEditingLocality] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(user?.preferredSchoolLocality || 'Greater Noida West');
  const [isUpdatingLocality, setIsUpdatingLocality] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const allSchools = getAllSchools();

  const { urgentAlerts } = React.useMemo(() => {
    return checkShortlistDeadlines(shortlist);
  }, [shortlist]);

  const handleSendEmailAlert = async () => {
    if (!user?.email) {
      showToast('No email address registered.', 'error');
      return;
    }
    if (urgentAlerts.length === 0) {
      showToast('No urgent admission deadlines within 7 days.', 'info');
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/notifications/admission-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          parentName: user.name,
          shortlist,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          data.devMode
            ? `Admission alert preview logged for ${user.email}`
            : `Admission alerts successfully sent to ${user.email}!`,
          'success'
        );
      } else {
        showToast(data.error || 'Failed to dispatch email.', 'error');
      }
    } catch {
      showToast('Network error while requesting email alerts.', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSaveLocality = async () => {
    setIsUpdatingLocality(true);
    const res = await updateProfile({ preferredSchoolLocality: selectedLocality });
    setIsUpdatingLocality(false);
    if (res.success) {
      setIsEditingLocality(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your parent account and all saved data? This action cannot be undone.')) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await fetch('/api/auth/me', { method: 'DELETE' });
      if (res.ok) {
        showToast('Your parent account and associated data have been permanently deleted.', 'info');
        router.push('/');
        window.location.reload();
      } else {
        showToast('Failed to delete account.', 'error');
      }
    } catch {
      showToast('Network error occurred.', 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.preferredSchoolLocality) {
      setSelectedLocality(user.preferredSchoolLocality);
    }
  }, [user?.preferredSchoolLocality]);

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

  // Nearby schools based on user locality keyword
  const currentLocality = user.preferredSchoolLocality || 'Greater Noida West';
  const localityKey = currentLocality.split(',')[0].trim().toLowerCase();
  const nearbySchools = allSchools.filter(s => {
    const schoolArea = (s.location.area || '').toLowerCase();
    const schoolAddress = s.location.address.toLowerCase();
    return schoolArea.includes(localityKey) || schoolAddress.includes(localityKey);
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Parent Dashboard', isCurrent: true }]} />

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-50/70 via-stone-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {user.name}
                </h1>
                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Email
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold">
                    Admin Auditor
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 font-medium">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {user.email}
                </span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Looking in: <strong>{currentLocality}</strong></span>
                  <button
                    type="button"
                    onClick={() => setIsEditingLocality(!isEditingLocality)}
                    className="ml-1 text-[11px] text-amber-800 underline hover:text-amber-950 font-semibold"
                  >
                    {isEditingLocality ? 'Cancel' : 'Change'}
                  </button>
                </span>

                {user.childGrade && (
                  <span className="inline-flex items-center gap-1 text-sky-800 bg-sky-50 px-2 py-0.5 rounded font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {user.childGrade}
                  </span>
                )}
              </div>

              {/* Inline Locality Editor */}
              {isEditingLocality && (
                <div className="pt-2 flex flex-wrap items-center gap-2 max-w-md animate-fadeIn">
                  <Select
                    id="dash-edit-locality"
                    options={SEARCH_LOCALITIES}
                    value={selectedLocality}
                    onChange={e => setSelectedLocality(e.target.value)}
                    className="text-xs py-1.5"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSaveLocality}
                    disabled={isUpdatingLocality}
                    className="bg-amber-800 hover:bg-amber-900 text-white text-xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    {isUpdatingLocality ? 'Saving...' : 'Save Area'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {user.role === 'admin' && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-900 hover:bg-purple-50 text-xs font-bold"
                >
                  Admin Telemetry &rarr;
                </Button>
              </Link>
            )}
            <Link href="/schools">
              <Button variant="primary" size="sm" rightIcon={<Compass className="w-4 h-4" />}>
                Explore Schools
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-stone-600 hover:text-rose-600 text-xs"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Shortlisted</span>
            <span className="text-xl font-black text-amber-800">{shortlist.length} Schools</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">In Compare Tray</span>
            <span className="text-xl font-black text-sky-700">{compareList.length} Schools</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Sector Matches</span>
            <span className="text-xl font-black text-stone-900">{nearbySchools.length} Schools</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Admissions 2026-27</span>
            <span className="text-xl font-black text-emerald-700">Open</span>
          </div>
        </div>
      </div>

      {/* Urgent 7-Day Admission Deadline Alerts */}
      {urgentAlerts.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-amber-950 tracking-tight">
                    Urgent Admission Deadlines ({urgentAlerts.length} Shortlisted School{urgentAlerts.length > 1 ? 's' : ''} Closing Within 7 Days)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Registration windows and document verification stages for these shortlisted campuses are concluding soon.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="accent"
              onClick={handleSendEmailAlert}
              disabled={isSendingEmail}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="shrink-0 text-xs font-bold"
            >
              {isSendingEmail ? 'Sending Email...' : `Email Alerts to ${user.email.split('@')[0]}`}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentAlerts.map(alert => (
              <div
                key={alert.slug}
                className="bg-white rounded-xl border border-amber-200 p-3.5 shadow-2xs flex flex-col justify-between gap-2.5 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {alert.schoolName}
                    </h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {alert.area}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black shrink-0 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {alert.daysRemaining <= 0 ? 'Closes Today!' : `${alert.daysRemaining} days left`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium text-[11px]">
                    Cutoff: <strong>{alert.formattedDeadline}</strong>
                  </span>
                  <Link
                    href={`/schools/${alert.slug}`}
                    className="font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>View &amp; Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shortlisted Schools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
              My Saved Shortlist ({wishlistedSchools.length})
            </h2>
          </div>
          {wishlistedSchools.length > 0 && (
            <button
              onClick={clearShortlist}
              className="text-xs font-semibold text-stone-500 hover:text-rose-600 cursor-pointer"
            >
              Clear Shortlist
            </button>
          )}
        </div>

        {wishlistedSchools.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-stone-300 bg-white text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Your shortlist is currently empty</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Save top schools in Greater Noida while browsing to easily compare their verified fee structures and admissions.
            </p>
            <Link href="/schools">
              <Button variant="primary" size="sm" className="bg-amber-800 hover:bg-amber-900 text-white">
                Browse Greater Noida Schools
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
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Active Comparison Tray ({comparedSchools.length}/4)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-stone-500 hover:text-rose-600 cursor-pointer"
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
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Recommended for {currentLocality}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified schools closest to your preferred search area with direct bus coverage.
            </p>
          </div>
          <Link href="/schools" className="text-xs font-bold text-amber-800 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(nearbySchools.length > 0 ? nearbySchools : allSchools.slice(0, 3)).map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>

      {/* Account Privacy & Data Deletion */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-stone-400" />
          <span>Need to remove your account or clear saved search preferences?</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDeleteAccount}
          disabled={isDeletingAccount}
          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
          className="text-xs text-rose-700 hover:bg-rose-50 border-stone-300 shrink-0"
        >
          {isDeletingAccount ? 'Deleting...' : 'Delete Account & Data'}
        </Button>
      </div>
    </div>
  );
}
