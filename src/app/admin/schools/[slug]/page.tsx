'use client';

import React, { useEffect, useState, use } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building,
  Eye,
  Heart,
  Star,
  Scale,
  Sparkles,
  MapPin,
  Calendar,
  ExternalLink,
  Users,
  Clock,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface SchoolAnalyticsData {
  school: {
    id: string;
    slug: string;
    name: string;
    shortName: string;
    location: {
      address: string;
      sector: string;
      area: string;
      city: string;
    };
    curriculum: {
      boards: string[];
      gradesOffered: string;
    };
    establishedYear: number;
    feeStructure: {
      annualTutionFee: string;
      monthlyEquivalent: string;
      quarterlyPayment: string;
    };
  };
  analytics: {
    slug: string;
    traffic: {
      totalViews: number;
      uniqueAuthenticatedViewers: number;
      repeatViewers: number;
      firstViewedAt: string | null;
      lastViewedAt: string | null;
      viewers: Array<{
        userId: string;
        userName: string;
        userEmail: string;
        viewCount: number;
        firstViewedAt: string;
        lastViewedAt: string;
      }>;
    };
    engagement: {
      wishlistSaves: number;
      shortlistedByUsers: Array<{
        userId: string;
        userName: string;
        userEmail: string;
        savedAt: string;
      }>;
      comparedCount: number;
      reviewsCount: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
      categoryAverages: Record<string, number>;
      reviews: Array<{
        id: string;
        userId: string;
        userName: string;
        userEmail: string;
        score: number;
        title?: string;
        comment: string;
        status: 'published' | 'deleted';
        createdAt: string;
      }>;
    };
  };
  promotions: Array<{
    id: string;
    campaignName: string;
    placementType: string;
    status: string;
    impressions: number;
    clicks: number;
  }>;
}

export default function AdminSchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [data, setData] = useState<SchoolAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/schools/${slug}`);
      if (!res.ok) {
        router.push('/admin');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch {
      setActionMsg({ type: 'error', text: 'Failed to load school analytics.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const reason = prompt('Reason for review deletion:');
    if (reason === null) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}&reason=${encodeURIComponent(reason || 'Admin removed')}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showNotification('success', 'Review deleted.');
        loadData();
      }
    } catch {
      showNotification('error', 'Failed to delete review.');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071322] text-slate-200">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
          <span className="text-xs font-semibold">Loading school analytics...</span>
        </div>
      </div>
    );
  }

  const { school, analytics, promotions } = data;
  const { traffic, engagement } = analytics;

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
              <span>{school.name}</span>
              <span className="font-mono text-[11px] text-amber-300">({school.location.sector || school.location.area})</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Slug: {school.slug}</p>
          </div>
        </div>

        <Link
          href={`/schools/${school.slug}`}
          target="_blank"
          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
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
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Total Views</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-3xl font-black text-white font-serif">{traffic.totalViews}</span>
            <p className="text-[10px] text-slate-400">
              {traffic.uniqueAuthenticatedViewers} unique parent accounts
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Shortlists</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-3xl font-black text-white font-serif">{engagement.wishlistSaves}</span>
            <p className="text-[10px] text-slate-400">
              {engagement.shortlistedByUsers.length} families bookmarked
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Comparisons</span>
              <Scale className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white font-serif">{engagement.comparedCount}</span>
            <p className="text-[10px] text-slate-400">Added to comparison engine</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Parent Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-3xl font-black text-white font-serif">★ {engagement.averageRating}</span>
            <p className="text-[10px] text-slate-400">{engagement.reviewsCount} verified reviews</p>
          </div>
        </div>

        {/* Viewers & Shortlisted Parents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authenticated Viewers */}
          <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Registered Parents Who Viewed ({traffic.viewers.length})</span>
            </h3>

            <div className="space-y-2.5">
              {traffic.viewers.length > 0 ? (
                traffic.viewers.map(v => (
                  <div
                    key={v.userId}
                    className="p-3.5 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <Link
                        href={`/admin/users/${v.userId}`}
                        className="font-bold text-amber-300 hover:underline"
                      >
                        {v.userName}
                      </Link>
                      <p className="text-[10px] text-slate-400">{v.userEmail}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        First: {new Date(v.firstViewedAt).toLocaleDateString()} • Last: {new Date(v.lastViewedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                      {v.viewCount} views
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No authenticated views recorded.</p>
              )}
            </div>
          </div>

          {/* Parents Who Shortlisted */}
          <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Parents Who Shortlisted ({engagement.shortlistedByUsers.length})</span>
            </h3>

            <div className="space-y-2.5">
              {engagement.shortlistedByUsers.length > 0 ? (
                engagement.shortlistedByUsers.map(u => (
                  <div
                    key={u.userId}
                    className="p-3.5 rounded-xl bg-[#0a1e38] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <Link
                        href={`/admin/users/${u.userId}`}
                        className="font-bold text-white hover:text-amber-300"
                      >
                        {u.userName}
                      </Link>
                      <p className="text-[10px] text-slate-400">{u.userEmail}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(u.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No parents have shorted this school yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 rounded-2xl bg-[#0f284a] border border-[#1e4878] shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Verified Reviews Moderation ({engagement.reviews.length})</span>
          </h3>

          <div className="space-y-3">
            {engagement.reviews.length > 0 ? (
              engagement.reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#0a1e38] border border-white/5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{rev.userName}</span>
                      <span className="text-slate-400 text-[10px] ml-2">({rev.userEmail})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-amber-400">★ {rev.score}.0</span>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {rev.title && <p className="font-bold text-slate-200">&ldquo;{rev.title}&rdquo;</p>}
                  <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews submitted for this school.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
