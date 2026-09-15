import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpCode } from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, identifier, otp } = body;

    const rawEmail = email || identifier;

    if (!rawEmail || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email address and verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(rawEmail).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const result = verifyOtpCode(cleanEmail, cleanOtp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Verification failed.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email address successfully verified.',
      verificationToken: result.verificationToken,
      email: cleanEmail,
    });
  } catch (error) {
    console.error('Error in verify-otp API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}

