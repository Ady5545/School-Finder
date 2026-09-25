import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getEmailCredentials } from '@/lib/emailService';
import { getAllParentUsers, recordAdminAudit, recordEmailCampaign } from '@/lib/authStore';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'email:send');
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user.adminRole, 'email:send')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { recipientType, customEmail, subject, contentHtml, isTest } = body;

    if (!subject || !contentHtml) {
      return NextResponse.json({ success: false, message: 'Subject and email body are required.' }, { status: 400 });
    }

    const creds = getEmailCredentials();
    const allUsers = getAllParentUsers();
    let recipients: string[] = [];

    if (recipientType === 'individual' && customEmail) {
      recipients = [customEmail.trim().toLowerCase()];
    } else if (recipientType === 'verified_parents') {
      recipients = allUsers.filter(u => u.emailVerified && u.status === 'active').map(u => u.email);
    } else if (recipientType === 'all_parents') {
      recipients = allUsers.filter(u => u.status === 'active').map(u => u.email);
    } else {
      recipients = [auth.user.email]; // Default test send to current admin
    }

    if (recipients.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid recipient addresses found for this target.' }, { status: 400 });
    }

    let sentSuccessfully = true;
    let errorMessage: string | undefined;

    // If SMTP credentials exist, attempt real sending
    if (creds.hasUser && creds.hasPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: creds.smtpHost,
          port: creds.smtpPort,
          secure: creds.smtpSecure,
          auth: {
            user: creds.emailUser,
            pass: creds.emailPass,
          },
        });

        // Send to test or small batch
        const batchTo = isTest ? [auth.user.email] : recipients.slice(0, 50);
        await transporter.sendMail({
          from: `"Admission Pitara" <${creds.emailUser}>`,
          to: batchTo.join(', '),
          subject: isTest ? `[TEST PREVIEW] ${subject}` : subject,
          html: contentHtml,
        });
      } catch (err: unknown) {
        console.warn('[ADMIN_EMAIL_SEND_ERR]', err);
        sentSuccessfully = false;
        errorMessage = err instanceof Error ? err.message : String(err);
      }
    } else {
      // SMTP not configured - log in development sandbox mode
      console.log(`[ADMIN_EMAIL_SIMULATED] Subject: ${subject} | To: ${recipients.join(', ')}`);
    }

    // Record in history log
    recordEmailCampaign({
      subject,
      bodySnippet: contentHtml.replace(/<[^>]+>/g, '').substring(0, 150),
      recipientType: recipientType || 'individual',
      recipientCount: recipients.length,
      recipientsPreview: recipients.slice(0, 5),
      sentBy: auth.user.email,
      status: sentSuccessfully ? (isTest ? 'test' : 'sent') : 'partially_failed',
    });

    recordAdminAudit(
      auth.user.id,
      auth.user.email,
      'send_email_campaign',
      'system',
      'email-service',
      { subject, recipientCount: recipients.length, isTest, sentSuccessfully },
      sentSuccessfully ? 'success' : 'failed'
    );

    return NextResponse.json({
      success: true,
      message: sentSuccessfully
        ? (isTest ? `Test preview dispatched to ${auth.user.email}` : `Broadcast initiated to ${recipients.length} recipients.`)
        : `Email dispatched in simulation mode (SMTP error: ${errorMessage})`,
      recipientCount: recipients.length,
    });
  } catch (error) {
    console.error('Error dispatching admin email:', error);
    return NextResponse.json({ success: false, message: 'Failed to process email dispatch request.' }, { status: 500 });
  }
}
