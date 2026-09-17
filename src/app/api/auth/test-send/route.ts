import { NextResponse } from 'next/server';
import { sendOtpEmail } from '../../../../lib/emailService';

export async function GET() {
  const result = await sendOtpEmail({
    to: 'knightdaygamingyt@gmail.com',
    otp: '111111',
    parentName: 'Browser Test',
    purpose: 'register',
  });
  return NextResponse.json(result);
}
