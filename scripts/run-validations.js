/**
 * Runs the repository validation suite.
 *
 * The suite is the fixed list below (kept explicit on purpose: some older
 * validate-*.js scripts in this folder are legacy/stale and are NOT part of the
 * suite). Every validator runs even if an earlier one fails, so a single run
 * shows all failures; the process exits non-zero if any validator failed.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const VALIDATORS = [
  'validate-school-data-shapes.js',
  'validate-phase1.js',
  'validate-phase2.js',
  'validate-phase3-accuracy.js',
  'validate-excel-reports.js',
  'validate-phase4-corrections.js',
  'validate-security.js',
  'validate-reminders.js',
  'validate-animations-wishlist-telemetry.js',
  'validate-batch2-fees.js',
];

const failed = [];
for (const file of VALIDATORS) {
  console.log(`\n>>> ${file}`);
  const r = spawnSync(process.execPath, [path.join(__dirname, file)], { stdio: 'inherit' });
  if (r.status !== 0) failed.push(file);
}

console.log('\n================================================================');
if (failed.length) {
  console.error(`VALIDATION FAILED (${failed.length}/${VALIDATORS.length}): ${failed.join(', ')}`);
  process.exit(1);
}
console.log(`ALL ${VALIDATORS.length} VALIDATORS PASSED`);
