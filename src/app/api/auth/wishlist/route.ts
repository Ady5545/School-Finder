import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserByIdAsync,
  updateUserListsAsync,
  recordActivityEvent,
  recordSchoolSave,
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

    const body = await req.json();
    const { slug, action, list } = body;

    let current = Array.isArray(user.wishlist) ? [...user.wishlist] : [];

    if (action === 'clear') {
      current = [];
      await updateUserListsAsync(user.id, current);
      return NextResponse.json({
        success: true,
        wishlist: [],
      });
    }

    if (action === 'sync' && Array.isArray(list)) {
      // Validate all slugs and convert to canonical slugs
      const validated = await Promise.all(
        list
          .filter((s: string) => typeof s === 'string')
          .map(async (s: string) => (await getPublicSchoolBySlugAsync(s)) ? s : null),
      );
      const validList = validated
        .filter((s): s is string => Boolean(s))
        .map((s: string) => getCanonicalSlug(s));
      const combined = Array.from(new Set([...current.map(s => getCanonicalSlug(s)), ...validList]));
      await updateUserListsAsync(user.id, combined);
      return NextResponse.json({ success: true, wishlist: combined });
    }

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, message: 'Valid school slug required' }, { status: 400 });
    }

    const rawCleanSlug = slug.trim();
    // Validate school existence
    if (!(await getPublicSchoolBySlugAsync(rawCleanSlug))) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    // Always resolve to canonical slug so aliases do not create duplicate identities
    const cleanSlug = getCanonicalSlug(rawCleanSlug);

    if (action === 'add') {
      if (!current.includes(cleanSlug)) {
        current.push(cleanSlug);
        recordActivityEvent({ type: 'wishlist_add', userId: user.id, schoolSlug: cleanSlug });
      }
    } else if (action === 'remove') {
      current = current.filter(s => s !== cleanSlug && s !== rawCleanSlug);
      recordActivityEvent({ type: 'wishlist_remove', userId: user.id, schoolSlug: cleanSlug });
    } else if (action === 'toggle') {
      if (current.includes(cleanSlug) || current.includes(rawCleanSlug)) {
        current = current.filter(s => s !== cleanSlug && s !== rawCleanSlug);
        recordActivityEvent({ type: 'wishlist_remove', userId: user.id, schoolSlug: cleanSlug });
      } else {
        current.push(cleanSlug);
        recordActivityEvent({ type: 'wishlist_add', userId: user.id, schoolSlug: cleanSlug });
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
