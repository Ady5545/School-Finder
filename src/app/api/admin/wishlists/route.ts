import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getWishlistAnalytics } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const rawAnalytics = getWishlistAnalytics();

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
