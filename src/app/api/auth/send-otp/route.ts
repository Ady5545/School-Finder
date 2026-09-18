import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOtp, checkRateLimit, getUserByEmailOrMobileAsync } from '../../../../lib/authStore';
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
        { success: false, message: 'Please enter a valid email address (e.g. name@example.com).' },
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
      const existing = await getUserByEmailOrMobileAsync(cleanEmail);
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'An account is already registered with this email address. Please sign in instead.' },
          { status: 409 }
        );
      }
    }

    // Check if account exists if purpose is login
    if (purpose === 'login') {
      const existing = await getUserByEmailOrMobileAsync(cleanEmail);
      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            notFound: true,
            email: cleanEmail,
            message: 'No registered parent account found for this email. Please create an account first.',
          },
          { status: 404 }
        );
      }
    }

    // Generate secure 6-digit OTP with 10-minute expiry
    const { code, expiresInSeconds, otpSessionToken } = generateAndStoreOtp(cleanEmail, purpose);

    // Send email using Nodemailer & Admission Pitara configured credentials
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp: code,
      parentName: name || parentName || 'Parent',
      purpose,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
    });

    if (!emailResult.success) {
      console.error('[OTP_DIAGNOSTICS] Email dispatch failed:', {
        category: emailResult.category,
        error: emailResult.error,
      });

      let status = 500;
      let userMsg = emailResult.error || "We couldn't send the verification email right now. Please try again in a moment.";

      if (emailResult.category === 'EMAIL_CONFIG_MISSING') {
        status = 530; // Custom / Service unconfigured
        userMsg = "Email verification dispatch is temporarily unavailable due to missing server SMTP credentials (EMAIL_USER / EMAIL_PASS). Please contact support.";
      } else if (emailResult.category === 'SMTP_AUTH_ERROR') {
        status = 502; // Bad Gateway
        userMsg = "Email verification dispatch failed due to an SMTP authentication error on the server. Please verify EMAIL_PASS is a valid 16-character App Password.";
      } else if (emailResult.category === 'SMTP_CONNECTION_ERROR') {
        status = 504; // Gateway Timeout / connection issue
        userMsg = "Email server connection timed out. Please try requesting a new verification code in a moment.";
      } else if (emailResult.category === 'INVALID_RECIPIENT') {
        status = 400;
        userMsg = "The email address provided was rejected as invalid by the mail server. Please check for typos.";
      }
      
      return NextResponse.json(
        {
          success: false,
          category: emailResult.category,
          message: userMsg,
        },
        { status }
      );
    }

    const isProd = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}. Please check your inbox and spam folder.`,
      email: cleanEmail,
      expiresInSeconds,
      // Only include devOtp in local development when email credentials are not yet configured
      ...(emailResult.devMode && !isProd ? { devOtp: code, isDevFallback: true } : {}),
    });

    // Set secure HTTP-only signed cookie for serverless durability across lambda instances
    response.cookies.set('ap_otp_session', otpSessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresInSeconds,
    });

    return response;
  } catch (error) {
    console.error('Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while dispatching verification email.' },
      { status: 500 }
    );
  }
}

