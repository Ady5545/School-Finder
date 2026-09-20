import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';
import shopCoupons from '../../../../../data/shop-coupons.json';

export const dynamic = 'force-dynamic';

type ShopCategory = 'uniform' | 'stationery' | 'fancy_dress';

type NearbyShop = {
  id: string;
  name: string;
  category: ShopCategory;
  distanceKm: number;
  address: string | null;
  lat: number;
  lng: number;
  osmUrl: string;
  coupon: { code: string; description: string } | null;
};

const CACHE_TTL_MS = 30 * 60 * 1000; // Overpass is a shared public service — cache per-school for 30 min.
const cache = new Map<string, { at: number; shops: NearbyShop[] }>();

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
}

function categorize(tags: Record<string, string>): ShopCategory | null {
  const shop = tags.shop || '';
  const name = (tags.name || '').toLowerCase();
  if (shop === 'clothes' || shop === 'tailor' || shop === 'boutique') {
    // "Uniform" is not its own OSM shop tag, so a clothes/tailor shop only
    // counts here if its own name/description signals school uniforms.
    if (/uniform|school wear|school dress/.test(name) || /uniform/.test((tags.description || '').toLowerCase())) return 'uniform';
    return null;
  }
  if (shop === 'stationery' || shop === 'books') return 'stationery';
  if (shop === 'variety_store' || shop === 'costume' || shop === 'gift' || shop === 'toys') return 'fancy_dress';
  return null;
}

function normalizeKey(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function fetchOverpassShops(lat: number, lng: number, radiusM: number): Promise<NearbyShop[]> {
  const query = `[out:json][timeout:20];(
    node["shop"~"^(clothes|tailor|boutique|stationery|books|variety_store|costume|gift|toys)$"](around:${radiusM},${lat},${lng});
    way["shop"~"^(clothes|tailor|boutique|stationery|books|variety_store|costume|gift|toys)$"](around:${radiusM},${lat},${lng});
  );out center tags;`;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Overpass ${response.status}`);
  const data = await response.json();
  const elements = Array.isArray(data?.elements) ? data.elements : [];

  const shops: NearbyShop[] = [];
  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name;
    if (!name) continue; // Unnamed POIs are not useful/trustworthy enough to show a parent.
    const category = categorize(tags);
    if (!category) continue;
    const shopLat = el.lat ?? el.center?.lat;
    const shopLng = el.lon ?? el.center?.lon;
    if (typeof shopLat !== 'number' || typeof shopLng !== 'number') continue;

    const addressParts = [tags['addr:housenumber'], tags['addr:street'] || tags['addr:place'], tags['addr:sector'], tags['addr:city']].filter(Boolean);
    const key = normalizeKey(name);
    const entry = (shopCoupons as unknown as Record<string, { code: string; description: string } | string>)[key];
    const coupon = entry && typeof entry === 'object' ? entry : null;

    shops.push({
      id: `${el.type}/${el.id}`,
      name,
      category,
      distanceKm: Number(haversineKm(lat, lng, shopLat, shopLng).toFixed(2)),
      address: addressParts.length ? addressParts.join(', ') : null,
      lat: shopLat,
      lng: shopLng,
      osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      coupon: category === 'uniform' ? coupon : null, // Coupons are a uniform-shop feature for now, per the product idea.
    });
  }
  shops.sort((a, b) => a.distanceKm - b.distanceKm);
  return shops;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('ap_session')?.value || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token || !verifySessionToken(token)?.sub) {
      return NextResponse.json({ success: false, message: 'Sign in to see nearby shops.' }, { status: 401 });
    }

    const slug = req.nextUrl.searchParams.get('slug') || '';
    const school = getSchoolBySlug(slug);
    if (!school) return NextResponse.json({ success: false, message: 'Unknown school.' }, { status: 404 });
    const { lat, lng } = school.location.coordinates;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ success: false, message: 'This school has no mapped coordinates yet.' }, { status: 422 });
    }

    const cacheKey = slug;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, slug, shops: cached.shops, cached: true }, { headers: { 'Cache-Control': 'private, max-age=900' } });
    }

    let shops: NearbyShop[] = [];
    try {
      shops = await fetchOverpassShops(lat, lng, 1500);
      // Widen the search once if nothing turned up within the tight default radius.
      if (shops.length === 0) shops = await fetchOverpassShops(lat, lng, 3000);
    } catch (err) {
      console.error('[SCHOOL_RUN_NEARBY_SHOPS] overpass failed', err);
      return NextResponse.json({ success: false, message: 'The nearby-shops directory is temporarily unavailable. Please try again shortly.' }, { status: 503 });
    }

    cache.set(cacheKey, { at: Date.now(), shops });
    return NextResponse.json({
      success: true, slug, shops,
      note: 'Shops are pulled live from OpenStreetMap contributors around this school. We do not invent listings — if a real shop is missing or mistagged, it will not appear here yet.',
    }, { headers: { 'Cache-Control': 'private, max-age=900' } });
  } catch (error) {
    console.error('[SCHOOL_RUN_NEARBY_SHOPS]', error);
    return NextResponse.json({ success: false, message: 'Could not load nearby shops right now.' }, { status: 500 });
  }
}
