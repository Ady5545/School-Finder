import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getAdminAuditLogs } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const adminUserId = searchParams.get('adminUserId') || undefined;
  const action = searchParams.get('action') || undefined;
  const targetType = searchParams.get('targetType') || undefined;
  const limit = Math.max(1, Math.min(200, parseInt(searchParams.get('limit') || '100', 10)));

  const logs = getAdminAuditLogs(limit, { adminUserId, action, targetType });

  return NextResponse.json({
    success: true,
    logs,
    count: logs.length,
  });
}
