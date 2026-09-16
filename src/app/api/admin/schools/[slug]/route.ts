import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../../lib/adminAuth';
import { getSchoolBySlug } from '../../../../../lib/schools';
import {
  getAdminSchoolAnalytics,
  getAllPromotions,
} from '../../../../../lib/authStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, message: 'School slug required' }, { status: 400 });
  }

  const school = getSchoolBySlug(slug);
  if (!school) {
    return NextResponse.json({ success: false, message: 'School not found' }, { status: 404 });
  }

  const analytics = getAdminSchoolAnalytics(slug);
  const promotions = getAllPromotions().filter(p => p.schoolSlug === slug);

  return NextResponse.json({
    success: true,
    school: {
      id: school.id,
      slug: school.slug,
      name: school.name,
      shortName: school.shortName,
      location: school.location,
      curriculum: {
        boards: school.board,
        gradesOffered: school.gradeRange?.raw || 'Nursery - Grade 12',
      },
      establishedYear: 2015,
      feeStructure: {
        annualTutionFee: school.fees?.rangeText || school.fees?.tuitionAnnual || `₹${school.fees?.cardFee?.toLocaleString('en-IN') || '1,20,000'}/yr`,
        monthlyEquivalent: school.fees?.tuitionMonthly || 'N/A',
        quarterlyPayment: school.fees?.tuitionQuarterly || 'N/A',
      },
      facilities: school.facilities,
      admissionStatus: school.admissions?.status || 'Open',
      contacts: school.contact,
    },
    analytics,
    promotions,
  });
}
