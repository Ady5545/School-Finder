import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getAdminSchoolsList } from '../../../../lib/schoolAdminService';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'schools:read');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const allSchools = getAdminSchoolsList({ includeArchived: true });

  const total = allSchools.length;
  const completeCount = allSchools.filter(s => s.completeness.level === 'complete').length;
  const adequateCount = allSchools.filter(s => s.completeness.level === 'adequate').length;
  const needsAttentionCount = allSchools.filter(s => s.completeness.level === 'needs_attention').length;
  const criticalMissingCount = allSchools.filter(s => s.completeness.level === 'critical_missing').length;

  const missingSummary: Record<string, { label: string; count: number; schools: { slug: string; name: string }[] }> = {};

  allSchools.forEach(s => {
    s.completeness.items.forEach(item => {
      if (!item.passed) {
        if (!missingSummary[item.key]) {
          missingSummary[item.key] = { label: item.label, count: 0, schools: [] };
        }
        missingSummary[item.key].count++;
        if (missingSummary[item.key].schools.length < 15) {
          missingSummary[item.key].schools.push({ slug: s.slug, name: s.name });
        }
      }
    });
  });

  return NextResponse.json({
    success: true,
    summary: {
      total,
      completeCount,
      adequateCount,
      needsAttentionCount,
      criticalMissingCount,
      healthScore: Math.round(
        allSchools.reduce((acc, s) => acc + s.completeness.score, 0) / (total || 1)
      ),
    },
    missingSummary,
    schools: allSchools.map(s => ({
      slug: s.slug,
      name: s.name,
      sector: s.location?.sector || s.location?.area,
      board: Array.isArray(s.board) ? s.board.join(', ') : s.board || 'CBSE',
      completeness: s.completeness,
      isArchived: Boolean(s.isArchived),
      status: s.status,
    })),
  });
}
