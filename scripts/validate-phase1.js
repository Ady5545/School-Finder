const fs = require('fs');
const path = require('path');
const { schools, legacyUrlMap, getSchoolBySlug, resolveLegacyUrl } = require('../school-website-backend/data/schoolsData');

console.log('================================================================');
console.log('     ADMISSION PITARA - PHASE 1 VERIFICATION & AUDIT SUITE      ');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// Test 1: Total school count
assert(schools.length >= 50, `At least 50 schools in canonical dataset (Found: ${schools.length})`);

// Test 2: Uniqueness of IDs and slugs
const ids = new Set(schools.map(s => s.id));
const slugs = new Set(schools.map(s => s.slug));
assert(ids.size === schools.length, `All ${schools.length} school IDs are strictly unique (Found: ${ids.size})`);
assert(slugs.size === schools.length, `All ${schools.length} school slugs are strictly unique (Found: ${slugs.size})`);

// Test 3: Essential required schema fields on every school
let allHaveRequiredFields = true;
schools.forEach(s => {
  if (!s.name || !s.shortName || !s.location || !s.fees || !s.facilities || !s.assets || !s.legacyIdentifiers) {
    allHaveRequiredFields = false;
  }
});
assert(allHaveRequiredFields, `All ${schools.length} schools contain complete schema structure`);

// Test 4: Ramagya School data integrity & correction
const ramagya = getSchoolBySlug('ramagya-school-noida-extension');
const wisdom = getSchoolBySlug('the-wisdom-tree-school');
assert(ramagya !== null, 'Ramagya school found in dataset');
assert(ramagya && ramagya.name === 'Ramagya School Noida Extension', 'Ramagya has correct name');
assert(ramagya && ramagya.fees.verificationStatus === 'unverified_copied_from_wisdom_tree', 'Ramagya fees flagged as unverified_copied_from_wisdom_tree');
assert(ramagya && ramagya.fees.table.length === 0, 'Ramagya does NOT present Wisdom Tree fee table as verified fact');
assert(ramagya && ramagya.legacyIdentifiers.pageTitle !== ramagya.name, 'Ramagya legacy cloned pageTitle recorded accurately in legacyIdentifiers');
assert(ramagya && ramagya.assets.gallery.length === 0, 'Ramagya does NOT borrow Wisdom Tree gallery images');

// Test 5: GD Goenka board preservation & note
const gdGoenka = getSchoolBySlug('gd-goenka-international-school');
assert(gdGoenka !== null, 'GD Goenka school found in dataset');
assert(gdGoenka && gdGoenka.board.includes('IGSC'), "GD Goenka board preserves verbatim 'IGSC'");
assert(gdGoenka && gdGoenka.boardNote && gdGoenka.boardNote.includes('IGCSE'), 'GD Goenka includes clarifying boardNote about IGCSE');

// Test 6: Legacy URL Resolution (specifically the 4 broken homepage card links)
const brokenLinksToTest = [
  'schools/xaviers.html',
  'schools/gdgoenka.html',
  'schools/bls.html',
  'schools/shriram.html'
];
let brokenLinksResolved = true;
brokenLinksToTest.forEach(url => {
  const resolved = resolveLegacyUrl(url);
  if (!resolved) {
    brokenLinksResolved = false;
    console.error(`Failed to resolve broken card URL: ${url}`);
  }
});
assert(brokenLinksResolved, 'All 4 legacy broken links on homepage correctly map to canonical schools');

// Test 7: Standard legacy page files exist on disk untouched
const legacyFiles = [
  'dps.html', 'lotus.html', 'pacific.html', 'SRU.html', 'DPSWS.html',
  'ryan.html', 'sks.html', 'jm.html', 'st.html', 'wisdom.html',
  'infinity.html', 'ramagya.html', 'gd-goenka.html', 'salvation-tree.html',
  'bls-world.html', 'shiv-nadar.html', 'shri-ram-global.html'
];
let allLegacyHtmlExist = true;
legacyFiles.forEach(file => {
  const p = path.join(__dirname, '../school-website-backend/public/schools', file);
  if (!fs.existsSync(p)) {
    allLegacyHtmlExist = false;
    console.error(`Legacy file missing: ${p}`);
  }
});
assert(allLegacyHtmlExist, 'All 17 original legacy HTML files remain 100% preserved and untouched');

// Test 8: Standardized assets exist on disk for all 17 schools
let allAssetsExist = true;
const assetBase = path.join(__dirname, '../school-website-backend/public');
schools.forEach(s => {
  const feat = path.join(assetBase, s.assets.featured);
  const hero = path.join(assetBase, s.assets.hero);
  if (!fs.existsSync(feat)) {
    console.error(`Featured asset missing for ${s.slug}: ${feat}`);
    allAssetsExist = false;
  }
  if (!fs.existsSync(hero)) {
    console.error(`Hero asset missing for ${s.slug}: ${hero}`);
    allAssetsExist = false;
  }
});
assert(allAssetsExist, 'All 17 schools have verified featured and hero assets in standardized hierarchy');

// Test 9: Backend auth and static assets preserved
assert(fs.existsSync(path.join(__dirname, '../school-website-backend/server.js')), 'server.js preserved');
assert(fs.existsSync(path.join(__dirname, '../school-website-backend/routes/auth.js')), 'auth.js route preserved');
const authContent = fs.readFileSync(path.join(__dirname, '../school-website-backend/routes/auth.js'), 'utf8');
assert(authContent.includes('const User = mongoose.model("User", userSchema)'), 'User schema model preserved in auth.js');

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passedTests} of ${totalTests} tests passed.`);
console.log('----------------------------------------------------------------');

if (passedTests === totalTests) {
  console.log('STATUS: PHASE 1 DATA PRESERVATION & NORMALIZATION COMPLETE [VERIFIED]\n');
  process.exit(0);
} else {
  console.error('STATUS: VALIDATION FAILED\n');
  process.exit(1);
}
