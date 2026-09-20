'use client';

import React, { useEffect, useState, useMemo } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCanonicalSchools } from '../../lib/schools';
import {
  ShieldCheck,
  Users,
  Eye,
  EyeOff,
  Heart,
  Star,
  Activity,
  Search,
  Scale,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  Calendar,
  Lock,
  ArrowRight,
  Filter,
  Trash2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Plus,
  Edit2,
  Check,
  Sliders,
  ShieldAlert,
  FileText,
  UserCheck,
  UserX,
  Building,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';

type AdminTab =
  | 'overview'
  | 'users'
  | 'activity'
  | 'reviews'
  | 'schools'
  | 'wishlists'
  | 'comparisons'
  | 'searches'
  | 'promotions'
  | 'reports'
  | 'audit'
  | 'settings';

interface AdminUser {
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
  preferredSchoolLocality?: string;
  createdAt: string;
  lastLoginAt?: string;
  lastActivityAt?: string;
  wishlist: string[];
  engagement: {
    schoolsViewedCount: number;
    searchesPerformedCount: number;
    comparisonsCount: number;
    shortlistedCount: number;
    reviewsSubmittedCount: number;
    totalEvents: number;
  };
}

interface ActivityEventItem {
  id: string;
  type: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  schoolSlug?: string;
  schoolName?: string;
  locality?: string;
  searchQuery?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

interface ReviewItem {
  id: string;
  schoolSlug: string;
  schoolName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userStatus: string;
  score: number;
  title?: string;
  comment: string;
  verifiedParent: boolean;
  isAnonymous?: boolean;
  status: 'published' | 'deleted';
  createdAt: string;
  deletionReason?: string;
}

interface SchoolMetricItem {
  id: string;
  slug: string;
  name: string;
  sector: string;
  address?: string;
  board: string;
  verifiedFee: string;
  isArchived?: boolean;
  isDuplicate?: boolean;
  views: number;
  uniqueViewersCount: number;
  saves: number;
  shortlistedCount: number;
  comparedCount: number;
  reviewsCount: number;
  averageRating: number;
  activePromotion?: {
    id: string;
    campaignName: string;
    placementType: string;
    status: string;
    impressions: number;
    clicks: number;
  } | null;
}

interface PromotionItem {
  id: string;
  schoolSlug: string;
  schoolName: string;
  campaignName: string;
  placementType: string;
  title: string;
  description: string;
  badgeLabel: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'expired' | 'draft';
  priority: number;
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: string;
}

interface AuditLogItem {
  id: string;
  adminUserId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
  result: 'success' | 'failed';
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d' | 'all'>('30d');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tab Specific Data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [activityList, setActivityList] = useState<ActivityEventItem[]>([]);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [schoolsList, setSchoolsList] = useState<SchoolMetricItem[]>([]);
  const [wishlistsData, setWishlistsData] = useState<any[]>([]);
  const [comparisonsData, setComparisonsData] = useState<{ commonPairs: any[]; mostComparedSchools: any[] }>({ commonPairs: [], mostComparedSchools: [] });
  const [searchesData, setSearchesData] = useState<{ topQueries: any[]; topLocalities: any[] }>({ topQueries: [], topLocalities: [] });
  const [promotionsList, setPromotionsList] = useState<PromotionItem[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AuditLogItem[]>([]);

  // Search & Filter states for Directory
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userVerifiedFilter, setUserVerifiedFilter] = useState('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStarFilter, setReviewStarFilter] = useState('all');

  // Promotion Form Modal State
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    schoolSlug: 'delhi-world-public-school-kp-5',
    campaignName: '',
    placementType: 'homepage_hero',
    title: '',
    description: '',
    badgeLabel: 'Sponsored',
    ctaText: 'Explore Admissions & Campus',
    ctaLink: '',
    status: 'active',
    priority: 1,
  });

  // Monthly Excel Report State
  const [reportMonth, setReportMonth] = useState<number>(() => new Date().getUTCMonth() + 1);
  const [reportYear, setReportYear] = useState<number>(() => new Date().getUTCFullYear());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [schoolReportSlug, setSchoolReportSlug] = useState('');
  const reportableSchools = getCanonicalSchools();

  // Sign out handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ap_token');
      localStorage.removeItem('ap_user');
    }
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    router.push('/login?redirect=/admin');
  };

  // Fast admin boot: authenticate first, then load only the section the admin opens.
  // The old panel requested every heavy dataset on first paint, which made the
  // control center feel frozen. This keeps the shell instant and data progressive.
  const [loadedTabs, setLoadedTabs] = useState<Set<AdminTab>>(new Set(['overview']));
  const [loadingTab, setLoadingTab] = useState<AdminTab | null>(null);

  const fetchTabData = async (tab: AdminTab, force = false) => {
    if (!force && loadedTabs.has(tab)) return;
    setLoadingTab(tab);
    try {
      const requests: Partial<Record<AdminTab, string>> = {
        overview: `/api/admin/overview?range=${timeRange}`,
        users: '/api/admin/users?limit=100',
        activity: '/api/admin/activity?limit=150',
        reviews: '/api/admin/reviews?includeDeleted=true',
        schools: '/api/admin/schools',
        wishlists: '/api/admin/wishlists',
        comparisons: '/api/admin/comparisons',
        searches: '/api/admin/searches',
        promotions: '/api/admin/promotions',
        audit: '/api/admin/audit-log?limit=100',
      };
      const url = requests[tab];
      if (!url) return;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || `Failed to load ${tab}`);

      if (tab === 'overview') setOverviewData(data.metrics);
      if (tab === 'users') setUsersList(data.users);
      if (tab === 'activity') setActivityList(data.events);
      if (tab === 'reviews') setReviewsList(data.reviews);
      if (tab === 'schools') setSchoolsList(data.schools);
      if (tab === 'wishlists') setWishlistsData(data.wishlists);
      if (tab === 'comparisons') setComparisonsData(data);
      if (tab === 'searches') setSearchesData(data);
      if (tab === 'promotions') setPromotionsList(data.campaigns);
      if (tab === 'audit') setAuditLogsList(data.logs);
      setLoadedTabs(prev => new Set(prev).add(tab));
    } catch (err) {
      console.error(`Failed to load admin ${tab} data:`, err);
    } finally {
      setLoadingTab(null);
    }
  };

  const loadAdminData = async (force = false) => {
    setIsLoading(true);
    try {
      const authRes = await fetch('/api/admin/auth/check', { cache: 'no-store' });
      if (!authRes.ok) {
        setIsAuthenticated(false);
        return;
      }
      const authData = await authRes.json();
      if (!authData.authorized) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      setCurrentAdmin(authData.user);
      await fetchTabData('overview', force);
    } catch (err) {
      console.error('Error loading admin control center:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [timeRange]);

  useEffect(() => {
    if (isAuthenticated) fetchTabData(activeTab);
  }, [activeTab, isAuthenticated]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // User Actions
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: newStatus }),
      });
      if (res.ok) {
        showNotification('success', `User account set to ${newStatus}.`);
        loadAdminData();
      } else {
        showNotification('error', 'Failed to update user status.');
      }
    } catch {
      showNotification('error', 'Error communicating with server.');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to permanently delete parent user ${userEmail}? This will also clean up their reviews and saves.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('success', 'User account deleted successfully.');
        loadAdminData();
      } else {
        showNotification('error', data.message || 'Failed to delete user.');
      }
    } catch {
      showNotification('error', 'Error deleting user.');
    }
  };

  // Review Actions
  const handleDeleteReview = async (reviewId: string) => {
    const reason = prompt('Reason for review removal (e.g. Inappropriate content, unverifiable claim):');
    if (reason === null) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}&reason=${encodeURIComponent(reason || 'Removed by admin')}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showNotification('success', 'Review deleted and school rating recalculated.');
        loadAdminData();
      }
    } catch {
      showNotification('error', 'Failed to delete review.');
    }
  };

  const handleRestoreReview = async (reviewId: string) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'restore' }),
      });
      if (res.ok) {
        showNotification('success', 'Review restored to published state.');
        loadAdminData();
      }
    } catch {
      showNotification('error', 'Failed to restore review.');
    }
  };

  // Promotion Actions
  const handleTogglePromoStatus = async (promoId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promoId, status: newStatus }),
      });
      if (res.ok) {
        showNotification('success', `Campaign status updated to ${newStatus}.`);
        loadAdminData();
      }
    } catch {
      showNotification('error', 'Failed to update campaign.');
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    if (!confirm('Are you sure you want to delete this promotional campaign?')) return;
    try {
      const res = await fetch(`/api/admin/promotions?id=${promoId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Campaign deleted.');
        loadAdminData();
      }
    } catch {
      showNotification('error', 'Failed to delete campaign.');
    }
  };

  const handleCreatePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('success', 'New promotion campaign launched.');
        setShowPromoModal(false);
        loadAdminData();
      } else {
        showNotification('error', data.message || 'Failed to create campaign.');
      }
    } catch {
      showNotification('error', 'Error creating promotion campaign.');
    }
  };

  // Monthly Excel Report Download Handler
  const handleDownloadReport = async (overrideMonth?: number, overrideYear?: number) => {
    const targetMonth = overrideMonth ?? reportMonth;
    const targetYear = overrideYear ?? reportYear;

    setIsGeneratingReport(true);
    try {
      const res = await fetch(`/api/admin/reports?month=${targetMonth}&year=${targetYear}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showNotification('error', errorData.message || 'Failed to generate Excel report.');
        setIsGeneratingReport(false);
        return;
      }

      const blob = await res.blob();
      const formattedMonth = targetMonth.toString().padStart(2, '0');
      const filename = `admission-pitara-report-${targetYear}-${formattedMonth}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification('success', `Excel report for ${formattedMonth}/${targetYear} generated and downloaded.`);

      // Refresh audit logs so admin sees the new download audit entry immediately
      fetch('/api/admin/audit-log?limit=100')
        .then(r => r.json())
        .then(auRes => {
          if (auRes.success) setAuditLogsList(auRes.logs);
        })
        .catch(() => {});
    } catch {
      showNotification('error', 'Network or server error while generating Excel report.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      if (userSearch) {
        const q = userSearch.toLowerCase();
        const mName = u.name?.toLowerCase().includes(q);
        const mEmail = u.email?.toLowerCase().includes(q);
        const mId = u.id?.toLowerCase().includes(q);
        const mLoc = u.preferredSchoolLocality?.toLowerCase().includes(q);
        const mPhone = u.phone?.toLowerCase().includes(q);
        const mChild = u.childName?.toLowerCase().includes(q);
        const mSoc = u.residentialSociety?.toLowerCase().includes(q);
        if (!mName && !mEmail && !mId && !mLoc && !mPhone && !mChild && !mSoc) return false;
      }
      if (userStatusFilter !== 'all' && u.status !== userStatusFilter) return false;
      if (userVerifiedFilter === 'verified' && !u.emailVerified) return false;
      if (userVerifiedFilter === 'unverified' && u.emailVerified) return false;
      return true;
    });
  }, [usersList, userSearch, userStatusFilter, userVerifiedFilter]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter(r => {
      if (reviewSearch) {
        const q = reviewSearch.toLowerCase();
        const mComment = r.comment?.toLowerCase().includes(q);
        const mSchool = r.schoolName?.toLowerCase().includes(q);
        const mUser = r.userName?.toLowerCase().includes(q);
        if (!mComment && !mSchool && !mUser) return false;
      }
      if (reviewStarFilter !== 'all') {
        const star = parseInt(reviewStarFilter, 10);
        if (Math.round(r.score) !== star) return false;
      }
      return true;
    });
  }, [reviewsList, reviewSearch, reviewStarFilter]);

  // Filtered Activity
  const filteredActivity = useMemo(() => {
    return activityList.filter(evt => {
      if (activityTypeFilter !== 'all' && evt.type !== activityTypeFilter) return false;
      return true;
    });
  }, [activityList, activityTypeFilter]);

  // --------------------------------------------------------------------------
  // UNAUTHENTICATED OR LOADING VIEW
  // --------------------------------------------------------------------------
  if (isLoading && isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f] text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm font-semibold tracking-wide text-slate-300">
            Verifying administrative credentials...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f] px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0f284a] border border-[#1e4570] text-center shadow-2xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white font-serif">
              Administrative Authorization Required
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              This platform-control center is restricted to authorized Admission Pitara administrators.
            </p>
          </div>
          <div className="p-3 bg-[#0a1f3a] rounded-xl border border-white/5 text-left text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200">Admin Email Requirements:</p>
            <p>• Only email addresses configured in ADMIN_EMAILS or accounts assigned the &apos;admin&apos; role are granted access.</p>
            <p>• Authenticate with your administrator parent account to continue.</p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login?redirect=/admin"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md block text-center"
            >
              Sign In as Administrator
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors block text-center"
            >
              Back to Public Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#071322] text-slate-200">
      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & ADMINISTRATIVE STATUS BAR                             */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full bg-[#0a1c33]/95 backdrop-blur-md border-b border-[#1b3d63] px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" theme="dark" subtext="Platform Control Center" />
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Admin Session</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Time Range Selector */}
          <div className="flex items-center bg-[#0d2646] border border-[#1d4b7c] rounded-xl p-0.5 text-xs">
            {(['today', '7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              loadAdminData(true);
              if (activeTab !== 'overview') fetchTabData(activeTab, true);
            }}
            title="Refresh the current admin section"
            className="p-2 rounded-xl bg-[#0d2646] border border-[#1d4b7c] text-slate-300 hover:text-white hover:bg-[#133763] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {currentAdmin && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d2646] border border-[#1d4b7c] rounded-xl text-xs">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">
                {currentAdmin.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="font-bold text-slate-200 truncate max-w-[120px]">{currentAdmin.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{currentAdmin.email}</p>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Exit to Site
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Sign out of Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. SUB-NAVIGATION TABS                                                */}
      {/* --------------------------------------------------------------------- */}
      <nav className="w-full bg-[#0a192f] border-b border-[#1b3d63] px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'overview', label: 'Executive Overview', icon: TrendingUp },
            { id: 'users', label: `User Directory (${usersList.length})`, icon: Users },
            { id: 'activity', label: 'Activity Feed', icon: Activity },
            { id: 'reviews', label: `Reviews Moderation (${reviewsList.length})`, icon: Star },
            { id: 'schools', label: `School Analytics (${schoolsList.length})`, icon: Building },
            { id: 'wishlists', label: 'Shortlists', icon: Heart },
            { id: 'comparisons', label: 'Comparisons', icon: Scale },
            { id: 'searches', label: 'Searches & Keywords', icon: Search },
            { id: 'promotions', label: `Paid Promotions (${promotionsList.length})`, icon: Sparkles },
            { id: 'reports', label: 'Monthly Excel Reports', icon: FileSpreadsheet },
            { id: 'audit', label: 'Audit Log', icon: FileText },
            { id: 'settings', label: 'Settings & Security', icon: Lock },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : 'bg-[#0e2746] text-slate-300 hover:text-white hover:bg-[#14365f] border border-[#1b436e]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* --------------------------------------------------------------------- */}
      {/* 3. MAIN DASHBOARD CONTENT AREA                                        */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingTab && (
          <div className="sticky top-[76px] z-30 mb-5 overflow-hidden rounded-2xl border border-amber-400/20 bg-[#0b2039]/95 backdrop-blur-md shadow-lg">
            <div className="h-0.5 w-full bg-amber-400/10">
              <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] bg-amber-400" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-white">Loading {activeTab === 'overview' ? 'dashboard' : activeTab} data…</p>
                <p className="text-[11px] text-slate-400">The panel is ready — only this section is being fetched.</p>
              </div>
            </div>
          </div>
        )}
        {/* =================================================================== */}
        {/* TAB 1: EXECUTIVE OVERVIEW                                           */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Registered Parents</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-serif">
                    {overviewData?.users.totalAccounts || usersList.length}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    +{overviewData?.users.newAccountsInRange || 0} in range
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {overviewData?.users.verifiedAccounts || 0} email-verified parents
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>School Views</span>
                  <Eye className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-serif">
                    {overviewData?.schools.totalViewsCount || 0}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    {timeRange === 'all' ? 'All-time views' : `in ${timeRange}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {overviewData?.schools.uniqueViewersInRange || 0} unique parents ({overviewData?.schools.allTimeViewsCount || overviewData?.schools.totalViewsCount || 0} all-time clicks)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Wishlist Saves</span>
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-serif">
                    {overviewData?.schools.totalSavesCount || 0}
                  </span>
                  <span className="text-xs text-rose-400 font-semibold">
                    {timeRange === 'all' ? 'All-time' : `in ${timeRange}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {overviewData?.schools.allTimeSavesCount || overviewData?.schools.totalSavesCount || 0} total saved admissions bookmarks
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Parent Reviews</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-serif">
                    {overviewData?.reviews.totalReviews || reviewsList.length}
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">
                    ★ {overviewData?.reviews.averageRating || '0.0'} avg
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  100% verified parent submissions
                </p>
              </div>
            </div>

            {/* Middle Grid: Top Shortlisted & Top Viewed Schools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Shortlisted Schools */}
              <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Top Shortlisted Institutions</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('wishlists')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>Inspect all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(overviewData?.schools.topShortlisted || []).map((item: any, idx: number) => {
                    const school = schoolsList.find(s => s.slug === item.slug);
                    return (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0a1e38] border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#153a63] text-amber-300 font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-200">
                              {school?.name || item.slug}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {school?.sector || school?.address || 'Location unavailable'}
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-extrabold text-xs">
                          {item.saves} Saves
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Most Viewed Schools */}
              <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Most Viewed Profiles</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('schools')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>View rankings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(overviewData?.schools.topViewed || []).filter((item: any) => {
                    const school = schoolsList.find(s => s.slug === item.slug);
                    return school ? !school.isArchived && !school.isDuplicate : false;
                  }).map((item: any, idx: number) => {
                    const school = schoolsList.find(s => s.slug === item.slug);
                    return (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0a1e38] border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#153a63] text-amber-300 font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-200">
                              {school?.name || item.slug}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {school?.sector || 'Greater Noida West'}
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-extrabold text-xs">
                          {item.views} Views
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Stream: Recent Platform Activity */}
            <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Recent Chronological Telemetry</span>
                </h3>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <span>Open live stream</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {activityList.slice(0, 8).map(evt => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a1e38] border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-white/10 text-slate-300">
                        {evt.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-200 font-medium">
                        {evt.userName ? (
                          <strong className="text-amber-300">{evt.userName}</strong>
                        ) : (
                          'Anonymous Visitor'
                        )}
                        {evt.schoolName && <span> • {evt.schoolName}</span>}
                        {evt.searchQuery && <span> • Searched &ldquo;{evt.searchQuery}&rdquo;</span>}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: USER DIRECTORY                                               */}
        {/* =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Directory Filters & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, ID..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-xs text-white placeholder:text-slate-400 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={userStatusFilter}
                  onChange={e => setUserStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="disabled">Disabled Only</option>
                </select>

                <select
                  value={userVerifiedFilter}
                  onChange={e => setUserVerifiedFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Verifications</option>
                  <option value="verified">Verified Emails</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="bg-[#0a1e38] border-b border-[#1b3d63] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">User &amp; Stable ID</th>
                      <th className="py-3 px-4">Locality / Sector</th>
                      <th className="py-3 px-4">Status &amp; Verification</th>
                      <th className="py-3 px-4 text-center">Views</th>
                      <th className="py-3 px-4 text-center">Shortlist</th>
                      <th className="py-3 px-4 text-center">Reviews</th>
                      <th className="py-3 px-4">Registered</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="font-bold text-amber-300 hover:underline flex items-center gap-1.5"
                            >
                              <span>{user.name}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </Link>
                            <p className="text-[11px] text-slate-400">{user.email}</p>
                            {user.phone && (
                              <p className="text-[10px] text-slate-300 font-mono">{user.phone}</p>
                            )}
                            <span className="font-mono text-[9px] text-slate-500 bg-[#07172b] px-1.5 py-0.5 rounded border border-white/5">
                              {user.id}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <div className="space-y-0.5">
                              <p className="font-medium text-slate-200">{user.residentialSociety || user.preferredSchoolLocality || 'N/A'}</p>
                              {user.residentialSociety && user.preferredSchoolLocality && (
                                <p className="text-[10px] text-slate-400">{user.preferredSchoolLocality}</p>
                              )}
                              {user.childName && (
                                <p className="text-[10px] text-sky-300">
                                  {user.childName} {user.childGrade ? `(${user.childGrade})` : ''}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`w-fit px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  user.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {user.status.toUpperCase()}
                              </span>
                              {user.emailVerified ? (
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Verified
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Unverified</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-blue-300">
                            {user.engagement?.schoolsViewedCount || 0}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-rose-300">
                            {user.wishlist?.length || 0}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-amber-300">
                            {user.engagement?.reviewsSubmittedCount || 0}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-[11px] transition-colors"
                              >
                                Inspect
                              </Link>
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.status)}
                                title={user.status === 'active' ? 'Disable Account' : 'Re-enable Account'}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  user.status === 'active'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                }`}
                              >
                                {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                title="Delete User Permanently"
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No users found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: ACTIVITY FEED                                                */}
        {/* =================================================================== */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Global Event Telemetry Stream ({filteredActivity.length})</span>
              </h3>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Filter Event Type:</span>
                <select
                  value={activityTypeFilter}
                  onChange={e => setActivityTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Events</option>
                  <option value="school_view">School Views</option>
                  <option value="search_performed">Searches Performed</option>
                  <option value="wishlist_add">Wishlist Adds</option>
                  <option value="wishlist_remove">Wishlist Removes</option>
                  <option value="compare_view">Comparisons</option>
                  <option value="rating_submitted">Reviews Submitted</option>
                  <option value="rating_edited">Reviews Edited</option>
                  <option value="rating_deleted">Reviews Deleted</option>
                  <option value="user_signup">User Signups</option>
                  <option value="user_login">User Logins</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredActivity.map(evt => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase ${
                        evt.type === 'school_view'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : evt.type === 'wishlist_add'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : evt.type === 'rating_submitted'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : evt.type === 'search_performed'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {evt.type.replace('_', ' ')}
                    </span>

                    <div>
                      <p className="font-semibold text-slate-200">
                        {evt.userId ? (
                          <Link href={`/admin/users/${evt.userId}`} className="text-amber-300 hover:underline">
                            {evt.userName || evt.userEmail || evt.userId}
                          </Link>
                        ) : (
                          <span className="text-slate-400">Anonymous Visitor</span>
                        )}
                        {evt.schoolName && <span className="text-slate-300"> → {evt.schoolName}</span>}
                        {evt.searchQuery && (
                          <span className="text-purple-300"> → Query: &ldquo;{evt.searchQuery}&rdquo;</span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Event ID: {evt.id}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(evt.timestamp).toLocaleString()}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: REVIEWS MODERATION                                           */}
        {/* =================================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews by comment or author..."
                  value={reviewSearch}
                  onChange={e => setReviewSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-xs text-white placeholder:text-slate-400 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={reviewStarFilter}
                  onChange={e => setReviewStarFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Stars (1 - 5)</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map(review => (
                  <div
                    key={review.id}
                    className={`p-5 rounded-2xl border shadow-lg space-y-3 ${
                      review.status === 'deleted'
                        ? 'bg-[#181a24] border-rose-900/40 opacity-70'
                        : 'bg-[#0f284a] border-[#1e4878]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{review.schoolName}</span>
                          <span className="flex items-center text-amber-400 font-black text-xs">
                            ★ {review.score}.0
                          </span>
                          {review.isAnonymous && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                              ANONYMOUS TO PUBLIC
                            </span>
                          )}
                          {review.status === 'deleted' && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                              DELETED / HIDDEN
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Author: <Link href={`/admin/users/${review.userId}`} className="text-amber-300 font-semibold hover:underline">{review.userName}</Link> ({review.userEmail}) • Published on {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {review.status === 'published' ? (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Review</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestoreReview(review.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Restore Review</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {review.title && (
                      <p className="text-xs font-bold text-slate-200">&ldquo;{review.title}&rdquo;</p>
                    )}
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0a1e38] p-3 rounded-xl border border-white/5">
                      {review.comment}
                    </p>

                    {review.deletionReason && (
                      <p className="text-[11px] text-rose-400 italic">
                        Deletion Reason: {review.deletionReason}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 bg-[#0f284a] rounded-2xl border border-[#1e4878]">
                  No parent reviews found matching filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: SCHOOL ANALYTICS                                             */}
        {/* =================================================================== */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolsList.map(school => (
                <div
                  key={school.slug}
                  className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-white font-serif">{school.name}</h4>
                      {school.activePromotion && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] uppercase shrink-0">
                          PROMOTED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{school.sector} • {school.board}</span>
                    </p>
                    <p className="text-[11px] text-slate-300 font-mono">
                      Fee: {school.verifiedFee}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#0a1e38] rounded-xl border border-white/5 text-center text-xs">
                    <div>
                      <p className="text-slate-400 text-[10px]">VIEWS</p>
                      <p className="font-bold text-blue-300">{school.views}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">SAVES</p>
                      <p className="font-bold text-rose-300">{school.saves}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">RATING</p>
                      <p className="font-bold text-amber-300">★ {school.averageRating}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                    <Link
                      href={`/schools/${school.slug}`}
                      target="_blank"
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Public Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <Link
                      href={`/admin/schools/${school.slug}`}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Deep Analytics</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: WISHLISTS & SHORTLISTS                                       */}
        {/* =================================================================== */}
        {activeTab === 'wishlists' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg">
              <h3 className="text-base font-bold text-white font-serif mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Aggregate Shortlist Popularity &amp; User Breakdown</span>
              </h3>

              <div className="space-y-4">
                {wishlistsData.map((item, idx) => (
                  <div
                    key={item.slug}
                    className="p-4 rounded-xl bg-[#0a1e38] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">{item.schoolName}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-extrabold text-xs">
                          {item.count} Saved Shortlists
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Sector: {item.sector} • Board: {item.board}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      <span className="text-[11px] text-slate-400 mr-1 self-center">Saved by:</span>
                      {item.users.map((u: any) => (
                        <Link
                          key={u.userId}
                          href={`/admin/users/${u.userId}`}
                          className="px-2 py-0.5 rounded-md bg-[#163a63] hover:bg-[#1d4d82] text-amber-200 text-[10px] font-semibold transition-colors"
                        >
                          {u.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 7: COMPARISONS ANALYTICS                                        */}
        {/* =================================================================== */}
        {activeTab === 'comparisons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Most Compared School Pairings</span>
              </h3>

              <div className="space-y-2.5">
                {comparisonsData.commonPairs.length > 0 ? (
                  comparisonsData.commonPairs.map((pair, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-200">
                        {pair.schoolNames.join(' vs ')}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {pair.count} Comparisons
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No comparison pairs recorded yet in telemetry.
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                <span>Comparison Frequency by School</span>
              </h3>

              <div className="space-y-2.5">
                {comparisonsData.mostComparedSchools.length > 0 ? (
                  comparisonsData.mostComparedSchools.map(item => (
                    <div
                      key={item.slug}
                      className="p-3.5 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-200">{item.schoolName}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                        {item.count} Times Added
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No individual comparison data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 8: SEARCHES & KEYWORDS                                          */}
        {/* =================================================================== */}
        {activeTab === 'searches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                <span>Top Search Queries</span>
              </h3>

              <div className="space-y-2.5">
                {searchesData.topQueries.length > 0 ? (
                  searchesData.topQueries.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-purple-300">&ldquo;{item.query}&rdquo;</p>
                        {item.locality && (
                          <p className="text-[10px] text-slate-400">Locality: {item.locality}</p>
                        )}
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                        {item.count} Searches
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No search queries recorded yet.
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Most Searched Localities / Sectors</span>
              </h3>

              <div className="space-y-2.5">
                {searchesData.topLocalities.length > 0 ? (
                  searchesData.topLocalities.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-amber-300">{item.locality}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        {item.count} Queries
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No locality query telemetry available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 9: PAID SCHOOL PROMOTIONS                                       */}
        {/* =================================================================== */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Paid Partner Campaigns &amp; Placements</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage sponsored banners and partner cards. Placements are transparently labeled and never modify organic ratings.
                </p>
              </div>

              <button
                onClick={() => setShowPromoModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            <div className="space-y-4">
              {promotionsList.map(campaign => (
                <div
                  key={campaign.id}
                  className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{campaign.campaignName}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            campaign.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {campaign.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                          {campaign.badgeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        School: <strong className="text-slate-200">{campaign.schoolName}</strong> • Placement: {campaign.placementType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromoStatus(campaign.id, campaign.status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          campaign.status === 'active'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                      </button>
                      <button
                        onClick={() => handleDeletePromo(campaign.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-[#0a1e38] rounded-xl border border-white/5 text-xs text-center">
                    <div>
                      <p className="text-[10px] text-slate-400">IMPRESSIONS</p>
                      <p className="font-bold text-white text-sm">{campaign.impressions || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">CLICKS</p>
                      <p className="font-bold text-amber-300 text-sm">{campaign.clicks || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">CLICK-THROUGH RATE</p>
                      <p className="font-bold text-emerald-400 text-sm">{campaign.ctr || 0}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">EXPIRES</p>
                      <p className="font-bold text-slate-300 text-xs">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-[#07172b] p-3 rounded-xl border border-white/5">
                    <p className="font-bold text-amber-200">{campaign.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{campaign.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 10: MONTHLY EXCEL REPORTING SYSTEM                             */}
        {/* =================================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Header / Intro Card */}
            <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Monthly Excel Reporting System (.xlsx)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Secure, server-compiled multi-sheet spreadsheets with strict monthly date filtering (UTC).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Telemetry Engine Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Generator Controls Card */}
            <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    1. Select Reporting Period
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Choose the calendar month and year to compile telemetry and account activity.
                  </p>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const now = new Date();
                      setReportMonth(now.getUTCMonth() + 1);
                      setReportYear(now.getUTCFullYear());
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0a1e38] hover:bg-[#14365f] text-slate-300 border border-[#1d4b7c] transition-colors cursor-pointer"
                  >
                    Current Month
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      let m = now.getUTCMonth(); // previous month (0-indexed)
                      let y = now.getUTCFullYear();
                      if (m === 0) {
                        m = 12;
                        y -= 1;
                      }
                      setReportMonth(m);
                      setReportYear(y);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0a1e38] hover:bg-[#14365f] text-slate-300 border border-[#1d4b7c] transition-colors cursor-pointer"
                  >
                    Previous Month
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Month</label>
                  <select
                    value={reportMonth}
                    onChange={e => setReportMonth(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-100 text-sm font-semibold outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value={1}>01 - January</option>
                    <option value={2}>02 - February</option>
                    <option value={3}>03 - March</option>
                    <option value={4}>04 - April</option>
                    <option value={5}>05 - May</option>
                    <option value={6}>06 - June</option>
                    <option value={7}>07 - July</option>
                    <option value={8}>08 - August</option>
                    <option value={9}>09 - September</option>
                    <option value={10}>10 - October</option>
                    <option value={11}>11 - November</option>
                    <option value={12}>12 - December</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Year</label>
                  <select
                    value={reportYear}
                    onChange={e => setReportYear(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-100 text-sm font-semibold outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026 (Current Academic Cycle)</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                    <option value={2029}>2029</option>
                    <option value={2030}>2030</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5">School-specific export</label>
                  <select
                    value={schoolReportSlug}
                    onChange={e => setSchoolReportSlug(e.target.value)}
                    className="w-full rounded-xl bg-[#07172b] border border-[#1d4b7c] text-slate-200 px-3 py-2.5 text-xs outline-none focus:border-emerald-400"
                  >
                    <option value="">All schools — monthly platform report</option>
                    {reportableSchools.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (!schoolReportSlug) {
                        handleDownloadReport();
                        return;
                      }
                      setIsGeneratingReport(true);
                      fetch('/api/admin/reports?schoolSlug=' + encodeURIComponent(schoolReportSlug), { cache: 'no-store' })
                        .then(async res => {
                          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to generate school export.');
                          const blob = await res.blob();
                          const school = reportableSchools.find(s => s.slug === schoolReportSlug);
                          const a = document.createElement('a');
                          a.href = window.URL.createObjectURL(blob);
                          a.download = 'admission-pitara-' + (school?.slug || 'school') + '.xlsx';
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(a.href);
                          a.remove();
                          showNotification('success', 'School-specific XLSX downloaded.');
                        })
                        .catch(err => showNotification('error', err.message || 'Failed to generate school export.'))
                        .finally(() => setIsGeneratingReport(false));
                    }}
                    disabled={isGeneratingReport}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingReport ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Compiling XLSX...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Report (.xlsx)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#07172b] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Output File:{' '}
                    <strong className="text-slate-200 font-mono">
                      admission-pitara-report-{reportYear}-{reportMonth.toString().padStart(2, '0')}.xlsx
                    </strong>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Strict UTC Time Boundaries • 5 Structured Sheets
                </span>
              </div>
            </div>

            {/* Workbook Architecture Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                2. Report Worksheets &amp; Data Structure
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sheet 1 Card */}
                <div className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      SHEET 1
                    </span>
                    <span className="text-[10px] text-slate-400">Accounts</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Parent Accounts</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    New parent registrations during the month with parent/guardian names, email, contact phone, child name, grade/class, and residential society name.
                  </p>
                  <div className="text-[11px] text-emerald-400/90 font-mono pt-1">
                    ✓ Privacy-safe (no OTPs or passwords)
                  </div>
                </div>

                {/* Sheet 2 Card */}
                <div className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-400/10 text-blue-300 border border-blue-400/20">
                      SHEET 2
                    </span>
                    <span className="text-[10px] text-slate-400">Traffic</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">School Visits</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Every timestamped school view event with target school name, slug, sector locality, user identifier (if authenticated), and estimated visit duration.
                  </p>
                  <div className="text-[11px] text-blue-400/90 font-mono pt-1">
                    ✓ Real activity event telemetry
                  </div>
                </div>

                {/* Sheet 3 Card */}
                <div className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-400/10 text-rose-300 border border-rose-400/20">
                      SHEET 3
                    </span>
                    <span className="text-[10px] text-slate-400">Intent</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Wishlists &amp; Shortlists</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Granular log of wishlist additions and removals during the period, providing clear insights into parental interest trends and school bookmarks.
                  </p>
                  <div className="text-[11px] text-rose-400/90 font-mono pt-1">
                    ✓ Full addition / removal audit trail
                  </div>
                </div>

                {/* Sheet 4 Card */}
                <div className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      SHEET 4
                    </span>
                    <span className="text-[10px] text-slate-400">Feedback</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Parent Reviews &amp; Ratings</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Complete ratings and text reviews created in the month with scores (1-5), verified parent badge status, published/moderated state, and admin notes.
                  </p>
                  <div className="text-[11px] text-amber-400/90 font-mono pt-1">
                    ✓ Moderation &amp; anonymous integrity
                  </div>
                </div>

                {/* Sheet 5 Card */}
                <div className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] space-y-2 md:col-span-2 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-400/10 text-purple-300 border border-purple-400/20">
                      SHEET 5
                    </span>
                    <span className="text-[10px] text-slate-400">Benchmark</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">Canonical School Summary (63 Schools)</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Side-by-side performance matrix for all 63 Greater Noida West schools: monthly recorded views, monthly wishlist adds, monthly reviews &amp; monthly average rating, juxtaposed against all-time views, active shortlists, and overall rating.
                  </p>
                  <div className="text-[11px] text-purple-400/90 font-mono pt-1">
                    ✓ Comprehensive canonical school coverage
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Access Notice */}
            <div className="p-4 rounded-xl bg-[#081b33] border border-[#19426f] flex items-start gap-3 text-xs text-slate-400">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-200">
                  Data Privacy &amp; Administrative Compliance Guarantees
                </p>
                <p className="leading-relaxed">
                  Excel reports are strictly restricted to authenticated administrators. Generation operations are audited and stored in the security log. Passwords, verification OTP tokens, rate-limiters, and detailed apartment/flat numbers are strictly excluded to maintain complete parental privacy and zero-trust security.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 11: ADMINISTRATIVE AUDIT LOG                                   */}
        {/* =================================================================== */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Administrative Actions &amp; Security Audit Log</span>
              </h3>
              <span className="text-xs text-slate-400">
                Immutable records of review deletions, user status changes &amp; campaigns
              </span>
            </div>

            <div className="space-y-2.5">
              {auditLogsList.map(log => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#0f284a] border border-[#1e4878] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-white">Target: {log.targetType} ({log.targetId})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Admin: <strong className="text-slate-200">{log.adminEmail}</strong>
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 12: SYSTEM SETTINGS & CHANGE PASSWORD                          */}
        {/* =================================================================== */}
        {activeTab === 'settings' && <AdminSettingsSection />}
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* 4. MODAL: CREATE NEW PROMOTION CAMPAIGN                               */}
      {/* --------------------------------------------------------------------- */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-[#0f284a] border border-[#1e4878] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-serif">
                Launch School Promotion Campaign
              </h3>
              <button
                onClick={() => setShowPromoModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromoSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target School</label>
                <select
                  value={promoForm.schoolSlug}
                  onChange={e => setPromoForm({ ...promoForm, schoolSlug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-200 outline-none"
                >
                  {schoolsList.map(s => (
                    <option key={s.slug} value={s.slug}>
                      {s.name} ({s.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Campaign Internal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DWPS Admissions 2027-28 Inaugural"
                  value={promoForm.campaignName}
                  onChange={e => setPromoForm({ ...promoForm, campaignName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Placement Type</label>
                  <select
                    value={promoForm.placementType}
                    onChange={e => setPromoForm({ ...promoForm, placementType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-200 outline-none"
                  >
                    <option value="homepage_hero">Homepage Hero Banner</option>
                    <option value="featured_card">Directory Featured Card</option>
                    <option value="sponsored_search">Search Header</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Badge Label</label>
                  <input
                    type="text"
                    required
                    placeholder="Sponsored / Promoted"
                    value={promoForm.badgeLabel}
                    onChange={e => setPromoForm({ ...promoForm, badgeLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Public Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi World Public School, Knowledge Park 5"
                  value={promoForm.title}
                  onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Value Proposition</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Highlight key admissions criteria, smart facilities, transparent fees..."
                  value={promoForm.description}
                  onChange={e => setPromoForm({ ...promoForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors shadow-md"
                >
                  Create &amp; Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminSettingsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Criteria calculations
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumberOrSpecial = /[0-9]|[^A-Za-z0-9]/.test(newPassword);
  const isMatching = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasMinLength && hasUpper && hasLower && hasNumberOrSpecial && isMatching;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!currentPassword) {
      setStatusMsg({ type: 'error', text: 'Current password is required.' });
      return;
    }

    if (!isValid) {
      setStatusMsg({
        type: 'error',
        text: 'Please ensure all password policy requirements and matching criteria are satisfied.',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: data.message || 'Administrator password successfully updated.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to update administrator password.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Network or server error occurred while updating password.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-4 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>System Security &amp; Administrative Credentials</span>
        </h3>
        <span className="text-xs text-slate-400">
          Enforce authentication integrity, rotate master credentials, and review security policies
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Password Change Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-5">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Change Administrator Password</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Update your administrative master account password. Password updates take effect immediately and are logged to the security audit trail.
            </p>
          </div>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-start gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            {/* Current Password */}
            <div>
              <label className="block text-slate-200 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                Current Administrator Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  required
                  disabled={isUpdating}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none text-xs font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-slate-200 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                New Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password..."
                  required
                  disabled={isUpdating}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none text-xs font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-slate-200 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                Confirm New Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  required
                  disabled={isUpdating}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none text-xs font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Criteria Indicators */}
            <div className="p-3.5 rounded-xl bg-[#0a1e38] border border-[#1d4b7c] space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Security Policy Criteria:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 text-center">○</span>}
                  <span>At least 8 characters long</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {hasUpper ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 text-center">○</span>}
                  <span>Uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {hasLower ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 text-center">○</span>}
                  <span>Lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumberOrSpecial ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {hasNumberOrSpecial ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 text-center">○</span>}
                  <span>Number or special character</span>
                </div>
                <div className={`col-span-2 flex items-center gap-1.5 ${isMatching ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isMatching ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 text-center">○</span>}
                  <span>New password and confirmation match</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating || !currentPassword || !isValid}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isUpdating || !currentPassword || !isValid
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
              }`}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Administrator Password</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Overview Sidebar */}
        <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4 text-xs">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Active Security Posture</span>
          </h4>

          <div className="space-y-3 divide-y divide-white/10">
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block font-medium">Password Hash Algorithm</span>
              <span className="text-slate-200 font-mono font-bold">PBKDF2-SHA512 (10,000 iter)</span>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-slate-400 block font-medium">Salt Generation</span>
              <span className="text-slate-200 font-mono font-bold">128-bit Cryptographic Random</span>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-slate-400 block font-medium">Session Verification</span>
              <span className="text-slate-200 font-mono font-bold">Server-Signed JWT Cookies</span>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-slate-400 block font-medium">Admin Authorization Boundary</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Enforced Server-Side
              </span>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-slate-400 block font-medium">Audit Trail Logging</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Immutable
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
