import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import {
  getDashboardAnalyticsAsync,
  getAllRatingsAsync,
  getActivityEventsAsync,
  getAllUsersSanitizedAsync,
  adminDeleteRatingAsync,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req, 'analytics:view');
    if (!auth.authorized || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = auth.user;
    const analytics = await getDashboardAnalyticsAsync();
    const ratings = await getAllRatingsAsync();
    const recentActivity = await getActivityEventsAsync(100);
    const users = await getAllUsersSanitizedAsync();

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
    const auth = await requireAdminAuth(req, 'reviews:moderate');
    if (!auth.authorized || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ratingId = searchParams.get('ratingId');

    if (!ratingId) {
      return NextResponse.json({ success: false, message: 'Rating ID is required' }, { status: 400 });
    }

    const deleted = await adminDeleteRatingAsync(ratingId, auth.user.id, 'Deleted via admin dashboard');
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Rating removed by administrator.' : 'Rating not found.',
    });
  } catch (error) {
    console.error('Error in admin delete rating:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete rating' }, { status: 500 });
  }
}

