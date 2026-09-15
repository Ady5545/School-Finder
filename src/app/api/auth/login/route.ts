import { NextRequest, NextResponse } from 'next/server';
import {
  getUserByEmail,
  verifyPassword,
  createSessionToken,
  sanitizeUser,
  verifyOtpCode,
  recordActivityEvent,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, identifier, password, otp, loginType = 'password' } = body;

    const emailToUse = (email || identifier || '').trim().toLowerCase();

    if (!emailToUse) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(emailToUse);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          notFound: true,
          email: emailToUse,
          message: 'No registered parent account found with this email. Please sign up.',
        },
        { status: 401 }
      );
    }

    if (loginType === 'otp') {
      if (!otp) {
        return NextResponse.json(
          { success: false, message: 'Verification code is required for OTP sign in.' },
          { status: 400 }
        );
      }

      const verifyResult = verifyOtpCode(emailToUse, otp);
      if (!verifyResult.success) {
        return NextResponse.json(
          { success: false, message: verifyResult.error || 'Invalid verification code.' },
          { status: 400 }
        );
      }
    } else {
      // Password Sign In
      if (!password) {
        return NextResponse.json(
          { success: false, message: 'Password is required.' },
          { status: 400 }
        );
      }

      if (!user.passwordHash) {
        return NextResponse.json(
          { success: false, message: 'This account was set up via email OTP. Please sign in using OTP code.' },
          { status: 400 }
        );
      }

      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid password. Please check your password and try again.' },
          { status: 401 }
        );
      }
    }

    user.lastLoginAt = new Date().toISOString();
    user.lastActivityAt = user.lastLoginAt;

    recordActivityEvent({
      type: 'user_login',
      userId: user.id,
      locality: user.preferredSchoolLocality,
    });

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
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
