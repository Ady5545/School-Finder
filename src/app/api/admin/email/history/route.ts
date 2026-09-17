import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../../lib/adminAuth';
import { getEmailCampaigns } from '../../../../../lib/authStore';
import { getEmailCredentials } from '../../../../../lib/emailService';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const campaigns = getEmailCampaigns();
  const smtpCreds = getEmailCredentials();

  return NextResponse.json({
    success: true,
    campaigns,
    smtpConfigured: smtpCreds.hasUser && smtpCreds.hasPass,
    smtpHost: smtpCreds.smtpHost,
    smtpPort: smtpCreds.smtpPort,
    smtpUserMasked: smtpCreds.emailUser ? smtpCreds.emailUser.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'Not Configured',
  });
}
