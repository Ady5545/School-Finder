import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserByIdAsync } from '../../../lib/authStore';
import { getPublicSchoolBySlug } from '../../../lib/schools';
import { isSafeStoredSchoolCoordinate } from '../../../lib/locationSafety';

type Point = { lat: number; lng: number; label: string; source?: string };
const geocodeCache = new Map<string, Point | null>();
let lastGeocodeAt = 0;

async function geocode(query: string): Promise<Point | null> {
  const raw = query.trim();
  const key = raw.toLowerCase();
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

  // Society names are user-entered and may already contain locality/city text.
  // Search the exact name first, then progressively broader locality variants.
  const cleaned = raw
    .replace(/,?\s*(uttar pradesh|india)\s*$/i, '')
    .replace(/,?\s*greater noida west\s*$/i, '')
    .replace(/,?\s*noida extension\s*$/i, '')
    .replace(/,?\s*greater noida\s*$/i, '')
    .trim();

  const queries = Array.from(new Set([
    raw,
    cleaned,
    `${cleaned}, Greater Noida West, Uttar Pradesh, India`,
    `${cleaned}, Greater Noida, Uttar Pradesh, India`,
    `${cleaned}, Noida Extension, Uttar Pradesh, India`,
  ]));

  let best: Point | null = null;
  let bestScore = -1;

  for (const candidate of queries) {
    const wait = Math.max(0, 1000 - (Date.now() - lastGeocodeAt));
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));

    const params = new URLSearchParams({
      q: candidate,
      format: 'jsonv2',
      limit: '10',
      countrycodes: 'in',
      addressdetails: '1',
    });

    let response: Response;
    try {
      response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
          'User-Agent': 'AdmissionPitara/1.0 (school-run feature; https://admissionpitara.com)',
          Accept: 'application/json',
        },
        cache: 'no-store',
      });
    } catch {
      continue;
    }

    lastGeocodeAt = Date.now();
    if (!response.ok) continue;

    const data = (await response.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
      type?: string;
      class?: string;
      address?: Record<string, string>;
    }>;

    for (const item of data) {
      const lat = Number(item.lat);
      const lng = Number(item.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const display = item.display_name.toLowerCase();
      const address = Object.values(item.address || {}).join(' ').toLowerCase();

      // Strongly prefer results that are actually in the requested region.
      let score = 0;
      if (display.includes('greater noida west') || address.includes('greater noida west')) score += 20;
      if (display.includes('noida extension') || address.includes('noida extension')) score += 18;
      if (display.includes('greater noida') || address.includes('greater noida')) score += 14;
      if (address.includes('uttar pradesh')) score += 4;
      if (['apartments', 'residential', 'residential_area', 'building', 'house'].includes(item.type || '')) score += 5;

      // Reward name overlap so "Society ABC" does not resolve to an unrelated
      // place merely because it happens to be in Greater Noida.
      const nameWords = cleaned.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4);
      const overlap = nameWords.filter(word => display.includes(word)).length;
      score += overlap * 3;

      if (score > bestScore) {
        bestScore = score;
        best = {
          lat,
          lng,
          label: item.display_name,
          source: 'OpenStreetMap Nominatim',
        };
      }
    }

    // An exact/locality match is good enough; do not hammer the public
    // geocoder once we have a strong result.
    if (bestScore >= 25) break;
  }

  // Nominatim does not always contain newer housing societies. Try Photon as a
  // second public geocoder before declaring the society unlocatable.
  if (!best) {
    for (const candidate of queries.slice(0, 3)) {
      try {
        const params = new URLSearchParams({ q: candidate, limit: '5' });
        const response = await fetch('https://photon.komoot.io/api/?' + params.toString(), { cache: 'no-store' });
        if (!response.ok) continue;
        const data = await response.json();
        const features = Array.isArray(data?.features) ? data.features : [];
        for (const feature of features) {
          const coords = feature?.geometry?.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) continue;
          const lng = Number(coords[0]);
          const lat = Number(coords[1]);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const props = feature?.properties || {};
          const label = [props.name, props.street, props.city, props.state, props.country].filter(Boolean).join(', ');
          const haystack = label.toLowerCase();
          if (!haystack.includes('greater noida') && !haystack.includes('noida')) continue;
          best = { lat, lng, label: label || candidate, source: 'Photon' };
          break;
        }
      } catch {
        // Try the next candidate/provider.
      }
      if (best) break;
    }
  }

  geocodeCache.set(key, best);
  return best;
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
    if (shortlist.length === 0) return NextResponse.json({ success: false, code: 'SHORTLIST_EMPTY', message: 'Shortlist at least one school to plan your school run.' }, { status: 422 });

    // The parent can plan from their saved society (default) or from their
    // device's live GPS position (e.g. while actually standing at a pickup
    // point). ?lat=&lng= overrides geocoding with the real coordinates the
    // browser reported — no lookup involved, so it is exact.
    const rawLat = req.nextUrl.searchParams.get('lat');
    const rawLng = req.nextUrl.searchParams.get('lng');
    const deviceLat = rawLat !== null ? Number(rawLat) : null;
    const deviceLng = rawLng !== null ? Number(rawLng) : null;
    const useDeviceLocation = Number.isFinite(deviceLat) && Number.isFinite(deviceLng)
      && Math.abs(deviceLat as number) <= 90 && Math.abs(deviceLng as number) <= 180;

    let origin: Point | null = null;
    if (useDeviceLocation) {
      origin = { lat: deviceLat as number, lng: deviceLng as number, label: 'Your current location', source: 'Device GPS' };
    } else {
      if (!society) return NextResponse.json({ success: false, code: 'SOCIETY_MISSING', message: 'Add your residential society to your Parent Account, or share your current location, to plan your school run.' }, { status: 422 });
      origin = await geocode(`${society}, Greater Noida West, Uttar Pradesh, India`);
      if (!origin) return NextResponse.json({ success: false, code: 'SOCIETY_NOT_FOUND', society, message: 'We could not confidently locate that society on the map yet. You can also share your current location instead.', diagnostic: { normalizedSociety: society.replace(/,?\s*(uttar pradesh|india|greater noida west|noida extension|greater noida)\s*$/i, '').trim(), providersTried: ['OpenStreetMap Nominatim', 'Photon'] } }, { status: 422 });
    }

    const schools = shortlist.map(slug => getPublicSchoolBySlug(slug)).filter(Boolean).map(school => {
      const coords = school!.location.coordinates;
      return {
        school: school!,
        point: isSafeStoredSchoolCoordinate(coords)
          ? { lat: coords.lat, lng: coords.lng, label: school!.name, source: 'verified school coordinates' }
          : null,
      };
    });

    const resolved = [];
    for (const item of schools) {
      let point: Point | null = null;
      const school = item.school;
      const query = school.location.mapSearchQuery || [school.name, school.location.address, school.location.sector, 'Greater Noida West', 'Uttar Pradesh', 'India'].filter(Boolean).join(', ');
      // Prefer live geocoding so stale legacy coordinates cannot move the map to the wrong campus.
      point = await geocode(query);
      if (!point && item.point) point = item.point;
      if (!point) continue;
      const [driving, walking] = await Promise.all([routeWithProvider(origin, point, 'driving'), routeWithProvider(origin, point, 'walking')]);
      resolved.push({
        slug: item.school.slug, name: item.school.name, shortName: item.school.shortName, sector: item.school.location.sector, address: item.school.location.address, point,
        driving: driving ? { distanceKm: Number(driving.distanceKm.toFixed(2)), durationMin: Math.max(1, Math.round(driving.durationMin)), coordinates: driving.coordinates, provider: driving.provider } : null,
        walking: walking ? { distanceKm: Number(walking.distanceKm.toFixed(2)), durationMin: Math.max(1, Math.round(walking.durationMin)), coordinates: walking.coordinates, provider: walking.provider } : null,
      });
    }

    return NextResponse.json({
      success: true, origin: useDeviceLocation ? origin : { ...origin, label: society }, schools: resolved,
      note: process.env.OPENROUTESERVICE_API_KEY ? 'Walking and driving routes use OpenRouteService.' : 'Driving routes use OpenStreetMap-based routing. Walking route support can be enabled with OPENROUTESERVICE_API_KEY.',
    }, { headers: { 'Cache-Control': 'private, max-age=300' } });
  } catch (error) {
    console.error('[SCHOOL_RUN]', error);
    return NextResponse.json({ success: false, message: 'School Run could not load right now.' }, { status: 500 });
  }
}