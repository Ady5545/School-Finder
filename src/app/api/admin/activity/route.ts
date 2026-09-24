import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getActivityEventsAsync, getAllUsersSanitizedAsync } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || undefined;
  const userId = searchParams.get('userId') || undefined;
  const schoolSlug = searchParams.get('schoolSlug') || undefined;
  const since = searchParams.get('since') || undefined;
  const limit = Math.max(1, Math.min(500, parseInt(searchParams.get('limit') || '100', 10)));

  const events = await getActivityEventsAsync(limit, {
    type,
    userId,
    schoolSlug,
    since,
  });

  // Enrich from one user lookup rather than querying Mongo once per event.
  const users = await getAllUsersSanitizedAsync();
  const usersById = new Map(users.map(user => [user.id, user]));

  const enrichedEvents = events.map(evt => {
    const user = evt.userId ? usersById.get(evt.userId) : undefined;
    const school = evt.schoolSlug ? getSchoolBySlug(evt.schoolSlug) : undefined;

    return {
      ...evt,
      userName: user?.name,
      userEmail: user?.email,
      schoolName: school?.name,
    };
  });

  return NextResponse.json({
    success: true,
    events: enrichedEvents,
    count: enrichedEvents.length,
  });
}
