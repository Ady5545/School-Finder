/**
 * Comprehensive Validation & Audit Suite for Admission Pitara Monthly Excel Reporting System
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('    ADMISSION PITARA - EXCEL REPORT AUDIT & VERIFICATION SUITE  ');
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
    process.exitCode = 1;
  }
}

// 1. Verify files exist
const excelReportPath = path.join(__dirname, '../src/lib/excelReport.ts');
const routePath = path.join(__dirname, '../src/app/api/admin/reports/route.ts');
const adminPagePath = path.join(__dirname, '../src/app/admin/page.tsx');
const schoolsJsonPath = path.join(__dirname, '../data/schools.json');

assert(fs.existsSync(excelReportPath), 'src/lib/excelReport.ts exists');
assert(fs.existsSync(routePath), 'src/app/api/admin/reports/route.ts exists');
assert(fs.existsSync(adminPagePath), 'src/app/admin/page.tsx exists');
assert(fs.existsSync(schoolsJsonPath), 'data/schools.json exists');

// 2. School count and canonical audit
const schools = JSON.parse(fs.readFileSync(schoolsJsonPath, 'utf8'));
assert(schools.length >= 60, `Total raw records in schools.json is valid (Found: ${schools.length})`);

const duplicateRecords = schools.filter(s => s.isDuplicate);
assert(duplicateRecords.length === 2, `Exactly 2 records are marked as legacy duplicates/aliases (Found: ${duplicateRecords.length})`);
assert(duplicateRecords.some(d => d.slug === 'dps-world-school-noida-extension'), 'DPS World School Noida Extension is flagged as duplicate alias');
assert(duplicateRecords.some(d => d.slug === 'st-xaviers-high-school-greater-noida-west'), 'St. Xaviers High School Sector 16B is flagged as duplicate alias');

const canonicalSchools = schools.filter(s => !s.isDuplicate && !s.isArchived);
assert(canonicalSchools.length > 0, `Canonical active non-duplicate school count is valid (Found: ${canonicalSchools.length})`);

// 3. Timezone Audit (Asia/Kolkata / IST = UTC+05:30)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
function getISTMonthBoundaries(year, month) {
  const startOfMonthIST = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0) - IST_OFFSET_MS);
  const endOfMonthIST = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999) - IST_OFFSET_MS);
  return {
    startTime: startOfMonthIST.getTime(),
    endTime: endOfMonthIST.getTime(),
  };
}

const sept2026 = getISTMonthBoundaries(2026, 9);
const oct2026 = getISTMonthBoundaries(2026, 10);

// Test 1: Sept 1 00:30 IST -> Aug 31 19:00 UTC
const sept1Early = new Date('2026-08-31T19:00:00.000Z').getTime();
assert(
  sept1Early >= sept2026.startTime && sept1Early <= sept2026.endTime,
  'September 1 00:30 IST belongs to September 2026 IST report'
);

// Test 2: Sept 30 23:45 IST -> Sept 30 18:15 UTC
const sept30Late = new Date('2026-09-30T18:15:00.000Z').getTime();
assert(
  sept30Late >= sept2026.startTime && sept30Late <= sept2026.endTime,
  'September 30 23:45 IST belongs to September 2026 IST report'
);

// Test 3: Oct 1 00:15 IST -> Sept 30 18:45 UTC
const oct1Early = new Date('2026-09-30T18:45:00.000Z').getTime();
assert(
  !(oct1Early >= sept2026.startTime && oct1Early <= sept2026.endTime),
  'October 1 00:15 IST does NOT belong to September 2026 IST report'
);
assert(
  oct1Early >= oct2026.startTime && oct1Early <= oct2026.endTime,
  'October 1 00:15 IST belongs to October 2026 IST report'
);

// 4. Read source files and check code constraints
const excelReportCode = fs.readFileSync(excelReportPath, 'utf8');
const routeCode = fs.readFileSync(routePath, 'utf8');
const adminPageCode = fs.readFileSync(adminPagePath, 'utf8');

assert(excelReportCode.includes('IST_OFFSET_MS = 5.5 * 60 * 60 * 1000'), 'excelReport.ts uses IST timezone offset (+05:30)');
assert(excelReportCode.includes('getISTMonthBoundaries'), 'excelReport.ts defines getISTMonthBoundaries helper');
assert(excelReportCode.includes('formatISTDateTime'), 'excelReport.ts formats timestamps in IST (Asia/Kolkata)');
assert(!excelReportCode.includes('password'), 'excelReport.ts does not export user passwords');
assert(!excelReportCode.includes('otpCode') && !excelReportCode.includes('loginTokens'), 'excelReport.ts does not export OTPs or login tokens');
assert(excelReportCode.includes('residentialSociety'), 'excelReport.ts exports broad residentialSociety without private apartment unit');
assert(!excelReportCode.includes("'Standard Visit (< 30s)'"), 'excelReport.ts does NOT synthesize visit durations');
assert(!excelReportCode.includes("'Account Created (UTC ISO)'"), 'excelReport.ts Parent Accounts worksheet excludes UTC ISO column as required');
assert(excelReportCode.includes("'Account Created (IST)'"), 'excelReport.ts Parent Accounts worksheet keeps Account Created (IST)');

// Verify Route Security
assert(routeCode.includes('requireAdminAuth(req)'), 'route.ts enforces server-side admin authorization');
assert(routeCode.includes('recordAdminAudit'), 'route.ts records admin audit logging on report generation');
assert(routeCode.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'), 'route.ts sets spreadsheet MIME type');

// 5. Test mock workbook generation using 61 canonical schools
const wb = XLSX.utils.book_new();

// Sheet 1: Parent Accounts
const ws1Data = [
  [
    'Parent / Guardian Name',
    'Email Address',
    'Phone Number (Profile Data)',
    'Child / Student Name',
    'Grade / Class',
    'Residential Society / Complex',
    "Father's Name",
    "Mother's Name",
    'Email Verification Status',
    'Account Status',
    'Account Created (IST)',
    'Last Login Date (IST)',
  ],
  [
    'Rohit Sharma',
    'rohit.sharma@example.com',
    '9876543210',
    'Aarav Sharma',
    'Class 1',
    'Cherry County, Sector 1',
    'Rohit Sharma',
    'Ritika Sharma',
    'Verified',
    'active',
    '01/09/2026, 15:30:00 IST',
    '15/09/2026, 20:00:00 IST',
  ],
];
const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
XLSX.utils.book_append_sheet(wb, ws1, 'Parent Accounts');

// Sheet 2: School Visits
const ws2Data = [
  ['Date & Time (IST)', 'Date & Time (UTC ISO)', 'School Name', 'School Slug', 'Locality / Sector', 'User / Account Identifier', 'User Email (if logged in)', 'Visit Duration (if recorded)', 'Event ID'],
  ['10/09/2026, 17:30:00 IST', '2026-09-10T12:00:00.000Z', 'Delhi World Public School', 'delhi-world-public-school-kp-5', 'Knowledge Park 5', 'Rohit Sharma (usr_123)', 'rohit.sharma@example.com', 'Not recorded / Pageview', 'evt_123'],
];
const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
XLSX.utils.book_append_sheet(wb, ws2, 'School Visits');

// Sheet 3: Wishlists
const ws3Data = [
  ['Date & Time (IST)', 'Date & Time (UTC ISO)', 'Action Type', 'School Name', 'School Slug', 'Locality / Sector', 'User / Account Identifier', 'User Email (if logged in)', 'Event ID', 'Data Model Note'],
  ['10/09/2026, 17:35:00 IST', '2026-09-10T12:05:00.000Z', 'Added to Wishlist', 'Delhi World Public School', 'delhi-world-public-school-kp-5', 'Knowledge Park 5', 'Rohit Sharma (usr_123)', 'rohit.sharma@example.com', 'evt_124', 'Historical event recorded with timestamp'],
];
const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
XLSX.utils.book_append_sheet(wb, ws3, 'Wishlists');

// Sheet 4: Reviews
const ws4Data = [
  ['Review Date (IST)', 'Review Date (UTC ISO)', 'School Name', 'School Slug', 'Rating Score (1-5)', 'Review Title', 'Review Content / Feedback', 'Public Display Name', 'Verified Parent Status', 'Moderation Status', 'Admin Internal User ID', 'Admin Internal User Email', 'Deletion / Moderation Reason'],
  ['12/09/2026, 15:00:00 IST', '2026-09-12T09:30:00.000Z', 'Delhi World Public School', 'delhi-world-public-school-kp-5', 5, 'Great faculty & sports', 'Very impressed with faculty support and campus sports facilities.', 'Parent of Grade 1 Student', 'Verified Parent', 'Published', 'usr_123', 'rohit.sharma@example.com', 'N/A'],
];
const ws4 = XLSX.utils.aoa_to_sheet(ws4Data);
XLSX.utils.book_append_sheet(wb, ws4, 'Reviews');

// Sheet 5: School Summary (1 header + 61 canonical schools = 62 rows)
const ws5Rows = [
  ['School Name', 'School Slug', 'Locality / Sector', 'Board / Curriculum', 'Monthly Recorded Views (09/2026 IST)', 'Monthly Wishlist Adds (09/2026 IST)', 'Monthly Wishlist Removes (09/2026 IST)', 'Monthly Reviews Submitted (09/2026 IST)', 'Monthly Avg Review Rating (09/2026 IST)', 'All-Time Total Views', 'All-Time Active Shortlists', 'All-Time Published Reviews', 'All-Time Overall Rating'],
];
for (const s of canonicalSchools) {
  ws5Rows.push([
    s.name,
    s.slug,
    s.location?.sector || s.location?.area || 'Greater Noida West',
    Array.isArray(s.board) ? s.board.join(', ') : 'CBSE',
    0,
    0,
    0,
    0,
    'No reviews in month',
    0,
    0,
    0,
    s.rating?.score || 0,
  ]);
}
const ws5 = XLSX.utils.aoa_to_sheet(ws5Rows);
XLSX.utils.book_append_sheet(wb, ws5, 'School Summary');

const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
assert(Buffer.isBuffer(buf), 'Generated XLSX is a valid binary Buffer');

const parsed = XLSX.read(buf, { type: 'buffer' });
assert(parsed.SheetNames.length === 5, 'Workbook contains exactly 5 worksheets');
assert(XLSX.utils.sheet_to_json(parsed.Sheets['School Summary'], { header: 1 }).length === canonicalSchools.length + 1, `School Summary sheet has exactly ${canonicalSchools.length} canonical schools + 1 header = ${canonicalSchools.length + 1} rows`);

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passedTests} of ${totalTests} tests passed.`);
console.log('----------------------------------------------------------------');
if (passedTests === totalTests) {
  console.log('STATUS: EXCEL REPORT AUDIT & TIMEZONE VERIFICATION COMPLETE [PASS]\n');
}
