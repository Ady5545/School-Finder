import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({
    smtpHost: process.env.SMTP_HOST || 'not-set',
    smtpPort: process.env.SMTP_PORT || 'not-set',
    hasSmtpUser: !!process.env.SMTP_USER,
    hasSmtpPass: !!process.env.SMTP_PASS,
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    nodeEnv: process.env.NODE_ENV,
  });
}
