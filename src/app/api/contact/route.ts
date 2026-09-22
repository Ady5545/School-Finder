import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimitAsync, getClientIp } from '@/lib/authStore';
import { sendPublicEnquiryEmail } from '@/lib/emailService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : '';
    const inquiryType = typeof body.inquiryType === 'string' ? body.inquiryType.trim().slice(0, 80) : 'parent';
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 180) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';

    if (!name || !email || !email.includes('@') || !message) {
      return NextResponse.json({ success: false, message: 'Please provide your name, a valid email address, and your message.' }, { status: 400 });
    }

    const ip = getClientIp(req);
    if (!(await checkRateLimitAsync(`public_contact_${email}_${ip}`, 5, 10 * 60 * 1000))) {
      return NextResponse.json({ success: false, message: 'Too many messages received. Please wait a few minutes before trying again.' }, { status: 429 });
    }

    const cleanSubject = subject || 'Admission Pitara enquiry';
    const text = [
      'NEW ADMISSION PITARA WEBSITE ENQUIRY',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Category: ${inquiryType}`,
      `Subject: ${cleanSubject}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const delivery = await sendPublicEnquiryEmail({
      subject: `[Website ${inquiryType.toUpperCase()}] ${cleanSubject}`,
      text,
      replyTo: email,
    });

    if (!delivery.success) {
      return NextResponse.json({ success: false, message: 'We could not deliver your message right now. Please try again shortly.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, message: 'Your message was sent directly to Admission Pitara.' });
  } catch (error) {
    console.error('Error processing public enquiry:', error);
    return NextResponse.json({ success: false, message: 'Unable to send your message right now.' }, { status: 500 });
  }
}
