import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getEmailCredentials } from '@/lib/emailService';
import { getAllParentUsersAsync, recordAdminAudit, recordEmailCampaign } from '@/lib/authStore';
import nodemailer from 'nodemailer';

const SIMPLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_BATCH_SIZE = 50;

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'email:send');
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'email:send')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid email payload.' }, { status: 400 });
    }
    const { recipientType, customEmail, subject, contentHtml, isTest } = body as Record<string, unknown>;
    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    const cleanHtml = typeof contentHtml === 'string' ? contentHtml.trim() : '';
    if (!cleanSubject || !cleanHtml) {
      return NextResponse.json({ success: false, message: 'Subject and email body are required.' }, { status: 400 });
    }

    const allowedRecipientTypes = new Set(['individual', 'verified_parents', 'all_parents']);
    const selectedRecipientType = typeof recipientType === 'string' ? recipientType : 'individual';
    if (!allowedRecipientTypes.has(selectedRecipientType)) {
      return NextResponse.json({ success: false, message: 'Invalid recipient type.' }, { status: 400 });
    }

    const allUsers = await getAllParentUsersAsync();
    let recipients: string[];
    if (selectedRecipientType === 'individual') {
      const candidate = typeof customEmail === 'string' ? customEmail.trim().toLowerCase() : '';
      if (!SIMPLE_EMAIL_RE.test(candidate)) {
        return NextResponse.json({ success: false, message: 'Enter a valid recipient email address.' }, { status: 400 });
      }
      recipients = [candidate];
    } else if (selectedRecipientType === 'verified_parents') {
      recipients = allUsers.filter(u => u.emailVerified && u.status === 'active')
        .map(u => u.email.trim().toLowerCase()).filter(email => SIMPLE_EMAIL_RE.test(email));
    } else {
      recipients = allUsers.filter(u => u.status === 'active')
        .map(u => u.email.trim().toLowerCase()).filter(email => SIMPLE_EMAIL_RE.test(email));
    }
    recipients = Array.from(new Set(recipients));
    if (recipients.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid recipient addresses found for this target.' }, { status: 400 });
    }

    const creds = getEmailCredentials();
    if (!creds.hasUser || !creds.hasPass) {
      if (process.env.NODE_ENV === 'production') {
        recordAdminAudit(auth.user.id, auth.user.email, 'send_email_campaign', 'system', 'email-service',
          { subject: cleanSubject, recipientCount: recipients.length, isTest, sentSuccessfully: false, reason: 'SMTP not configured' }, 'failed');
        return NextResponse.json(
          { success: false, message: 'Email service is not configured in production. Configure SMTP credentials before sending.' },
          { status: 503 }
        );
      }
      recordAdminAudit(auth.user.id, auth.user.email, 'send_email_campaign', 'system', 'email-service',
        { subject: cleanSubject, recipientCount: recipients.length, isTest, simulated: true }, 'success');
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Email send simulated in development; no SMTP message was delivered.',
        recipientCount: isTest ? 1 : recipients.length,
      });
    }

    const transporter = nodemailer.createTransport({
      host: creds.smtpHost,
      port: creds.smtpPort,
      secure: creds.smtpSecure,
      auth: { user: creds.emailUser, pass: creds.emailPass },
    });
    const targetRecipients = isTest ? [auth.user.email] : recipients;
    let sentCount = 0;
    let failedCount = 0;
    let firstError = '';

    for (let i = 0; i < targetRecipients.length; i += EMAIL_BATCH_SIZE) {
      const batch = targetRecipients.slice(i, i + EMAIL_BATCH_SIZE);
      try {
        await transporter.sendMail({
          from: `"Admission Pitara" <${creds.emailUser}>`,
          to: batch.join(', '),
          subject: isTest ? `[TEST PREVIEW] ${cleanSubject}` : cleanSubject,
          html: cleanHtml,
        });
        sentCount += batch.length;
      } catch (err: unknown) {
        failedCount += batch.length;
        if (!firstError) firstError = err instanceof Error ? err.message : String(err);
      }
    }

    const fullySuccessful = failedCount === 0;
    recordEmailCampaign({
      subject: cleanSubject,
      bodySnippet: cleanHtml.replace(/<[^>]+>/g, '').substring(0, 150),
      recipientType: selectedRecipientType,
      recipientCount: targetRecipients.length,
      recipientsPreview: targetRecipients.slice(0, 5),
      sentBy: auth.user.email,
      status: fullySuccessful ? (isTest ? 'test' : 'sent') : 'partially_failed',
    });
    recordAdminAudit(auth.user.id, auth.user.email, 'send_email_campaign', 'system', 'email-service',
      { subject: cleanSubject, recipientCount: targetRecipients.length, sentCount, failedCount, isTest, sentSuccessfully: fullySuccessful },
      fullySuccessful ? 'success' : 'failed');

    if (!fullySuccessful) {
      return NextResponse.json({
        success: false,
        message: `Email delivery partially failed: ${sentCount}/${targetRecipients.length} recipients accepted. ${firstError ? `First SMTP error: ${firstError}` : ''}`.trim(),
        recipientCount: targetRecipients.length,
        sentCount,
        failedCount,
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: isTest ? `Test email delivered to ${auth.user.email}.` : `Email campaign delivered to ${sentCount} recipients.`,
      recipientCount: targetRecipients.length,
      sentCount,
    });
  } catch (error) {
    console.error('Error dispatching admin email:', error);
    return NextResponse.json({ success: false, message: 'Failed to process email dispatch request.' }, { status: 500 });
  }
}
