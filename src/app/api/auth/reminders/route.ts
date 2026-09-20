import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserByIdAsync,
  getUserRemindersAsync,
  createAdmissionReminderAsync,
  updateReminderStatusAsync,
  deleteReminderAsync,
} from '@/lib/authStore';
import { getPublicSchoolBySlug } from '@/lib/schools';

async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cookieToken = req.cookies.get('ap_session')?.value;

  let token = cookieToken;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload || !payload.sub || !payload.email) return null;

  const user = await getUserByIdAsync(payload.sub);
  return {
    id: payload.sub,
    email: payload.email,
    user,
  };
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Sign in to view admission reminders.' }, { status: 401 });
    }

    const reminders = await getUserRemindersAsync(auth.id);
    return NextResponse.json({ success: true, reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Sign in to create admission reminders.' }, { status: 401 });
    }

    const body = await req.json();
    const { schoolSlug, milestoneId, milestoneLabel, targetDate, timing } = body || {};

    if (!schoolSlug || typeof schoolSlug !== 'string') {
      return NextResponse.json({ success: false, message: 'School selection is required.' }, { status: 400 });
    }

    const school = getPublicSchoolBySlug(schoolSlug);
    if (!school) {
      return NextResponse.json({ success: false, message: 'Selected school was not found in the directory.' }, { status: 404 });
    }

    if (!milestoneId || !milestoneLabel || !targetDate) {
      return NextResponse.json({ success: false, message: 'Valid admission milestone and date are required.' }, { status: 400 });
    }

    const result = await createAdmissionReminderAsync({
      userId: auth.id,
      userEmail: auth.email,
      schoolSlug,
      schoolName: school.name,
      milestoneId,
      milestoneLabel,
      targetDate,
      timing: timing || '3_days_before',
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || 'Failed to create reminder.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, reminder: result.reminder }, { status: 201 });
  } catch (error) {
    console.error('Error creating admission reminder:', error);
    return NextResponse.json({ success: false, message: 'Failed to create admission reminder' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { reminderId, status } = body || {};

    if (!reminderId || (status !== 'active' && status !== 'disabled')) {
      return NextResponse.json({ success: false, message: 'Invalid parameters. Status must be active or disabled.' }, { status: 400 });
    }

    const result = await updateReminderStatusAsync(auth.id, reminderId, status);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, reminder: result.reminder });
  } catch (error) {
    console.error('Error updating reminder status:', error);
    return NextResponse.json({ success: false, message: 'Failed to update reminder' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let reminderId = searchParams.get('id');

    if (!reminderId) {
      try {
        const body = await req.json();
        reminderId = body.reminderId;
      } catch {
        // Body was empty or invalid
      }
    }

    if (!reminderId) {
      return NextResponse.json({ success: false, message: 'Reminder ID is required.' }, { status: 400 });
    }

    const result = await deleteReminderAsync(auth.id, reminderId);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Reminder deleted successfully.' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete reminder' }, { status: 500 });
  }
}
