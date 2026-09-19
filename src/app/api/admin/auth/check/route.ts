import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../../lib/adminAuth';
import { sanitizeUser, getAdminEmails } from '../../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ authorized: false }, { status: 401 });
  }

  const adminEmailsList = getAdminEmails();

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
