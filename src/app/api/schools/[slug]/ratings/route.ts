import { NextRequest, NextResponse } from 'next/server';
import {
  getSanitizedSchoolRatingsAsync,
  getSchoolRatingStatsAsync,
  saveSchoolRatingAsync,
  deleteSchoolRatingAsync,
  verifySessionToken,
  getUserByIdAsync,
  getUserRatingForSchoolAsync,
  sanitizePublicRating,
  isUserSuspendedOrBanned,
} from '../../../../../lib/authStore';
import { getPublicSchoolBySlug, getCanonicalSlug } from '../../../../../lib/schools';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
    }

    const school = getPublicSchoolBySlug(slug);
    if (!school) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    const canonicalSlug = getCanonicalSlug(slug);
    const summary = await getSchoolRatingStatsAsync(canonicalSlug);
    const ratings = await getSanitizedSchoolRatingsAsync(canonicalSlug);

    // If user is authenticated, also return their specific rating
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    let userRating = null;
    if (token) {
      const session = verifySessionToken(token);
      if (session?.sub) {
        userRating = await getUserRatingForSchoolAsync(canonicalSlug, session.sub);
      }
    }

    return NextResponse.json({
      success: true,
      summary,
      ratings,
      userRating,
    });
  } catch (error) {
    console.error('Error fetching school ratings:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch school ratings' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
    }

    // Validate canonical school exists
    const school = getPublicSchoolBySlug(slug);
    if (!school) {
      return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
    }

    // Authenticate parent
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to rate this school.' },
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
      return NextResponse.json(
        { success: false, message: 'Parent account not found.' },
        { status: 404 }
      );
    }

    const access = isUserSuspendedOrBanned(user.id);
    if (access.blocked) {
      return NextResponse.json(
        { success: false, message: 'This account cannot submit or edit reviews right now.' },
        { status: 403 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email address before submitting a review.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { score, title, comment, categories, isAnonymous } = body;

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

    const canonicalSlug = getCanonicalSlug(slug);

    const rating = await saveSchoolRatingAsync({
      schoolSlug: canonicalSlug,
      userId: user.id,
      userName: user.name,
      userChildGrade: user.childGrade,
      score: Math.round(numScore),
      title: title ? String(title).trim().slice(0, 100) : undefined,
      comment: String(comment).trim().slice(0, 1000),
      isAnonymous: Boolean(isAnonymous),
      categories: categories && typeof categories === 'object' ? {
        academics: categories.academics ? Math.min(5, Math.max(1, Number(categories.academics))) : undefined,
        infrastructure: categories.infrastructure ? Math.min(5, Math.max(1, Number(categories.infrastructure))) : undefined,
        faculty: categories.faculty ? Math.min(5, Math.max(1, Number(categories.faculty))) : undefined,
        safety: categories.safety ? Math.min(5, Math.max(1, Number(categories.safety))) : undefined,
      } : undefined,
    });

    const updatedSummary = await getSchoolRatingStatsAsync(canonicalSlug);

    return NextResponse.json({
      success: true,
      message: rating.isAnonymous
        ? 'Thank you! Your rating has been published anonymously.'
        : 'Thank you! Your rating has been published.',
      rating: sanitizePublicRating(rating),
      summary: updatedSummary,
    });
  } catch (error) {
    console.error('Error submitting school rating:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit rating' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
    }

    const canonicalSlug = getCanonicalSlug(slug);

    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const access = isUserSuspendedOrBanned(session.sub);
    if (access.blocked) {
      return NextResponse.json(
        { success: false, message: 'This account cannot remove reviews right now.' },
        { status: 403 }
      );
    }

    const deleted = await deleteSchoolRatingAsync(canonicalSlug, session.sub);
    const updatedSummary = await getSchoolRatingStatsAsync(canonicalSlug);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Your review has been removed.' : 'Review not found.',
      summary: updatedSummary,
    });
  } catch (error) {
    console.error('Error deleting school rating:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete rating' }, { status: 500 });
  }
}
