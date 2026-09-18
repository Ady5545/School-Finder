import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '../../../../../lib/adminAuth';
import {
  updateAnnouncement,
  deleteAnnouncement,
  recordAdminAudit,
} from '../../../../../lib/authStore';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'announcements:manage')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Announcement ID required' }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const updated = updateAnnouncement(id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    recordAdminAudit(
      auth.user.id,
      auth.user.email,
      'update_announcement',
      'system',
      id,
      { updates: Object.keys(updates) },
      'success'
    );

    return NextResponse.json({
      success: true,
      announcement: updated,
      message: 'Announcement updated successfully.',
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ success: false, message: 'Failed to update announcement.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'announcements:manage')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Announcement ID required' }, { status: 400 });
  }

  const deleted = deleteAnnouncement(id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
  }

  recordAdminAudit(
    auth.user.id,
    auth.user.email,
    'delete_announcement',
    'system',
    id,
    {},
    'success'
  );

  return NextResponse.json({
    success: true,
    message: 'Announcement deleted successfully.',
  });
}
