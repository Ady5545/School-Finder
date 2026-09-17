const fs = require('fs');
const schools = JSON.parse(fs.readFileSync('data/schools.json', 'utf8'));

const dps = schools.find(s => s.slug === 'delhi-public-school-knowledge-park-5');
if (dps && dps.location.coordinates.lat === 28.58) {
  dps.location.coordinates = { lat: 28.5833, lng: 77.4667 };
}

fs.writeFileSync('data/schools.json', JSON.stringify(schools, null, 2));
