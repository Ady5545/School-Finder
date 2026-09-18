import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserById, getUserByIdAsync, getUserByEmailAsync, updateUserProfileAsync, ParentUser } from './authStore';

export type AdminRole =
  | 'super_admin'
  | 'directory_admin'
  | 'review_moderator'
  | 'support_admin'
  | 'editorial_admin'
  | 'business_admin'
  | 'analyst';

export type AdminPermission =
  | 'schools:read'
  | 'schools:write'
  | 'schools:archive'
  | 'reviews:moderate'
  | 'users:manage'
  | 'users:suspend'
  | 'email:send'
  | 'announcements:manage'
  | 'sponsorships:manage'
  | 'analytics:view'
  | 'reports:export'
  | 'reports:import'
  | 'system:health'
  | 'system:settings'
  | 'audit:view';

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'schools:read',
    'schools:write',
    'schools:archive',
    'reviews:moderate',
    'users:manage',
    'users:suspend',
    'email:send',
    'announcements:manage',
    'sponsorships:manage',
    'analytics:view',
    'reports:export',
    'reports:import',
    'system:health',
    'system:settings',
    'audit:view',
  ],
  directory_admin: [
    'schools:read',
    'schools:write',
    'schools:archive',
    'analytics:view',
    'reports:export',
    'reports:import',
    'audit:view',
  ],
  review_moderator: [
    'schools:read',
    'reviews:moderate',
    'audit:view',
  ],
  support_admin: [
    'schools:read',
    'users:manage',
    'users:suspend',
    'email:send',
    'reviews:moderate',
    'audit:view',
  ],
  editorial_admin: [
    'schools:read',
    'schools:write',
    'announcements:manage',
    'audit:view',
  ],
  business_admin: [
    'schools:read',
    'sponsorships:manage',
    'analytics:view',
    'audit:view',
  ],
  analyst: [
    'schools:read',
    'analytics:view',
    'reports:export',
    'audit:view',
  ],
};

export function getEffectiveAdminRole(user: ParentUser): AdminRole {
  // If user has specific adminRole assigned in profile, use it
  if (user.adminRole) {
    return user.adminRole;
  }
  // Default to super_admin for configured admin emails or standard 'admin' role
  return 'super_admin';
}

export function hasAdminPermission(userOrRole: ParentUser | AdminRole | string | undefined, permission: AdminPermission): boolean {
  if (!userOrRole) return false;
  let role: AdminRole = 'super_admin';
  if (typeof userOrRole === 'string') {
    if (userOrRole in ROLE_PERMISSIONS) {
      role = userOrRole as AdminRole;
    }
  } else if (typeof userOrRole === 'object') {
    role = getEffectiveAdminRole(userOrRole as ParentUser);
  }
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export interface AdminAuthResult {
  authorized: boolean;
  user?: ParentUser;
  errorResponse?: NextResponse;
}

/**
 * Server-side authorization check for all administrative APIs.
 * Requires an authenticated user whose email is in ADMIN_EMAILS or whose role is 'admin'.
 * Can optionally enforce a specific AdminPermission.
 * Never exposes secrets.
 */
export async function requireAdminAuth(req: NextRequest, requiredPermission?: AdminPermission): Promise<AdminAuthResult> {
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

    let user = getUserById(session.sub);
    if (!user) {
      user = await getUserByIdAsync(session.sub);
    }
    if (!user && session.email) {
      user = await getUserByEmailAsync(session.email);
    }

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

    if (isAdminEmail && user.role !== 'admin') {
      user.role = 'admin';
      await updateUserProfileAsync(user.id, { role: 'admin' });
    }

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

    if (requiredPermission && !hasAdminPermission(user, requiredPermission)) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: `Access denied: Your administrative role does not grant permission '${requiredPermission}'.`,
            code: 'FORBIDDEN_INSUFFICIENT_ROLE',
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
