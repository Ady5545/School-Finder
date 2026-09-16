import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../../lib/adminAuth';
import {
  getUserById,
  sanitizeUser,
  getUserActivityTimeline,
  getUserRatings,
  updateUserStatus,
  updateUserRole,
  removeWishlistItemForUser,
  deleteParentUser,
} from '../../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../../lib/schools';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
  }

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Parent user not found' }, { status: 404 });
  }

  // Get isolated activity timeline & analytics for this specific user
  const activityData = getUserActivityTimeline(userId);

  // Get ratings authored by this user
  const reviews = getUserRatings(userId);

  // Enhance wishlist with school details
  const wishlistDetails = (user.wishlist || []).map(slug => {
    const school = getSchoolBySlug(slug);
    return {
      slug,
      name: school?.name || slug,
      sector: school?.location.sector || school?.location.area || 'Greater Noida West',
      board: school?.board ? school.board.join(', ') : 'CBSE',
      verifiedFee: school?.fees?.rangeText || school?.fees?.tuitionAnnual || `₹${school?.fees?.cardFee?.toLocaleString('en-IN') || '1,20,000'}/yr`,
    };
  });

  // Enhance viewed schools with school names
  const enhancedViews = activityData.uniqueSchoolsViewed.map(item => {
    const school = getSchoolBySlug(item.slug);
    return {
      ...item,
      schoolName: school?.name || item.slug,
      sector: school?.location.sector || school?.location.area,
    };
  });

  // Enhance reviews with school names
  const enhancedReviews = reviews.map(rev => {
    const school = getSchoolBySlug(rev.schoolSlug);
    return {
      ...rev,
      schoolName: school?.name || rev.schoolSlug,
    };
  });

  return NextResponse.json({
    success: true,
    user: sanitizeUser(user),
    engagement: activityData.summary,
    activityTimeline: activityData.timeline,
    uniqueSchoolsViewed: enhancedViews,
    searchHistory: activityData.searchHistory,
    comparisons: activityData.comparisons,
    wishlist: wishlistDetails,
    reviews: enhancedReviews,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { userId } = await params;
  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  const body = await req.json();
  const { action, status, role, removeWishlistSlug, reason } = body;

  const adminUserId = auth.user.id;

  if (action === 'update_status' || status) {
    const newStatus = status === 'disabled' ? 'disabled' : 'active';
    updateUserStatus(userId, newStatus, adminUserId, reason);
  }

  if (action === 'update_role' || role) {
    const newRole = role === 'admin' ? 'admin' : 'parent';
    updateUserRole(userId, newRole, adminUserId);
  }

  if (action === 'remove_wishlist_item' && removeWishlistSlug) {
    removeWishlistItemForUser(userId, removeWishlistSlug, adminUserId);
  }

  const updatedUser = getUserById(userId);
  return NextResponse.json({
    success: true,
    message: 'User account updated successfully',
    user: updatedUser ? sanitizeUser(updatedUser) : null,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
  }

  // Prevent self-deletion of the active admin
  if (auth.user.id === userId) {
    return NextResponse.json(
      { success: false, message: 'Security restriction: You cannot delete your own active administrator account.' },
      { status: 400 }
    );
  }

  const deleted = deleteParentUser(userId, auth.user.id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: 'User not found or could not be removed' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'User account and associated records removed successfully.',
  });
}
