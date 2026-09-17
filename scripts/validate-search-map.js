const fs = require('fs');
const schools = JSON.parse(fs.readFileSync('data/schools.json'));

let passed = true;

const bgs = schools.find(s => s.slug === 'bgs-vijnatham-school');
if (!bgs) {
  console.log('[FAIL] BGS school missing');
  passed = false;
} else if (!bgs.assets.featured || bgs.assets.featured === null) {
  console.log('[FAIL] BGS school missing featured photo');
  passed = false;
}

schools.forEach(s => {
  if (s.location && s.location.coordinates) {
    const { lat, lng } = s.location.coordinates;
    if (lat === 28.595 && lng === 77.445 && s.location.sector !== 'Sector 16' && s.slug !== 'bgs-vijnatham-school') {
      console.log(`[WARN] School ${s.slug} has fallback coordinates (Amrapali / Tech Zone 4)`);
    }
  }
});
