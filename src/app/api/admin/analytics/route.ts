import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserById,
  getDashboardAnalytics,
  getAllRatings,
  getActivityEvents,
  getAllUsersSanitized,
  adminDeleteRating,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Administrative authentication required.' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired administrative session.' },
        { status: 401 }
      );
    }

    const user = getUserById(session.sub);
    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@admissionpitara.com')
      .split(',')
      .map(e => e.trim().toLowerCase());

    const isAdmin = user?.role === 'admin' || (user?.email && adminEmails.includes(user.email.toLowerCase()));

    if (!user || !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Admin privileges required.' },
        { status: 403 }
      );
    }

    const analytics = getDashboardAnalytics();
    const ratings = getAllRatings();
    const recentActivity = getActivityEvents(100);
    const users = getAllUsersSanitized();

    return NextResponse.json({
      success: true,
      analytics,
      ratings,
      recentActivity,
      users,
      adminUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'admin',
      },
    });
  } catch (error) {
    console.error('Error in admin analytics route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while fetching analytics.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Administrative authentication required.' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired administrative session.' },
        { status: 401 }
      );
    }

    const user = getUserById(session.sub);
    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@admissionpitara.com')
      .split(',')
      .map(e => e.trim().toLowerCase());

    const isAdmin = user?.role === 'admin' || (user?.email && adminEmails.includes(user.email.toLowerCase()));

    if (!user || !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Admin privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const ratingId = searchParams.get('ratingId');

    if (!ratingId) {
      return NextResponse.json({ success: false, message: 'Rating ID is required' }, { status: 400 });
    }

    const deleted = adminDeleteRating(ratingId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Rating removed by administrator.' : 'Rating not found.',
    });
  } catch (error) {
    console.error('Error in admin delete rating:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete rating' }, { status: 500 });
  }
}
