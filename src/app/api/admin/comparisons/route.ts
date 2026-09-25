import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getComparisonAnalyticsAsync } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'analytics:view');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const rawAnalytics = await getComparisonAnalyticsAsync();

  const enrichedPairs = rawAnalytics.commonPairs.map(p => ({
    pair: p.pair,
    schoolNames: p.pair.map(slug => getSchoolBySlug(slug)?.name || slug),
    count: p.count,
  }));

  const enrichedFrequency = rawAnalytics.mostComparedSchools.map(item => ({
    slug: item.slug,
    schoolName: getSchoolBySlug(item.slug)?.name || item.slug,
    count: item.count,
  }));

  return NextResponse.json({
    success: true,
    commonPairs: enrichedPairs,
    mostComparedSchools: enrichedFrequency,
  });
}
