import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserByIdAsync, updateUserProfileAsync } from '../../../../lib/authStore';
import { getPublicSchoolBySlug } from '../../../../lib/schools';
import {
  APPLICATION_TRACKER_STATUSES,
  type ApplicationTrackerItem,
  type ApplicationTrackerStatus,
} from '../../../../lib/applicationTracker';

async function getAuthUser(req: NextRequest) {
  const cookieToken = req.cookies.get('ap_session')?.value;
  const header = req.headers.get('authorization');
  const bearer = header?.startsWith('Bearer ') ? header.substring(7) : null;
  const token = cookieToken || bearer;
  if (!token) return null;
  const session = verifySessionToken(token);
  if (!session?.sub) return null;
  const user = await getUserByIdAsync(session.sub);
  return user ? { user, id: session.sub } : null;
}

function isValidStatus(value: unknown): value is ApplicationTrackerStatus {
  return APPLICATION_TRACKER_STATUSES.some(item => item.value === value);
}

function cleanOptionalString(value: unknown, max: number) {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, max) : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    return NextResponse.json({ success: true, applications: auth.user.applicationTracker || [] });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to load application tracker.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, message: 'Sign in to track applications.' }, { status: 401 });

    const body = await req.json();
    const schoolSlug = cleanOptionalString(body.schoolSlug, 200) || '';
    const school = getPublicSchoolBySlug(schoolSlug);
    if (!school) return NextResponse.json({ success: false, message: 'School not found.' }, { status: 404 });

    const current = Array.isArray(auth.user.applicationTracker) ? auth.user.applicationTracker : [];
    if (current.some(item => item.schoolSlug === school.slug)) {
      return NextResponse.json({ success: false, message: 'This school is already in your application tracker.' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const item: ApplicationTrackerItem = {
      id: 'app-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      schoolSlug: school.slug,
      schoolName: school.name,
      status: isValidStatus(body.status) ? body.status : 'researching',
      notes: cleanOptionalString(body.notes, 1000),
      applicationUrl: cleanOptionalString(body.applicationUrl, 500),
      targetDate: cleanOptionalString(body.targetDate, 40),
      createdAt: now,
      updatedAt: now,
    };

    const updatedUser = await updateUserProfileAsync(auth.id, {
      applicationTracker: [...current, item],
    });
    if (!updatedUser) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });

    return NextResponse.json({ success: true, application: item, applications: updatedUser.applicationTracker || [] }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to add tracker item.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });

    const body = await req.json();
    const id = typeof body.id === 'string' ? body.id : '';
    const current = Array.isArray(auth.user.applicationTracker) ? auth.user.applicationTracker : [];
    const index = current.findIndex(item => item.id === id);
    if (index < 0) return NextResponse.json({ success: false, message: 'Tracker item not found.' }, { status: 404 });

    const next = { ...current[index] };
    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) return NextResponse.json({ success: false, message: 'Invalid tracker status.' }, { status: 400 });
      next.status = body.status;
    }
    if (body.notes !== undefined) next.notes = cleanOptionalString(body.notes, 1000);
    if (body.applicationUrl !== undefined) next.applicationUrl = cleanOptionalString(body.applicationUrl, 500);
    if (body.targetDate !== undefined) next.targetDate = cleanOptionalString(body.targetDate, 40);
    next.updatedAt = new Date().toISOString();

    const nextList = [...current];
    nextList[index] = next;
    const updatedUser = await updateUserProfileAsync(auth.id, { applicationTracker: nextList });
    if (!updatedUser) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });

    return NextResponse.json({ success: true, application: next, applications: updatedUser.applicationTracker || [] });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update tracker item.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === 'string' ? body.id : new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Tracker item id is required.' }, { status: 400 });

    const current = Array.isArray(auth.user.applicationTracker) ? auth.user.applicationTracker : [];
    const nextList = current.filter(item => item.id !== id);
    if (nextList.length === current.length) return NextResponse.json({ success: false, message: 'Tracker item not found.' }, { status: 404 });

    const updatedUser = await updateUserProfileAsync(auth.id, { applicationTracker: nextList });
    if (!updatedUser) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    return NextResponse.json({ success: true, applications: updatedUser.applicationTracker || [] });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to remove tracker item.' }, { status: 500 });
  }
}
