import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import {
  getAllRatingsAsync,
  adminDeleteRatingAsync,
  adminRestoreRatingAsync,
  getAllUsersSanitizedAsync,
} from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const schoolSlug = searchParams.get('schoolSlug');
  const userId = searchParams.get('userId');
  const star = searchParams.get('star');
  const search = (searchParams.get('q') || '').toLowerCase().trim();
  const includeDeleted = searchParams.get('includeDeleted') === 'true';

  let ratings = await getAllRatingsAsync(includeDeleted);

  if (schoolSlug) {
    ratings = ratings.filter(r => r.schoolSlug === schoolSlug);
  }
  if (userId) {
    ratings = ratings.filter(r => r.userId === userId);
  }
  if (star) {
    const starNum = parseInt(star, 10);
    if (!isNaN(starNum)) {
      ratings = ratings.filter(r => Math.round(r.score) === starNum);
    }
  }
  if (search) {
    ratings = ratings.filter(r =>
      r.comment.toLowerCase().includes(search) ||
      (r.title && r.title.toLowerCase().includes(search)) ||
      r.userName.toLowerCase().includes(search) ||
      r.schoolSlug.toLowerCase().includes(search)
    );
  }

  // Enrich all reviews from one user lookup instead of an N+1 query.
  const users = await getAllUsersSanitizedAsync();
  const usersById = new Map(users.map(user => [user.id, user]));

  const enriched = ratings.map(r => {
    const school = getSchoolBySlug(r.schoolSlug);
    const user = usersById.get(r.userId);
    return {
      ...r,
      schoolName: school?.name || (r.schoolSlug === '__platform__' ? 'Admission Pitara (platform review)' : r.schoolSlug),
      userEmail: user?.email || '',
      userStatus: user?.status || 'active',
    };
  });

  return NextResponse.json({
    success: true,
    reviews: enriched,
    total: enriched.length,
  });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get('id');
  const reason = searchParams.get('reason') || 'Removed by platform administrator';

  if (!reviewId) {
    return NextResponse.json({ success: false, message: 'Review ID required' }, { status: 400 });
  }

  const deleted = await adminDeleteRatingAsync(reviewId, auth.user.id, reason);
  if (!deleted) {
    return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Review removed successfully and school aggregates recalculated.',
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'reviews:moderate');
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const { reviewId, action, reason } = body;

  if (!reviewId) {
    return NextResponse.json({ success: false, message: 'Review ID required' }, { status: 400 });
  }

  if (action === 'restore') {
    const restored = await adminRestoreRatingAsync(reviewId, auth.user.id);
    if (!restored) {
      return NextResponse.json({ success: false, message: 'Review not found or could not be restored' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Review restored successfully and school aggregates updated.',
    });
  }

  if (action === 'delete') {
    const deleted = await adminDeleteRatingAsync(reviewId, auth.user.id, reason || 'Removed by moderator');
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Review hidden/removed successfully.',
    });
  }

  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
}
