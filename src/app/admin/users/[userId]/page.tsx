'use client';

import React, { useEffect, useState, use } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Heart,
  Star,
  Search,
  Scale,
  Clock,
  MapPin,
  Shield,
  Activity,
  Calendar,
  ExternalLink,
  Mail,
  ShieldAlert,
  RefreshCw,
  Phone,
  GraduationCap,
  Building2,
  Users,
} from 'lucide-react';
import { BrandLogo } from '../../../../components/ui/BrandLogo';

interface UserProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'parent' | 'admin';
    status: 'active' | 'disabled';
    emailVerified: boolean;
    phone?: string;
    childName?: string;
    childGrade?: string;
    residentialSociety?: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    createdAt: string;
    lastLoginAt?: string;
    lastActivityAt?: string;
  };
  engagement: {
    schoolsViewedCount: number;
    searchesPerformedCount: number;
    comparisonsCount: number;
    shortlistedCount: number;
    reviewsSubmittedCount: number;
    totalEvents: number;
  };
  activityTimeline: Array<{
    id: string;
    type: string;
    schoolSlug?: string;
    locality?: string;
    searchQuery?: string;
    timestamp: string;
    details?: Record<string, unknown>;
  }>;
  uniqueSchoolsViewed: Array<{
    slug: string;
    schoolName: string;
    sector?: string;
    count: number;
    firstViewedAt: string;
    lastViewedAt: string;
  }>;
  searchHistory: Array<{
    query: string;
    locality?: string;
    resultsCount?: number;
    timestamp: string;
  }>;
  comparisons: Array<{
    schoolSlugs: string[];
    timestamp: string;
  }>;
  wishlist: Array<{
    slug: string;
    name: string;
    sector: string;
    board: string;
    verifiedFee: string;
  }>;
  reviews: Array<{
    id: string;
    schoolSlug: string;
    schoolName: string;
    score: number;
    title?: string;
    comment: string;
    status: 'published' | 'deleted';
    createdAt: string;
  }>;
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.userId;
  const router = useRouter();

  const [data, setData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        router.push('/admin');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch {
      setActionMsg({ type: 'error', text: 'Failed to load user profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleToggleStatus = async () => {
    if (!data) return;
    const newStatus = data.user.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: newStatus }),
      });
      if (res.ok) {
        showNotification('success', `User account status set to ${newStatus}.`);
        loadUser();
      }
    } catch {
      showNotification('error', 'Failed to update user status.');
    }
  };

  const handleToggleRole = async () => {
    if (!data) return;
    const newRole = data.user.role === 'admin' ? 'parent' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', role: newRole }),
      });
      if (res.ok) {
        showNotification('success', `User role set to ${newRole}.`);
        loadUser();
      }
    } catch {
      showNotification('error', 'Failed to update user role.');
    }
  };

  const handleRemoveWishlistItem = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove_wishlist_item', removeWishlistSlug: slug }),
      });
      if (res.ok) {
        showNotification('success', 'School removed from user wishlist.');
        loadUser();
      }
    } catch {
      showNotification('error', 'Failed to remove wishlist item.');
    }
  };

  const handleDeleteUser = async () => {
    if (!data) return;
    if (!confirm(`Are you sure you want to permanently delete user ${data.user.email}? This action is irreversible.`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        alert('User account deleted successfully.');
        router.push('/admin');
      } else {
        showNotification('error', json.message || 'Failed to delete user.');
      }
    } catch {
      showNotification('error', 'Error deleting user.');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071322] text-slate-200">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
          <span className="text-xs font-semibold">Loading user telemetry profile...</span>
        </div>
      </div>
    );
  }

  const { user, engagement, activityTimeline, uniqueSchoolsViewed, searchHistory, comparisons, wishlist, reviews } = data;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#071322] text-slate-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0a1c33]/95 backdrop-blur-md border-b border-[#1b3d63] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-[#0d2646] hover:bg-[#133763] border border-[#1d4b7c] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{user.name}</span>
              <span className="font-mono text-[11px] text-slate-400">({user.email})</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">User ID: {user.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
              user.status === 'active'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {user.status === 'active' ? 'Disable Account' : 'Re-enable Account'}
          </button>

          <button
            onClick={handleDeleteUser}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-bold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {actionMsg && (
        <div
          className={`w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b ${
            actionMsg.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Identity & KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white font-serif">Account Identity</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Parent / Guardian Name:</span>
                <p className="font-bold text-white text-sm">{user.name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Email Address:</span>
                <p className="font-semibold text-slate-200">{user.email}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  {user.emailVerified ? <CheckCircle2 className="w-3 h-3" /> : null}
                  <span>{user.emailVerified ? 'Verified via Email OTP' : 'Unverified Email'}</span>
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Mobile Phone:</span>
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.phone || 'Not recorded'}</span>
                </p>
              </div>

              {/* Student Details Section */}
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student & Admission Profile</span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-[#0a1e38] p-2 rounded-xl border border-[#1b3d63]">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Child Name:</span>
                    <span className="font-bold text-slate-200 text-xs">{user.childName || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Target Grade:</span>
                    <span className="font-bold text-sky-300 text-xs">{user.childGrade || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Residential Society & Area */}
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Residence & Search Area</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Residential Society:</span>
                  <p className="font-semibold text-slate-200 text-xs bg-[#0a1e38] px-2.5 py-1.5 rounded-lg border border-[#1b3d63]">
                    {user.residentialSociety || 'Not recorded'}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5 italic">
                    Society level only (privacy-preserving; no flat/tower collected)
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Preferred Locality:</span>
                  <p className="font-semibold text-slate-200">{user.preferredSchoolLocality || 'Not specified'}</p>
                </div>
              </div>

              {/* Family Details */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                  <Users className="w-3.5 h-3.5" />
                  <span>Father &amp; Mother Details</span>
                </div>
                {(user.fatherName || user.motherName) ? (
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#0a1e38] p-2 rounded-xl border border-[#1b3d63]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Father&apos;s Name:</span>
                      <span className="font-medium text-slate-200">{user.fatherName || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Mother&apos;s Name:</span>
                      <span className="font-medium text-slate-200">{user.motherName || 'Not provided'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Not provided by parent</p>
                )}
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Assigned Role:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold uppercase font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-amber-300">
                    {user.role}
                  </span>
                  <button
                    onClick={handleToggleRole}
                    className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Change to {user.role === 'admin' ? 'parent' : 'admin'}
                  </button>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 space-y-1">
                <p>Registered: {new Date(user.createdAt).toLocaleString()}</p>
                <p>Last Login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</p>
                <p>Last Activity: {user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Engagement KPIs (2 cols) */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Schools Viewed</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-3xl font-black text-white font-serif">{engagement.schoolsViewedCount}</span>
              <p className="text-[10px] text-slate-400">Total campus clicks</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Shortlists</span>
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-3xl font-black text-white font-serif">{wishlist.length}</span>
              <p className="text-[10px] text-slate-400">Schools saved in wishlist</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Searches</span>
                <Search className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-3xl font-black text-white font-serif">{engagement.searchesPerformedCount}</span>
              <p className="text-[10px] text-slate-400">Directory queries</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Comparisons</span>
                <Scale className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-black text-white font-serif">{engagement.comparisonsCount}</span>
              <p className="text-[10px] text-slate-400">Comparison engine runs</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Reviews</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-3xl font-black text-white font-serif">{reviews.length}</span>
              <p className="text-[10px] text-slate-400">Verified parent reviews</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Total Telemetry</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-3xl font-black text-white font-serif">{engagement.totalEvents}</span>
              <p className="text-[10px] text-slate-400">Recorded user events</p>
            </div>
          </div>
        </div>

        {/* Unique Schools Viewed & Wishlist Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unique Schools Viewed */}
          <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Schools Viewed by this Parent ({uniqueSchoolsViewed.length})</span>
            </h3>

            <div className="space-y-2.5">
              {uniqueSchoolsViewed.length > 0 ? (
                uniqueSchoolsViewed.map(item => (
                  <div
                    key={item.slug}
                    className="p-3.5 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <Link
                        href={`/schools/${item.slug}`}
                        target="_blank"
                        className="font-bold text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <span>{item.schoolName}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <p className="text-[10px] text-slate-400">
                        {item.sector || 'Greater Noida West'} • Last viewed {new Date(item.lastViewedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                      {item.count} views
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No schools viewed yet.</p>
              )}
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Shortlist Bookmarks ({wishlist.length})</span>
            </h3>

            <div className="space-y-2.5">
              {wishlist.length > 0 ? (
                wishlist.map(item => (
                  <div
                    key={item.slug}
                    className="p-3.5 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <Link
                        href={`/schools/${item.slug}`}
                        target="_blank"
                        className="font-bold text-white hover:text-amber-300 flex items-center gap-1"
                      >
                        <span>{item.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <p className="text-[10px] text-slate-400">
                        {item.sector} • {item.board} • Fee: {item.verifiedFee}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveWishlistItem(item.slug)}
                      title="Remove from user's wishlist"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No schools bookmarked in shortlist.</p>
              )}
            </div>
          </div>
        </div>

        {/* Authored Reviews */}
        <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Authored Parent Reviews ({reviews.length})</span>
          </h3>

          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#0a1e38] border border-white/5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.schoolName}</span>
                    <span className="font-black text-amber-400">★ {rev.score}.0</span>
                  </div>
                  {rev.title && <p className="font-bold text-slate-200">&ldquo;{rev.title}&rdquo;</p>}
                  <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                  <p className="text-[10px] text-slate-400">
                    Submitted on {new Date(rev.createdAt).toLocaleDateString()} • Status: {rev.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews written by this user.</p>
            )}
          </div>
        </div>

        {/* Chronological Activity Feed (Isolated to this user) */}
        <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Chronological User Activity Log ({activityTimeline.length})</span>
          </h3>

          <div className="space-y-2">
            {activityTimeline.map(evt => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-white/10 text-slate-300">
                    {evt.type.replace('_', ' ')}
                  </span>
                  <span className="text-slate-200">
                    {evt.schoolSlug && <span>School: {evt.schoolSlug}</span>}
                    {evt.searchQuery && <span>Search: &ldquo;{evt.searchQuery}&rdquo;</span>}
                    {evt.locality && <span> ({evt.locality})</span>}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(evt.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
