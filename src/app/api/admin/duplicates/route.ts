import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { detectDuplicateSchools } from '../../../../lib/schoolAdminService';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const duplicates = detectDuplicateSchools();

  return NextResponse.json({
    success: true,
    totalDuplicatesDetected: duplicates.length,
    highConfidenceCount: duplicates.filter(d => d.confidence === 'high').length,
    mediumConfidenceCount: duplicates.filter(d => d.confidence === 'medium').length,
    lowConfidenceCount: duplicates.filter(d => d.confidence === 'low').length,
    duplicates,
  });
}
