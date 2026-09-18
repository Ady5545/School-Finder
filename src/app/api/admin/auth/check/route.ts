import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../../lib/adminAuth';
import { sanitizeUser } from '../../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ authorized: false }, { status: 401 });
  }

  const rawAdminEmails = process.env.ADMIN_EMAILS || 'admin@admissionpitara.com';
  const adminEmailsList = rawAdminEmails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  return NextResponse.json({
    authorized: true,
    user: sanitizeUser(auth.user),
    configuredAdminEmailsCount: adminEmailsList.length,
    environment: {
      smtpConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      jwtConfigured: !!process.env.JWT_SECRET,
    },
  });
}
