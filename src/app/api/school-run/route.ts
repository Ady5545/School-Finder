import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserByIdAsync } from '../../../lib/authStore';
import { getSchoolBySlug } from '../../../lib/schools';

type Point = { lat: number; lng: number; label: string; source?: string };
const geocodeCache = new Map<string, Point | null>();
let lastGeocodeAt = 0;

async function geocode(query: string): Promise<Point | null> {
  const key = query.trim().toLowerCase();
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;
  const wait = Math.max(0, 1000 - (Date.now() - lastGeocodeAt));
  if (wait) await new Promise(resolve => setTimeout(resolve, wait));
  const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: '1', countrycodes: 'in' });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { 'User-Agent': 'AdmissionPitara/1.0 (school-run feature; https://admissionpitara.com)', Accept: 'application/json' },
    cache: 'no-store',
  });
  lastGeocodeAt = Date.now();
  if (!response.ok) return null;
  const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  const first = data[0];
  const result = first ? { lat: Number(first.lat), lng: Number(first.lon), label: first.display_name, source: 'OpenStreetMap Nominatim' } : null;
  geocodeCache.set(key, result);
  return result;
}

async function routeWithProvider(origin: Point, destination: Point, mode: 'driving' | 'walking') {
  const orsKey = process.env.OPENROUTESERVICE_API_KEY;
  if (orsKey) {
    const profile = mode === 'walking' ? 'foot-walking' : 'driving-car';
    const response = await fetch(`https://api.heigit.org/openrouteservice/v2/directions/${profile}/geojson`, {
      method: 'POST',
      headers: { Authorization: orsKey, 'Content-Type': 'application/json', Accept: 'application/geo+json,application/json' },
      body: JSON.stringify({ coordinates: [[origin.lng, origin.lat], [destination.lng, destination.lat]], instructions: false }),
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      const feature = data?.features?.[0];
      const summary = feature?.properties?.summary;
      const coordinates = feature?.geometry?.coordinates;
      if (summary && Array.isArray(coordinates)) {
        return { distanceKm: Number(summary.distance) / 1000, durationMin: Number(summary.duration) / 60, coordinates, provider: 'OpenRouteService' };
      }
    }
  }
  if (mode !== 'driving') return null;
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`, { cache: 'no-store' });
  if (!response.ok) return null;
  const data = await response.json();
  const route = data?.routes?.[0];
  if (!route) return null;
  return { distanceKm: Number(route.distance) / 1000, durationMin: Number(route.duration) / 60, coordinates: route.geometry?.coordinates ?? [], provider: 'OSRM' };
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('ap_session')?.value || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ success: false, message: 'Sign in to use School Run.' }, { status: 401 });
    const payload = verifySessionToken(token);
    if (!payload?.sub) return NextResponse.json({ success: false, message: 'Your session has expired.' }, { status: 401 });
    const user = await getUserByIdAsync(payload.sub);
    if (!user) return NextResponse.json({ success: false, message: 'Parent profile not found.' }, { status: 404 });

    const society = String(user.residentialSociety || '').trim();
    const shortlist = Array.isArray(user.wishlist) ? user.wishlist.slice(0, 6) : [];
    if (!society) return NextResponse.json({ success: false, code: 'SOCIETY_MISSING', message: 'Add your residential society to your Parent Account to plan your school run.' }, { status: 422 });
    if (shortlist.length === 0) return NextResponse.json({ success: false, code: 'SHORTLIST_EMPTY', message: 'Shortlist at least one school to plan your school run.' }, { status: 422 });

    const origin = await geocode(`${society}, Greater Noida West, Uttar Pradesh, India`);
    if (!origin) return NextResponse.json({ success: false, code: 'SOCIETY_NOT_FOUND', message: 'We could not confidently locate that society on the map yet. Please update the society name in your Parent Account.' }, { status: 422 });

    const schools = shortlist.map(slug => getSchoolBySlug(slug)).filter(Boolean).map(school => {
      const coords = school!.location.coordinates;
      return {
        school: school!,
        point: typeof coords.lat === 'number' && typeof coords.lng === 'number'
          ? { lat: coords.lat, lng: coords.lng, label: school!.name, source: coords.isVerified ? 'verified school coordinates' : 'school coordinates' }
          : null,
      };
    });

    const resolved = [];
    for (const item of schools) {
      let point: Point | null = item.point;
      if (!point) {
        const school = item.school;
        point = await geocode(school.location.mapSearchQuery || `${school.name}, ${school.location.address}, ${school.location.sector}, Greater Noida West, Uttar Pradesh, India`);
      }
      if (!point) continue;
      const [driving, walking] = await Promise.all([routeWithProvider(origin, point, 'driving'), routeWithProvider(origin, point, 'walking')]);
      resolved.push({
        slug: item.school.slug, name: item.school.name, shortName: item.school.shortName, sector: item.school.location.sector, address: item.school.location.address, point,
        driving: driving ? { distanceKm: Number(driving.distanceKm.toFixed(2)), durationMin: Math.max(1, Math.round(driving.durationMin)), coordinates: driving.coordinates, provider: driving.provider } : null,
        walking: walking ? { distanceKm: Number(walking.distanceKm.toFixed(2)), durationMin: Math.max(1, Math.round(walking.durationMin)), coordinates: walking.coordinates, provider: walking.provider } : null,
      });
    }

    return NextResponse.json({
      success: true, origin: { ...origin, label: society }, schools: resolved,
      note: process.env.OPENROUTESERVICE_API_KEY ? 'Walking and driving routes use OpenRouteService.' : 'Driving routes use OpenStreetMap-based routing. Walking route support can be enabled with OPENROUTESERVICE_API_KEY.',
    }, { headers: { 'Cache-Control': 'private, max-age=300' } });
  } catch (error) {
    console.error('[SCHOOL_RUN]', error);
    return NextResponse.json({ success: false, message: 'School Run could not load right now.' }, { status: 500 });
  }
}