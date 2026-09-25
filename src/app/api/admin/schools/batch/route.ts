import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { archiveAdminSchoolAsync, updateAdminSchoolAsync, getAdminSchoolBySlugAsync } from '@/lib/schoolAdminService';
import { recordAdminAudit } from '@/lib/authStore';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'schools:write');
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
    const archiveReason = typeof reason === 'string' && reason.trim().length >= 5 ? reason.trim() : '';
    const results: { slug: string; success: boolean; message?: string }[] = [];

    if (action === 'archive') {
      if (!hasAdminPermission(auth.user, 'schools:archive')) {
        return NextResponse.json({ success: false, message: 'Archive permission required.' }, { status: 403 });
      }
      if (!archiveReason) {
        return NextResponse.json({ success: false, message: 'Descriptive archive reason required' }, { status: 400 });
      }
      for (const slug of slugs) {
        const res = await archiveAdminSchoolAsync(slug, archiveReason, adminUser);
        results.push({ slug, success: res.success, message: res.error });
      }
    } else if (action === 'verify_status') {
      const sourceName = typeof data?.sourceName === 'string' ? data.sourceName.trim() : '';
      const sourceUrl = typeof data?.sourceUrl === 'string' ? data.sourceUrl.trim() : '';
      const verifiedFields = Array.isArray(data?.verifiedFields)
        ? data.verifiedFields.filter((field: unknown): field is string => typeof field === 'string' && field.trim().length > 0).slice(0, 30)
        : [];
      const statusToSet = data?.verificationStatus || 'verified_official';

      if (!sourceName || !sourceUrl || verifiedFields.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Real verification source name, source URL, and at least one verified field are required.' },
          { status: 400 }
        );
      }

      for (const slug of slugs) {
        const res = await updateAdminSchoolAsync(
          slug,
          {
            verification: {
              isVerified: true,
              status: statusToSet,
              lastVerified: new Date().toISOString().split('T')[0],
              sourceName,
              sourceUrl,
              verifiedFields,
            },
          },
          adminUser,
          typeof reason === 'string' && reason.trim() ? reason.trim() : 'Bulk verification update'
        );
        results.push({ slug, success: res.success, message: res.error });
      }
    } else if (action === 'update_admission_status') {
      const admStatus = data?.admissionStatus || 'Admissions Open';
      for (const slug of slugs) {
        const current = await getAdminSchoolBySlugAsync(slug);
        if (!current) {
          results.push({ slug, success: false, message: 'School record not found.' });
          continue;
        }
        const res = await updateAdminSchoolAsync(
          slug,
          {
            admissions: {
              ...current.admissions,
              status: typeof admStatus === 'string' ? admStatus : 'Admissions Open',
              academicYear: typeof data?.academicYear === 'string' ? data.academicYear : (current.admissions.academicYear || '2027-28'),
              ...(typeof data?.process === 'string' && data.process.trim()
                ? { process: data.process.trim() }
                : {}),
            },
          },
          adminUser,
          typeof reason === 'string' && reason.trim() ? reason.trim() : `Bulk admission status change to ${admStatus}`
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
