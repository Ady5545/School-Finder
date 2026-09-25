import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getSecurityEvents, recordSecurityEvent } from '@/lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'system:health');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const events = getSecurityEvents(limit);

  return NextResponse.json({
    success: true,
    events,
    total: events.length,
    criticalCount: events.filter(e => e.severity === 'critical' || e.severity === 'high').length,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'system:health');
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const body = await req.json();
    const event = recordSecurityEvent(body);
    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
