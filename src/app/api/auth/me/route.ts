import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getUserByIdAsync,
  sanitizeUser,
  updateUserProfileAsync,
  deleteParentUserAsync,
  normalizeIndianPhone,
  validateResidentialSociety,
  validateChildName,
  validateOptionalParentName,
} from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ap_session')?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    let user = await getUserByIdAsync(payload.sub);
    if (!user && payload.sub && payload.email) {
      // Reconstruct user from cryptographically verified session token for serverless resilience
      user = {
        id: payload.sub,
        name: payload.name || 'Parent',
        email: payload.email,
        status: 'active',
        preferredSchoolLocality: payload.preferredSchoolLocality || 'Greater Noida West',
        emailVerified: true,
        analyticsConsent: true,
        role: payload.role || 'parent',
        createdAt: new Date().toISOString(),
        wishlist: [],
        compareList: [],
      };
    }

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Error in me API GET:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ap_session')?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const body = await req.json();
    const updates: {
      name?: string;
      phone?: string;
      childName?: string;
      childGrade?: string;
      residentialSociety?: string;
      fatherName?: string;
      motherName?: string;
      preferredSchoolLocality?: string;
      preferredBoards?: string[];
      analyticsConsent?: boolean;
    } = {};

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        return NextResponse.json(
          { success: false, message: 'Parent / Guardian name must be at least 2 characters.' },
          { status: 400 }
        );
      }
      updates.name = body.name.trim();
    }

    if (body.phone !== undefined) {
      if (body.phone) {
        const pVal = normalizeIndianPhone(body.phone);
        if (!pVal.valid) {
          return NextResponse.json({ success: false, message: pVal.error }, { status: 400 });
        }
        updates.phone = pVal.normalized;
      } else {
        updates.phone = undefined;
      }
    }

    if (body.childName !== undefined) {
      if (body.childName) {
        const cVal = validateChildName(body.childName);
        if (!cVal.valid) {
          return NextResponse.json({ success: false, message: cVal.error }, { status: 400 });
        }
        updates.childName = cVal.cleaned;
      } else {
        updates.childName = undefined;
      }
    }

    if (body.childGrade !== undefined && typeof body.childGrade === 'string') {
      updates.childGrade = body.childGrade.trim();
    }

    if (body.residentialSociety !== undefined) {
      if (body.residentialSociety) {
        const sVal = validateResidentialSociety(body.residentialSociety);
        if (!sVal.valid) {
          return NextResponse.json({ success: false, message: sVal.error }, { status: 400 });
        }
        updates.residentialSociety = sVal.cleaned;
      } else {
        updates.residentialSociety = undefined;
      }
    }

    if (body.fatherName !== undefined) {
      const fVal = validateOptionalParentName(body.fatherName);
      if (!fVal.valid) {
        return NextResponse.json({ success: false, message: fVal.error }, { status: 400 });
      }
      updates.fatherName = fVal.cleaned;
    }

    if (body.motherName !== undefined) {
      const mVal = validateOptionalParentName(body.motherName);
      if (!mVal.valid) {
        return NextResponse.json({ success: false, message: mVal.error }, { status: 400 });
      }
      updates.motherName = mVal.cleaned;
    }

    if (body.preferredSchoolLocality !== undefined && typeof body.preferredSchoolLocality === 'string') {
      updates.preferredSchoolLocality = body.preferredSchoolLocality.trim();
    }

    if (Array.isArray(body.preferredBoards)) {
      updates.preferredBoards = body.preferredBoards;
    }

    if (typeof body.analyticsConsent === 'boolean') {
      updates.analyticsConsent = body.analyticsConsent;
    }

    const updatedUser = await updateUserProfileAsync(payload.sub, updates);

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('Error in me API PATCH:', error);
    return NextResponse.json({ success: false, message: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ap_session')?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const deleted = await deleteParentUserAsync(payload.sub);
    const response = NextResponse.json({
      success: deleted,
      message: deleted ? 'Account and associated data removed.' : 'User not found',
    });

    response.cookies.delete('ap_session');
    return response;
  } catch (error) {
    console.error('Error in me API DELETE:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete account' }, { status: 500 });
  }
}
