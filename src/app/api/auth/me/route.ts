import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserById, sanitizeUser } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    // Check Authorization header or Cookie
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ap_session')?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = getUserById(payload.sub);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Error in me API:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
