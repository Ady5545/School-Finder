import { NextRequest, NextResponse } from 'next/server';
import {
  recordSchoolView,
  verifySessionToken,
} from '../../../../../lib/authStore';
import { getCanonicalSlug } from '../../../../../lib/schools';

// In-memory sliding window cache to deduplicate rapid view calls (within 30 seconds)
const recentViewsCache = new Map<string, number>();

function isDuplicateView(key: string): boolean {
  const now = Date.now();
  const lastTime = recentViewsCache.get(key);
  if (lastTime && now - lastTime < 30 * 1000) {
    return true;
  }
  recentViewsCache.set(key, now);

  // Periodic pruning if cache exceeds 2000 entries
  if (recentViewsCache.size > 2000) {
    for (const [k, t] of recentViewsCache.entries()) {
      if (now - t > 60 * 1000) recentViewsCache.delete(k);
    }
  }
  return false;
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

    const canonicalSlug = getCanonicalSlug(slug);

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

    // Deduplicate rapid successive views from the same user/client IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'client';
    const dedupKey = `${userId || clientIp}:${canonicalSlug}`;
    if (isDuplicateView(dedupKey)) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    recordSchoolView(canonicalSlug, undefined, userId);

    return NextResponse.json({ success: true, duplicate: false });
  } catch (error) {
    console.error('Error logging school view:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
