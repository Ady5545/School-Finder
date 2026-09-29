import { NextResponse } from 'next/server';
import { getSchoolViewsCollection, isMongoConfigured } from '../../../../lib/mongodb';
import { getEffectiveCanonicalSchoolsAsync } from '../../../../lib/managedSchools';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const schools = await getEffectiveCanonicalSchoolsAsync();
    const schoolBySlug = new Map(schools.map(school => [school.slug, school]));

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, schools: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const collection = await getSchoolViewsCollection();
    if (!collection) {
      return NextResponse.json({ success: true, schools: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const rows = await collection
      .find({ slug: { $in: schools.map(school => school.slug) } })
      .sort({ totalViews: -1, lastViewedAt: -1 })
      .limit(8)
      .toArray();

    const result = rows
      .map(row => {
        const school = schoolBySlug.get(row.slug);
        if (!school) return null;
        return {
          slug: school.slug,
          name: school.name,
          area: school.location?.area || school.location?.sector || 'Greater Noida',
          sector: school.location?.sector || '',
          rating: school.rating?.score || 0,
          views: Number(row.totalViews || row.count || 0),
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { success: true, schools: result },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[MOST_VIEWED_PUBLIC]', error);
    return NextResponse.json({ success: false, schools: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
