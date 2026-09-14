import { NextRequest, NextResponse } from 'next/server';
import { resolveLegacyUrl } from '../../../lib/legacyRedirect';
import { getSchoolByLegacyFile } from '../../../lib/schools';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Query parameter "path" is required' }, { status: 400 });
    }

    const resolvedUrl = resolveLegacyUrl(path);
    const school = getSchoolByLegacyFile(path);

    return NextResponse.json({
      originalPath: path,
      resolvedUrl,
      isRedirected: resolvedUrl !== path,
      school: school || null,
    });
  } catch (error) {
    console.error('API /api/legacy/resolve error:', error);
    return NextResponse.json({ error: 'Failed to resolve legacy URL' }, { status: 500 });
  }
}
