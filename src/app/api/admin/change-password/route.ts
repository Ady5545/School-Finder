import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import {
  verifyPassword,
  updateUserPasswordAsync,
  checkRateLimit,
  recordAdminAuditAsync,
  getUserByIdAsync,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (!auth.authorized || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, message: 'Admin authorization required.' }, { status: 401 });
    }

    // Rate Limiting Protection (Max 5 password change attempts per 15 minutes per admin user)
    const allowed = checkRateLimit(`admin_pwd_change_${auth.user.id}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many password change attempts. Please wait 15 minutes before trying again.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
      return NextResponse.json(
        { success: false, message: 'Current password is required.' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Complexity criteria check
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasUpper || !hasLower || (!hasNumber && !hasSpecial)) {
      return NextResponse.json(
        {
          success: false,
          message: 'New password must contain uppercase, lowercase, and at least one number or special character.',
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New password and confirmation password do not match.' },
        { status: 400 }
      );
    }

    // Fetch fresh user record from MongoDB
    const freshUser = await getUserByIdAsync(auth.user.id);
    const passwordHash = freshUser?.passwordHash || auth.user.passwordHash || '';

    // Verify current password server-side
    const isCurrentValid = verifyPassword(currentPassword, passwordHash);
    if (!isCurrentValid) {
      await recordAdminAuditAsync(
        auth.user.id,
        auth.user.email,
        'change_password_attempt',
        'user',
        auth.user.id,
        { reason: 'invalid_current_password' },
        'failed'
      );

      return NextResponse.json(
        { success: false, message: 'Current password verification failed. Please check your credentials.' },
        { status: 400 }
      );
    }

    // Prevent re-using identical current password
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from your current password.' },
        { status: 400 }
      );
    }

    // Execute secure password change
    const updated = await updateUserPasswordAsync(auth.user.id, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Failed to update administrator password in user database.' },
        { status: 500 }
      );
    }

    // Log security audit event (NEVER including passwords or hashes)
    await recordAdminAuditAsync(
      auth.user.id,
      auth.user.email,
      'change_password',
      'user',
      auth.user.id,
      { event: 'admin_password_updated' },
      'success'
    );

    return NextResponse.json({
      success: true,
      message: 'Administrator password updated successfully.',
    });
  } catch (err) {
    console.error('[ADMIN_PWD_CHANGE_ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected server error occurred while updating password.' },
      { status: 500 }
    );
  }
}
