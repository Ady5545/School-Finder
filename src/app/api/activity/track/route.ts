import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  recordSearchEventAsync,
  recordCompareEventAsync,
  checkRateLimitAsync,
  getClientIp,
} from '../../../../lib/authStore';
import { getPublicSchoolBySlugAsync } from '../../../../lib/schoolsServer';

const ALLOWED_PUBLIC_EVENTS = new Set(['search_performed', 'compare_view']);
const MAX_QUERY_LENGTH = 100;
const MAX_LOCALITY_LENGTH = 80;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!(await checkRateLimitAsync(`public_activity_${ip}`, 120, 60 * 1000))) {
      return NextResponse.json(
        { success: false, message: 'Too many telemetry requests. Please slow down.' },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid telemetry payload.' }, { status: 400 });
    }

    const { type } = body as Record<string, unknown>;
    if (typeof type !== 'string' || !ALLOWED_PUBLIC_EVENTS.has(type)) {
      return NextResponse.json({ success: false, message: 'Unsupported telemetry event.' }, { status: 400 });
    }

    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const token = cookieToken || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    let userId: string | undefined;
    if (token) {
      const session = verifySessionToken(token);
      if (session?.sub) userId = session.sub;
    }

    if (type === 'search_performed') {
      const query = typeof body.query === 'string' ? body.query.trim().slice(0, MAX_QUERY_LENGTH) : '';
      if (query.length < 2) {
        return NextResponse.json({ success: false, message: 'Search telemetry requires a valid query.' }, { status: 400 });
      }

      const locality = typeof body.locality === 'string'
        ? body.locality.trim().slice(0, MAX_LOCALITY_LENGTH) || undefined
        : undefined;
      const resultsCount = typeof body.resultsCount === 'number' && Number.isFinite(body.resultsCount)
        ? Math.max(0, Math.min(10000, Math.floor(body.resultsCount)))
        : undefined;

      await recordSearchEventAsync({ query, locality, resultsCount, userId });
      return NextResponse.json({ success: true });
    }

    const rawSlugs = Array.isArray(body.schoolSlugs) ? body.schoolSlugs : [];
    const requestedSlugs = Array.from(new Set(
      rawSlugs
        .filter((slug): slug is string => typeof slug === 'string')
        .map(slug => slug.trim())
        .filter(Boolean)
    )).slice(0, 4);

    if (requestedSlugs.length < 2) {
      return NextResponse.json({ success: false, message: 'Comparison telemetry requires at least two schools.' }, { status: 400 });
    }

    const verifiedSlugs = (await Promise.all(
      requestedSlugs.map(async slug => (await getPublicSchoolBySlugAsync(slug)) ? slug : null)
    )).filter((slug): slug is string => Boolean(slug));

    if (verifiedSlugs.length < 2) {
      return NextResponse.json({ success: false, message: 'Comparison contains an unavailable school.' }, { status: 400 });
    }

    await recordCompareEventAsync({ schoolSlugs: verifiedSlugs, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in activity tracking:', error);
    return NextResponse.json({ success: false, message: 'Telemetry could not be recorded.' }, { status: 500 });
  }
}
