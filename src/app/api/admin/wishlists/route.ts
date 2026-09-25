import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getWishlistAnalyticsAsync } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'analytics:view');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const rawAnalytics = await getWishlistAnalyticsAsync();

  const enriched = rawAnalytics.map(item => {
    const school = getSchoolBySlug(item.slug);
    return {
      ...item,
      schoolName: school?.name || item.slug,
      sector: school?.location.sector || school?.location.area || 'Greater Noida West',
      board: school?.board ? school.board.join(', ') : 'CBSE',
    };
  });

  return NextResponse.json({
    success: true,
    wishlists: enriched,
    totalShortlistsCount: enriched.reduce((acc, curr) => acc + curr.count, 0),
  });
}
