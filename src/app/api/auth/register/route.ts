import { NextRequest, NextResponse } from 'next/server';
import {
  createParentUserAsync,
  checkVerificationToken,
  createSessionToken,
  sanitizeUser,
  getUserByEmailAsync,
  normalizeIndianPhone,
  validateResidentialSociety,
  validateChildName,
  validateOptionalParentName,
} from '../../../../lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      childName,
      childGrade,
      residentialSociety,
      fatherName,
      motherName,
      preferredSchoolLocality,
      password,
      verificationToken,
      preferredBoards,
      termsAccepted,
      analyticsConsent,
    } = body;

    // 1. Terms & Privacy Acceptance
    if (!termsAccepted) {
      return NextResponse.json(
        { success: false, message: 'You must accept the Terms of Service and Privacy Policy to create an account.' },
        { status: 400 }
      );
    }

    // 2. Parent / Guardian Full Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid Parent / Guardian name (minimum 2 characters).' },
        { status: 400 }
      );
    }
    const cleanParentName = name.trim();

    // 3. Email Address
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address for account notices.' },
        { status: 400 }
      );
    }
    const cleanEmail = email.trim().toLowerCase();

    // 4. Contact Phone Number (Required Indian Phone Format)
    const phoneValidation = normalizeIndianPhone(phone);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { success: false, message: phoneValidation.error || 'Please enter a valid 10-digit Indian phone number.' },
        { status: 400 }
      );
    }
    const cleanPhone = phoneValidation.normalized!;

    // 5. Child / Student Full Name
    const childValidation = validateChildName(childName);
    if (!childValidation.valid) {
      return NextResponse.json(
        { success: false, message: childValidation.error || 'Please enter your child / student name.' },
        { status: 400 }
      );
    }
    const cleanChildName = childValidation.cleaned!;

    // 6. Child / Student Admission Grade
    if (!childGrade || typeof childGrade !== 'string' || !childGrade.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please select a target admission class/grade for your child.' },
        { status: 400 }
      );
    }
    const cleanChildGrade = childGrade.trim();

    // 7. Residential Society / Apartment Complex (Respects Strict Privacy)
    const societyValidation = validateResidentialSociety(residentialSociety);
    if (!societyValidation.valid) {
      return NextResponse.json(
        { success: false, message: societyValidation.error || 'Please enter your residential society or apartment complex name.' },
        { status: 400 }
      );
    }
    const cleanResidentialSociety = societyValidation.cleaned!;

    // 8. Optional Family Members (Father / Mother Names)
    const fatherValidation = validateOptionalParentName(fatherName);
    if (!fatherValidation.valid) {
      return NextResponse.json(
        { success: false, message: fatherValidation.error },
        { status: 400 }
      );
    }
    const cleanFatherName = fatherValidation.cleaned;

    const motherValidation = validateOptionalParentName(motherName);
    if (!motherValidation.valid) {
      return NextResponse.json(
        { success: false, message: motherValidation.error },
        { status: 400 }
      );
    }
    const cleanMotherName = motherValidation.cleaned;

    // 9. Check duplicate email
    const existingEmail = await getUserByEmailAsync(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // 10. Email OTP Verification token check
    const verifiedEmail = verificationToken ? checkVerificationToken(verificationToken) : null;
    if (!verifiedEmail || verifiedEmail !== cleanEmail) {
      return NextResponse.json(
        { success: false, message: 'Email verification expired or missing. Please verify your email via the 6-digit OTP code.' },
        { status: 400 }
      );
    }

    // 11. Create User
    const result = await createParentUserAsync({
      name: cleanParentName,
      email: cleanEmail,
      phone: cleanPhone,
      childName: cleanChildName,
      childGrade: cleanChildGrade,
      residentialSociety: cleanResidentialSociety,
      fatherName: cleanFatherName,
      motherName: cleanMotherName,
      preferredSchoolLocality: typeof preferredSchoolLocality === 'string' ? preferredSchoolLocality.trim() : '',
      password: typeof password === 'string' && password.length >= 6 ? password : undefined,
      preferredBoards: Array.isArray(preferredBoards) ? preferredBoards : [],
      analyticsConsent: analyticsConsent !== false,
    });

    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to create parent account.' },
        { status: 400 }
      );
    }

    const sessionToken = createSessionToken(result.user);
    const safeUser = sanitizeUser(result.user);

    const response = NextResponse.json({
      success: true,
      message: 'Parent account created successfully.',
      user: safeUser,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('ap_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while registering account.' },
      { status: 500 }
    );
  }
}
