import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { restoreAdminSchoolAsync } from '@/lib/schoolAdminService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:archive')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { reason } = body || {};

    const result = await restoreAdminSchoolAsync(
      slug,
      reason || 'Restored to active directory listing by admin',
      { id: auth.user.id, email: auth.user.email, name: auth.user.name }
    );

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `School '${slug}' has been restored to the active public directory.`,
    });
  } catch (error) {
    console.error('Error restoring school:', error);
    return NextResponse.json({ success: false, message: 'Failed to restore school.' }, { status: 500 });
  }
}
