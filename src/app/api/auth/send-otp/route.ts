import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOtp, checkRateLimit, getUserByEmailOrMobile } from '../../../../lib/authStore';
import { sendOtpEmail } from '../../../../lib/emailService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, identifier, name, parentName, purpose = 'register' } = body;

    const rawEmail = email || identifier;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required to receive verification code.' },
        { status: 400 }
      );
    }

    const cleanEmail = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address (e.g. parent@example.com).' },
        { status: 400 }
      );
    }

    // Rate Limiting Protection (Max 5 attempts per 10 minutes)
    const allowed = checkRateLimit(`otp_${cleanEmail}`, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many OTP requests for this email address. Please wait 10 minutes before trying again.' },
        { status: 429 }
      );
    }

    // Check existing account if purpose is register
    if (purpose === 'register') {
      const existing = getUserByEmailOrMobile(cleanEmail);
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'An account is already registered with this email address. Please sign in instead.' },
          { status: 409 }
        );
      }
    }

    // Check if account exists if purpose is login
    if (purpose === 'login') {
      const existing = getUserByEmailOrMobile(cleanEmail);
      if (!existing) {
        return NextResponse.json(
          { success: false, message: 'No registered parent account found for this email. Please create an account first.' },
          { status: 404 }
        );
      }
    }

    // Generate secure 6-digit OTP with 10-minute expiry
    const { code, expiresInSeconds } = generateAndStoreOtp(cleanEmail, purpose);

    // Send email using Nodemailer & Admission Pitara configured credentials
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp: code,
      parentName: name || parentName || 'Parent',
      purpose,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResult.error || 'Failed to dispatch verification email. Please check server email configuration.',
        },
        { status: 500 }
      );
    }

    const isProd = process.env.NODE_ENV === 'production';

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}. Please check your inbox and spam folder.`,
      email: cleanEmail,
      expiresInSeconds,
      // Only include devOtp in local development when email credentials are not yet configured
      ...(emailResult.devMode && !isProd ? { devOtp: code, isDevFallback: true } : {}),
    });
  } catch (error) {
    console.error('Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while dispatching verification email.' },
      { status: 500 }
    );
  }
}

