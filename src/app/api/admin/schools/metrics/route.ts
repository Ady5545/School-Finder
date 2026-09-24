import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getAllSchoolsAdminOverviewAsync } from '@/lib/authStore';

const METRICS_CACHE_TTL_MS = 20_000;
let metricsCache: { expiresAt: number; value: Array<{
  slug: string;
  views: number;
  saves: number;
  reviewsCount: number;
  averageRating: number;
  activePromotion: unknown;
}> } | null = null;


export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const now = Date.now();
    if (metricsCache && metricsCache.expiresAt > now) {
      return NextResponse.json({ success: true, metrics: metricsCache.value, cached: true });
    }

    const analyticsOverview = await getAllSchoolsAdminOverviewAsync();
    const value = analyticsOverview.map(item => ({
      slug: item.slug,
      views: item.views || 0,
      saves: item.saves || 0,
      reviewsCount: item.reviewsCount || 0,
      averageRating: item.averageRating || 0,
      activePromotion: item.activePromotion || null,
    }));

    metricsCache = { expiresAt: now + METRICS_CACHE_TTL_MS, value };

    return NextResponse.json({
      success: true,
      metrics: value,
      cached: false,
    });
  } catch (error) {
    console.error('Error loading school analytics metrics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load school analytics.' },
      { status: 500 }
    );
  }
}
