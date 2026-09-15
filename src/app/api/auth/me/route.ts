import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserById,
  sanitizeUser,
  updateUserProfile,
  deleteParentUser,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
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

    let user = getUserById(payload.sub);
    if (!user && payload.sub && payload.email) {
      // Reconstruct user from cryptographically verified session token for serverless resilience
      user = {
        id: payload.sub,
        name: payload.name || 'Parent',
        email: payload.email,
        preferredSchoolLocality: payload.preferredSchoolLocality || 'Greater Noida West',
        emailVerified: true,
        analyticsConsent: true,
        role: payload.role || 'parent',
        createdAt: new Date().toISOString(),
        wishlist: [],
        compareList: [],
      };
    }

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Error in me API GET:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ap_session')?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const body = await req.json();
    const updatedUser = updateUserProfile(payload.sub, body);

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('Error in me API PATCH:', error);
    return NextResponse.json({ success: false, message: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ap_session')?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const deleted = deleteParentUser(payload.sub);
    const response = NextResponse.json({
      success: deleted,
      message: deleted ? 'Account and associated data removed.' : 'User not found',
    });

    response.cookies.delete('ap_session');
    return response;
  } catch (error) {
    console.error('Error in me API DELETE:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete account' }, { status: 500 });
  }
}
