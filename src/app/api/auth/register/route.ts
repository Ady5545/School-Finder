import { NextRequest, NextResponse } from 'next/server';
import {
  createParentUser,
  checkVerificationToken,
  createSessionToken,
  sanitizeUser,
  getUserByEmail,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      preferredSchoolLocality,
      password,
      verificationToken,
      preferredBoards,
      childGrade,
      termsAccepted,
      analyticsConsent,
    } = body;

    // Validation
    if (!termsAccepted) {
      return NextResponse.json(
        { success: false, message: 'You must accept the Terms of Service and Privacy Policy to create an account.' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid Parent / Guardian name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address for account notices.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingEmail = getUserByEmail(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Email OTP Verification token check
    const verifiedEmail = verificationToken ? checkVerificationToken(verificationToken) : null;
    if (!verifiedEmail || verifiedEmail !== cleanEmail) {
      return NextResponse.json(
        { success: false, message: 'Email verification expired or missing. Please verify your email via the 6-digit OTP code.' },
        { status: 400 }
      );
    }

    // Create User
    const result = createParentUser({
      name,
      email: cleanEmail,
      preferredSchoolLocality: typeof preferredSchoolLocality === 'string' ? preferredSchoolLocality : '',
      password: typeof password === 'string' && password.length >= 6 ? password : undefined,
      preferredBoards: Array.isArray(preferredBoards) ? preferredBoards : [],
      childGrade: typeof childGrade === 'string' ? childGrade : '',
      analyticsConsent: analyticsConsent !== false,
    });

    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to create parent account.' },
        { status: 400 }
      );
    }

    const sessionToken = createSessionToken(result.user);
    const safeUser = sanitizeUser(result.user);

    const response = NextResponse.json({
      success: true,
      message: 'Parent account created successfully.',
      user: safeUser,
      token: sessionToken,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('ap_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while registering account.' },
      { status: 500 }
    );
  }
}
