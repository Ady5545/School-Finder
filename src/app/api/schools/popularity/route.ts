import { NextRequest, NextResponse } from 'next/server';
import { getPublicSchoolPopularityAsync } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || undefined;

    const popularity = await getPublicSchoolPopularityAsync(slug);

    return NextResponse.json({
      success: true,
      popularity,
    });
  } catch (error) {
    console.error('Error in popularity API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch popularity metrics.' },
      { status: 500 }
    );
  }
}
