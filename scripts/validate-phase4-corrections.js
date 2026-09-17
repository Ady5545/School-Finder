/**
 * ADMISSION PITARA - PHASE 4 CONTROLLED DATABASE CORRECTIONS TEST SUITE
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('  ADMISSION PITARA - PHASE 4 CONTROLLED CORRECTIONS TEST SUITE ');
console.log('================================================================\n');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
assert(fs.existsSync(schoolsPath), 'data/schools.json exists');

const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

// 1. Total & Active Counts
assert(schools.length === 70, 'Total raw records count is 70');
const activeCanonical = schools.filter(s => !s.isArchived && !s.isDuplicate);
assert(activeCanonical.length === 56, 'Active canonical count is exactly 56');

const archivedCount = schools.filter(s => s.isArchived).length;
assert(archivedCount === 12, 'Archived records count is exactly 12');

const aliasCount = schools.filter(s => s.isDuplicate).length;
assert(aliasCount === 2, 'Alias records count is exactly 2');

// 2. Affiliation Duplicate Check among Active Canonical
const affMap = {};
activeCanonical.forEach(s => {
  const aff = s.verification?.cbseAffiliationNumber || s.affiliationNumber;
  if (aff && aff !== 'N/A' && aff !== 'Pending') {
    if (!affMap[aff]) affMap[aff] = [];
    affMap[aff].push(s.id);
  }
});

let duplicateAffs = 0;
Object.keys(affMap).forEach(aff => {
  if (affMap[aff].length > 1) duplicateAffs++;
});
assert(duplicateAffs === 0, 'Zero duplicate affiliation numbers exist among active canonical schools');

// 3. DAV Public School Verification
const dav = schools.find(s => s.id === 'crossings-republic-dav-public-school');
assert(dav !== undefined, 'DAV Public School record exists');
assert(dav.recordType === 'canonical', 'DAV Public School recordType is canonical');
assert(!dav.affiliationNumber && !dav.verification?.cbseAffiliationNumber, 'DAV Public School has no copied affiliation 2132338');
assert(dav.studentTeacherRatio === 'Not publicly verified', 'DAV Public School studentTeacherRatio is Not publicly verified');

// 4. Oxford Green Verification
const oxford = schools.find(s => s.id === 'oxford-green-public-school-greater-noida-west');
assert(oxford !== undefined, 'Oxford Green record exists');
assert(!oxford.affiliationNumber && !oxford.verification?.cbseAffiliationNumber, 'Oxford Green has no copied affiliation 2133182');
assert(oxford.studentTeacherRatio === 'Not publicly verified', 'Oxford Green studentTeacherRatio is Not publicly verified');

// 5. Gaurs International School
const gaurs = schools.find(s => s.id === 'gaurs-international-school-gaur-city-2');
assert(gaurs !== undefined, 'Gaurs International School record exists');
assert(gaurs.recordType === 'canonical', 'Gaurs International School recordType is canonical');

// 6. Gagan Public School
const gagan = schools.find(s => s.id === 'gagan-public-school-sector-4');
assert(gagan !== undefined, 'Gagan Public School record exists');
assert((gagan.verification?.cbseAffiliationNumber || gagan.affiliationNumber) === '2132338', 'Gagan Public School retains verified affiliation 2132338');

// 7. Ryan Techzone 4
const ryanTechzone = schools.find(s => s.id === 'ryan-international-school-noida-extension');
assert(ryanTechzone !== undefined, 'Ryan Techzone 4 record exists');
assert((ryanTechzone.verification?.cbseAffiliationNumber || ryanTechzone.affiliationNumber) === '2133182', 'Ryan Techzone 4 retains verified affiliation 2133182');

// 8. Synthetic Data Removal Verification
const GENERIC_ADM = 'Online inquiry or campus registration followed by document submission and interaction.';
const GENERIC_FAC_NAMES = ['Computer Lab', 'Library', 'Playground & Sports Facilities', 'Science Lab', 'Transport Facilities'].sort().join('|');

let syntheticStrCount = 0;
let syntheticFacCount = 0;
let syntheticAdmCount = 0;

activeCanonical.forEach(s => {
  const isUnverifiedVerif = s.verification?.status !== 'verified_official';
  if (isUnverifiedVerif) {
    if (s.studentTeacherRatio === '15:1') syntheticStrCount++;
    const facNames = (s.facilities || []).map(f => f.name).sort().join('|');
    if (facNames === GENERIC_FAC_NAMES) syntheticFacCount++;
    if (s.admissions?.process === GENERIC_ADM) syntheticAdmCount++;
  }
});

assert(syntheticStrCount === 0, 'Zero synthetic 15:1 ratios remain among unverified schools');
assert(syntheticFacCount === 0, 'Zero synthetic 5-item facility arrays remain among unverified schools');
assert(syntheticAdmCount === 0, 'Zero generic admission process sentences remain among unverified schools');

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passed} of ${total} tests passed.`);
console.log('----------------------------------------------------------------');
if (passed === total) {
  console.log('STATUS: PHASE 4 CONTROLLED CORRECTIONS VERIFIED CLEANLY [PASS]\n');
} else {
  console.log('STATUS: PHASE 4 VERIFICATION FAILED\n');
  process.exit(1);
}
