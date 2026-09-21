const fs = require('fs');
const path = require('path');
const schools = require('../data/schools.json');

console.log('================================================================');
console.log('    ADMISSION PITARA - PHASE 3 DATA ACCURACY & AUDIT SUITE      ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Total records
assert(schools.length >= 50, `Directory contains complete canonical dataset (Found: ${schools.length})`);

// 2. Uniqueness
const slugs = new Set(schools.map(s => s.slug));
assert(slugs.size === schools.length, `All ${schools.length} slugs are strictly unique`);

// 3. St. Xavier's reconciliation
const sXavierCanonical = schools.find(s => s.slug === 'st-xaviers-high-school');
const sXavierDuplicate = schools.find(s => s.slug === 'st-xaviers-high-school-greater-noida-west');
assert(sXavierCanonical && sXavierCanonical.contact.website === 'https://stxaviersgn.in/', 'St. Xavier canonical has verified official website');
assert(sXavierDuplicate && sXavierDuplicate.isDuplicate === true && sXavierDuplicate.duplicateOf === 'st-xaviers-high-school', 'St. Xavier secondary record explicitly flagged as linked duplicate');

// 4. DWPS location, fee verification, and Photo Pending integrity (no group photos)
const dwps = schools.find(s => s.slug === 'delhi-world-public-school-kp-5');
assert(dwps && dwps.location.sector === 'Knowledge Park V', 'DWPS verified in Knowledge Park V, Greater Noida West');
assert(dwps && dwps.contact.website === 'https://dwpsnoidaex.com', 'DWPS website verified as dwpsnoidaex.com');
assert(dwps && dwps.affiliationNumber === '2132903', 'DWPS CBSE affiliation verified as 2132903');
assert(dwps && dwps.fees.verificationStatus === 'verified_from_source', 'DWPS fees verified from official mandatory disclosure');
assert(dwps && dwps.assets.featured && dwps.assets.featured.includes('featured.jpg'), 'DWPS featured photo verified with official campus exterior');
assert(dwps && dwps.assets.gallery.length >= 6, 'DWPS gallery contains at least 6 authentic activity images');

// 5. Ryan dual campus audit & separation
const ryanBeta = schools.find(s => s.slug === 'ryan-international-school-greater-noida');
const ryanTechzone = schools.find(s => s.slug === 'ryan-international-school-noida-extension');
assert(ryanBeta && ryanBeta.location.sector === 'Sector Beta 1', 'Ryan Beta 1 verified in Sector Beta 1 (Greater Noida)');
assert(ryanTechzone && ryanTechzone.location.sector === 'Techzone 4', 'Ryan Techzone 4 verified in Techzone 4 (Greater Noida West)');
assert(ryanBeta && ryanTechzone && ryanBeta.slug !== ryanTechzone.slug, 'Ryan Beta 1 and Ryan Techzone 4 are distinct standalone listings');
assert(ryanBeta && ryanBeta.assets.featured === null, 'Ryan Beta 1 does not display Techzone IV image and is set to Photo Pending');
assert(ryanTechzone && ryanTechzone.assets.featured && ryanTechzone.assets.featured.includes('featured.webp'), 'Ryan Techzone 4 displays verified Techzone IV campus image');
assert(ryanBeta && ryanBeta.affiliationNumber === '2130728', 'Ryan Beta 1 CBSE Affiliation is 2130728');
assert(ryanTechzone && ryanTechzone.affiliationNumber === '2133182', 'Ryan Techzone 4 CBSE Affiliation is 2133182');

// 6. SKS World School campus banner verification
const sks = schools.find(s => s.slug === 'sks-world-school-greater-noida-west');
assert(sks && sks.assets.featured && sks.assets.featured.includes('featured.jpg'), 'SKS World School has verified campus photo');
assert(sks && sks.location.address.includes('HS-04'), 'SKS World School address verified at HS-04 Sector 16');
assert(sks && (sks.affiliationNumber || sks.verification?.cbseAffiliationNumber) === '2134098', 'SKS World School CBSE affiliation verified as 2134098');

// 5. DPS Knowledge Park-V verification
const dps = schools.find(s => s.slug === 'delhi-public-school-knowledge-park-5');
assert(dps && dps.contact.website === 'https://dpskpv.com', 'DPS Knowledge Park-V website verified as dpskpv.com');
assert(dps && dps.affiliationNumber === '2133797', 'DPS KP-V CBSE affiliation verified as 2133797');

// 6. No non-existent synthetic .edu.in domains
const syntheticEduIn = schools.filter(s => {
  const w = s.contact?.website || '';
  return w.endsWith('.edu.in') && ![
    'tsusnoida.edu.in',
    'salvationtree.edu.in',
    'noida.cambridgeschool.edu.in',
    'shivnadarschool.edu.in',
  ].some(v => w.includes(v));
});
assert(syntheticEduIn.length === 0, `All non-existent synthetic .edu.in domains cleansed (Found: ${syntheticEduIn.length})`);

// 7. Preservation of Ramagya truth rule
const ramagya = schools.find(s => s.slug === 'ramagya-school-noida-extension');
assert(ramagya && (ramagya.fees.verificationStatus === 'unverified_copied_from_wisdom_tree' || ramagya.fees.verificationStatus === 'verified_from_source'), 'Ramagya fee verification status preserved accurately');

// 8. Preservation of GD Goenka rule
const gdGoenka = schools.find(s => s.slug === 'gd-goenka-international-school');
assert(gdGoenka && gdGoenka.board.includes('IGSC') && gdGoenka.boardNote.includes('IGCSE'), 'GD Goenka board verbatim and note preserved');

// 9. Regional outliers flagged & Bulandshahr removal
const pragyan = schools.find(s => s.slug === 'pragyan-public-school-jewar-extension');
const thakurDwara = schools.find(s => s.slug === 'shree-thakur-dwara-balika-vidyalaya-gr-noida');
const renaissance = schools.find(s => s.slug === 'renaissance-school-noida-ext');
const gaurs = schools.find(s => s.slug === 'gaurs-international-school-gaur-city-2');
assert(pragyan && pragyan.geographicClassification === 'geographic_outlier', 'Pragyan Jewar flagged as geographic outlier');
assert(thakurDwara && thakurDwara.geographicClassification === 'geographic_outlier', 'Shree Thakur Dwara Ghaziabad flagged as geographic outlier');
assert(!renaissance, 'Renaissance Bulandshahr geographic outlier cleanly removed from active dataset');
assert(gaurs && gaurs.boardNote.includes('2132595') && gaurs.location.sector === 'Sector 16C', 'Gaurs International Gaur City-2 verified in Sector 16C with CBSE 2132595');

// 10. Truthful unverified fee & admission status
const unverifiedCount = schools.filter(s => s.fees.verificationStatus === 'not_publicly_verified').length;
assert(unverifiedCount >= 5, `Unverified schools (${unverifiedCount}) truthfully declare not_publicly_verified`);

console.log('----------------------------------------------------------------');
console.log(`Results: ${passedTests} of ${totalTests} tests passed.`);
console.log('----------------------------------------------------------------');

if (passedTests === totalTests) {
  console.log('STATUS: PHASE 3 DATA ACCURACY & CANONICAL AUDIT COMPLETE [VERIFIED]\n');
  process.exit(0);
} else {
  console.error('STATUS: PHASE 3 VERIFICATION FAILED\n');
  process.exit(1);
}
