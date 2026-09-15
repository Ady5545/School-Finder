import { NextRequest, NextResponse } from 'next/server';
import {
  createParentUser,
  checkVerificationToken,
  createSessionToken,
  sanitizeUser,
  getUserByEmailOrMobile,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      mobile,
      email,
      locality,
      password,
      verificationToken,
      preferredBoards,
      childGrade,
      termsAccepted,
      marketingConsent,
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

    if (!locality || typeof locality !== 'string' || locality.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please select your Sector / Locality in Greater Noida.' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address for account notices.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Verify Email & Token
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile ? String(mobile).replace(/\D/g, '').slice(-10) : '';

    if (cleanMobile && (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile))) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 10-digit mobile number starting with 6, 7, 8, or 9.' },
        { status: 400 }
      );
    }

    const verifiedIdentifier = verificationToken ? checkVerificationToken(verificationToken) : null;

    if (!verifiedIdentifier || (verifiedIdentifier !== cleanEmail && verifiedIdentifier !== cleanMobile)) {
      return NextResponse.json(
        { success: false, message: 'Email verification expired or invalid. Please verify your email address again.' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingEmail = getUserByEmailOrMobile(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Create User
    const result = createParentUser({
      name,
      mobile: cleanMobile,
      email: cleanEmail,
      locality,
      password,
      preferredBoards: Array.isArray(preferredBoards) ? preferredBoards : [],
      childGrade: typeof childGrade === 'string' ? childGrade : '',
      marketingConsent: Boolean(marketingConsent),
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
