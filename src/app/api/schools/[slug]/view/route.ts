import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  recordActivityEventAsync,
  verifySessionToken,
} from '../../../../../lib/authStore';
import { getPublicSchoolBySlugAsync } from '../../../../../lib/schoolsServer';

// In-memory sliding window cache to deduplicate rapid view calls (within 30 seconds)
const recentViewsCache = new Map<string, number>();

function isDuplicateView(key: string): boolean {
  const lastTime = recentViewsCache.get(key);
  return Boolean(lastTime && Date.now() - lastTime < 30 * 1000);
}

function markViewRecorded(key: string): void {
  const now = Date.now();
  recentViewsCache.set(key, now);

  // Periodic pruning if cache exceeds 2000 entries.
  if (recentViewsCache.size > 2000) {
    for (const [k, t] of recentViewsCache.entries()) {
      if (now - t > 60 * 1000) recentViewsCache.delete(k);
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const school = await getPublicSchoolBySlugAsync(slug);
    if (!school) {
      return NextResponse.json({ success: false, message: 'School not found.' }, { status: 404 });
    }
    const canonicalSlug = school.slug;

    // Optional user activity tracking
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const token = cookieToken || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    let userId: string | undefined = undefined;
    if (token) {
      const session = verifySessionToken(token);
      if (session?.sub) {
        userId = session.sub;
      }
    }

    // Use a stable pseudonymous visitor cookie for anonymous analytics. Falling back to
    // the client IP alone can incorrectly merge different visitors behind the same network.
    const existingVisitorId = req.cookies.get('ap_visitor_id')?.value;
    const visitorId = existingVisitorId || randomUUID();
    const dedupKey = (userId || visitorId) + ':' + canonicalSlug;
    if (isDuplicateView(dedupKey)) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    // Await persistence: on serverless hosts a fire-and-forget Mongo write can be
    // interrupted as soon as the HTTP response finishes, silently losing views.
    await recordActivityEventAsync({
      type: 'school_view',
      schoolSlug: canonicalSlug,
      targetType: 'school',
      targetId: canonicalSlug,
      userId,
      visitorId: userId ? undefined : visitorId,
      failOnMongoError: true,
    });

    // Only deduplicate after durable persistence succeeds; a failed write can retry immediately.
    markViewRecorded(dedupKey);

    const response = NextResponse.json({ success: true, duplicate: false });
    if (!existingVisitorId) {
      response.cookies.set('ap_visitor_id', visitorId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    console.error('Error logging school view:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
