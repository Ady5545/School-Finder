import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserById, ParentUser } from './authStore';

export interface AdminAuthResult {
  authorized: boolean;
  user?: ParentUser;
  errorResponse?: NextResponse;
}

/**
 * Server-side authorization check for all administrative APIs.
 * Requires an authenticated user whose email is in ADMIN_EMAILS or whose role is 'admin'.
 * Never exposes secrets.
 */
export function requireAdminAuth(req: NextRequest): AdminAuthResult {
  try {
    const cookieToken = req.cookies.get('ap_session')?.value;
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: 'Administrative authentication required. Please sign in to an authorized admin account.',
            code: 'AUTH_REQUIRED',
          },
          { status: 401 }
        ),
      };
    }

    const session = verifySessionToken(token);
    if (!session || !session.sub) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: 'Administrative session is invalid or expired. Please sign in again.',
            code: 'SESSION_EXPIRED',
          },
          { status: 401 }
        ),
      };
    }

    const user = getUserById(session.sub);
    if (!user) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: 'Account not found in system records.',
            code: 'USER_NOT_FOUND',
          },
          { status: 404 }
        ),
      };
    }

    if (user.status === 'disabled') {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: 'This account has been disabled by platform administration.',
            code: 'ACCOUNT_DISABLED',
          },
          { status: 403 }
        ),
      };
    }

    // Configured admin emails
    const rawAdminEmails = process.env.ADMIN_EMAILS || 'admin@admissionpitara.com';
    const adminEmails = rawAdminEmails
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmailLower = user.email.toLowerCase();
    const isAdminEmail = adminEmails.includes(userEmailLower);
    const isAdminRole = user.role === 'admin';

    if (!isAdminEmail && !isAdminRole) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: 'Access denied: You do not possess administrator authorization for Admission Pitara.',
            code: 'FORBIDDEN',
          },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      user,
    };
  } catch (error) {
    console.error('Error during administrative authorization check:', error);
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        {
          success: false,
          message: 'Internal error during authorization check.',
          code: 'INTERNAL_AUTH_ERROR',
        },
        { status: 500 }
      ),
    };
  }
}
