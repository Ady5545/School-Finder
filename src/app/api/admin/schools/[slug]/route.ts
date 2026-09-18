import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getAdminSchoolBySlug, updateAdminSchool } from '@/lib/schoolAdminService';
import {
  getAdminSchoolAnalytics,
  getAllPromotions,
  getAdminAuditLogs,
} from '@/lib/authStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
  }

  const school = getAdminSchoolBySlug(slug);
  if (!school) {
    return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
  }

  const analytics = getAdminSchoolAnalytics(slug);
  const promotions = getAllPromotions().filter(p => p.schoolSlug === slug);
  const auditLogs = getAdminAuditLogs(50, { targetType: 'school' }).filter(
    l => l.targetId === slug
  );

  return NextResponse.json({
    success: true,
    school,
    analytics,
    promotions,
    auditLogs,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
    }

    const body = await req.json();
    const { updates, reason } = body || {};

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ success: false, message: 'Missing update payload' }, { status: 400 });
    }

    const result = updateAdminSchool(
      slug,
      updates,
      { id: auth.user.id, email: auth.user.email, name: auth.user.name },
      reason || 'Administrative update via School Editor'
    );

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      school: result.school,
      message: 'School record successfully updated.',
    });
  } catch (error) {
    console.error('Error updating school via admin:', error);
    return NextResponse.json({ success: false, message: 'Failed to update school record.' }, { status: 500 });
  }
}
