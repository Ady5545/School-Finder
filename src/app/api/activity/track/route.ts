import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  recordSearchEvent,
  recordCompareEvent,
  recordActivityEvent,
  ActivityEventType,
} from '../../../../lib/authStore';
import { getCanonicalSlug } from '../../../../lib/schools';

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const { type, query, locality, resultsCount, schoolSlugs, schoolSlug, details } = body;

    const canonicalSchoolSlug = schoolSlug ? getCanonicalSlug(String(schoolSlug)) : undefined;
    const canonicalSchoolSlugs = Array.isArray(schoolSlugs)
      ? Array.from(new Set(schoolSlugs.map((s: string) => getCanonicalSlug(String(s)))))
      : undefined;

    if (type === 'search_performed' && query) {
      recordSearchEvent({
        query: String(query).slice(0, 100),
        locality: locality ? String(locality).slice(0, 50) : undefined,
        resultsCount: typeof resultsCount === 'number' ? resultsCount : undefined,
        userId,
      });
    } else if (type === 'compare_view' && Array.isArray(canonicalSchoolSlugs)) {
      recordCompareEvent({
        schoolSlugs: canonicalSchoolSlugs.slice(0, 4),
        userId,
      });
    } else if (type && typeof type === 'string') {
      recordActivityEvent({
        type: type as ActivityEventType,
        userId,
        schoolSlug: canonicalSchoolSlug,
        locality: locality ? String(locality) : undefined,
        searchQuery: query ? String(query) : undefined,
        details: typeof details === 'object' ? details : undefined,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in activity tracking:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
