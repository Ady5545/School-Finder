import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getAllSchoolsAdminOverviewAsync } from '@/lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const analyticsOverview = await getAllSchoolsAdminOverviewAsync();

    return NextResponse.json({
      success: true,
      metrics: analyticsOverview.map(item => ({
        slug: item.slug,
        views: item.views || 0,
        saves: item.saves || 0,
        reviewsCount: item.reviewsCount || 0,
        averageRating: item.averageRating || 0,
        activePromotion: item.activePromotion || null,
      })),
    });
  } catch (error) {
    console.error('Error loading school analytics metrics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load school analytics.' },
      { status: 500 }
    );
  }
}
