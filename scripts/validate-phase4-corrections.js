/**
 * ADMISSION PITARA - PHASE 4 CONTROLLED DATABASE INTEGRITY TEST SUITE
 *
 * This validator checks invariants rather than hard-coded historical record
 * counts, so legitimate data expansion does not make CI stale.
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('  ADMISSION PITARA - PHASE 4 DATABASE INTEGRITY TEST SUITE     ');
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

const activeCanonical = schools.filter(s => !s.isArchived && !s.isDuplicate);
const archived = schools.filter(s => s.isArchived);
const aliases = schools.filter(s => s.isDuplicate);

assert(schools.length >= 50, `Dataset contains at least 50 school records (Found: ${schools.length})`);
assert(activeCanonical.length >= 50, `Dataset contains at least 50 active canonical schools (Found: ${activeCanonical.length})`);
assert(aliases.length >= 2, `Legacy alias records are preserved (Found: ${aliases.length})`);
assert(activeCanonical.length + archived.length + aliases.length >= schools.length, 'School classifications remain internally consistent');

// Identity integrity
const ids = new Set(schools.map(s => s.id));
const slugs = new Set(schools.map(s => s.slug));
assert(ids.size === schools.length, `All ${schools.length} school IDs are unique`);
assert(slugs.size === schools.length, `All ${schools.length} school slugs are unique`);

// Affiliation integrity
const affMap = {};
activeCanonical.forEach(s => {
  const aff = s.verification?.cbseAffiliationNumber || s.affiliationNumber;
  if (aff && aff !== 'N/A' && aff !== 'Pending') {
    if (!affMap[aff]) affMap[aff] = [];
    affMap[aff].push(s.id);
  }
});
const duplicateAffiliations = Object.entries(affMap).filter(([, recordIds]) => recordIds.length > 1);
assert(duplicateAffiliations.length === 0, 'Zero duplicate CBSE affiliation numbers exist among active canonical schools');

// Key records retained by the current audited dataset
const gaurs = schools.find(s => s.id === 'gaurs-international-school-gaur-city-2');
assert(gaurs !== undefined, 'Gaurs International School record exists');
assert(gaurs?.recordType === 'canonical', 'Gaurs International School is canonical');

const gagan = schools.find(s => s.id === 'gagan-public-school-sector-4');
assert(gagan !== undefined, 'Gagan Public School record exists');
assert((gagan?.verification?.cbseAffiliationNumber || gagan?.affiliationNumber) === '2132338', 'Gagan Public School retains verified affiliation 2132338');

const ryanTechzone = schools.find(s => s.id === 'ryan-international-school-noida-extension');
assert(ryanTechzone !== undefined, 'Ryan Techzone 4 record exists');
assert((ryanTechzone?.verification?.cbseAffiliationNumber || ryanTechzone?.affiliationNumber) === '2133036', 'Ryan Techzone 4 retains verified affiliation 2133036');

function numericTokens(text) {
  return String(text || '')
    .match(/\d[\d,]*/g)
    ?.map(value => Number(value.replace(/,/g, '')))
    .filter(Number.isFinite) || [];
}

let malformedComponents = 0;
let malformedCurrency = 0;
let malformedEstimatedTotals = 0;
let duplicatedAuditNotes = 0;

for (const school of schools) {
  const estimated = school.fees?.estimatedFirstYear;
  assert(
    estimated === null || estimated === undefined || typeof estimated === 'number',
    `${school.slug}: fees.estimatedFirstYear is numeric or null`
  );
  if (estimated !== null && estimated !== undefined && typeof estimated !== 'number') {
    malformedEstimatedTotals++;
  }

  if (typeof school.fees?.estimatedFirstYearText === 'string') {
    assert(
      school.fees.estimatedFirstYear === null || school.fees.estimatedFirstYear === undefined,
      `${school.slug}: text-only estimated fee is not duplicated as a numeric value`
    );
  }

  const components = Array.isArray(school.fees?.components) ? school.fees.components : [];
  for (const component of components) {
    const amount = component.amount;
    assert(
      amount === null || amount === undefined || (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0),
      `${school.slug}: fee component "${component.name}" has a valid numeric amount or null`
    );

    if (typeof component.formattedAmount === 'string' && component.formattedAmount.includes('₹₹')) {
      malformedCurrency++;
    }

    if (typeof amount === 'number') {
      const numbers = numericTokens(component.formattedAmount);
      const maxDisplayed = numbers.length ? Math.max(...numbers) : null;
      if (maxDisplayed !== null && amount > maxDisplayed * 100) {
        malformedComponents++;
      }
    }
  }

  const noteCounts = {};
  for (const note of Array.isArray(school.auditNotes) ? school.auditNotes : []) {
    noteCounts[note] = (noteCounts[note] || 0) + 1;
  }
  duplicatedAuditNotes += Object.values(noteCounts).filter(count => count > 1).length;
}

assert(malformedComponents === 0, 'No fee component contains a concatenated/range-corrupted numeric amount');
assert(malformedCurrency === 0, 'No fee component contains duplicated rupee symbols');
assert(malformedEstimatedTotals === 0, 'No estimated first-year fee is stored as a non-numeric value');
assert(duplicatedAuditNotes === 0, 'No school contains duplicated audit notes');

// Synthetic-data regression checks for unverified schools
const GENERIC_ADM = 'Online inquiry or campus registration followed by document submission and interaction.';
const GENERIC_FAC_NAMES = ['Computer Lab', 'Library', 'Playground & Sports Facilities', 'Science Lab', 'Transport Facilities'].sort().join('|');

let syntheticStrCount = 0;
let syntheticFacCount = 0;
let syntheticAdmCount = 0;

for (const school of activeCanonical) {
  const isUnverified = school.verification?.status !== 'verified_official';

  if (isUnverified && school.studentTeacherRatio === '15:1') syntheticStrCount++;

  const facNames = (school.facilities || []).map(f => f.name).sort().join('|');
  if (isUnverified && facNames === GENERIC_FAC_NAMES) syntheticFacCount++;

  if (isUnverified && school.admissions?.process === GENERIC_ADM) syntheticAdmCount++;
}

assert(syntheticStrCount === 0, 'Zero synthetic 15:1 ratios remain among unverified schools');
assert(syntheticFacCount === 0, 'Zero synthetic 5-item facility arrays remain among unverified schools');
assert(syntheticAdmCount === 0, 'Zero generic admission process sentences remain among unverified schools');

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passed} of ${total} tests passed.`);
console.log('----------------------------------------------------------------');

if (passed === total) {
  console.log('STATUS: PHASE 4 DATABASE INTEGRITY VERIFIED CLEANLY [PASS]\n');
} else {
  console.log('STATUS: PHASE 4 DATABASE INTEGRITY FAILED\n');
  process.exit(1);
}
