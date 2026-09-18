import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import {
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const notifications = getAdminNotifications();
  return NextResponse.json({
    success: true,
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, markAll } = body;

  if (markAll) {
    markAllNotificationsRead();
  } else if (id) {
    markNotificationRead(id);
  }

  return NextResponse.json({
    success: true,
    message: 'Notifications marked as read.',
  });
}
