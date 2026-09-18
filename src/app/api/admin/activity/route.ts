import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getActivityEventsAsync, getUserByIdAsync } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
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

  // Enrich events with user names and school names
  const enrichedEvents = await Promise.all(events.map(async evt => {
    let userName: string | undefined = undefined;
    let userEmail: string | undefined = undefined;
    if (evt.userId) {
      const user = await getUserByIdAsync(evt.userId);
      if (user) {
        userName = user.name;
        userEmail = user.email;
      }
    }

    let schoolName: string | undefined = undefined;
    if (evt.schoolSlug) {
      const school = getSchoolBySlug(evt.schoolSlug);
      if (school) {
        schoolName = school.name;
      }
    }

    return {
      ...evt,
      userName,
      userEmail,
      schoolName,
    };
  }));

  return NextResponse.json({
    success: true,
    events: enrichedEvents,
    count: enrichedEvents.length,
  });
}
