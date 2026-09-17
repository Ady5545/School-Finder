import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import {
  getDashboardAnalytics,
  getAllRatings,
  getActivityEvents,
  getAllUsersSanitized,
  adminDeleteRating,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdminAuth(req);
    if (!auth.authorized || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = auth.user;
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
    const auth = requireAdminAuth(req);
    if (!auth.authorized || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
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

