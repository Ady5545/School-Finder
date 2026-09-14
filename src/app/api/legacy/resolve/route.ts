import { NextRequest, NextResponse } from 'next/server';
import { resolveLegacyUrl } from '../../../../lib/legacyRedirect';
import { getSchoolByLegacyFile } from '../../../../lib/schools';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Query parameter "path" is required' }, { status: 400 });
    }

    const school = resolveLegacyUrl(path);
    const resolvedUrl = school ? `/schools/${school.slug}` : path;

    return NextResponse.json({
      originalPath: path,
      resolvedUrl,
      isRedirected: school !== undefined,
      school: school || null,
    });
  } catch (error) {
    console.error('API /api/legacy/resolve error:', error);
    return NextResponse.json({ error: 'Failed to resolve legacy URL' }, { status: 500 });
  }
}
