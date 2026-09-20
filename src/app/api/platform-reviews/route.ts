import { NextRequest, NextResponse } from 'next/server';
import {
  getSanitizedSchoolRatingsAsync,
  getSchoolRatingStatsAsync,
  saveSchoolRatingAsync,
  deleteSchoolRatingAsync,
  verifySessionToken,
  getUserByIdAsync,
  getUserRatingForSchoolAsync,
} from '../../../lib/authStore';

// Platform reviews reuse the exact same storage, moderation, and anonymity
// pipeline as school reviews (see /api/schools/[slug]/ratings) rather than a
// parallel implementation - this reserved key is the "school" they're filed
// under. It can never collide with a real school slug because every real
// school slug is derived from an actual name and none produce this string.
const PLATFORM_REVIEW_KEY = '__platform__';

function getSessionUserId(req: NextRequest): string | null {
  const cookieToken = req.cookies.get('ap_session')?.value;
  const authHeader = req.headers.get('Authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || headerToken;
  if (!token) return null;
  const session = verifySessionToken(token);
  return session?.sub || null;
}

export async function GET(req: NextRequest) {
  try {
    const summary = await getSchoolRatingStatsAsync(PLATFORM_REVIEW_KEY);
    const ratings = await getSanitizedSchoolRatingsAsync(PLATFORM_REVIEW_KEY);

    let userRating = null;
    const userId = getSessionUserId(req);
    if (userId) {
      userRating = await getUserRatingForSchoolAsync(PLATFORM_REVIEW_KEY, userId);
    }

    return NextResponse.json({ success: true, summary, ratings, userRating });
  } catch (error) {
    console.error('Error fetching platform reviews:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch platform reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getSessionUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to leave a review.' },
        { status: 401 }
      );
    }

    const user = await getUserByIdAsync(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email address before submitting a review.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { score, title, comment, isAnonymous } = body;

    const numScore = Number(score);
    if (!numScore || numScore < 1 || numScore > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating score must be between 1 and 5 stars.' },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Please provide feedback of at least 5 characters.' },
        { status: 400 }
      );
    }

    const rating = await saveSchoolRatingAsync({
      schoolSlug: PLATFORM_REVIEW_KEY,
      userId: user.id,
      userName: user.name,
      score: Math.round(numScore),
      title: title ? String(title).trim().slice(0, 100) : undefined,
      comment: String(comment).trim().slice(0, 1000),
      isAnonymous: Boolean(isAnonymous),
    });

    const updatedSummary = await getSchoolRatingStatsAsync(PLATFORM_REVIEW_KEY);

    // Public list re-fetched by the client is already sanitized server-side
    // (sanitizePublicRating strips userId/email for anonymous entries) -
    // reviewer identity is retained internally regardless of the anonymous
    // display toggle, for moderation and abuse prevention. This matches what
    // the privacy policy discloses.
    return NextResponse.json({
      success: true,
      message: rating.isAnonymous
        ? 'Thank you! Your review has been published anonymously.'
        : 'Thank you! Your review has been published.',
      rating,
      summary: updatedSummary,
    });
  } catch (error) {
    console.error('Error submitting platform review:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getSessionUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await deleteSchoolRatingAsync(PLATFORM_REVIEW_KEY, userId);
    const updatedSummary = await getSchoolRatingStatsAsync(PLATFORM_REVIEW_KEY);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Your review has been removed.' : 'Review not found.',
      summary: updatedSummary,
    });
  } catch (error) {
    console.error('Error deleting platform review:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
