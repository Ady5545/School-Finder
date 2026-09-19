/**
 * Admission Pitara - Current dataset integrity & correction suite
 * Counts are derived from the canonical dataset; no stale historical totals.
 */
const fs = require('fs');
const path = require('path');

let passed = 0;
let total = 0;
function assert(condition, message) {
  total++;
  if (condition) { console.log('[PASS] ' + message); passed++; }
  else { console.error('[FAIL] ' + message); process.exitCode = 1; }
}

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
assert(fs.existsSync(schoolsPath), 'data/schools.json exists');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

const activeCanonical = schools.filter(s => !s.isArchived && !s.isDuplicate);
assert(schools.length > 0, 'Dataset is non-empty');
assert(activeCanonical.length > 0, 'Active canonical dataset is non-empty');

const explicitlyArchived = [
  'Prudence School','Shemford Futuristic School',"Scholars' Rosary School",'Oxford Green Public School',
  'The Icon International School','Kalka Public School','Vienna Public School',
  'Blooming Buds Senior Secondary School','Jinvani Bharti Public School','Glorious Public School',
  'Aditi Public School','Navjeevan Mission School','Mother Teresa Public School',
  'D-Point High School','Om Sun International School','Mount Olympus School'
];
for (const name of explicitlyArchived) {
  const school = schools.find(s => s.name === name);
  assert(Boolean(school), 'Explicit archive target exists: ' + name);
  assert(Boolean(school?.isArchived) && school?.status === 'archived',
    'Explicit archive target retained and archived: ' + name);
}

const ids = schools.map(s => s.id);
const slugs = schools.map(s => s.slug);
assert(new Set(ids).size === ids.length, 'No duplicate school IDs');
assert(new Set(slugs).size === slugs.length, 'No duplicate school slugs');

const affMap = {};
for (const s of activeCanonical) {
  const aff = s.verification?.cbseAffiliationNumber || s.affiliationNumber;
  if (aff && aff !== 'N/A' && aff !== 'Pending') (affMap[aff] ||= []).push(s.id);
}
assert(Object.values(affMap).every(ids => ids.length === 1),
  'No duplicate affiliation numbers among active canonical schools');

const gaurs = schools.find(s => s.id === 'gaurs-international-school-gaur-city-2');
assert(gaurs?.recordType === 'canonical', 'Gaurs International School remains canonical');

const gagan = schools.find(s => s.id === 'gagan-public-school-sector-4');
assert(gagan !== undefined, 'Gagan Public School record exists');
assert((gagan.verification?.cbseAffiliationNumber || gagan.affiliationNumber) === '2132338',
  'Gagan Public School retains verified affiliation 2132338');

const ryan = schools.find(s => s.id === 'ryan-international-school-noida-extension');
assert(ryan !== undefined, 'Ryan International School, Greater Noida West record exists');
assert((ryan.verification?.cbseAffiliationNumber || ryan.affiliationNumber) === '2133182',
  'Ryan International School retains verified affiliation 2133182');

const GENERIC_ADM = 'Online inquiry or campus registration followed by document submission and interaction.';
const GENERIC_FAC_NAMES = ['Computer Lab','Library','Playground & Sports Facilities','Science Lab','Transport Facilities'].sort().join('|');
let syntheticStrCount = 0, syntheticFacCount = 0, syntheticAdmCount = 0;
for (const s of activeCanonical) {
  if (s.verification?.status !== 'verified_official') {
    if (s.studentTeacherRatio === '15:1') syntheticStrCount++;
    const facNames = (s.facilities || []).map(f => f.name).sort().join('|');
    if (facNames === GENERIC_FAC_NAMES) syntheticFacCount++;
    if (s.admissions?.process === GENERIC_ADM) syntheticAdmCount++;
  }
}
assert(syntheticStrCount === 0, 'No synthetic 15:1 ratios remain among unverified schools');
assert(syntheticFacCount === 0, 'No synthetic generic facility arrays remain among unverified schools');
assert(syntheticAdmCount === 0, 'No generic admission-process sentence remains among unverified schools');

console.log('\nResults: ' + passed + ' of ' + total + ' tests passed.');
if (passed === total) {
  console.log('STATUS: CURRENT DATASET INTEGRITY VERIFIED [PASS]');
  process.exit(0);
}
console.log('STATUS: CURRENT DATASET INTEGRITY FAILED');
process.exit(1);
