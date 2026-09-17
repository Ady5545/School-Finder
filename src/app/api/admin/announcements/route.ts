import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import {
  getAllAnnouncements,
  createAnnouncement,
  recordAdminAudit,
} from '@/lib/authStore';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const announcements = getAllAnnouncements(true);
  return NextResponse.json({
    success: true,
    announcements,
  });
}

export async function POST(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'announcements:manage')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, body: contentBody, ctaText, ctaLink, startDate, endDate, priority, targetAudience, status } = body;

    if (!title || !contentBody) {
      return NextResponse.json({ success: false, message: 'Announcement title and body are required.' }, { status: 400 });
    }

    const newAnn = createAnnouncement({
      title,
      body: contentBody,
      ctaText,
      ctaLink,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      priority: priority || 'normal',
      targetAudience: targetAudience || 'all',
      status: status || 'draft',
    }, auth.user.email);

    recordAdminAudit(
      auth.user.id,
      auth.user.email,
      'create_announcement',
      'system',
      newAnn.id,
      { title: newAnn.title },
      'success'
    );

    return NextResponse.json({
      success: true,
      announcement: newAnn,
      message: 'Announcement successfully created.',
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ success: false, message: 'Failed to create announcement.' }, { status: 500 });
  }
}
