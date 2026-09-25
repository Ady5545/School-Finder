import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { updateSubmissionStatusAsync, recordAdminAudit } from '@/lib/authStore';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(req, 'schools:write');
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Submission ID required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status, adminNotes, assignedAdmin } = body;

    const updated = await updateSubmissionStatusAsync(id, status, adminNotes, assignedAdmin || auth.user.email);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    recordAdminAudit(
      auth.user.id,
      auth.user.email,
      'update_submission_status',
      'system',
      id,
      { status, adminNotes },
      'success'
    );

    return NextResponse.json({
      success: true,
      submission: updated,
      message: 'Submission status updated.',
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ success: false, message: 'Failed to update submission.' }, { status: 500 });
  }
}
