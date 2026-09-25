import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getAllSubmissionsAsync, createSchoolSubmissionAsync } from '@/lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'schools:read');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const submissions = await getAllSubmissionsAsync();
  return NextResponse.json({
    success: true,
    submissions,
    total: submissions.length,
    newCount: submissions.filter((s) => s.status === 'new').length,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const submission = await createSchoolSubmissionAsync(body);
    return NextResponse.json({
      success: true,
      submission,
      message: 'Submission successfully recorded.',
    });
  } catch (error) {
    console.error('Error logging submission:', error);
    return NextResponse.json({ success: false, message: 'Failed to record submission.' }, { status: 500 });
  }
}
