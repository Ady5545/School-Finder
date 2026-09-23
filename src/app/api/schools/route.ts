export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getPublicSchoolsAsync, filterPublicSchoolsAsync } from '../../../lib/publicSchoolData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const boardParam = searchParams.get('board');
    const areaParam = searchParams.get('area');
    const includeAliases = searchParams.get('includeAliases') === 'true';

    const board = boardParam ? boardParam.split(',') : undefined;
    const area = areaParam ? areaParam.split(',') : undefined;

    if (!q && !board && !area) {
      const schools = await getPublicSchoolsAsync({ includeAliases });
      return NextResponse.json({
        total: schools.length,
        schools,
      });
    }

    const filtered = await filterPublicSchoolsAsync({ searchQuery: q, board, area });
    return NextResponse.json({
      total: filtered.length,
      schools: filtered,
    });
  } catch (error) {
    console.error('API /api/schools error:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
