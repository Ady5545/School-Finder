import { NextRequest, NextResponse } from 'next/server';
import {
  getUserByEmailAsync,
  verifyPassword,
  createSessionToken,
  sanitizeUser,
  verifyOtpCodeAsync,
  recordActivityEvent,
  isUserSuspendedOrBanned,
  updateUserProfileAsync,
  updateUserPasswordAsync,
  getAdminEmails,
  getAdminInitialPassword,
  hashPassword,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, identifier, password, otp, loginType = 'password' } = body;

    const emailToUse = (email || identifier || '').trim().toLowerCase();

    if (!emailToUse) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const user = await getUserByEmailAsync(emailToUse);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          notFound: true,
          email: emailToUse,
          message: 'No registered parent account found with this email. Please sign up.',
        },
        { status: 401 }
      );
    }

    const { blocked, status, reason } = isUserSuspendedOrBanned(user.id);
    if (blocked) {
      return NextResponse.json(
        {
          success: false,
          message: `Account is ${status}. Reason: ${reason}. Please contact support.`,
        },
        { status: 403 }
      );
    }

    if (loginType === 'otp') {
      if (!otp) {
        return NextResponse.json(
          { success: false, message: 'Verification code is required for OTP sign in.' },
          { status: 400 }
        );
      }

      const statelessSessionToken = req.cookies.get('ap_otp_session')?.value;
      const verifyResult = await verifyOtpCodeAsync(emailToUse, otp, statelessSessionToken);
      if (!verifyResult.success) {
        return NextResponse.json(
          { success: false, message: verifyResult.error || 'Invalid verification code.' },
          { status: 400 }
        );
      }
    } else {
      // Password Sign In
      if (!password) {
        return NextResponse.json(
          { success: false, message: 'Password is required.' },
          { status: 400 }
        );
      }

      if (!user.passwordHash) {
        return NextResponse.json(
          { success: false, message: 'This account was set up via email OTP. Please sign in using OTP code.' },
          { status: 400 }
        );
      }

      let isValid = verifyPassword(password, user.passwordHash);

      // Bootstrap-only fallback: ADMIN_INITIAL_PASSWORD may be used to complete
      // provisioning for an admin-listed account, but ONLY on that account's very
      // first login. Once a user has logged in at least once, this account already
      // has a real credential and the bootstrap password must never authenticate
      // it again, nor silently overwrite the password hash going forward.
      const isFirstLoginForAccount = !user.lastLoginAt;
      if (
        !isValid &&
        isFirstLoginForAccount &&
        (user.role === 'admin' || getAdminEmails().includes(user.email.toLowerCase()))
      ) {
        try {
          const envPass = getAdminInitialPassword();
          if (password === envPass || password === `${envPass}!` || `${password}!` === envPass) {
            user.passwordHash = hashPassword(password);
            await updateUserPasswordAsync(user.id, password);
            isValid = true;
          }
        } catch {}
      }

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid password. Please check your password and try again.' },
          { status: 401 }
        );
      }
    }

    // Admin-whitelist promotion also only applies on an account's first-ever login
    // (initial provisioning). A manually demoted or downgraded admin-listed account
    // must stay demoted on subsequent logins — being on ADMIN_EMAILS authorizes
    // *initial* elevation, not a standing override of an admin's own role decisions.
    const isFirstLoginEver = !user.lastLoginAt;
    if (isFirstLoginEver && getAdminEmails().includes(user.email.toLowerCase()) && user.role !== 'admin') {
      user.role = 'admin';
      user.emailVerified = true;
    }

    const now = new Date().toISOString();
    user.lastLoginAt = now;
    user.lastActivityAt = now;
    await updateUserProfileAsync(user.id, {
      role: user.role,
    });

    recordActivityEvent({
      type: 'user_login',
      userId: user.id,
      locality: user.preferredSchoolLocality,
    });

    const token = createSessionToken(user);
    // The session lives only in the HTTP-only ap_session cookie below — the JWT is
    // intentionally not included in the JSON body so it can't be read by page JS.
    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      user: sanitizeUser(user),
    });

    response.cookies.set('ap_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
