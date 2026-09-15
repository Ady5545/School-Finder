import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserById,
  updateUserLists,
  recordActivityEvent,
  recordSchoolSave,
} from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

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

    const user = getUserById(session.sub);
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

    const user = getUserById(session.sub);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { slug, action, list } = body;

    let current = Array.isArray(user.wishlist) ? [...user.wishlist] : [];

    if (action === 'sync' && Array.isArray(list)) {
      // Validate all slugs
      const validList = list.filter((s: string) => typeof s === 'string' && getSchoolBySlug(s));
      const combined = Array.from(new Set([...current, ...validList]));
      updateUserLists(user.id, combined);
      return NextResponse.json({ success: true, wishlist: combined });
    }

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, message: 'Valid school slug required' }, { status: 400 });
    }

    const cleanSlug = slug.trim();
    // Validate canonical school existence
    if (!getSchoolBySlug(cleanSlug)) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    if (action === 'add') {
      if (!current.includes(cleanSlug)) {
        current.push(cleanSlug);
        recordActivityEvent({ type: 'wishlist_add', userId: user.id, schoolSlug: cleanSlug });
        recordSchoolSave(cleanSlug);
      }
    } else if (action === 'remove') {
      current = current.filter(s => s !== cleanSlug);
      recordActivityEvent({ type: 'wishlist_remove', userId: user.id, schoolSlug: cleanSlug });
    } else if (action === 'toggle') {
      if (current.includes(cleanSlug)) {
        current = current.filter(s => s !== cleanSlug);
        recordActivityEvent({ type: 'wishlist_remove', userId: user.id, schoolSlug: cleanSlug });
      } else {
        current.push(cleanSlug);
        recordActivityEvent({ type: 'wishlist_add', userId: user.id, schoolSlug: cleanSlug });
        recordSchoolSave(cleanSlug);
      }
    } else if (action === 'clear') {
      current = [];
    }

    updateUserLists(user.id, current);

    return NextResponse.json({
      success: true,
      wishlist: current,
    });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to update wishlist' }, { status: 500 });
  }
}
