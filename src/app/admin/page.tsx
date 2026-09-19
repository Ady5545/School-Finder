'use client';

import React, { useEffect, useState, useMemo } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
                    return Boolean(school) && !school.isArchived && !school.isDuplicate;
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