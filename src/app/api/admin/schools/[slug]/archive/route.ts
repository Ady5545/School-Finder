import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { archiveAdminSchool } from '@/lib/schoolAdminService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = requireAdminAuth(req);
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

    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Mandatory archive reason is required (minimum 5 characters).' },
        { status: 400 }
      );
    }

    const result = archiveAdminSchool(
      slug,
      reason.trim(),
      { id: auth.user.id, email: auth.user.email, name: auth.user.name }
    );

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `School '${slug}' has been archived. It is preserved for historical integrity but hidden from the public directory.`,
    });
  } catch (error) {
    console.error('Error archiving school:', error);
    return NextResponse.json({ success: false, message: 'Failed to archive school.' }, { status: 500 });
  }
}
