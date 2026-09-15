'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/authContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Eye,
  Heart,
  Star,
  Activity,
  ArrowUpRight,
  Clock,
  Lock,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

interface AnalyticsData {
  totalParents: number;
  activeParents?: number;
  totalViews: number;
  totalSaves: number;
  totalRatings: number;
  averageRating: number;
  topViewedSchools: { slug: string; views: number }[];
  topSavedSchools: { slug: string; saves: number }[];
}

interface ActivityEvent {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  schoolSlug?: string;
  details?: Record<string, unknown>;
}

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

export default function AdminAnalyticsPage() {
  const { user, isAuthenticated, isAdmin, isLoading, login } = useAuth();
  const [data, setData] = useState<{
    analytics: AnalyticsData;
    ratings: RatingItem[];
    recentActivity: ActivityEvent[];
  } | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin Login state if not authenticated as admin
  const [adminEmail, setAdminEmail] = useState('admin@admissionpitara.com');
  const [adminPassword, setAdminPassword] = useState('Admin@Pitara2025');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Activity filter
  const [activityFilter, setActivityFilter] = useState<string>('all');

  const fetchAnalytics = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Access Denied: You do not have administrator permissions.');
        } else {
          setError('Failed to fetch analytics from the server.');
        }
        setData(null);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData({
          analytics: json.analytics,
          ratings: json.ratings,
          recentActivity: json.recentActivity,
        });
      } else {
        setError(json.message || 'Error loading dashboard data');
      }
    } catch {
      setError('Network error while requesting administrative metrics.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const res = await login({
      email: adminEmail,
      password: adminPassword,
      loginType: 'password',
    });
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.message || 'Invalid administrative credentials.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // Security Access Guard: If not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="border border-slate-300 shadow-warm-md">
          <CardHeader className="text-center pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-black text-slate-900">
              Restricted Administrative Portal
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Access to platform telemetry, analytics, and ratings moderation requires verified administrator privileges.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600 bg-white"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoggingIn}
                className="w-full font-bold shadow-warm-xs"
              >
                Authenticate as Auditor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredActivity = data?.recentActivity.filter(event => {
    if (activityFilter === 'all') return true;
    return event.type === activityFilter;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authorized: {user?.email}</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Role: Auditor / Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrative Telemetry & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Privacy-safe operational metrics, user engagement tracking, and verified parent review logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            isLoading={loadingData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Refresh Data
          </Button>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs font-semibold">
              Parent View
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      {data && (
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>Registered Parents</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data.analytics.totalParents}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <span>Email OTP Verified</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>Active Parents</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data.analytics.activeParents ?? data.analytics.totalParents}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">
                Active in last 30 days
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>School Views</span>
                <Eye className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data.analytics.totalViews}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">
                Profile read queries
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>Shortlist Saves</span>
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data.analytics.totalSaves}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">
                Parent shortlist items
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>Parent Reviews</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data.analytics.totalRatings}
              </div>
              <div className="text-[11px] text-amber-800 font-semibold mt-1">
                Avg: {data.analytics.averageRating} / 5.0
              </div>
            </div>
          </div>

          {/* Metric Clarity & Privacy Assurance Guide */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Metric Definitions &amp; Privacy Safeguards</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <strong className="text-slate-900 block mb-0.5">Parent Accounts</strong>
                Count of verified parents who registered using secure, time-limited email OTP.
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <strong className="text-slate-900 block mb-0.5">Zero-PII Telemetry</strong>
                Telemetry tracks aggregated views and saves. No passwords, OTPs, or exact locations are ever collected or stored.
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <strong className="text-slate-900 block mb-0.5">Verified Reviews</strong>
                Real ratings covering Academics, Infrastructure, Faculty, and Safety submitted solely by verified accounts.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Activity Events + Reviews Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Activity Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Audit Activity Stream ({filteredActivity.length})
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['all', 'school_view', 'wishlist_add', 'school_rated', 'user_signup'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActivityFilter(f)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer capitalize ${
                      activityFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Compliance Banner */}
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Policy Compliance:</strong> No passwords, OTP values, SMS tokens, or exact GPS locations are logged or stored. Only aggregated event types and anonymous user session IDs are tracked.
              </span>
            </div>

            {/* Events List */}
            {filteredActivity.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No activity records found matching the selected filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto pr-1">
                {filteredActivity.map(event => (
                  <div key={event.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                            event.type === 'school_rated'
                              ? 'bg-amber-100 text-amber-800'
                              : event.type === 'wishlist_add'
                              ? 'bg-rose-100 text-rose-800'
                              : event.type === 'user_signup'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {event.type}
                        </span>
                        {event.schoolSlug && (
                          <span className="font-semibold text-slate-800">
                            {event.schoolSlug}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        User: {event.userId || 'Anonymous Guest'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Column: Top Schools & Ratings Summary (1 col) */}
        <div className="space-y-6">
          {/* Top Viewed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Top Viewed Schools</span>
              <Eye className="w-4 h-4 text-slate-400" />
            </h3>
            {data?.analytics.topViewedSchools && data.analytics.topViewedSchools.length > 0 ? (
              <div className="space-y-2">
                {data.analytics.topViewedSchools.map((item, idx) => (
                  <div key={item.slug} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 font-bold text-slate-400">#{idx + 1}</span>
                      <Link href={`/schools/${item.slug}`} className="text-slate-700 hover:text-sky-600 font-medium truncate">
                        {item.slug.replace(/-/g, ' ')}
                      </Link>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {item.views}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">No view statistics yet.</div>
            )}
          </div>

          {/* Top Saved */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Top Wishlisted Schools</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </h3>
            {data?.analytics.topSavedSchools && data.analytics.topSavedSchools.length > 0 ? (
              <div className="space-y-2">
                {data.analytics.topSavedSchools.map((item, idx) => (
                  <div key={item.slug} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 font-bold text-slate-400">#{idx + 1}</span>
                      <Link href={`/schools/${item.slug}`} className="text-slate-700 hover:text-sky-600 font-medium truncate">
                        {item.slug.replace(/-/g, ' ')}
                      </Link>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {item.saves} saves
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">No shortlist statistics yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Moderation Table */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-base font-bold text-slate-900">
              Verified Parent Ratings Log ({data?.ratings.length || 0})
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Authenticated Submissions Only
          </span>
        </div>

        {data?.ratings && data.ratings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">School</th>
                  <th className="py-2.5 px-3">Parent</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Title & Feedback</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.ratings.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      <Link href={`/schools/${rev.schoolSlug}`} className="hover:underline text-sky-700">
                        {rev.schoolSlug}
                      </Link>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{rev.userName}</div>
                      <div className="text-[11px] text-slate-400">{rev.userChildGrade || 'Parent'}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{rev.score}.0</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-md">
                      {rev.title && <strong className="block text-slate-900 mb-0.5">{rev.title}</strong>}
                      <p className="text-slate-600 line-clamp-2">{rev.comment}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No parent reviews submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}
