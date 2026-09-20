'use client';

import React, { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { useSchoolStore } from '../../lib/schoolStore';
import { getAllSchools } from '../../lib/schools';
import { SchoolCard } from '../../components/school/SchoolCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Select } from '../../components/ui/Select';
import { Tooltip } from '../../components/ui/Tooltip';
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
  Phone,
  Building2,
  User,
  Users,
  Edit3,
  X,
  Shield,
  ClipboardList,
} from 'lucide-react';
import { checkShortlistDeadlines } from '../../lib/notifications';
import { useToast } from '../../components/ui/Toast';
import { ParentRemindersCard } from '../../components/parent/ParentRemindersCard';

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

  // Profile Editor Modal / Drawer State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editChildName, setEditChildName] = useState('');
  const [editChildGrade, setEditChildGrade] = useState('Nursery / Pre-K');
  const [editResidentialSociety, setEditResidentialSociety] = useState('');
  const [editFatherName, setEditFatherName] = useState('');
  const [editMotherName, setEditMotherName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

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
      showToast('Search area updated.', 'success');
    }
  };

  const openProfileEditor = () => {
    if (!user) return;
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditChildName(user.childName || '');
    setEditChildGrade(user.childGrade || 'Nursery / Pre-K');
    setEditResidentialSociety(user.residentialSociety || '');
    setEditFatherName(user.fatherName || '');
    setEditMotherName(user.motherName || '');
    setProfileError(null);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);

    if (!editName.trim() || editName.trim().length < 2) {
      setProfileError('Parent / Guardian name must be at least 2 characters.');
      return;
    }

    if (editPhone.trim()) {
      const cleaned = editPhone.trim().replace(/[\s\-\(\)\.]/g, '');
      if (!/^(?:\+91|91|0)?([6-9]\d{9})$/.test(cleaned)) {
        setProfileError('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
    }

    if (editChildName.trim() && editChildName.trim().length < 2) {
      setProfileError('Child / student name must be at least 2 characters.');
      return;
    }

    if (editResidentialSociety.trim() && editResidentialSociety.trim().length < 3) {
      setProfileError('Residential society must be at least 3 characters.');
      return;
    }

    setIsUpdatingProfile(true);
    const res = await updateProfile({
      name: editName.trim(),
      phone: editPhone.trim() || undefined,
      childName: editChildName.trim() || undefined,
      childGrade: editChildGrade,
      residentialSociety: editResidentialSociety.trim() || undefined,
      fatherName: editFatherName.trim() || undefined,
      motherName: editMotherName.trim() || undefined,
    });
    setIsUpdatingProfile(false);

    if (res.success) {
      showToast('Profile details updated successfully!', 'success');
      setIsEditingProfile(false);
    } else {
      setProfileError(res.message || 'Failed to update profile.');
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

  const isProfileIncomplete = !user.phone || !user.childName || !user.residentialSociety;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Parent Dashboard', isCurrent: true }]} />

      {/* Profile Completion Prompt for Existing Accounts */}
      {isProfileIncomplete && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Complete Your Parent &amp; Student Profile
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Add your contact mobile number, student details, and residential society to unlock tailored admission updates for Greater Noida West.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={openProfileEditor}
            className="bg-amber-800 hover:bg-amber-900 text-white text-xs shrink-0 font-semibold"
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Complete Profile Details
          </Button>
        </div>
      )}

      <Link href="/application-tracker" className="block rounded-2xl border border-sky-100 bg-sky-50/70 p-5 hover:bg-sky-50 transition-colors shadow-2xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-sky-100 text-sky-700 flex items-center justify-center shrink-0"><ClipboardList className="w-5 h-5" /></div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Application Tracker</h2>
              <p className="text-xs text-slate-600 mt-1">Keep school-specific notes, target dates, official links and application progress in one private place.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-sky-700 shrink-0" />
        </div>
      </Link>

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
                    Administrator
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 font-medium">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {user.email}
                </span>

                {user.phone ? (
                  <span className="inline-flex items-center gap-1 text-stone-700">
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>{user.phone}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={openProfileEditor}
                    className="inline-flex items-center gap-1 text-amber-800 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>+ Add Phone</span>
                  </button>
                )}

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
              </div>

              {/* Extended Profile Badges Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                {user.childName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-900 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                    <span>Child: <strong>{user.childName}</strong></span>
                    {user.childGrade && (
                      <span className="text-[11px] text-sky-700 font-normal">({user.childGrade})</span>
                    )}
                  </span>
                )}

                {user.residentialSociety && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-950 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Society: <strong>{user.residentialSociety}</strong></span>
                    <span className="text-[10px] text-amber-700 font-normal bg-white/70 px-1 rounded border border-amber-200/50">Society level</span>
                  </span>
                )}

                {(user.fatherName || user.motherName) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-xs">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      {user.fatherName && `Father: ${user.fatherName}`}
                      {user.fatherName && user.motherName && ' • '}
                      {user.motherName && `Mother: ${user.motherName}`}
                    </span>
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
            <Button
              variant="outline"
              size="sm"
              onClick={openProfileEditor}
              className="text-stone-700 hover:text-amber-950 hover:bg-stone-50 text-xs font-semibold"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
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

        {/* Profile Edit Modal / Drawer */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-800" />
                  <h3 className="text-lg font-bold text-stone-900">Edit Parent & Student Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="dash-edit-name" className="block text-xs font-bold text-stone-700 mb-1">
                    Parent / Guardian Name <span className="text-amber-700">*</span>
                  </label>
                  <Input
                    id="dash-edit-name"
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="dash-edit-phone" className="block text-xs font-bold text-stone-700">
                      Phone Number <span className="text-amber-700">*</span>
                    </label>
                    <Tooltip
                      id="tooltip-dash-phone"
                      align="right"
                      text="Your phone number is part of your parent profile and may be used for relevant admission-related communication and deadline updates."
                    />
                  </div>
                  <Input
                    id="dash-edit-phone"
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    10-digit Indian mobile number. Email OTP remains your primary account login identifier.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                  <div>
                    <label htmlFor="dash-edit-child-name" className="block text-xs font-bold text-stone-700 mb-1">
                      Child / Student Name <span className="text-amber-700">*</span>
                    </label>
                    <Input
                      id="dash-edit-child-name"
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={editChildName}
                      onChange={e => setEditChildName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="dash-edit-child-grade" className="block text-xs font-bold text-stone-700 mb-1">
                      Grade / Class <span className="text-amber-700">*</span>
                    </label>
                    <Select
                      id="dash-edit-child-grade"
                      options={[
                        { value: 'Nursery / Pre-K', label: 'Nursery / Pre-School (Ages 3-4)' },
                        { value: 'KG / Kindergarten', label: 'Kindergarten / KG' },
                        { value: 'Primary (Grades 1-5)', label: 'Primary School (Grades 1-5)' },
                        { value: 'Middle School (Grades 6-8)', label: 'Middle School (Grades 6-8)' },
                        { value: 'Secondary (Grades 9-10)', label: 'Secondary (Grades 9-10)' },
                        { value: 'Senior Secondary (Grades 11-12)', label: 'Senior Secondary (Grades 11-12)' },
                      ]}
                      value={editChildGrade}
                      onChange={e => setEditChildGrade(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="dash-edit-society" className="block text-xs font-bold text-stone-700">
                      Residential Society / Apartment Complex <span className="text-amber-700">*</span>
                    </label>
                    <Tooltip
                      id="tooltip-dash-society"
                      align="right"
                      text="This helps Admission Pitara understand which schools are realistically accessible from where families live and improve relevant school discovery and recommendations."
                    />
                  </div>
                  <Input
                    id="dash-edit-society"
                    type="text"
                    placeholder="e.g. Gaur City 2, Panchsheel Greens, Arihant Arden"
                    value={editResidentialSociety}
                    onChange={e => setEditResidentialSociety(e.target.value)}
                    leftIcon={<Building2 className="w-4 h-4 text-stone-400" />}
                  />
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex items-start gap-1.5 mt-1">
                    <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Privacy Notice:</strong> Enter only your society or apartment complex name. Do not enter flat, tower, floor, or house number.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">Father &amp; Mother Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="dash-edit-father" className="block text-[11px] font-medium text-stone-600 mb-1">
                        Father&apos;s Name
                      </label>
                      <Input
                        id="dash-edit-father"
                        type="text"
                        placeholder="e.g. Rajesh Sharma"
                        value={editFatherName}
                        onChange={e => setEditFatherName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="dash-edit-mother" className="block text-[11px] font-medium text-stone-600 mb-1">
                        Mother&apos;s Name
                      </label>
                      <Input
                        id="dash-edit-mother"
                        type="text"
                        placeholder="e.g. Sunita Sharma"
                        value={editMotherName}
                        onChange={e => setEditMotherName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isUpdatingProfile}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isUpdatingProfile}
                    className="bg-amber-800 hover:bg-amber-900 text-white"
                  >
                    {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

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
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Admissions 2027-28</span>
            <span className="text-xl font-black text-emerald-700">Open</span>
          </div>
        </div>
      </div>

      {/* Parent Admission Reminders & Notifications */}
      <ParentRemindersCard />

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
