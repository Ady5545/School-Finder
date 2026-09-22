import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimitAsync, getClientIp, verifySessionToken, getUserByIdAsync, createSchoolSubmissionAsync, recordActivityEvent } from '@/lib/authStore';
import { sendPublicEnquiryEmail } from '@/lib/emailService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      schoolSlug,
      schoolName,
      formType = 'admission_registration',
      academicSession = '2027–28',
      parentName,
      email,
      phone,
      childGrade,
      residentialSociety,
      consent,
    } = body;

    // Validate required fields
    if (!parentName || typeof parentName !== 'string' || !parentName.trim()) {
      return NextResponse.json({ success: false, message: 'Parent / Guardian name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'A valid email address is required.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ success: false, message: 'A valid mobile number is required.' }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ success: false, message: 'Please provide a valid 10-digit mobile number.' }, { status: 400 });
    }

    if (!childGrade || typeof childGrade !== 'string') {
      return NextResponse.json({ success: false, message: "Child's grade / class is required." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ success: false, message: 'Consent is required to submit this request.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanParentName = parentName.trim();
    const cleanSchoolName = (schoolName || 'Target School').trim();
    const cleanSchoolSlug = (schoolSlug || '').trim();
    const isPreReg = formType === 'admission_preregistration';
    const cleanType = isPreReg ? 'admission_preregistration' : 'admission_registration';

    // Rate Limiting Protection (Max 5 submissions per 10 minutes per IP/Email)
    const ip = getClientIp(req);
    const rateKey = `adm_reg_${cleanEmail}_${ip}`;
    if (!(await checkRateLimitAsync(rateKey, 5, 10 * 60 * 1000))) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions received. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // Optional user session correlation
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;
    let userId: string | undefined = undefined;
    let profileSociety = '';

    if (token) {
      const session = verifySessionToken(token);
      if (session) {
        userId = session.sub;
        const profileUser = await getUserByIdAsync(session.sub);
        profileSociety = String(profileUser?.residentialSociety || '').trim();
      }
    }

    // For logged-in parents, the saved profile society is authoritative.
    // Do not depend on the public form sending this private profile field.
    const cleanResidentialSociety = profileSociety || (typeof residentialSociety === 'string' ? residentialSociety.trim() : '');

    // Create Submission Record
    const title = isPreReg
      ? `Pre-Registration for ${cleanSchoolName} (${academicSession})`
      : `Admission Pitara Registration for ${cleanSchoolName} (${academicSession})`;

    const description = `Parent: ${cleanParentName} | Email: ${cleanEmail} | Phone: ${cleanPhone} | Target Grade: ${childGrade} | Society: ${residentialSociety || 'Not specified'} | Session: ${academicSession}`;

    const submission = await createSchoolSubmissionAsync({
      type: cleanType,
      schoolName: cleanSchoolName,
      schoolSlug: cleanSchoolSlug,
      submitterName: cleanParentName,
      submitterEmail: cleanEmail,
      submitterPhone: cleanPhone,
      submitterRole: 'parent',
      title,
      description,
      academicSession,
      childGrade,
      residentialSociety: cleanResidentialSociety || undefined,
      consent: true,
      userId,
      sourceReference: isPreReg ? 'Admission Pitara Pre-Registration' : 'Admission Pitara Registration',
    });

    const enquiryText = [
      isPreReg ? 'NEW PRE-REGISTRATION REQUEST' : 'NEW ADMISSION REGISTRATION REQUEST',
      '',
      `Parent / Guardian: ${cleanParentName}`,
      `Email: ${cleanEmail}`,
      `Phone: ${cleanPhone}`,
      `Child Grade: ${childGrade}`,
      `Residential Society: ${residentialSociety || 'Not specified'}`,
      `School: ${cleanSchoolName}`,
      `School Slug: ${cleanSchoolSlug || 'Not provided'}`,
      `Academic Session: ${academicSession}`,
      `Submission ID: ${submission.id}`,
      '',
      'Submitted through the Admission Pitara website.',
    ].join('\\n');

    const emailDelivery = await sendPublicEnquiryEmail({
      subject: `${isPreReg ? 'Pre-registration' : 'Admission registration'} interest — ${cleanSchoolName} — ${academicSession}`,
      text: enquiryText,
      replyTo: cleanEmail,
    });

    if (!emailDelivery.success) {
      return NextResponse.json(
        { success: false, message: 'Your form was recorded, but we could not deliver the notification email. Please try again shortly.' },
        { status: 503 }
      );
    }

    // Log Activity Event for Admin Dashboard Analytics
    try {
      recordActivityEvent({
        type: isPreReg ? 'admission_preregistration' : 'admission_registration',
        userId,
        targetType: 'school',
        targetId: cleanSchoolSlug,
        schoolSlug: cleanSchoolSlug,
        locality: cleanResidentialSociety || undefined,
        details: {
          childGrade,
          academicSession,
          submissionId: submission.id,
          parentName: cleanParentName,
          email: cleanEmail,
        },
      });
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json({
      success: true,
      leadId: submission.id,
      message: isPreReg
        ? `Pre-registration for ${cleanSchoolName} successfully recorded.`
        : `Registration for ${cleanSchoolName} successfully recorded.`,
      disclaimer: 'This registration is recorded on Admission Pitara. Official admission evaluation and enrollment are conducted directly by the school.',
    });
  } catch (error) {
    console.error('Error processing admission registration:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred while recording your registration.' },
      { status: 500 }
    );
  }
}
