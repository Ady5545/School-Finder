import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getAllSchools } from '../../../../lib/schools';
import {
  getAdminSchoolAnalytics,
  getAllPromotions,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const schools = getAllSchools();
  const allPromotions = getAllPromotions();

  const schoolMetrics = schools.map(school => {
    const analytics = getAdminSchoolAnalytics(school.slug);
    const activePromo = allPromotions.find(p => p.schoolSlug === school.slug && p.status === 'active');

    return {
      id: school.id,
      slug: school.slug,
      name: school.name,
      shortName: school.shortName,
      sector: school.location.sector || school.location.area,
      board: school.board.join(', '),
      establishedYear: 2015,
      verifiedFee: school.fees?.rangeText || school.fees?.tuitionAnnual || `₹${school.fees?.cardFee?.toLocaleString('en-IN') || '1,20,000'}/yr`,
      views: analytics.traffic.totalViews,
      uniqueViewersCount: analytics.traffic.uniqueAuthenticatedViewers,
      saves: analytics.engagement.wishlistSaves,
      shortlistedCount: analytics.engagement.shortlistedByUsers.length,
      comparedCount: analytics.engagement.comparedCount,
      reviewsCount: analytics.engagement.reviewsCount,
      averageRating: analytics.engagement.averageRating,
      activePromotion: activePromo ? {
        id: activePromo.id,
        campaignName: activePromo.campaignName,
        placementType: activePromo.placementType,
        status: activePromo.status,
        impressions: activePromo.impressions,
        clicks: activePromo.clicks,
      } : null,
    };
  });

  return NextResponse.json({
    success: true,
    schools: schoolMetrics,
    totalSchools: schools.length,
  });
}
