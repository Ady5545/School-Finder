import { NextRequest, NextResponse } from 'next/server';
import { sendAdmissionDeadlineAlertEmail } from '../../../../lib/emailService';
import { checkShortlistDeadlines } from '../../../../lib/notifications';
import { checkRateLimit, verifySessionToken } from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, parentName = 'Parent', shortlist = [] } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify mandatory session for sending alerts (prevents open relay)
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in to send deadline alerts.' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { success: false, error: 'Session expired or invalid. Please sign in again.' },
        { status: 401 }
      );
    }

    if (session.email && session.email.toLowerCase() !== cleanEmail && session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Cannot send notifications to an email address other than your verified account email.' },
        { status: 403 }
      );
    }

    // Rate Limiting Protection (Max 3 alerts per 10 minutes per email)
    const allowed = checkRateLimit(`alert_${cleanEmail}`, 3, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many alert requests for this email address. Please wait 10 minutes.' },
        { status: 429 }
      );
    }

    if (!Array.isArray(shortlist) || shortlist.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No shortlisted schools found to check deadlines.' },
        { status: 400 }
      );
    }

    const { urgentAlerts } = checkShortlistDeadlines(shortlist);

    if (urgentAlerts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'None of your shortlisted schools currently have deadlines within 7 days.',
        urgentCount: 0,
      });
    }

    // Dispatch email
    const emailResult = await sendAdmissionDeadlineAlertEmail({
      to: cleanEmail,
      parentName,
      alerts: urgentAlerts.map(a => ({
        schoolName: a.schoolName,
        slug: a.slug,
        deadlineDate: a.formattedDeadline,
        daysRemaining: a.daysRemaining,
        process: a.process,
        area: a.area,
        verifiedFee: a.verifiedFee,
      })),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to dispatch email notification.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admission alert email dispatched successfully for ${urgentAlerts.length} school(s).`,
      urgentCount: urgentAlerts.length,
      alerts: urgentAlerts,
      devMode: emailResult.devMode || false,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json(
      { success: false, error: `Internal notification error: ${errorMsg}` },
      { status: 500 }
    );
  }
}

