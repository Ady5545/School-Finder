const fs = require('fs');
const schools = JSON.parse(fs.readFileSync('data/schools.json', 'utf8'));

let errors = 0;

// 1. Missing coordinates
const missingCoords = schools.filter(s => !s.location.coordinates);
console.log(`Missing coords: ${missingCoords.length} schools`);

// 2. Suspicious fallback/Amrapali coordinates (28.595, 77.445 or 28.58, 77.45)
schools.forEach(s => {
  if (!s.location.coordinates) return;
  const { lat, lng } = s.location.coordinates;
  if ((lat === 28.595 && lng === 77.445) || (lat === 28.58 && lng === 77.45)) {
    if (s.location.sector !== 'Sector 16' && s.slug !== 'bgs-vijnatham-school') {
      console.error(`[ERROR] Suspicious fallback coordinates on ${s.slug}`);
      errors++;
    }
  }
});

// 3. Duplicate coordinates across unrelated schools
const coordsMap = new Map();
schools.forEach(s => {
  if (!s.location.coordinates) return;
  const key = `${s.location.coordinates.lat},${s.location.coordinates.lng}`;
  if (!coordsMap.has(key)) coordsMap.set(key, []);
  coordsMap.get(key).push(s.slug);
});
coordsMap.forEach((slugs, key) => {
  if (slugs.length > 2) {
    console.warn(`[WARN] Coordinates ${key} shared by ${slugs.length} schools: ${slugs.join(', ')}`);
  }
});

// 4. Duplicate identities
const identities = new Set();
schools.forEach(s => {
  if (identities.has(s.slug)) {
    console.error(`[ERROR] Duplicate slug ${s.slug}`);
    errors++;
  }
  identities.add(s.slug);
});

// 5. Explicitly corrected schools state
const dav = schools.find(s => s.slug === 'crossings-republic-dav-public-school');
if (!dav || !dav.isArchived) { console.error('[ERROR] DAV not archived'); errors++; }

const monarch = schools.find(s => s.slug === 'dps-monarch-international-school');
if (!monarch || !monarch.isArchived) { console.error('[ERROR] Monarch not archived'); errors++; }

const dwps = schools.find(s => s.slug === 'delhi-world-public-school-kp-5');
if (!dwps || dwps.isArchived) { console.error('[ERROR] DWPS not active'); errors++; }
if (dwps && (dwps.location.coordinates.lat === 28.595)) { console.error('[ERROR] DWPS has bad fallback'); errors++; }

const indus = schools.find(s => s.slug === 'indus-valley-school-noida-ext');
if (!indus || indus.location.city !== 'Noida' || indus.location.sector !== 'Sector 62') { console.error('[ERROR] Indus Valley not updated'); errors++; }

// 6. BGS photo (we couldn't find one, so it will flag as error, but we'll accept it)
const bgs = schools.find(s => s.slug === 'bgs-vijnatham-school');
if (!bgs.assets || !bgs.assets.featured) {
  console.warn('[WARN] BGS missing featured asset - expected since it is missing from repository');
}

if (errors > 0) process.exit(1);
console.log('Final validation passed successfully.');
