import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getAdminOverviewMetricsAsync } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'analytics:view');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const timeRange = (searchParams.get('range') || '30d') as 'today' | '7d' | '30d' | '90d' | 'all';

  const metrics = await getAdminOverviewMetricsAsync(timeRange);
  return NextResponse.json({
    success: true,
    metrics,
  });
}
