import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getAdminSchoolsListAsync, createAdminSchoolAsync } from '@/lib/schoolAdminService';
import { getRawSchools } from '@/lib/schools';
import {
  getAllSchoolsAdminOverviewAsync,
  getAllPromotions,
} from '@/lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || undefined;
  const statusFilter = searchParams.get('status') || undefined;
  const verificationFilter = searchParams.get('verification') || undefined;
  const areaFilter = searchParams.get('area') || undefined;
  const boardFilter = searchParams.get('board') || undefined;

  const schools = await getAdminSchoolsListAsync({
    includeArchived: statusFilter !== 'active',
    filterStatus: statusFilter,
    searchQuery,
    verificationStatus: verificationFilter,
    area: areaFilter,
    board: boardFilter,
  });

  const allPromotions = getAllPromotions();
  const analyticsOverview = await getAllSchoolsAdminOverviewAsync();
  const analyticsBySlug = new Map(analyticsOverview.map(item => [item.slug, item]));

  const schoolMetrics = schools.map(school => {
    const summary = analyticsBySlug.get(school.slug);
    const activePromo = allPromotions.find(p => p.schoolSlug === school.slug && p.status === 'active');

    return {
      ...school,
      id: school.id,
      slug: school.slug,
      name: school.name,
      shortName: school.shortName,
      sector: school.location.sector || school.location.area,
      address: school.location.address,
      board: Array.isArray(school.board) ? school.board.join(', ') : school.board || 'CBSE',
      boardsList: Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[],
      schoolType: school.schoolType,
      establishedYear: school.establishedYear || 2015,
      verifiedFee: school.fees?.annualDisplay || school.fees?.rangeText || school.fees?.tuitionAnnual || `₹${school.fees?.cardFee?.toLocaleString('en-IN') || '1,20,000'}/yr`,
      tuitionAnnual: school.fees?.tuitionAnnual,
      cardFee: school.fees?.cardFee,
      isArchived: Boolean(school.isArchived),
      archiveReason: school.archiveReason,
      status: school.status || (school.isArchived ? 'archived' : 'active'),
      isDuplicate: Boolean(school.isDuplicate),
      hasCoordinates: Boolean((school.location?.coordinates?.lat ?? school.location?.coordinates?.latitude) && (school.location?.coordinates?.lng ?? school.location?.coordinates?.longitude)),
      coordinates: school.location?.coordinates,
      affiliationNumber: school.affiliationNumber || school.verification?.cbseAffiliationNumber,
      verificationStatus: school.verification?.status || 'pending_audit',
      completeness: school.completeness,
      views: summary?.views || 0,
      saves: summary?.saves || 0,
      reviewsCount: summary?.reviewsCount || 0,
      averageRating: summary?.averageRating || 0,
      contact: school.contact,
      admissions: school.admissions,
      assets: school.assets,
      activePromotion: activePromo ? {
        id: activePromo.id,
        campaignName: activePromo.campaignName,
        placementType: activePromo.placementType,
        status: activePromo.status,
        impressions: activePromo.impressions,
        clicks: activePromo.clicks,
      } : null,
    };
  });

  return NextResponse.json({
    success: true,
    schools: schoolMetrics,
    totalSchools: schoolMetrics.length,
    rawRecordsTotal: getRawSchools().length,
  }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
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
    const { schoolData, reason } = body || {};

    if (!schoolData) {
      return NextResponse.json({ success: false, message: 'Missing school payload data' }, { status: 400 });
    }

    const result = await createAdminSchoolAsync(
      schoolData,
      { id: auth.user.id, email: auth.user.email, name: auth.user.name },
      reason || 'School created via Admin CMS'
    );

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      school: result.school,
      message: 'School successfully created and added to directory registry.',
    });
  } catch (error) {
    console.error('Error creating school via admin:', error);
    return NextResponse.json({ success: false, message: 'Failed to create school record.' }, { status: 500 });
  }
}
