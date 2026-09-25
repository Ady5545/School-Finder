import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getMapDataAudit } from '../../../../lib/schoolAdminService';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'schools:read');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const audit = getMapDataAudit();

  return NextResponse.json({
    success: true,
    ...audit,
  });
}
