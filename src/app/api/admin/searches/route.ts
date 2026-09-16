import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getSearchAnalytics } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const searchData = getSearchAnalytics();

  return NextResponse.json({
    success: true,
    topQueries: searchData.topQueries,
    topLocalities: searchData.topLocalities,
  });
}
