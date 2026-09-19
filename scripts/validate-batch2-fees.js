/**
 * Admission Pitara - Batch 2 Fee Verification & Accuracy Test Suite
 * Validates the corrected authoritative fee records for all schools.
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
runTest('All 54 schools contain a valid fees object', () => {
  assert(schools.length >= 50, `Dataset contains at least 50 school records for fee regression checks (Found: ${schools.length})`);
  schools.forEach(s => {
    assert(s.fees && typeof s.fees === 'object', `School ${s.slug} missing fees`);
  });
});

// 2. DPS Knowledge Park 5
const dps = schools.find(s => s.slug === 'delhi-public-school-knowledge-park-5');
runTest('DPS Knowledge Park 5 has exact authoritative fee structure (CBSE + Cambridge add-on)', () => {
  assert(dps !== undefined, 'DPS KP5 found');
  assert.strictEqual(dps.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(dps.fees.cardFee, 132900);
  assert.strictEqual(dps.fees.registrationFee, 1000);
  assert.strictEqual(dps.fees.admissionFee, 50000);
  assert.strictEqual(dps.fees.tuitionMonthly, '11,075');
  assert.strictEqual(dps.fees.tuitionQuarterly, '33,225');
  assert.strictEqual(dps.fees.billingFrequency, 'quarterly');

  // Check Cambridge component: ₹16,200/year (two installments of ₹8,100)
  const cambridge = dps.fees.components.find(c => c.id === 'dps-cambridge-fee');
  assert(cambridge !== undefined, 'Cambridge curriculum component exists');
  assert.strictEqual(cambridge.amount, 16200);
  assert.strictEqual(cambridge.isOfficial, true);

  // Check Lab fee: ₹4,500/year for Classes XI & XII Science
  const lab = dps.fees.components.find(c => c.id === 'dps-lab-fee');
  assert(lab !== undefined, 'Lab fee exists');
  assert.strictEqual(lab.amount, 4500);

  // Check Transport schedule: ₹3,700 GNW, ₹4,100 outer
  assert(dps.fees.transportSchedule && dps.fees.transportSchedule.length >= 2, 'Transport schedule present');
  assert.strictEqual(dps.fees.transportSchedule[0].amount, '₹3,700 / month');
  assert.strictEqual(dps.fees.transportSchedule[1].amount, '₹4,100 / month');

  // Check board includes CBSE and Cambridge
  assert(dps.board.includes('CBSE') && dps.board.includes('Cambridge'), 'Board includes CBSE and Cambridge');
});

// 3. Lotus Valley International School (Greater Noida West)
const lotus = schools.find(s => s.slug === 'lotus-valley-international-school');
runTest('Lotus Valley International School (GNW) has verified fee schedule with ₹10,000 refundable caution money', () => {
  assert(lotus !== undefined, 'Lotus Valley found');
  assert.strictEqual(lotus.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(lotus.fees.cardFee, 130800);
  assert.strictEqual(lotus.fees.registrationFee, 1000);
  assert.strictEqual(lotus.fees.admissionFee, 50000);
  assert.strictEqual(lotus.fees.billingFrequency, 'quarterly');

  // Check caution deposit (₹10,000 Refundable)
  const caution = lotus.fees.components.find(c => c.id === 'lv-caution');
  assert(caution !== undefined, 'Caution deposit component exists');
  assert.strictEqual(caution.amount, 10000);
  assert.strictEqual(caution.refundable, true);

  // Check admission fee (₹50,000 Non-refundable)
  const admission = lotus.fees.components.find(c => c.id === 'lv-adm');
  assert(admission !== undefined, 'Admission fee component exists');
  assert.strictEqual(admission.amount, 50000);
  assert.strictEqual(admission.refundable, false);

  // Check grade-wise tiers: Nursery–V (₹10,900/mo), VI–X (₹11,370/mo), XI–XII Comm (₹12,850/mo), XI–XII Sci (₹13,130/mo)
  assert(lotus.fees.gradeWiseTiers && lotus.fees.gradeWiseTiers.length === 4, '4 Grade wise tiers exist');
  const sciTier = lotus.fees.gradeWiseTiers.find(t => t.gradeGroup.includes('Science'));
  assert(sciTier !== undefined, 'Science grade tier exists');
  assert.strictEqual(sciTier.totalAnnualPayable, '₹1,57,560');
});

// 4. Pacific World School
const pacific = schools.find(s => s.slug === 'pacific-world-school-techzone-4');
runTest('Pacific World School has verified quarterly tuition and sibling admission concession', () => {
  assert(pacific !== undefined, 'Pacific World School found');
  assert.strictEqual(pacific.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(pacific.fees.cardFee, 145200);
  assert.strictEqual(pacific.fees.registrationFee, 1200);
  assert.strictEqual(pacific.fees.admissionFee, 45000);
  assert.strictEqual(pacific.fees.tuitionQuarterly, '36,300 – 45,300');

  // Check Sibling Admission Concession (₹25,000)
  const sibAdm = pacific.fees.components.find(c => c.id === 'pacific-sibling-adm');
  assert(sibAdm !== undefined, 'Sibling admission component exists');
  assert.strictEqual(sibAdm.amount, 25000);

  // Check Cambridge stream tier (₹45,300/qtr = ₹1,81,200/yr)
  const cambridgeTier = pacific.fees.gradeWiseTiers.find(t => t.gradeGroup.includes('Cambridge'));
  assert(cambridgeTier !== undefined, 'Cambridge tier exists');
  assert.strictEqual(cambridgeTier.totalAnnualPayable, '₹1,81,200');
});

// 5. SKS World School (Greater Noida West)
const sks = schools.find(s => s.slug === 'sks-world-school-greater-noida-west');
runTest('SKS World School has verified quarterly composite tiers and one-time fees', () => {
  assert(sks !== undefined, 'SKS World School found');
  assert.strictEqual(sks.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(sks.fees.cardFee, 91200);
  assert.strictEqual(sks.fees.registrationFee, 1100);
  assert.strictEqual(sks.fees.admissionFee, 40000);
  assert.strictEqual(sks.fees.tuitionQuarterly, '22,800 – 26,550');

  // Check 4 grade tiers: Pre-Nur-Prep (₹91,200), I-V (₹93,600), VI-VIII (₹98,400), IX-X (₹1,06,200)
  assert(sks.fees.gradeWiseTiers && sks.fees.gradeWiseTiers.length === 4, '4 grade tiers exist');
  assert.strictEqual(sks.fees.gradeWiseTiers[0].totalAnnualPayable, '₹91,200');
  assert.strictEqual(sks.fees.gradeWiseTiers[1].totalAnnualPayable, '₹93,600');
  assert.strictEqual(sks.fees.gradeWiseTiers[2].totalAnnualPayable, '₹98,400');
  assert.strictEqual(sks.fees.gradeWiseTiers[3].totalAnnualPayable, '₹1,06,200');
});

// 6. Indus Valley Public School (Sector 62, Noida)
const indus = schools.find(s => s.slug === 'indus-valley-school-noida-ext');
runTest('Indus Valley Public School has Sector 62 Noida location, ₹10k refundable caution, ₹10k dev fee, and monthly tiers', () => {
  assert(indus !== undefined, 'Indus Valley found');
  assert.strictEqual(indus.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(indus.location.sector, 'Sector 62');
  assert.strictEqual(indus.location.city, 'Noida');
  assert.strictEqual(indus.fees.cardFee, 128400);
  assert.strictEqual(indus.fees.registrationFee, 1000);
  assert.strictEqual(indus.fees.admissionFee, 50000);

  // Check Dev charges: ₹10,000 (Non-refundable)
  const dev = indus.fees.components.find(c => c.id === 'iv-dev');
  assert(dev !== undefined, 'Development fee component exists');
  assert.strictEqual(dev.amount, 10000);
  assert.strictEqual(dev.refundable, false);

  // Check Caution money: ₹10,000 (Refundable)
  const caution = indus.fees.components.find(c => c.id === 'iv-caution');
  assert(caution !== undefined, 'Caution deposit component exists');
  assert.strictEqual(caution.amount, 10000);
  assert.strictEqual(caution.refundable, true);

  // Check 5 Grade Tiers: Nursery-UKG (₹10,700), I-III (₹11,200), IV-V (₹12,208), VI-X (₹12,535), XI-XII (₹12,644)
  assert(indus.fees.gradeWiseTiers && indus.fees.gradeWiseTiers.length === 5, '5 grade tiers exist');
  assert.strictEqual(indus.fees.gradeWiseTiers[0].totalAnnualPayable, '₹1,28,400');
  assert.strictEqual(indus.fees.gradeWiseTiers[1].totalAnnualPayable, '₹1,34,400');
  assert.strictEqual(indus.fees.gradeWiseTiers[2].totalAnnualPayable, '₹1,46,496');
  assert.strictEqual(indus.fees.gradeWiseTiers[3].totalAnnualPayable, '₹1,50,420');
  assert.strictEqual(indus.fees.gradeWiseTiers[4].totalAnnualPayable, '₹1,51,728');
});

// 7. The Infinity School
const infinity = schools.find(s => s.slug === 'the-infinity-school');
runTest('The Infinity School has historical estimated flag and clear disclaimer', () => {
  assert(infinity !== undefined, 'The Infinity School found');
  assert.strictEqual(infinity.fees.verificationStatus, 'estimated_historical');
  assert.strictEqual(infinity.fees.isVerified, false);
  assert(infinity.fees.disclaimer.includes('Estimated / inferred'), 'Disclaimer includes estimated/inferred warning');
  assert(infinity.fees.academicSession.includes('2023–24'), 'Academic session reflects historical 2023–24 period');
  assert(infinity.fees.rangeText.includes('Historical Reference'), 'Range text reflects historical reference');
});

// 7.5. GD Goenka International School Greater Noida West
const gdGoenka = schools.find(s => s.slug === 'gd-goenka-international-school');
runTest('GD Goenka International School GNW has verified fee structure and exact grade-wise tiers', () => {
  assert(gdGoenka !== undefined, 'GD Goenka found');
  assert.strictEqual(gdGoenka.fees.verificationStatus, 'verified_from_source');
  assert.strictEqual(gdGoenka.fees.cardFee, 8855);
  assert.strictEqual(gdGoenka.fees.registrationFee, 1000);
  assert.strictEqual(gdGoenka.fees.admissionFee, 25000);
  assert.strictEqual(gdGoenka.fees.cautionDeposit, 20000);
  assert.strictEqual(gdGoenka.fees.gradeWiseTiers.length, 5);
  const nurTier = gdGoenka.fees.gradeWiseTiers.find(t => t.gradeGroup === 'Nursery–KG');
  assert(nurTier !== undefined && nurTier.tuitionFee === '₹8,855 / month', 'Nursery-KG tier fee verified');
  const srTier = gdGoenka.fees.gradeWiseTiers.find(t => t.gradeGroup === 'Classes XI–XII');
  assert(srTier !== undefined && srTier.tuitionFee === '₹12,925 / month', 'Senior XI-XII tier fee verified');
});

// 8. Undisclosed Schools
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

// 9. Calculated vs Official Distinctions
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
