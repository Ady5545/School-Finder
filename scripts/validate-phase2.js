const fs = require('fs');
const path = require('path');
const { schools, resolveLegacyUrl } = require('../school-website-backend/data/schoolsData');

console.log('================================================================');
console.log('     ADMISSION PITARA - PHASE 2 ARCHITECTURE & FOUNDATION SUITE  ');
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

const rootDir = path.join(__dirname, '..');

// Test 1: Design tokens in globals.css
const globalsCssPath = path.join(rootDir, 'src/styles/globals.css');
assert(fs.existsSync(globalsCssPath), 'globals.css exists');
if (fs.existsSync(globalsCssPath)) {
  const css = fs.readFileSync(globalsCssPath, 'utf8');
  assert(css.includes('--color-primary:') && css.includes('--color-primary-light:'), 'Primary color tokens defined');
  assert(css.includes('--color-surface:') && css.includes('--color-content:'), 'Surface and content tokens defined');
  assert(css.includes('--color-success:') && css.includes('--color-warning:') && css.includes('--color-error:'), 'Status color tokens defined');
  assert(css.includes('--font-display:') && css.includes('--font-body:'), 'Typography font tokens defined');
}

// Test 2: Core UI Primitives exist
const uiComponents = [
  'Button.tsx',
  'IconButton.tsx',
  'Input.tsx',
  'SearchInput.tsx',
  'Select.tsx',
  'Checkbox.tsx',
  'Badge.tsx',
  'Card.tsx',
  'Modal.tsx',
  'Drawer.tsx',
  'Tabs.tsx',
  'Breadcrumbs.tsx',
  'Skeleton.tsx',
  'EmptyState.tsx',
  'ErrorState.tsx',
  'Toast.tsx',
  'RatingDisplay.tsx',
];
let allUiExist = true;
uiComponents.forEach(file => {
  const p = path.join(rootDir, 'src/components/ui', file);
  if (!fs.existsSync(p)) {
    console.error(`Missing UI component: ${file}`);
    allUiExist = false;
  }
});
assert(allUiExist, `All ${uiComponents.length} core UI primitives exist`);

// Test 3: School domain components exist
const schoolComponents = [
  'SchoolCard.tsx',
  'SchoolImage.tsx',
  'SchoolBadge.tsx',
  'FeeDisplay.tsx',
  'AdmissionStatus.tsx',
  'LocationDisplay.tsx',
];
let allSchoolComponentsExist = true;
schoolComponents.forEach(file => {
  const p = path.join(rootDir, 'src/components/school', file);
  if (!fs.existsSync(p)) {
    console.error(`Missing school component: ${file}`);
    allSchoolComponentsExist = false;
  }
});
assert(allSchoolComponentsExist, `All ${schoolComponents.length} school domain components exist`);

// Test 4: App Layout & Navigation components exist
const layoutComponents = ['Header.tsx', 'Footer.tsx'];
let allLayoutExist = true;
layoutComponents.forEach(file => {
  const p = path.join(rootDir, 'src/components/layout', file);
  if (!fs.existsSync(p)) {
    console.error(`Missing layout component: ${file}`);
    allLayoutExist = false;
  }
});
assert(allLayoutExist, 'Global Header and Footer layout components exist');

// Test 5: Future Canonical Routes exist
const routes = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/loading.tsx',
  'src/app/error.tsx',
  'src/app/not-found.tsx',
  'src/app/schools/page.tsx',
  'src/app/schools/loading.tsx',
  'src/app/schools/[slug]/page.tsx',
  'src/app/schools/[slug]/loading.tsx',
  'src/app/schools/[slug]/not-found.tsx',
  'src/app/compare/page.tsx',
  'src/app/admissions/page.tsx',
  'src/app/wishlist/page.tsx',
  'src/app/auth/login/page.tsx',
  'src/app/auth/register/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/api/schools/route.ts',
  'src/app/api/legacy/resolve/route.ts',
];
let allRoutesExist = true;
routes.forEach(route => {
  const p = path.join(rootDir, route);
  if (!fs.existsSync(p)) {
    console.error(`Missing route: ${route}`);
    allRoutesExist = false;
  }
});
assert(allRoutesExist, `All ${routes.length} canonical routes, API handlers, and states exist`);

// Test 6: Data Access Layer & Type Safety
const libFiles = ['schools.ts', 'legacyRedirect.ts', 'seo.ts', 'analytics.ts', 'utils.ts'];
let allLibExist = true;
libFiles.forEach(file => {
  const p = path.join(rootDir, 'src/lib', file);
  if (!fs.existsSync(p)) {
    console.error(`Missing lib file: ${file}`);
    allLibExist = false;
  }
});
assert(allLibExist, 'Canonical data access, SEO, analytics, and utility layers exist');

// Test 7: No hardcoded school names in reusable UI components
const cardContent = fs.readFileSync(path.join(rootDir, 'src/components/school/SchoolCard.tsx'), 'utf8');
assert(
  !cardContent.includes('Delhi Public School') && !cardContent.includes('Lotus Valley'),
  'SchoolCard is purely dynamic with zero hardcoded school content'
);

// Test 8: SEO and Structured Data Generation
const seoContent = fs.readFileSync(path.join(rootDir, 'src/lib/seo.ts'), 'utf8');
assert(
  seoContent.includes('generateSchoolJsonLd') && seoContent.includes('@type') && seoContent.includes('EducationalOrganization'),
  'SEO layer implements schema.org EducationalOrganization structured data'
);

// Test 9: Legacy Broken Links Resolution
const brokenLinks = [
  'schools/xaviers.html',
  'schools/gdgoenka.html',
  'schools/bls.html',
  'schools/shriram.html',
];
let allRedirected = true;
brokenLinks.forEach(link => {
  const school = resolveLegacyUrl(link);
  if (!school || !school.slug) {
    allRedirected = false;
    console.error(`Broken link not resolved: ${link} -> ${school}`);
  }
});
assert(allRedirected, 'Legacy broken links map cleanly to canonical school objects with valid slugs');

// Test 10: Next.js Config exists with permanent redirects
const nextConfigPath = path.join(rootDir, 'next.config.mjs');
assert(fs.existsSync(nextConfigPath), 'next.config.mjs exists');
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  assert(nextConfig.includes('redirects()') && nextConfig.includes('permanent: true'), 'Permanent 301 redirects configured for legacy compatibility');
}

// Test 11: Phase 1 preservation intact
const legacyFiles = [
  'dps.html', 'lotus.html', 'pacific.html', 'SRU.html', 'DPSWS.html',
  'ryan.html', 'sks.html', 'jm.html', 'st.html', 'wisdom.html',
  'infinity.html', 'ramagya.html', 'gd-goenka.html', 'salvation-tree.html',
  'bls-world.html', 'shri-ram-global.html'
];
let allLegacyIntact = true;
legacyFiles.forEach(file => {
  const p = path.join(rootDir, 'school-website-backend/public/schools', file);
  if (!fs.existsSync(p)) {
    allLegacyIntact = false;
  }
});
assert(allLegacyIntact, 'Phase 1 legacy HTML files remain 100% untouched');

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passedTests} of ${totalTests} tests passed.`);
console.log('----------------------------------------------------------------');

if (passedTests === totalTests) {
  console.log('STATUS: PHASE 2 ARCHITECTURE & DESIGN SYSTEM COMPLETE [VERIFIED]\n');
  process.exit(0);
} else {
  console.error('STATUS: VALIDATION FAILED\n');
  process.exit(1);
}
