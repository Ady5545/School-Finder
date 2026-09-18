/**
 * Admission Pitara - Batch 2 Fee Verification & Accuracy Test Suite
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('       ADMISSION PITARA - BATCH 2 FEE VERIFICATION SUITE       ');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`[PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${description}`);
    console.error(`       Error: ${err.message}`);
  }
}

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

// 1. Dataset Integrity
runTest('All 70 schools contain a valid fees object', () => {
  assert.strictEqual(schools.length, 70);
  schools.forEach(s => {
    assert(s.fees && typeof s.fees === 'object', `School ${s.slug} missing fees`);
  });
});

// 2. DPS Knowledge Park 5
const dps = schools.find(s => s.slug === 'delhi-public-school-knowledge-park-5');
runTest('DPS Knowledge Park 5 has verified fee structure with Cambridge stream and lab charges', () => {
  assert(dps !== undefined, 'DPS KP5 found');
  assert.strictEqual(dps.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(dps.fees.cardFee, 123900);
  assert.strictEqual(dps.fees.billingFrequency, 'quarterly');

  // Check Cambridge component
  const cambridge = dps.fees.components.find(c => c.id === 'dps-cambridge-fee');
  assert(cambridge !== undefined, 'Cambridge curriculum component exists');
  assert.strictEqual(cambridge.amount, 35000);
  assert.strictEqual(cambridge.isOfficial, true);

  // Check Lab fee
  const lab = dps.fees.components.find(c => c.id === 'dps-lab-fee');
  assert(lab !== undefined, 'Lab fee exists');
  assert.strictEqual(lab.amount, 4500);

  // Check Transport schedule
  assert(dps.fees.transportSchedule && dps.fees.transportSchedule.length >= 2, 'Transport schedule present');

  // Check Sibling concession
  assert(dps.fees.concessions && dps.fees.concessions.length >= 1, 'Sibling concession present');

  // Check Circular metadata
  assert(dps.fees.circular && dps.fees.circular.sourceUrl, 'Circular metadata exists');
});

// 3. Lotus Valley International
const lotus = schools.find(s => s.slug === 'lotus-valley-international-school');
runTest('Lotus Valley International has grade-tiered composite fees and refundable caution deposit', () => {
  assert(lotus !== undefined, 'Lotus Valley found');
  assert.strictEqual(lotus.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(lotus.fees.cardFee, 186480);
  assert.strictEqual(lotus.fees.billingFrequency, 'quarterly');

  // Check caution deposit (Refundable)
  const caution = lotus.fees.components.find(c => c.id === 'lv-caution');
  assert(caution !== undefined, 'Caution deposit component exists');
  assert.strictEqual(caution.amount, 25000);
  assert.strictEqual(caution.refundable, true);

  // Check admission fee (Non-refundable)
  const admission = lotus.fees.components.find(c => c.id === 'lv-adm');
  assert(admission !== undefined, 'Admission fee component exists');
  assert.strictEqual(admission.amount, 90000);
  assert.strictEqual(admission.refundable, false);

  // Check grade-wise tiers
  assert(lotus.fees.gradeWiseTiers && lotus.fees.gradeWiseTiers.length >= 4, 'Grade wise tiers exist');
  const scienceTier = lotus.fees.gradeWiseTiers.find(t => t.gradeGroup.includes('Science'));
  assert(scienceTier !== undefined, 'Science grade tier exists');
  assert.strictEqual(scienceTier.totalAnnualPayable, '₹2,16,720');
});

// 4. The Infinity School
const infinity = schools.find(s => s.slug === 'the-infinity-school');
runTest('The Infinity School has historical estimated flag and clear disclaimer', () => {
  assert(infinity !== undefined, 'The Infinity School found');
  assert.strictEqual(infinity.fees.verificationStatus, 'estimated_historical');
  assert.strictEqual(infinity.fees.isVerified, false);
  assert(infinity.fees.disclaimer.includes('Estimated / inferred'), 'Disclaimer includes estimated/inferred warning');
  assert(infinity.fees.academicSession.includes('2023–24'), 'Academic session reflects historical 2023–24 period');
  assert(infinity.fees.rangeText.includes('Historical Reference'), 'Range text reflects historical reference');
});

// 5. Undisclosed Schools
const undisclosed = schools.filter(s => s.fees.disclosed === false);
runTest('Undisclosed schools have null cardFee and honest disclosure copy without fake zeroes', () => {
  assert(undisclosed.length > 0, 'Found undisclosed schools');
  undisclosed.forEach(s => {
    assert.strictEqual(s.fees.cardFee, null, `${s.slug} cardFee must be null`);
    assert.strictEqual(s.fees.rangeText, 'Not publicly disclosed', `${s.slug} rangeText must state Not publicly disclosed`);
    assert(s.fees.disclaimer, `${s.slug} must have a disclaimer`);
    assert.strictEqual(s.fees.table.length, 0, `${s.slug} table must be empty`);
  });
});

// 6. Calculated vs Official Distinctions
runTest('All calculated fee items include calculationNotes', () => {
  let countChecked = 0;
  schools.forEach(s => {
    if (s.fees.components) {
      s.fees.components.forEach(comp => {
        if (comp.isCalculated) {
          assert(comp.calculationNotes && comp.calculationNotes.length > 0, `${s.slug} component ${comp.id} missing calculationNotes`);
          countChecked++;
        }
      });
    }
  });
  assert(countChecked > 0, `Verified ${countChecked} calculated components`);
});

console.log('----------------------------------------------------------------');
console.log(`Results: ${passedTests} of ${totalTests} tests passed.`);
console.log('----------------------------------------------------------------');

if (passedTests !== totalTests) {
  console.error('STATUS: VALIDATION FAILED');
  process.exit(1);
} else {
  console.log('STATUS: BATCH 2 FEE DATA ACCURACY VERIFICATION COMPLETE [PASS]');
  process.exit(0);
}
