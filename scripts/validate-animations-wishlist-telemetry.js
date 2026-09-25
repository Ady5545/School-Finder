/**
 * ADMISSION PITARA - SCROLL ANIMATIONS, WISHLIST RELIABILITY & VISIT TELEMETRY VALIDATION
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('  ADMISSION PITARA - ANIMATIONS, WISHLIST & TELEMETRY SUITE    ');
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

// -----------------------------------------------------------------------------
// 1. SCROLL REVEAL ANIMATIONS & CSS ARCHITECTURE
// -----------------------------------------------------------------------------
const cssPath = path.join(__dirname, '..', 'src', 'styles', 'globals.css');
assert(fs.existsSync(cssPath), 'src/styles/globals.css exists');
const cssContent = fs.readFileSync(cssPath, 'utf8');

assert(
  cssContent.includes('.reveal-on-scroll') && cssContent.includes('opacity: 1;'),
  'Progressive default: .reveal-on-scroll has default opacity 1 for SSR and non-JS clients'
);

assert(
  cssContent.includes('html.has-scroll-reveal .reveal-on-scroll.is-pending') &&
  cssContent.includes('opacity: 0;'),
  'Pending state: is-pending hides below-the-fold content when JS observer is active'
);

assert(
  cssContent.includes('html.has-scroll-reveal .reveal-on-scroll.is-revealed') &&
  cssContent.includes('transform: translateY(0);'),
  'Revealed state: is-revealed animates translateY(0) and opacity 1'
);

assert(
  cssContent.includes('html.has-scroll-reveal .reveal-on-scroll.is-settled') &&
  cssContent.includes('transform: none;') &&
  cssContent.includes('transition: none;'),
  'Settled state: is-settled releases transforms and transitions for clean hover & layout'
);

assert(
  cssContent.includes('[data-reveal-delay="1"]') &&
  cssContent.includes('[data-reveal-delay="2"]') &&
  cssContent.includes('[data-reveal-delay="3"]') &&
  cssContent.includes('[data-reveal-delay="4"]'),
  'Staggered delays: graduated delays configured from 1 through 4+'
);

assert(
  cssContent.includes('@media (prefers-reduced-motion: reduce)') &&
  cssContent.includes('opacity: 1 !important;') &&
  cssContent.includes('transform: none !important;'),
  'Accessibility: prefers-reduced-motion completely bypasses reveal transitions'
);

// ScrollRevealManager
const srmPath = path.join(__dirname, '..', 'src', 'components', 'layout', 'ScrollRevealManager.tsx');
assert(fs.existsSync(srmPath), 'ScrollRevealManager.tsx exists');
const srmContent = fs.readFileSync(srmPath, 'utf8');

assert(
  !srmContent.includes('safetyTimeout = setTimeout(') &&
  !srmContent.includes('stuckElements.forEach'),
  'ScrollRevealManager does NOT prematurely kill observer with destructive safetyTimeout'
);

assert(
  srmContent.includes('IntersectionObserver') &&
  srmContent.includes("classList.remove('is-pending')") &&
  srmContent.includes("classList.add('is-revealed')"),
  'ScrollRevealManager dynamically arms and reveals elements via IntersectionObserver'
);

assert(
  srmContent.includes('MutationObserver'),
  'ScrollRevealManager dynamically observes DOM mutations for dynamic content'
);

// -----------------------------------------------------------------------------
// 2. HOMEPAGE REVEAL HIERARCHY
// -----------------------------------------------------------------------------
const pagePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
assert(fs.existsSync(pagePath), 'src/app/page.tsx exists');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(
  pageContent.includes('Explore schools') &&
  pageContent.includes('reveal-on-scroll'),
  'Homepage school discovery section header includes reveal-on-scroll'
);

assert(
  pageContent.includes('Parent-Centric Methodology') &&
  pageContent.includes('data-reveal-delay="1"') &&
  pageContent.includes('data-reveal-delay="5"'),
  'Homepage methodology section includes staggered reveal cards'
);

const whyPitaraPath = path.join(__dirname, '..', 'src', 'components', 'home', 'WhyAdmissionPitara.tsx');
const whyContent = fs.readFileSync(whyPitaraPath, 'utf8');
assert(
  whyContent.includes('Why Parents Rely on Admission Pitara') &&
  whyContent.includes('reveal-on-scroll'),
  'WhyAdmissionPitara includes reveal-on-scroll on header'
);

// -----------------------------------------------------------------------------
// 3. WISHLIST RELIABILITY & SYNCHRONIZATION
// -----------------------------------------------------------------------------
const storePath = path.join(__dirname, '..', 'src', 'lib', 'schoolStore.tsx');
assert(fs.existsSync(storePath), 'schoolStore.tsx exists');
const storeContent = fs.readFileSync(storePath, 'utf8');

assert(
  storeContent.includes('ANON_SHORTLIST_KEY') &&
  storeContent.includes('localStorage.getItem(ANON_SHORTLIST_KEY)'),
  'schoolStore hydrates anonymous shortlist from localStorage when unauthenticated'
);

assert(
  storeContent.includes("action: 'sync'") &&
  storeContent.includes('localStorage.removeItem(ANON_SHORTLIST_KEY)'),
  'schoolStore syncs anonymous shortlist with user account upon authentication and clears local key'
);

assert(
  storeContent.includes('addToShortlist') &&
  storeContent.includes('removeFromShortlist') &&
  storeContent.includes('clearShortlist'),
  'schoolStore provides full CRUD operations for shortlist'
);

const actionsPath = path.join(__dirname, '..', 'src', 'components', 'school', 'SchoolProfileActions.tsx');
const actionsContent = fs.readFileSync(actionsPath, 'utf8');
assert(
  !actionsContent.includes("fetch('/api/auth/wishlist'") ||
  actionsContent.split("fetch('/api/auth/wishlist'").length === 1,
  'SchoolProfileActions does not duplicate backend sync already handled by store'
);

// -----------------------------------------------------------------------------
// 4. SCHOOL VISIT METRICS & ADMIN TELEMETRY
// -----------------------------------------------------------------------------
const trackerPath = path.join(__dirname, '..', 'src', 'components', 'school', 'SchoolViewTracker.tsx');
assert(fs.existsSync(trackerPath), 'SchoolViewTracker.tsx exists');
const trackerContent = fs.readFileSync(trackerPath, 'utf8');

assert(
  !trackerContent.includes('sessionStorage') &&
  trackerContent.includes('keepalive: true'),
  'SchoolViewTracker sends genuine profile visits without browser-level 10-minute suppression'
);

const schoolDetailPath = path.join(__dirname, '..', 'src', 'app', 'schools', '[slug]', 'page.tsx');
const schoolDetailContent = fs.readFileSync(schoolDetailPath, 'utf8');
assert(
  schoolDetailContent.includes('<SchoolViewTracker slug={school.slug} />'),
  'SchoolDetailPage embeds SchoolViewTracker for automatic view logging'
);

const viewRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'schools', '[slug]', 'view', 'route.ts');
const viewRouteContent = fs.readFileSync(viewRoutePath, 'utf8');
assert(
  viewRouteContent.includes('isDuplicateView') &&
  viewRouteContent.includes('recentViewsCache') &&
  viewRouteContent.includes('failOnMongoError: true'),
  'School view API route uses server-side rapid-repeat deduplication and fail-fast persistence'
);

const authStorePath = path.join(__dirname, '..', 'src', 'lib', 'authStore.ts');
const authStoreContent = fs.readFileSync(authStorePath, 'utf8');
assert(
  authStoreContent.includes('uniqueViewersInRange') &&
  authStoreContent.includes('viewsInRange') &&
  authStoreContent.includes('allTimeViewsCount'),
  'authStore computes range metrics, unique viewers, and all-time counts'
);

const adminPagePath = path.join(__dirname, '..', 'src', 'app', 'admin', 'page.tsx');
const adminPageContent = fs.readFileSync(adminPagePath, 'utf8');
assert(
  adminPageContent.includes('uniqueViewersInRange') &&
  adminPageContent.includes('allTimeViewsCount'),
  'Admin dashboard Overview displays range metrics, unique parents, and all-time totals'
);

console.log(`\n================================================================`);
console.log(`  RESULTS: ${passed}/${total} assertions passed successfully!`);
console.log(`================================================================\n`);
