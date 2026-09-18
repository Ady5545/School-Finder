import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { generateMonthlyExcelReportAsync } from '../../../../lib/excelReport';
import { recordAdminAuditAsync } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  // 1. Strict Server-Side Admin Authorization
  const auth = await requireAdminAuth(req);
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
