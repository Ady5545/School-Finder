import { NextRequest, NextResponse } from 'next/server';
import {
  getUserByEmailOrMobile,
  verifyPassword,
  createSessionToken,
  sanitizeUser,
  verifyOtpCode,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, identifier, password, mobile, otp, loginType = 'password' } = body;

    if (loginType === 'otp') {
      const emailOrMobile = email || identifier || mobile;
      if (!emailOrMobile || !otp) {
        return NextResponse.json(
          { success: false, message: 'Email address and verification code are required for OTP sign in.' },
          { status: 400 }
        );
      }

      const cleanIdentifier = String(emailOrMobile).trim().toLowerCase();
      const user = getUserByEmailOrMobile(cleanIdentifier);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'No registered parent account found with this email. Please create an account first.' },
          { status: 404 }
        );
      }

      const verifyResult = verifyOtpCode(cleanIdentifier, otp);
      if (!verifyResult.success) {
        return NextResponse.json(
          { success: false, message: verifyResult.error || 'Invalid verification code.' },
          { status: 400 }
        );
      }

      const token = createSessionToken(user);
      const response = NextResponse.json({
        success: true,
        message: 'Signed in successfully.',
        user: sanitizeUser(user),
        token,
      });

      response.cookies.set('ap_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // Password Sign In
    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/Mobile and password are required.' },
        { status: 400 }
      );
    }

    const user = getUserByEmailOrMobile(identifier);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid login credentials. Please verify your email or mobile.' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      user: sanitizeUser(user),
      token,
    });

    response.cookies.set('ap_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while logging in.' },
      { status: 500 }
    );
  }
}
