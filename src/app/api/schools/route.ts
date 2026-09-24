import { NextRequest, NextResponse } from 'next/server';
import { getAllSchoolsAsync, filterSchoolsAsync } from '../../../lib/schools';

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
      const schools = await getAllSchoolsAsync({ includeAliases });
      return NextResponse.json({
        success: true,
        total: schools.length,
        schools,
      }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    const filtered = await filterSchoolsAsync({ searchQuery: q, board, area });
    return NextResponse.json({
      success: true,
      total: filtered.length,
      schools: filtered,
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('API /api/schools error:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
