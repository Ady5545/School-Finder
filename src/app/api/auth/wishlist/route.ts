import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserByIdAsync,
  updateUserListsAsync,
  recordActivityEventAsync,
  isUserSuspendedOrBanned,
} from '../../../../lib/authStore';
import { getPublicSchoolBySlugAsync } from '../../../../lib/schoolsServer';
import { getCanonicalSlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to access saved wishlist.' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { success: false, message: 'Session expired. Please sign in again.' },
        { status: 401 }
      );
    }

    const user = await getUserByIdAsync(session.sub);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const access = isUserSuspendedOrBanned(user.id);
    if (access.blocked) {
      return NextResponse.json({ success: false, message: 'This account cannot access the saved shortlist right now.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to modify your saved shortlist.' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { success: false, message: 'Session expired. Please sign in again.' },
        { status: 401 }
      );
    }

    const user = await getUserByIdAsync(session.sub);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const access = isUserSuspendedOrBanned(user.id);
    if (access.blocked) {
      return NextResponse.json({ success: false, message: 'This account cannot modify the shortlist right now.' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const action = body?.action;
    const slug = body?.slug;
    const list = body?.list;

    if (!['add', 'remove', 'toggle', 'clear', 'sync'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid shortlist action.' }, { status: 400 });
    }

    let current = Array.from(new Set(
      (Array.isArray(user.wishlist) ? user.wishlist : [])
        .map(item => getCanonicalSlug(String(item)))
        .filter(Boolean)
    ));

    const recordDelta = async (schoolSlug: string, type: 'wishlist_add' | 'wishlist_remove') => {
      await recordActivityEventAsync({
        type,
        userId: user.id,
        schoolSlug,
        targetType: 'school',
        targetId: schoolSlug,
      });
    };

    if (action === 'clear') {
      await Promise.all(current.map(schoolSlug => recordDelta(schoolSlug, 'wishlist_remove')));
      current = [];
      await updateUserListsAsync(user.id, current);
      return NextResponse.json({ success: true, wishlist: [] });
    }

    if (action === 'sync') {
      if (!Array.isArray(list)) {
        return NextResponse.json({ success: false, message: 'Shortlist sync requires a school list.' }, { status: 400 });
      }

      const requested = Array.from(new Set(
        list
          .filter((s): s is string => typeof s === 'string')
          .map(s => s.trim())
          .filter(Boolean)
      )).slice(0, 100);

      const validated = await Promise.all(
        requested.map(async s => {
          const school = await getPublicSchoolBySlugAsync(s);
          return school ? getCanonicalSlug(school.slug) : null;
        })
      );
      const validList = Array.from(new Set(validated.filter((s): s is string => Boolean(s))));
      const additions = validList.filter(s => !current.includes(s));

      await Promise.all(additions.map(schoolSlug => recordDelta(schoolSlug, 'wishlist_add')));
      current = Array.from(new Set([...current, ...validList]));
      await updateUserListsAsync(user.id, current);
      return NextResponse.json({ success: true, wishlist: current });
    }

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, message: 'Valid school slug required' }, { status: 400 });
    }

    const rawCleanSlug = slug.trim();
    const school = await getPublicSchoolBySlugAsync(rawCleanSlug);
    if (!school) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    const cleanSlug = getCanonicalSlug(school.slug);
    const exists = current.includes(cleanSlug);

    if (action === 'add') {
      if (!exists) {
        current.push(cleanSlug);
        await recordDelta(cleanSlug, 'wishlist_add');
      }
    } else if (action === 'remove') {
      if (exists) {
        current = current.filter(s => s !== cleanSlug);
        await recordDelta(cleanSlug, 'wishlist_remove');
      }
    } else if (action === 'toggle') {
      if (exists) {
        current = current.filter(s => s !== cleanSlug);
        await recordDelta(cleanSlug, 'wishlist_remove');
      } else {
        current.push(cleanSlug);
        await recordDelta(cleanSlug, 'wishlist_add');
      }
    }

    await updateUserListsAsync(user.id, current);

    return NextResponse.json({
      success: true,
      wishlist: current,
    });

  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to update wishlist' }, { status: 500 });
  }
}
