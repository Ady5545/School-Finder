import { NextRequest, NextResponse } from 'next/server';
import { getPublicSchoolPopularityAsync } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || undefined;

    const popularity = await getPublicSchoolPopularityAsync(slug);

    // View totals are admin-only analytics. Public consumers may use this
    // endpoint for popularity/rating plumbing, but never receive raw view counts.
    let publicPopularity = popularity;
    if (popularity && typeof popularity === 'object' && !Array.isArray(popularity)) {
      publicPopularity = Object.fromEntries(
        Object.entries(popularity).map(([key, value]) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const { views: _privateViews, ...safeValue } = value as Record<string, unknown>;
            return [key, safeValue];
          }
          return [key, value];
        })
      );
    }

    return NextResponse.json({
      success: true,
      popularity: publicPopularity,
    });
  } catch (error) {
    console.error('Error in popularity API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch popularity metrics.' },
      { status: 500 }
    );
  }
}
