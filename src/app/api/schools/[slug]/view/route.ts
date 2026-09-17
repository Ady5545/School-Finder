import { NextRequest, NextResponse } from 'next/server';
import {
  recordSchoolView,
  recordActivityEvent,
  verifySessionToken,
} from '../../../../../lib/authStore';
import { getCanonicalSlug } from '../../../../../lib/schools';

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

    recordSchoolView(canonicalSlug, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging school view:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
