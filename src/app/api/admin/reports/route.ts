import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { generateMonthlyExcelReportAsync } from '../../../../lib/excelReport';
import { recordAdminAuditAsync, getSchoolRatingStatsAsync } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  // 1. Strict Server-Side Admin Authorization
  const auth = await requireAdminAuth(req, 'reports:export');
  if (!auth.authorized || !auth.user) {
    return (
      auth.errorResponse ||
      NextResponse.json(
        {
          success: false,
          message: 'Access denied: Administrative authorization required to generate reports.',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      )
    );
  }

  // 2. Parse and Validate Query Parameters
  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get('month');
  const schoolSlug = searchParams.get('schoolSlug');
  const yearParam = searchParams.get('year');

  const now = new Date();
  const currentMonth = now.getUTCMonth() + 1;
  const currentYear = now.getUTCFullYear();

  const month = monthParam ? parseInt(monthParam, 10) : currentMonth;
  const year = yearParam ? parseInt(yearParam, 10) : currentYear;

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid month specified. Month must be an integer between 1 and 12.',
        code: 'INVALID_MONTH',
      },
      { status: 400 }
    );
  }

  if (isNaN(year) || year < 2000 || year > 2100) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid year specified. Year must be a valid 4-digit year between 2000 and 2100.',
        code: 'INVALID_YEAR',
      },
      { status: 400 }
    );
  }

  try {
    if (schoolSlug) {
      const school = getSchoolBySlug(schoolSlug);
      if (!school) return NextResponse.json({ success: false, message: 'School not found.' }, { status: 404 });
      const stats = await getSchoolRatingStatsAsync(school.slug);
      const rows = [
        ['Admission Pitara — School Data Export'],
        ['School', school.name],
        ['Slug', school.slug],
        ['Area / Sector', school.location.area || school.location.sector],
        ['Address', school.location.address],
        ['Board / Curriculum', Array.isArray(school.board) ? school.board.join(', ') : school.board],
        ['Grade Range', school.gradeRange.raw],
        ['Student–Teacher Ratio', school.studentTeacherRatio],
        ['Admissions Status', school.admissions.status],
        ['Admissions Session', school.admissions.session || school.admissions.academicYear || '2027-28'],
        ['Annual Fee Display', school.fees.annualDisplay || school.fees.tuitionAnnual || school.fees.rangeText],
        ['Monthly Fee', school.fees.tuitionMonthly || ''],
        ['Quarterly Fee', school.fees.tuitionQuarterly || ''],
        ['Fee Session', school.fees.academicSession || school.fees.academicYear || ''],
        ['Fee Verification Status', school.fees.verificationStatus || ''],
        ['Fee Source URL', school.fees.sourceUrl || ''],
        ['Admissions Source URL', school.admissions.sourceUrl || ''],
        ['Rating', stats?.averageScore ?? ''],
        ['Published Reviews', stats?.totalReviews ?? 0],
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'School Data');
      const reportBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      const safeName = school.slug.replace(/[^a-z0-9-]/gi, '-');
      await recordAdminAuditAsync(auth.user.id, auth.user.email, 'generate_school_report', 'school', school.slug, { filename: safeName + '.xlsx', generatedAt: new Date().toISOString() }, 'success');
      return new NextResponse(new Uint8Array(reportBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="admission-pitara-' + safeName + '.xlsx"',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }

    // 3. Generate the Excel Workbook Server-Side with MongoDB-authoritative data
    const reportBuffer = await generateMonthlyExcelReportAsync(year, month);
    const formattedMonth = month.toString().padStart(2, '0');
    const filename = `admission-pitara-report-${year}-${formattedMonth}.xlsx`;

    // 4. Record Administrative Audit Log
    await recordAdminAuditAsync(
      auth.user.id,
      auth.user.email,
      'generate_monthly_report',
      'report',
      `${year}-${formattedMonth}`,
      { year, month, filename, generatedAt: new Date().toISOString() },
      'success'
    );

    // 5. Return Binary File with Content-Disposition Attachment
    return new NextResponse(new Uint8Array(reportBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[API /api/admin/reports] Failed to generate Excel report:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected internal error occurred while compiling the Excel report.',
      },
      { status: 500 }
    );
  }
}
