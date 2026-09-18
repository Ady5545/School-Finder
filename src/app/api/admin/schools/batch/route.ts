import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { archiveAdminSchool, updateAdminSchool } from '@/lib/schoolAdminService';
import { recordAdminAudit } from '@/lib/authStore';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, slugs, reason, data } = body || {};

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json({ success: false, message: 'Array of school slugs required' }, { status: 400 });
    }

    const adminUser = { id: auth.user.id, email: auth.user.email, name: auth.user.name };
    const results: { slug: string; success: boolean; message?: string }[] = [];

    if (action === 'archive') {
      if (!reason || reason.trim().length < 5) {
        return NextResponse.json({ success: false, message: 'Descriptive archive reason required' }, { status: 400 });
      }
      for (const slug of slugs) {
        const res = archiveAdminSchool(slug, reason, adminUser);
        results.push({ slug, success: res.success, message: res.error });
      }
    } else if (action === 'verify_status') {
      const statusToSet = data?.verificationStatus || 'verified_official';
      for (const slug of slugs) {
        const res = updateAdminSchool(
          slug,
          {
            verification: {
              isVerified: true,
              status: statusToSet,
              lastVerified: new Date().toISOString().split('T')[0],
              sourceName: 'Bulk Administrative Verification',
              verifiedFields: ['name', 'location', 'fees', 'contact'],
            },
          },
          adminUser,
          reason || 'Bulk verification update'
        );
        results.push({ slug, success: res.success, message: res.error });
      }
    } else if (action === 'update_admission_status') {
      const admStatus = data?.admissionStatus || 'Admissions Open';
      for (const slug of slugs) {
        const res = updateAdminSchool(
          slug,
          {
            admissions: {
              status: admStatus,
              academicYear: data?.academicYear || '2025-2026',
              process: 'Online & Offline Application',
              date: null,
            },
          },
          adminUser,
          reason || `Bulk admission status change to ${admStatus}`
        );
        results.push({ slug, success: res.success, message: res.error });
      }
    } else {
      return NextResponse.json({ success: false, message: `Unsupported batch action: ${action}` }, { status: 400 });
    }

    recordAdminAudit(
      auth.user.id,
      auth.user.email,
      'batch_schools_operation',
      'system',
      'bulk-action',
      { action, count: slugs.length, reason },
      'success'
    );

    return NextResponse.json({
      success: true,
      results,
      affectedCount: results.filter(r => r.success).length,
      totalCount: slugs.length,
    });
  } catch (error) {
    console.error('Error in batch schools operation:', error);
    return NextResponse.json({ success: false, message: 'Failed to process batch operation.' }, { status: 500 });
  }
}
