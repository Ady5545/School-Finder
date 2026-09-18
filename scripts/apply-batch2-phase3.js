const fs = require('fs');
const path = require('path');

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

const audit = [];
function getSchool(slug) {
  return schools.find(s => s.slug === slug);
}

// 22. MODERN PUBLIC SCHOOL
const mps = getSchool('modern-public-school-noida-extension');
if (mps) {
  const oldVal = mps.fees?.rangeText;
  if (mps.location) {
    mps.location.address = 'Near Crossings Republik, Shahberi, Noida, Ghaziabad, UP 201318';
  }
  mps.affiliationNumber = '2132062';
  if (mps.verification) mps.verification.cbseAffiliationNumber = '2132062';
  mps.studentTeacherRatio = '25:1';
  mps.fees = {
    cardFee: 67200,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹5,600 – ₹8,800 / month (Grade-wise monthly tuition)',
    registrationFee: 1000,
    admissionFee: 24000,
    tuitionMonthly: '5,600 – 8,800',
    tuitionQuarterly: null,
    tuitionAnnual: '₹67,200 – ₹1,05,600 (Calculated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Registration Fee', cost: '₹1,000' },
      { type: 'Admission Fee (Pre-Nursery / Muskan)', cost: '₹10,000' },
      { type: 'Admission Fee (Nursery to Class XII)', cost: '₹24,000' },
      { type: 'Caution Money (Refundable)', cost: '₹6,000 (Pre-Nur) | ₹10,000 (Nur–XII)' },
      { type: 'Development Charges (Nur–XII)', cost: '₹6,000' },
      { type: 'Orientation Charges', cost: '₹1,000' },
      { type: 'Annual Exam Fee', cost: '₹3,000 (Nur–UKG) | ₹6,000 (I–XII)' },
      { type: 'Monthly Tuition (Pre-Nursery)', cost: '₹5,600 / month' },
      { type: 'Monthly Tuition (Nursery)', cost: '₹6,000 / month' },
      { type: 'Monthly Tuition (LKG)', cost: '₹6,100 / month' },
      { type: 'Monthly Tuition (UKG)', cost: '₹6,400 / month' },
      { type: 'Monthly Tuition (Class I)', cost: '₹6,600 / month' },
      { type: 'Monthly Tuition (Class II)', cost: '₹7,150 / month' },
      { type: 'Monthly Tuition (Class III)', cost: '₹7,750 / month' },
      { type: 'Monthly Tuition (Classes IV–V)', cost: '₹8,300 / month' },
      { type: 'Monthly Tuition (Classes VI–VIII)', cost: '₹8,600 / month' },
      { type: 'Monthly Tuition (Classes IX–X)', cost: '₹8,700 / month' },
      { type: 'Monthly Tuition (Classes XI–XII)', cost: '₹8,800 / month' }
    ],
    components: [
      {
        id: 'mps-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1000,
        formattedAmount: '₹1,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time registration fee.'
      },
      {
        id: 'mps-adm-nur-xii',
        name: 'Admission Fee (Nursery to XII)',
        category: 'one_time',
        amount: 24000,
        formattedAmount: '₹24,000 (Pre-Nur: ₹10,000)',
        frequency: 'one_time',
        gradesApplicable: 'Nursery to Class XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee.'
      },
      {
        id: 'mps-caution',
        name: 'Caution Money',
        category: 'deposit',
        amount: 10000,
        formattedAmount: '₹10,000 (Pre-Nur: ₹6,000)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: true,
        isOfficial: true,
        notes: 'Refundable security deposit.'
      },
      {
        id: 'mps-dev',
        name: 'Development Charges',
        category: 'one_time',
        amount: 6000,
        formattedAmount: '₹6,000',
        frequency: 'one_time',
        gradesApplicable: 'Nursery to Class XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time development fee.'
      },
      {
        id: 'mps-exam',
        name: 'Annual Exam Fee',
        category: 'examination',
        amount: 6000,
        formattedAmount: '₹3,000 (Nur–UKG) | ₹6,000 (I–XII)',
        frequency: 'annual',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Annual examination charges.'
      },
      {
        id: 'mps-tuition-pre-nur',
        name: 'Monthly Tuition – Pre-Nursery',
        category: 'recurring',
        amount: 5600,
        formattedAmount: '₹5,600 / month',
        frequency: 'monthly',
        gradesApplicable: 'Pre-Nursery',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Pre-Nursery monthly fee.'
      },
      {
        id: 'mps-tuition-nur-xii',
        name: 'Monthly Tuition – Nursery to Class XII',
        category: 'recurring',
        amount: 6000,
        formattedAmount: '₹6,000 – ₹8,800 / month',
        frequency: 'monthly',
        gradesApplicable: 'Nursery to Class XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Grade-wise monthly tuition schedule.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nursery',
        grades: ['Pre-Nursery'],
        tuitionFee: '₹5,600 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹67,200 / year (Calculated)',
        totalAnnualPayable: '₹67,200',
        isCalculated: true,
        calculationNotes: '₹5,600 × 12 = ₹67,200/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly tuition.'
      },
      {
        gradeGroup: 'Nursery / LKG / UKG',
        grades: ['Nursery', 'LKG', 'UKG'],
        tuitionFee: '₹6,000 – ₹6,400 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹72,000 – ₹76,800 / year (Calculated)',
        totalAnnualPayable: '₹72,000 – ₹76,800',
        isCalculated: true,
        calculationNotes: '₹6,000–₹6,400 × 12.',
        curriculum: 'CBSE',
        notes: 'Monthly tuition.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
        tuitionFee: '₹6,600 – ₹8,300 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹79,200 – ₹99,600 / year (Calculated)',
        totalAnnualPayable: '₹79,200 – ₹99,600',
        isCalculated: true,
        calculationNotes: '₹6,600–₹8,300 × 12.',
        curriculum: 'CBSE',
        notes: 'Monthly tuition.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class VI', 'Class VII', 'Class VIII'],
        tuitionFee: '₹8,600 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,03,200 / year (Calculated)',
        totalAnnualPayable: '₹1,03,200',
        isCalculated: true,
        calculationNotes: '₹8,600 × 12.',
        curriculum: 'CBSE',
        notes: 'Monthly tuition.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: '₹8,700 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,04,400 / year (Calculated)',
        totalAnnualPayable: '₹1,04,400',
        isCalculated: true,
        calculationNotes: '₹8,700 × 12.',
        curriculum: 'CBSE Secondary',
        notes: 'Monthly tuition.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class XI', 'Class XII'],
        tuitionFee: '₹8,800 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,05,600 / year (Calculated)',
        totalAnnualPayable: '₹1,05,600',
        isCalculated: true,
        calculationNotes: '₹8,800 × 12.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Monthly tuition.'
      }
    ],
    concessions: [],
    disclaimer: '2027–28 admission status is currently unconfirmed.'
  };
  audit.push({ name: mps.name, slug: mps.slug, oldVal, newVal: mps.fees.rangeText });
}

// 23. SUNSHINE PUBLIC SCHOOL
const sun = getSchool('sunshine-public-school-noida-ext');
if (sun) {
  const oldVal = sun.fees?.rangeText;
  if (sun.location) {
    sun.location.address = 'Khasra Number 562, Near Masjid, Adarsh Vihar, Mulla Colony, Pushta Road near Haldwani Mode, Kulesra, Greater Noida, Gautam Buddha Nagar, UP 201306';
  }
  sun.affiliationNumber = null;
  if (sun.verification) sun.verification.cbseAffiliationNumber = null;
  sun.board = ['State Board / UP Board'];
  sun.studentTeacherRatio = '25:1';
  sun.fees = {
    cardFee: 18000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹18,000 – ₹30,000 / year (Approximate annual tuition)',
    registrationFee: null,
    admissionFee: null,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: 'approx ₹18,000 – ₹30,000',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'annual',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule Schedule Range',
    table: [
      { type: 'Annual Tuition (Kindergarten / Pre-Primary)', cost: 'approx ₹18,000 / year' },
      { type: 'Annual Tuition (Classes I–V)', cost: 'approx ₹24,000 / year' },
      { type: 'Annual Tuition (Classes VI–VIII)', cost: 'approx ₹30,000 / year' }
    ],
    components: [
      {
        id: 'sun-pre-prim',
        name: 'Annual Tuition – Kindergarten / Pre-Primary',
        category: 'recurring',
        amount: 18000,
        formattedAmount: 'approx ₹18,000 / year',
        frequency: 'annual',
        gradesApplicable: 'Kindergarten / Pre-Primary',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate annual tuition.'
      },
      {
        id: 'sun-i-v',
        name: 'Annual Tuition – Classes I to V',
        category: 'recurring',
        amount: 24000,
        formattedAmount: 'approx ₹24,000 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes I to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate annual tuition.'
      },
      {
        id: 'sun-vi-viii',
        name: 'Annual Tuition – Classes VI to VIII',
        category: 'recurring',
        amount: 30000,
        formattedAmount: 'approx ₹30,000 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes VI to VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate annual tuition.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Kindergarten / Pre-Primary',
        grades: ['Pre-Primary'],
        tuitionFee: 'approx ₹18,000 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹18,000',
        totalAnnualPayable: '₹18,000',
        isCalculated: false,
        curriculum: 'State Board',
        notes: 'Approximate annual fee.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Classes 1–5'],
        tuitionFee: 'approx ₹24,000 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹24,000',
        totalAnnualPayable: '₹24,000',
        isCalculated: false,
        curriculum: 'State Board',
        notes: 'Approximate annual fee.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Classes 6–8'],
        tuitionFee: 'approx ₹30,000 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹30,000',
        totalAnnualPayable: '₹30,000',
        isCalculated: false,
        curriculum: 'State Board',
        notes: 'Approximate annual fee.'
      }
    ],
    concessions: [],
    disclaimer: 'Affiliated with Local State Board / UP Board. Admission forms typically available December to February.'
  };
  audit.push({ name: sun.name, slug: sun.slug, oldVal, newVal: sun.fees.rangeText });
}

// 24. BGS VIJNATHAM SCHOOL
const bgs = getSchool('bgs-vijnatham-school');
if (bgs) {
  const oldVal = bgs.fees?.rangeText;
  if (bgs.location) {
    bgs.location.address = 'Plot No. 2, Techzone VII, Milak Lachchhi, Greater Noida, UP 203207';
  }
  bgs.affiliationNumber = '2133804';
  if (bgs.verification) bgs.verification.cbseAffiliationNumber = '2133804';
  bgs.studentTeacherRatio = '13:1 (Pre-Primary) | 25:1 (Primary/Secondary)';
  if (bgs.admissions) {
    bgs.admissions.status = 'open_2027_2028';
    bgs.admissions.academicYear = '2027–28';
  }
  bgs.fees = {
    cardFee: 102600,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹8,550 – ₹11,250 / month (Composite monthly tuition)',
    registrationFee: 1250,
    admissionFee: 40000,
    tuitionMonthly: '8,550 – 11,250',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,02,600 – ₹1,35,000 (Calculated)',
    transportMonthly: '1,500 – 3,000 (Optional)',
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2027–28',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Registration Fee', cost: '₹1,250' },
      { type: 'Admission Fee', cost: '₹40,000' },
      { type: 'Examination Fee (VI onward)', cost: '₹1,250 / year' },
      { type: 'Lab Fee (XI–XII)', cost: '₹250 / quarter / subject' },
      { type: 'Monthly Composite (Pre-Primary)', cost: '₹8,550 / month (₹1,02,600 / yr)' },
      { type: 'Monthly Composite (Classes I–V)', cost: '₹10,150 / month (₹1,21,800 / yr)' },
      { type: 'Monthly Composite (Classes VI–X)', cost: '₹10,650 / month (₹1,27,800 / yr)' },
      { type: 'Monthly Composite (Classes XI–XII)', cost: '₹11,250 / month (₹1,35,000 / yr)' },
      { type: 'Transport Fee (Optional)', cost: '₹1,500 – ₹3,000 / month' }
    ],
    components: [
      {
        id: 'bgs-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1250,
        formattedAmount: '₹1,250',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time registration fee.'
      },
      {
        id: 'bgs-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 40000,
        formattedAmount: '₹40,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee.'
      },
      {
        id: 'bgs-exam',
        name: 'Examination Fee (VI onward)',
        category: 'examination',
        amount: 1250,
        formattedAmount: '₹1,250 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes VI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Annual examination fee.'
      },
      {
        id: 'bgs-lab',
        name: 'Lab Charges (XI–XII)',
        category: 'activity',
        amount: 250,
        formattedAmount: '₹250 / quarter / subject',
        frequency: 'quarterly',
        gradesApplicable: 'Classes XI to XII',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'Per practical subject.'
      },
      {
        id: 'bgs-comp-pre-prim',
        name: 'Monthly Composite – Pre-Primary',
        category: 'recurring',
        amount: 8550,
        formattedAmount: '₹8,550 / month',
        frequency: 'monthly',
        gradesApplicable: 'Pre-Primary',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,02,600/yr.'
      },
      {
        id: 'bgs-comp-i-v',
        name: 'Monthly Composite – Classes I to V',
        category: 'recurring',
        amount: 10150,
        formattedAmount: '₹10,150 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes I to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,21,800/yr.'
      },
      {
        id: 'bgs-comp-vi-x',
        name: 'Monthly Composite – Classes VI to X',
        category: 'recurring',
        amount: 10650,
        formattedAmount: '₹10,650 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes VI to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,27,800/yr.'
      },
      {
        id: 'bgs-comp-xi-xii',
        name: 'Monthly Composite – Classes XI to XII',
        category: 'recurring',
        amount: 11250,
        formattedAmount: '₹11,250 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes XI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,35,000/yr.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Primary',
        grades: ['Pre-Nursery', 'Nursery', 'KG'],
        tuitionFee: '₹8,550 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,02,600 / year (Calculated)',
        totalAnnualPayable: '₹1,02,600',
        isCalculated: true,
        calculationNotes: '₹8,550 × 12 = ₹1,02,600/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Classes 1–5'],
        tuitionFee: '₹10,150 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,21,800 / year (Calculated)',
        totalAnnualPayable: '₹1,21,800',
        isCalculated: true,
        calculationNotes: '₹10,150 × 12 = ₹1,21,800/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes VI to X',
        grades: ['Classes 6–10'],
        tuitionFee: '₹10,650 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,27,800 / year (Calculated)',
        totalAnnualPayable: '₹1,27,800',
        isCalculated: true,
        calculationNotes: '₹10,650 × 12 = ₹1,27,800/yr.',
        curriculum: 'CBSE Secondary',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Classes 11–12'],
        tuitionFee: '₹11,250 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,35,000 / year (Calculated)',
        totalAnnualPayable: '₹1,35,000',
        isCalculated: true,
        calculationNotes: '₹11,250 × 12 = ₹1,35,000/yr.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Monthly composite fee.'
      }
    ],
    concessions: [
      {
        title: 'Sibling Concession',
        category: 'sibling',
        discountDescription: '40% concession on monthly composite tuition for 2nd child.',
        discountValue: '40% off composite',
        isOfficial: true
      }
    ],
    disclaimer: '40% sibling concession available on monthly composite for the younger child.'
  };
  audit.push({ name: bgs.name, slug: bgs.slug, oldVal, newVal: bgs.fees.rangeText });
}

// 25. BLOOM INTERNATIONAL SCHOOL TECHZONE 7
const blm = getSchool('bloom-international-school-techzone-7');
if (blm) {
  const oldVal = blm.fees?.rangeText;
  if (blm.location) {
    blm.location.address = 'Techzone-VII, Noida Extension, Roza Jalalpur Village, Greater Noida, UP 203207';
  }
  blm.affiliationNumber = '2132289';
  if (blm.verification) blm.verification.cbseAffiliationNumber = '2132289';
  blm.studentTeacherRatio = '36:1';
  blm.fees = {
    cardFee: 81700,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹81,700 – ₹1,37,100 / year (Grade-wise annual tuition)',
    registrationFee: 1100,
    admissionFee: 11000,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: '₹81,700 – ₹1,37,100',
    transportMonthly: '1,750 – 2,150 (Optional)',
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'annual',
    academicSession: '2027–28',
    source: 'Official School 2027–28 Annual Fee Schedule',
    table: [
      { type: 'Registration Fee', cost: '₹1,100' },
      { type: 'Admission Fee', cost: '₹11,000' },
      { type: 'Annual Tuition (Pre-Nur/Nur/LKG/UKG)', cost: '₹81,700 / year' },
      { type: 'Annual Tuition (Classes I–III)', cost: '₹84,100 / year' },
      { type: 'Annual Tuition (Class IV)', cost: '₹85,300 / year' },
      { type: 'Annual Tuition (Class V)', cost: '₹86,500 / year' },
      { type: 'Annual Tuition (Class VI)', cost: '₹87,700 / year' },
      { type: 'Annual Tuition (Class VII)', cost: '₹88,900 / year' },
      { type: 'Annual Tuition (Class VIII)', cost: '₹90,100 / year' },
      { type: 'Annual Tuition (Class IX)', cost: '₹1,08,700 / year' },
      { type: 'Annual Tuition (Class X)', cost: '₹1,31,100 / year' },
      { type: 'Annual Tuition (Class XI)', cost: '₹1,13,500 / year' },
      { type: 'Annual Tuition (Class XII)', cost: '₹1,37,100 / year' }
    ],
    components: [
      {
        id: 'blm-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1100,
        formattedAmount: '₹1,100',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time registration fee.'
      },
      {
        id: 'blm-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 11000,
        formattedAmount: '₹11,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee.'
      },
      {
        id: 'blm-ann-pre-ukg',
        name: 'Annual Tuition – Pre-Nur / Nur / LKG / UKG',
        category: 'recurring',
        amount: 81700,
        formattedAmount: '₹81,700 / year',
        frequency: 'annual',
        gradesApplicable: 'Pre-Nur, Nur, LKG, UKG',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official 2027–28 annual tuition.'
      },
      {
        id: 'blm-ann-ix',
        name: 'Annual Tuition – Class IX',
        category: 'recurring',
        amount: 108700,
        formattedAmount: '₹1,08,700 / year',
        frequency: 'annual',
        gradesApplicable: 'Class IX',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official 2027–28 annual tuition.'
      },
      {
        id: 'blm-ann-x',
        name: 'Annual Tuition – Class X',
        category: 'recurring',
        amount: 131100,
        formattedAmount: '₹1,31,100 / year',
        frequency: 'annual',
        gradesApplicable: 'Class X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official 2027–28 annual tuition.'
      },
      {
        id: 'blm-ann-xi',
        name: 'Annual Tuition – Class XI',
        category: 'recurring',
        amount: 113500,
        formattedAmount: '₹1,13,500 / year',
        frequency: 'annual',
        gradesApplicable: 'Class XI',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official 2027–28 annual tuition.'
      },
      {
        id: 'blm-ann-xii',
        name: 'Annual Tuition – Class XII',
        category: 'recurring',
        amount: 137100,
        formattedAmount: '₹1,37,100 / year',
        frequency: 'annual',
        gradesApplicable: 'Class XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official 2027–28 annual tuition.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nur / Nur / LKG / UKG',
        grades: ['Pre-Nursery', 'Nursery', 'LKG', 'UKG'],
        tuitionFee: '₹81,700 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹81,700',
        totalAnnualPayable: '₹81,700',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: '2027–28 annual tuition.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
        tuitionFee: '₹84,100 – ₹86,500 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹84,100 – ₹86,500',
        totalAnnualPayable: '₹84,100 – ₹86,500',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: '2027–28 annual tuition.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class 6', 'Class 7', 'Class 8'],
        tuitionFee: '₹87,700 – ₹90,100 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹87,700 – ₹90,100',
        totalAnnualPayable: '₹87,700 – ₹90,100',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: '2027–28 annual tuition.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class 9', 'Class 10'],
        tuitionFee: '₹1,08,700 – ₹1,31,100 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,08,700 – ₹1,31,100',
        totalAnnualPayable: '₹1,08,700 – ₹1,31,100',
        isCalculated: false,
        curriculum: 'CBSE Secondary',
        notes: '2027–28 annual tuition.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class 11', 'Class 12'],
        tuitionFee: '₹1,13,500 – ₹1,37,100 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,13,500 – ₹1,37,100',
        totalAnnualPayable: '₹1,13,500 – ₹1,37,100',
        isCalculated: false,
        curriculum: 'CBSE Senior Secondary',
        notes: '2027–28 annual tuition.'
      }
    ],
    concessions: [],
    disclaimer: 'Supplied fees reflect official 2027–28 annual schedule. Transport optional (₹1,750–₹2,150/mo).'
  };
  audit.push({ name: blm.name, slug: blm.slug, oldVal, newVal: blm.fees.rangeText });
}

// 26. SPARSH GLOBAL SCHOOL
const spg = getSchool('sparsh-global-school-greater-noida-west');
if (spg) {
  const oldVal = spg.fees?.rangeText;
  if (spg.location) {
    spg.location.address = 'HS-01, Sector 20, Buddha, Greater Noida, UP 201311';
  }
  spg.affiliationNumber = '2134159';
  if (spg.verification) spg.verification.cbseAffiliationNumber = '2134159';
  spg.studentTeacherRatio = '12:1–15:1';
  if (spg.admissions) {
    spg.admissions.status = 'open_2027_2028';
    spg.admissions.academicYear = '2027–28';
  }
  spg.fees = {
    cardFee: 84000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹21,000 – ₹29,250 / quarter (Quarterly composite tuition)',
    registrationFee: 1000,
    admissionFee: 35000,
    tuitionMonthly: null,
    tuitionQuarterly: '21,000 – 29,250',
    tuitionAnnual: '₹84,000 – ₹1,17,000 (Calculated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'quarterly',
    academicSession: '2027–28',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Registration / Application Fee', cost: '₹1,000' },
      { type: 'Caution Money (Refundable)', cost: '₹8,000 – ₹10,000' },
      { type: 'Admission Fee Range', cost: '₹25,000 – ₹45,000' },
      { type: 'Quarterly Composite Tuition', cost: '₹21,000 – ₹29,250 / quarter' },
      { type: 'Quarterly Transport (Optional)', cost: '₹9,900 – ₹15,000 / quarter' }
    ],
    components: [
      {
        id: 'spg-reg',
        name: 'Registration / Application Fee',
        category: 'one_time',
        amount: 1000,
        formattedAmount: '₹1,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Registration fee.'
      },
      {
        id: 'spg-caution',
        name: 'Caution Money',
        category: 'deposit',
        amount: 8000,
        formattedAmount: '₹8,000 – ₹10,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: true,
        isOfficial: true,
        notes: 'Refundable security deposit.'
      },
      {
        id: 'spg-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 35000,
        formattedAmount: '₹25,000 – ₹45,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee.'
      },
      {
        id: 'spg-tuition-qtr',
        name: 'Quarterly Composite Tuition',
        category: 'recurring',
        amount: 21000,
        formattedAmount: '₹21,000 – ₹29,250 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹84,000–₹1,17,000/yr.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'All Grades',
        grades: ['Pre-Primary to Senior Secondary'],
        tuitionFee: '₹21,000 – ₹29,250 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹84,000 – ₹1,17,000 / year (Calculated)',
        totalAnnualPayable: '₹84,000 – ₹1,17,000',
        isCalculated: true,
        calculationNotes: '₹21,000–₹29,250 × 4 = ₹84,000–₹1,17,000/yr.',
        curriculum: 'CBSE',
        notes: 'Quarterly composite tuition.'
      }
    ],
    concessions: [],
    disclaimer: 'Transport is optional (₹9,900–₹15,000/quarter) depending on route.'
  };
  audit.push({ name: spg.name, slug: spg.slug, oldVal, newVal: spg.fees.rangeText });
}

// 28. SETH ANANDRAM JAIPURIA SCHOOL
const saj = getSchool('seth-anandram-jaipuria-school-greater-noida-west');
if (saj) {
  const oldVal = saj.fees?.rangeText;
  if (saj.location) {
    saj.location.address = 'Plot No 2A & 2B, Chauganpur, Knowledge Park V, Greater Noida, UP 201306';
  }
  saj.affiliationNumber = '2134145';
  if (saj.verification) saj.verification.cbseAffiliationNumber = '2134145';
  saj.studentTeacherRatio = '15:1–28:1 (Conflicting reports)';
  if (saj.admissions) {
    saj.admissions.status = 'admissions_opening_soon';
    saj.admissions.academicYear = '2027–28';
  }
  saj.fees = {
    cardFee: 102800,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹1,02,800 – ₹1,27,050 / year (Estimated annual total)',
    registrationFee: 1500,
    admissionFee: 45000,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,02,800 – ₹1,27,050 (Estimated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'estimated_historical',
    isVerified: false,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'annual',
    academicSession: '2026–27',
    source: 'Estimated Annual Fee Schedule Schedule Range',
    table: [
      { type: 'Registration Fee', cost: '₹1,000 – ₹2,000' },
      { type: 'Admission Fee', cost: 'Up to ₹45,000' },
      { type: 'Security Deposit (Refundable)', cost: '₹5,000 – ₹7,500' },
      { type: 'Annual Examination Fee', cost: '₹2,500 / year' },
      { type: 'Estimated Yearly Total (Pre-Nur–UKG)', cost: '₹1,02,800 / year (Estimated)' },
      { type: 'Estimated Yearly Total (Classes I–VIII)', cost: '₹1,13,850 / year (Estimated)' },
      { type: 'Estimated Yearly Total (Classes IX–X)', cost: '₹1,25,150 / year (Estimated)' },
      { type: 'Estimated Yearly Total (Classes XI–XII)', cost: '₹1,27,050 / year (Estimated)' }
    ],
    components: [
      {
        id: 'saj-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1500,
        formattedAmount: '₹1,000 – ₹2,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'Estimated registration fee.'
      },
      {
        id: 'saj-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 45000,
        formattedAmount: 'Up to ₹45,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'Admission fee.'
      },
      {
        id: 'saj-sec',
        name: 'Security Deposit',
        category: 'deposit',
        amount: 5000,
        formattedAmount: '₹5,000 – ₹7,500',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: true,
        isOfficial: false,
        notes: 'Refundable security deposit.'
      },
      {
        id: 'saj-exam',
        name: 'Annual Exam Fee',
        category: 'examination',
        amount: 2500,
        formattedAmount: '₹2,500 / year',
        frequency: 'annual',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'Annual examination fee.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nur to UKG',
        grades: ['Pre-Nursery', 'Nursery', 'LKG', 'UKG'],
        tuitionFee: '₹1,02,800 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,02,800 (Estimated)',
        totalAnnualPayable: '₹1,02,800',
        isCalculated: true,
        curriculum: 'CBSE',
        notes: 'Estimated total yearly fee.'
      },
      {
        gradeGroup: 'Classes I to VIII',
        grades: ['Classes 1–8'],
        tuitionFee: '₹1,13,850 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,13,850 (Estimated)',
        totalAnnualPayable: '₹1,13,850',
        isCalculated: true,
        curriculum: 'CBSE',
        notes: 'Estimated total yearly fee.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class 9', 'Class 10'],
        tuitionFee: '₹1,25,150 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,25,150 (Estimated)',
        totalAnnualPayable: '₹1,25,150',
        isCalculated: true,
        curriculum: 'CBSE Secondary',
        notes: 'Estimated total yearly fee.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class 11', 'Class 12'],
        tuitionFee: '₹1,27,050 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,27,050 (Estimated)',
        totalAnnualPayable: '₹1,27,050',
        isCalculated: true,
        curriculum: 'CBSE Senior Secondary',
        notes: 'Estimated total yearly fee.'
      }
    ],
    concessions: [],
    disclaimer: 'Estimated current fee based on historical fee structure; not an official school fee. 2027–28 admissions expected late 2026/early 2027.'
  };
  audit.push({ name: saj.name, slug: saj.slug, oldVal, newVal: saj.fees.rangeText });
}

// 29. GAGAN PUBLIC SCHOOL
const gag = getSchool('gagan-public-school-sector-4');
if (gag) {
  const oldVal = gag.fees?.rangeText;
  if (gag.location) {
    gag.location.address = 'Plot HS 1, near Gaur City 1, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, UP 201318';
  }
  gag.affiliationNumber = '2132338';
  if (gag.verification) gag.verification.cbseAffiliationNumber = '2132338';
  gag.studentTeacherRatio = '18:1';
  gag.fees = {
    cardFee: 65400,
    estimatedFirstYear: 48800,
    currency: 'INR',
    rangeText: '₹5,450 – ₹6,800 / month (1st Yr Est: ₹48.8k – ₹89.4k)',
    registrationFee: 5000,
    admissionFee: 19000,
    tuitionMonthly: '5,450 – 6,800',
    tuitionQuarterly: null,
    tuitionAnnual: '₹65,400 – ₹81,600 (Calculated)',
    transportMonthly: '1,300 – 2,900 (Optional)',
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Prospectus Fee', cost: '₹500' },
      { type: 'Registration Fee', cost: '₹5,000' },
      { type: 'Admission Fee Range', cost: '₹16,000 – ₹22,000' },
      { type: 'Monthly Tuition / Composite', cost: '₹5,450 – ₹6,800 / month' },
      { type: 'Estimated First-Year Total Range', cost: '₹48,800 – ₹89,400' },
      { type: 'Transport Fee (Optional)', cost: '₹1,300 – ₹2,900 / month' }
    ],
    components: [
      {
        id: 'gag-prospectus',
        name: 'Prospectus Fee',
        category: 'one_time',
        amount: 500,
        formattedAmount: '₹500',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Prospectus fee.'
      },
      {
        id: 'gag-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 5000,
        formattedAmount: '₹5,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Registration fee.'
      },
      {
        id: 'gag-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 19000,
        formattedAmount: '₹16,000 – ₹22,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee.'
      },
      {
        id: 'gag-tuition-mo',
        name: 'Monthly Tuition / Composite',
        category: 'recurring',
        amount: 5450,
        formattedAmount: '₹5,450 – ₹6,800 / month',
        frequency: 'monthly',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹65,400–₹81,600/yr.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'All Grades',
        grades: ['Pre-Primary to Class XII'],
        tuitionFee: '₹5,450 – ₹6,800 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹65,400 – ₹81,600 / year (Calculated)',
        totalAnnualPayable: '₹65,400 – ₹81,600',
        isCalculated: true,
        calculationNotes: '₹5,450–₹6,800 × 12 = ₹65,400–₹81,600/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly tuition range.'
      }
    ],
    concessions: [],
    disclaimer: 'CBSE affiliation is verified as 2132338 (an alternate report lists 2132689). First-year total is estimated at ₹48,800–₹89,400.'
  };
  audit.push({ name: gag.name, slug: gag.slug, oldVal, newVal: gag.fees.rangeText });
}

// 30. INDIRAPURAM PUBLIC SCHOOL CROSSINGS REPUBLIK
const ips = getSchool('indirapuram-public-school-crossings-republik');
if (ips) {
  const oldVal = ips.fees?.rangeText;
  if (ips.location) {
    ips.location.address = 'Plot number EF-7 & 8B, Sain Vihar Rd, Biharipur Village, Dundahera, Ghaziabad, UP 201016';
  }
  ips.affiliationNumber = '2132548';
  if (ips.verification) ips.verification.cbseAffiliationNumber = '2132548';
  ips.studentTeacherRatio = '14:1';
  ips.fees = {
    cardFee: 117216,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹9,768 – ₹10,328 / month (Composite monthly tuition)',
    registrationFee: null,
    admissionFee: null,
    tuitionMonthly: '9,768 – 10,328',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,17,216 – ₹1,23,936 (Calculated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Monthly Composite (Nursery/LKG/UKG)', cost: '₹10,328 / mo (₹1,23,936 / yr)' },
      { type: 'Monthly Composite (Class I)', cost: '₹9,984 / mo (₹1,19,808 / yr)' },
      { type: 'Monthly Composite (Classes II–VI)', cost: '₹9,860 / mo (₹1,18,320 / yr)' },
      { type: 'Monthly Composite (Class VII)', cost: '₹10,012 / mo (₹1,20,144 / yr)' },
      { type: 'Monthly Composite (Classes VIII–X)', cost: '₹10,204 / mo (₹1,22,448 / yr)' },
      { type: 'Monthly Composite (Classes XI–XII)', cost: '₹9,768 / mo (₹1,17,216 / yr)' },
      { type: 'Examination Fee', cost: '₹354 / mo (₹1,062 / qtr)' },
      { type: 'Optional CS/AI Lab (XI–XII)', cost: '₹836 / mo (₹2,508 / qtr)' },
      { type: 'Optional Science Lab PCB (XI–XII)', cost: '₹536 / mo (₹1,608 / qtr)' }
    ],
    components: [
      {
        id: 'ips-exam',
        name: 'Examination Fee',
        category: 'examination',
        amount: 354,
        formattedAmount: '₹354 / month (₹1,062 / quarter)',
        frequency: 'monthly',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Monthly examination fee.'
      },
      {
        id: 'ips-comp-nur-ukg',
        name: 'Monthly Composite – Nursery / LKG / UKG',
        category: 'recurring',
        amount: 10328,
        formattedAmount: '₹10,328 / month',
        frequency: 'monthly',
        gradesApplicable: 'Nursery, LKG, UKG',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,23,936/yr.'
      },
      {
        id: 'ips-comp-i',
        name: 'Monthly Composite – Class I',
        category: 'recurring',
        amount: 9984,
        formattedAmount: '₹9,984 / month',
        frequency: 'monthly',
        gradesApplicable: 'Class 1',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,19,808/yr.'
      },
      {
        id: 'ips-comp-ii-vi',
        name: 'Monthly Composite – Classes II to VI',
        category: 'recurring',
        amount: 9860,
        formattedAmount: '₹9,860 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes 2 to 6',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,18,320/yr.'
      },
      {
        id: 'ips-comp-vii',
        name: 'Monthly Composite – Class VII',
        category: 'recurring',
        amount: 10012,
        formattedAmount: '₹10,012 / month',
        frequency: 'monthly',
        gradesApplicable: 'Class 7',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,20,144/yr.'
      },
      {
        id: 'ips-comp-viii-x',
        name: 'Monthly Composite – Classes VIII to X',
        category: 'recurring',
        amount: 10204,
        formattedAmount: '₹10,204 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes 8 to 10',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,22,448/yr.'
      },
      {
        id: 'ips-comp-xi-xii',
        name: 'Monthly Composite – Classes XI to XII',
        category: 'recurring',
        amount: 9768,
        formattedAmount: '₹9,768 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes 11 to 12',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,17,216/yr.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Nursery / LKG / UKG',
        grades: ['Nursery', 'LKG', 'UKG'],
        tuitionFee: '₹10,328 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,23,936 / year (Calculated)',
        totalAnnualPayable: '₹1,23,936',
        isCalculated: true,
        calculationNotes: '₹10,328 × 12 = ₹1,23,936/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Class I',
        grades: ['Class 1'],
        tuitionFee: '₹9,984 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,19,808 / year (Calculated)',
        totalAnnualPayable: '₹1,19,808',
        isCalculated: true,
        calculationNotes: '₹9,984 × 12 = ₹1,19,808/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes II to VI',
        grades: ['Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
        tuitionFee: '₹9,860 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,18,320 / year (Calculated)',
        totalAnnualPayable: '₹1,18,320',
        isCalculated: true,
        calculationNotes: '₹9,860 × 12 = ₹1,18,320/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Class VII',
        grades: ['Class 7'],
        tuitionFee: '₹10,012 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,20,144 / year (Calculated)',
        totalAnnualPayable: '₹1,20,144',
        isCalculated: true,
        calculationNotes: '₹10,012 × 12 = ₹1,20,144/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes VIII to X',
        grades: ['Class 8', 'Class 9', 'Class 10'],
        tuitionFee: '₹10,204 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,22,448 / year (Calculated)',
        totalAnnualPayable: '₹1,22,448',
        isCalculated: true,
        calculationNotes: '₹10,204 × 12 = ₹1,22,448/yr.',
        curriculum: 'CBSE Secondary',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class 11', 'Class 12'],
        tuitionFee: '₹9,768 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,17,216 / year (Calculated)',
        totalAnnualPayable: '₹1,17,216',
        isCalculated: true,
        calculationNotes: '₹9,768 × 12 = ₹1,17,216/yr.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Monthly composite fee.'
      }
    ],
    concessions: [],
    disclaimer: 'Optional XI–XII computer/AI lab is ₹836/mo (₹2,508/qtr); physics/chemistry/biology lab is ₹536/mo.'
  };
  audit.push({ name: ips.name, slug: ips.slug, oldVal, newVal: ips.fees.rangeText });
}

// 31. SAPPHIRE INTERNATIONAL CROSSINGS REPUBLIK
const sap = getSchool('sapphire-international-school-crossings-republik');
if (sap) {
  const oldVal = sap.fees?.rangeText;
  if (sap.location) {
    sap.location.address = 'Plot EF 7&8, adjoining GH-07 Gate 2, Crossing Infra, Sain Vihar Road, Crossings Republik, Ghaziabad, UP 201016';
  }
  sap.affiliationNumber = '2133627';
  if (sap.verification) sap.verification.cbseAffiliationNumber = '2133627';
  sap.studentTeacherRatio = '15:1';
  if (sap.admissions) {
    sap.admissions.status = 'open_2027_2028';
    sap.admissions.academicYear = '2027–28';
  }
  sap.fees = {
    cardFee: 202100,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹2,02,100 – ₹2,24,900 / year (Estimated grade-wise total)',
    registrationFee: 1500,
    admissionFee: 35000,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: '₹2,02,100 – ₹2,24,900 (Estimated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'annual',
    academicSession: '2027–28',
    source: 'Official School Fee Schedule Schedule Range',
    table: [
      { type: 'Registration Fee', cost: '₹1,500' },
      { type: 'Admission Fee Range', cost: '₹33,000 – ₹40,000' },
      { type: 'Security Deposit (Refundable)', cost: '₹20,000 – ₹25,000' },
      { type: 'Annual Fee (Pre-Nur / EYPL)', cost: 'approx ₹2,04,200 / year' },
      { type: 'Annual Fee (Nursery / UKG)', cost: 'approx ₹2,02,100 / year' },
      { type: 'Annual Fee (Classes I–X)', cost: 'approx ₹2,08,700 / year' },
      { type: 'Annual Fee (Classes XI–XII)', cost: 'approx ₹2,24,900 / year' }
    ],
    components: [
      {
        id: 'sap-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1500,
        formattedAmount: '₹1,500',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Registration fee.'
      },
      {
        id: 'sap-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 35000,
        formattedAmount: '₹33,000 – ₹40,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee.'
      },
      {
        id: 'sap-sec',
        name: 'Security Deposit',
        category: 'deposit',
        amount: 20000,
        formattedAmount: '₹20,000 – ₹25,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: true,
        isOfficial: true,
        notes: 'Refundable security deposit.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nur / EYPL',
        grades: ['Pre-Nursery', 'EYPL'],
        tuitionFee: 'approx ₹2,04,200 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹2,04,200',
        totalAnnualPayable: '₹2,04,200',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Estimated annual total.'
      },
      {
        gradeGroup: 'Nursery / UKG',
        grades: ['Nursery', 'LKG', 'UKG'],
        tuitionFee: 'approx ₹2,02,100 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹2,02,100',
        totalAnnualPayable: '₹2,02,100',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Estimated annual total.'
      },
      {
        gradeGroup: 'Classes I to X',
        grades: ['Classes 1–10'],
        tuitionFee: 'approx ₹2,08,700 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹2,08,700',
        totalAnnualPayable: '₹2,08,700',
        isCalculated: false,
        curriculum: 'CBSE Secondary',
        notes: 'Estimated annual total.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class 11', 'Class 12'],
        tuitionFee: 'approx ₹2,24,900 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹2,24,900',
        totalAnnualPayable: '₹2,24,900',
        isCalculated: false,
        curriculum: 'CBSE Senior Secondary',
        notes: 'Estimated annual total.'
      }
    ],
    concessions: [],
    disclaimer: 'Annual total figures are source-derived estimates. Security deposit of ₹20,000–₹25,000 is refundable.'
  };
  audit.push({ name: sap.name, slug: sap.slug, oldVal, newVal: sap.fees.rangeText });
}

// 33. GOLDEN VALLEY PUBLIC SCHOOL
const gol = getSchool('golden-valley-public-school-noida-ext');
if (gol) {
  const oldVal = gol.fees?.rangeText;
  if (gol.location) {
    gol.location.address = 'Maripat Road Roza Yakubpur, Roza Jalalpur Village, Greater Noida, UP 201009';
  }
  if (gol.contact) {
    gol.contact.phone = '+91 99112 54445';
  }
  gol.fees = {
    cardFee: null,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: 'Not publicly disclosed',
    registrationFee: null,
    admissionFee: null,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: null,
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'not_publicly_verified',
    isVerified: false,
    disclosed: false,
    comparableAnnualAvailable: false,
    billingFrequency: 'as_applicable',
    academicSession: '2026–27',
    source: 'Not publicly disclosed',
    table: [],
    components: [],
    gradeWiseTiers: [],
    concessions: [],
    disclaimer: 'Fee information for Golden Valley Public School is not publicly disclosed.'
  };
  audit.push({ name: gol.name, slug: gol.slug, oldVal, newVal: gol.fees.rangeText });
}

// Save back
fs.writeFileSync(schoolsPath, JSON.stringify(schools, null, 2), 'utf8');
console.log(`Phase 3 applied. Updated ${audit.length} records.`);
audit.forEach(a => console.log(`  - ${a.name} (${a.slug}): ${a.oldVal} -> ${a.newVal}`));
