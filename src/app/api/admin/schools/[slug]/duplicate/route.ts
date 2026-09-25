import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getAdminSchoolBySlugAsync, createAdminSchoolAsync } from '@/lib/schoolAdminService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdminAuth(req, 'schools:write');
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
  }

  try {
    const original = await getAdminSchoolBySlugAsync(slug);
    if (!original) {
      return NextResponse.json({ success: false, message: `School '${slug}' not found.` }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const newName = body.newName || `${original.name} (Copy)`;
    const newSlug = body.newSlug || `${original.slug}-copy-${Date.now().toString(36)}`;

    const clonedData = {
      ...original,
      id: newSlug,
      slug: newSlug,
      name: newName,
      status: 'active' as const,
      isArchived: false,
      archiveReason: undefined,
    };

    const result = await createAdminSchoolAsync(
      clonedData,
      { id: auth.user.id, email: auth.user.email, name: auth.user.name },
      `Cloned from existing school ${original.slug}`
    );

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      school: result.school,
      message: `School '${original.name}' successfully duplicated as '${newName}'.`,
    });
  } catch (error) {
    console.error('Error duplicating school:', error);
    return NextResponse.json({ success: false, message: 'Failed to duplicate school.' }, { status: 500 });
  }
}
