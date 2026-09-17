const fs = require('fs');
const path = require('path');
const schoolsPath = path.join(__dirname, '../data/schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

// 1. Remove DAV Crossing Republik (Set to archived)
const davCrossing = schools.find(s => s.slug === 'crossings-republic-dav-public-school');
if (davCrossing) {
  davCrossing.isArchived = true;
  davCrossing.status = 'archived';
  davCrossing.archiveReason = 'Falsely located as Crossing Republik campus.';
}

// 2. Correct Indus Valley Public School (Sector 62, Noida)
const indus = schools.find(s => s.slug === 'indus-valley-school-noida-ext');
if (indus) {
  indus.name = 'Indus Valley Public School';
  indus.shortName = 'Indus Valley Public School';
  indus.location.address = 'Sector 62, Noida, Uttar Pradesh 201301';
  indus.location.sector = 'Sector 62';
  indus.location.city = 'Noida';
  indus.location.area = 'Noida';
  indus.location.pincode = '201301';
  indus.location.coordinates = null;
  indus.geographicClassification = 'geographic_outlier'; // Because it's Sector 62, Noida
}

// 3. Remove DPS Monarch International School (Doha, Qatar)
const monarch = schools.find(s => s.slug === 'dps-monarch-international-school');
if (monarch) {
  monarch.isArchived = true;
  monarch.status = 'archived';
  monarch.archiveReason = 'Actually located in Doha, Qatar. Not Greater Noida West.';
}

// 4. Restore DWPS Noida Extension (Knowledge Park-V, HS-57)
const dwpsKp5 = schools.find(s => s.slug === 'delhi-world-public-school-kp-5');
if (dwpsKp5) {
  dwpsKp5.name = 'Delhi World Public School';
  dwpsKp5.shortName = 'DWPS Noida Extension';
  dwpsKp5.location.address = 'HS-57, Knowledge Park V, Greater Noida West, Uttar Pradesh 201306';
  dwpsKp5.location.sector = 'Knowledge Park V';
  dwpsKp5.location.city = 'Greater Noida West';
  dwpsKp5.location.area = 'Greater Noida West';
  dwpsKp5.location.coordinates = { lat: 28.5833, lng: 77.4667 }; // Approximate KP-V
  dwpsKp5.geographicClassification = 'core_greater_noida_west';
  dwpsKp5.isArchived = false;
  dwpsKp5.status = 'active';
  delete dwpsKp5.archiveReason;
  dwpsKp5.recordType = 'canonical';
}

// Fix fallbacks
schools.forEach(s => {
  if (s.location && s.location.coordinates) {
    const { lat, lng } = s.location.coordinates;
    if (lat === 28.595 && lng === 77.445 && s.location.sector !== 'Sector 16' && s.slug !== 'bgs-vijnatham-school') {
      s.location.coordinates = null; // Remove fake fallback
    }
  }
});

// For BGS Vijnatham, find if there's any image we can use or if we just leave it. The user wants the PREVIOUSLY intended BGS photo. 
// I will check if BGS photo is available somewhere, else I'll set it to a known good path in hope it resolves, or check git via another command.

fs.writeFileSync(schoolsPath, JSON.stringify(schools, null, 2));
console.log('Done data fixes.');
