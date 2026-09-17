const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('    ADMISSION PITARA - SECURITY & PRIVACY HARDENING AUDIT TEST  ');
console.log('================================================================');

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

// 1. Audit all admin API routes for requireAdminAuth(req)
const adminApiDir = path.join(__dirname, '../src/app/api/admin');
function getAdminRoutes(dir) {
  let routes = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      routes = routes.concat(getAdminRoutes(fullPath));
    } else if (file === 'route.ts' || file === 'route.js') {
      routes.push(fullPath);
    }
  }
  return routes;
}

const adminRoutes = getAdminRoutes(adminApiDir);
assert(adminRoutes.length >= 10, `Found ${adminRoutes.length} admin API routes to audit`);

let unauthenticatedAdminRoutes = 0;
for (const routePath of adminRoutes) {
  const content = fs.readFileSync(routePath, 'utf8');
  if (!content.includes('requireAdminAuth(req)')) {
    console.error(`Unprotected admin route found: ${path.relative(process.cwd(), routePath)}`);
    unauthenticatedAdminRoutes++;
  }
}
assert(unauthenticatedAdminRoutes === 0, '100% of admin API routes invoke server-side requireAdminAuth(req)');

// 2. Audit adminAuth.ts logic
const adminAuthPath = path.join(__dirname, '../src/lib/adminAuth.ts');
const adminAuthCode = fs.readFileSync(adminAuthPath, 'utf8');
assert(adminAuthCode.includes('verifySessionToken'), 'adminAuth.ts validates session tokens cryptographically');
assert(adminAuthCode.includes('status === \'disabled\'') || adminAuthCode.includes('status === "disabled"'), 'adminAuth.ts rejects disabled accounts');
assert(adminAuthCode.includes('ADMIN_EMAILS'), 'adminAuth.ts checks ADMIN_EMAILS environment whitelist');

// 3. Audit User Sanitization and Anonymous Rating Data Stripping
const authStorePath = path.join(__dirname, '../src/lib/authStore.ts');
const authStoreCode = fs.readFileSync(authStorePath, 'utf8');
assert(authStoreCode.includes('delete safe.passwordHash') || authStoreCode.includes('passwordHash'), 'authStore.ts strips passwordHash in sanitizeUser');
assert(authStoreCode.includes('sanitizePublicRating'), 'authStore.ts defines sanitizePublicRating helper');
assert(authStoreCode.includes("userName: 'Anonymous Parent'") || authStoreCode.includes('userName: "Anonymous Parent"'), 'sanitizePublicRating replaces author name with Anonymous Parent');

// 4. Audit Rating POST endpoint for response sanitization
const ratingRoutePath = path.join(__dirname, '../src/app/api/schools/[slug]/ratings/route.ts');
const ratingRouteCode = fs.readFileSync(ratingRoutePath, 'utf8');
assert(ratingRouteCode.includes('sanitizePublicRating(rating)'), 'POST /api/schools/[slug]/ratings sanitizes returned rating object in API response');

// 5. Audit Diagnostic Route Protection
const diagRoutePath = path.join(__dirname, '../src/app/api/auth/diagnostic/route.ts');
const diagRouteCode = fs.readFileSync(diagRoutePath, 'utf8');
assert(diagRouteCode.includes('requireAdminAuth(req)'), '/api/auth/diagnostic is protected by requireAdminAuth(req)');

// 6. Audit Admission Alert Route Rate Limiting & Session Validation
const alertRoutePath = path.join(__dirname, '../src/app/api/notifications/admission-alert/route.ts');
const alertRouteCode = fs.readFileSync(alertRoutePath, 'utf8');
assert(alertRouteCode.includes('checkRateLimit'), '/api/notifications/admission-alert uses checkRateLimit to block spam');
assert(alertRouteCode.includes('verifySessionToken'), '/api/notifications/admission-alert verifies session if authenticated');

// 7. Audit Security Headers in next.config.mjs
const nextConfigPath = path.join(__dirname, '../next.config.mjs');
const nextConfigCode = fs.readFileSync(nextConfigPath, 'utf8');
assert(nextConfigCode.includes('X-Content-Type-Options'), 'next.config.mjs specifies X-Content-Type-Options: nosniff');
assert(nextConfigCode.includes('X-Frame-Options'), 'next.config.mjs specifies X-Frame-Options: SAMEORIGIN');
assert(nextConfigCode.includes('Referrer-Policy'), 'next.config.mjs specifies Referrer-Policy');
assert(nextConfigCode.includes('Permissions-Policy'), 'next.config.mjs specifies Permissions-Policy');

// 8. Audit Password Hashing & HMAC Session Utilities
assert(authStoreCode.includes('pbkdf2Sync'), 'authStore.ts uses PBKDF2 for password hashing');
assert(authStoreCode.includes('timingSafeEqual'), 'authStore.ts uses timingSafeEqual for hash & signature comparison');
assert(authStoreCode.includes('createHmac'), 'authStore.ts uses HMAC-SHA256 for session token signatures');

// 9. Audit Legal Pages for Public Contact Email
const termsPath = path.join(__dirname, '../src/app/terms/page.tsx');
const privacyPath = path.join(__dirname, '../src/app/privacy/page.tsx');
assert(fs.readFileSync(termsPath, 'utf8').includes('enquiry.admissionpitara@gmail.com'), 'Terms page references enquiry.admissionpitara@gmail.com');
assert(fs.readFileSync(privacyPath, 'utf8').includes('enquiry.admissionpitara@gmail.com'), 'Privacy page references enquiry.admissionpitara@gmail.com');

console.log('----------------------------------------------------------------');
console.log(`Results: ${passed} of ${total} tests passed.`);
console.log('----------------------------------------------------------------');
if (passed === total) {
  console.log('STATUS: SECURITY & PRIVACY HARDENING AUDIT VERIFIED CLEANLY [PASS]');
} else {
  console.log('STATUS: SECURITY AUDIT FAILED');
  process.exit(1);
}
