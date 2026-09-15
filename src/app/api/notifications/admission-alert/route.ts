import { NextRequest, NextResponse } from 'next/server';
import { sendAdmissionDeadlineAlertEmail } from '../../../../lib/emailService';
import { checkShortlistDeadlines } from '../../../../lib/notifications';

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
      to: email,
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
