const fs = require('fs');
const path = require('path');

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

const audit = [];

function getSchool(slug) {
  return schools.find(s => s.slug === slug);
}

// 1. THE SHRI RAM UNIVERSAL SCHOOL
const sru = getSchool('the-shri-ram-universal-school');
if (sru) {
  const oldVal = sru.fees?.rangeText;
  sru.affiliationNumber = '2134175';
  if (sru.verification) sru.verification.cbseAffiliationNumber = '2134175';
  sru.studentTeacherRatio = '10:1';
  sru.fees = {
    cardFee: 164400,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: 'Classes IX–XII: ₹41,100 / quarter (Nursery–VII: Not publicly specified)',
    registrationFee: null,
    admissionFee: null,
    tuitionMonthly: null,
    tuitionQuarterly: '41,100 (IX–XII)',
    tuitionAnnual: null,
    transportMonthly: '2,500 – 3,500',
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'quarterly',
    academicSession: '2026–27',
    source: 'Official School Circular & Fee Structure',
    table: [
      { type: 'Tuition / Composite Fee (Classes IX–XII)', cost: '₹41,100 / quarter' },
      { type: 'Tuition Fee (Nursery to Class VII)', cost: 'Not publicly specified' },
      { type: 'Transport Fee (Optional)', cost: '₹2,500 – ₹3,500 / month' }
    ],
    components: [
      {
        id: 'tsrus-tuition-ix-xii',
        name: 'Composite Fee – Classes IX to XII',
        category: 'recurring',
        amount: 41100,
        formattedAmount: '₹41,100 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'Classes IX to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Supplied official fee detail for Classes IX–XII.'
      },
      {
        id: 'tsrus-tuition-nur-vii',
        name: 'Tuition Fee – Nursery to Class VII',
        category: 'recurring',
        amount: null,
        formattedAmount: 'Not publicly specified',
        frequency: 'quarterly',
        gradesApplicable: 'Nursery to Class VII',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'Pre-primary and primary grade tuition is not publicly specified in supplied circular.'
      },
      {
        id: 'tsrus-transport',
        name: 'Transport Fee (Optional)',
        category: 'transport',
        amount: null,
        formattedAmount: '₹2,500 – ₹3,500 / month',
        frequency: 'monthly',
        gradesApplicable: 'All Grades (Optional)',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'Route and distance dependent.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Nursery to Class VII',
        grades: ['Nursery', 'KG', 'Class I–VII'],
        tuitionFee: 'Not publicly specified',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: 'Not publicly specified',
        totalAnnualPayable: 'Not publicly specified',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Pre-primary and primary tuition figures are not publicly specified.'
      },
      {
        gradeGroup: 'Classes IX to XII',
        grades: ['Class IX', 'Class X', 'Class XI', 'Class XII'],
        tuitionFee: '₹41,100 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹1,64,400 / year (Calculated)',
        totalAnnualPayable: '₹1,64,400',
        isCalculated: true,
        calculationNotes: 'Calculated as ₹41,100/quarter × 4 quarters = ₹1,64,400/year.',
        curriculum: 'CBSE Secondary & Senior Secondary',
        notes: 'Official supplied quarterly fee of ₹41,100.'
      }
    ],
    concessions: [],
    disclaimer: 'Books and uniform fees are not included as published school fee components. Figures for Classes IX–XII reflect supplied fee schedule.'
  };
  audit.push({ name: sru.name, slug: sru.slug, oldVal, newVal: sru.fees.rangeText });
}

// 2. JM INTERNATIONAL SCHOOL
const jm = getSchool('jm-international-school');
if (jm) {
  const oldVal = jm.fees?.rangeText;
  jm.studentTeacherRatio = '30:1';
  jm.fees = {
    cardFee: 114000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹9,500 – ₹12,000 / month (Calculated annual: ₹1,14,000 – ₹1,44,000 / yr)',
    registrationFee: null,
    admissionFee: 55000,
    tuitionMonthly: '9,500 – 12,000',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,14,000 – ₹1,44,000 (Calculated)',
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
      { type: 'Admission Fee (One-Time)', cost: '₹55,000' },
      { type: 'Composite Tuition Fee', cost: '₹9,500 – ₹12,000 / month' },
      { type: 'Calculated Annual Equivalent', cost: '₹1,14,000 – ₹1,44,000 / year' }
    ],
    components: [
      {
        id: 'jm-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 55000,
        formattedAmount: '₹55,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time non-refundable admission fee.'
      },
      {
        id: 'jm-tuition-monthly',
        name: 'Composite Tuition Fee',
        category: 'recurring',
        amount: null,
        formattedAmount: '₹9,500 – ₹12,000 / month',
        frequency: 'monthly',
        gradesApplicable: 'Pre-Primary to Class XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Monthly composite tuition range.'
      },
      {
        id: 'jm-tuition-annual-calc',
        name: 'Calculated Annual Tuition Equivalent',
        category: 'recurring',
        amount: 114000,
        formattedAmount: '₹1,14,000 – ₹1,44,000 / year',
        frequency: 'annual',
        gradesApplicable: 'Pre-Primary to Class XII',
        mandatory: true,
        refundable: false,
        isCalculated: true,
        calculationNotes: 'Calculated strictly from supplied monthly composite range (₹9,500 × 12 = ₹1,14,000 to ₹12,000 × 12 = ₹1,44,000). Not an official single annual fee.',
        isOfficial: false,
        notes: 'Calculated annual equivalent.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Primary to Class XII',
        grades: ['Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Senior Secondary'],
        tuitionFee: '₹9,500 – ₹12,000 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,14,000 – ₹1,44,000 / year',
        totalAnnualPayable: '₹1,14,000 – ₹1,44,000',
        isCalculated: true,
        calculationNotes: 'Calculated as ₹9,500–₹12,000/month × 12 months = ₹1,14,000–₹1,44,000/year.',
        curriculum: 'CBSE',
        notes: 'Calculated annual equivalent from supplied monthly range.'
      }
    ],
    concessions: [],
    disclaimer: 'Annual figures are calculated equivalents from the supplied monthly composite range (₹9,500–₹12,000/mo) and are not quoted official single annual fees.'
  };
  audit.push({ name: jm.name, slug: jm.slug, oldVal, newVal: jm.fees.rangeText });
}

// 3. ST. XAVIER'S HIGH SCHOOL
const sxSlugs = ['st-xaviers-high-school', 'st-xaviers-high-school-greater-noida-west'];
sxSlugs.forEach(slug => {
  const sx = getSchool(slug);
  if (sx) {
    const oldVal = sx.fees?.rangeText;
    sx.studentTeacherRatio = '14:1';
    if (sx.location) {
      sx.location.address = 'Plot No 20 C, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201308';
      sx.location.pincode = '201308';
    }
    sx.fees = {
      cardFee: 90000,
      estimatedFirstYear: null,
      currency: 'INR',
      rangeText: '₹22,500 – ₹30,000+ / quarter (Grade-wise quarterly range)',
      registrationFee: null,
      admissionFee: null,
      tuitionMonthly: null,
      tuitionQuarterly: '22,500 – 30,000+',
      tuitionAnnual: '₹90,000 – ₹1,20,000+ (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      isVerified: true,
      disclosed: true,
      comparableAnnualAvailable: true,
      billingFrequency: 'quarterly',
      academicSession: '2026–27',
      source: 'Official School Fee Circular',
      table: [
        { type: 'Caution Money / Security Fee (Refundable)', cost: '₹7,500 – ₹10,000 (One-Time)' },
        { type: 'Quarterly Tuition (Nursery–V)', cost: '₹22,500 – ₹29,700 / quarter' },
        { type: 'Quarterly Tuition (VI–VIII)', cost: '₹23,400 – ₹30,000+ / quarter' },
        { type: 'Quarterly Tuition (IX–X)', cost: '₹24,300+ / quarter' }
      ],
      components: [
        {
          id: 'sx-caution',
          name: 'Caution Money / Security Deposit',
          category: 'deposit',
          amount: 7500,
          formattedAmount: '₹7,500 – ₹10,000',
          frequency: 'one_time',
          gradesApplicable: 'All Entry Grades',
          mandatory: true,
          refundable: true,
          isOfficial: true,
          notes: 'One-time refundable security deposit. Not part of tuition.'
        },
        {
          id: 'sx-tuition-nur-v',
          name: 'Quarterly Tuition – Nursery to Class V',
          category: 'recurring',
          amount: 22500,
          formattedAmount: '₹22,500 – ₹29,700 / quarter',
          frequency: 'quarterly',
          gradesApplicable: 'Nursery to Class V',
          mandatory: true,
          refundable: false,
          isOfficial: true,
          notes: 'Supplied quarterly fee range for primary grades.'
        },
        {
          id: 'sx-tuition-vi-viii',
          name: 'Quarterly Tuition – Classes VI to VIII',
          category: 'recurring',
          amount: 23400,
          formattedAmount: '₹23,400 – ₹30,000+ / quarter',
          frequency: 'quarterly',
          gradesApplicable: 'Classes VI to VIII',
          mandatory: true,
          refundable: false,
          isOfficial: true,
          notes: 'Supplied quarterly fee range for middle grades.'
        },
        {
          id: 'sx-tuition-ix-x',
          name: 'Quarterly Tuition – Classes IX to X',
          category: 'recurring',
          amount: 24300,
          formattedAmount: '₹24,300+ / quarter',
          frequency: 'quarterly',
          gradesApplicable: 'Classes IX to X',
          mandatory: true,
          refundable: false,
          isOfficial: true,
          notes: 'Supplied quarterly fee for secondary grades.'
        }
      ],
      gradeWiseTiers: [
        {
          gradeGroup: 'Nursery to Class V',
          grades: ['Nursery', 'KG', 'Classes I–V'],
          tuitionFee: '₹22,500 – ₹29,700 / quarter',
          tuitionFrequency: 'quarterly',
          calculatedAnnualEquivalent: '₹90,000 – ₹1,18,800 / year (Calculated)',
          totalAnnualPayable: '₹90,000 – ₹1,18,800',
          isCalculated: true,
          calculationNotes: 'Calculated as ₹22,500–₹29,700/quarter × 4 quarters.',
          curriculum: 'CBSE',
          notes: 'Quarterly tuition fee.'
        },
        {
          gradeGroup: 'Classes VI to VIII',
          grades: ['Class VI', 'Class VII', 'Class VIII'],
          tuitionFee: '₹23,400 – ₹30,000+ / quarter',
          tuitionFrequency: 'quarterly',
          calculatedAnnualEquivalent: '₹93,600 – ₹1,20,000+ / year (Calculated)',
          totalAnnualPayable: '₹93,600 – ₹1,20,000+',
          isCalculated: true,
          calculationNotes: 'Calculated as ₹23,400–₹30,000+/quarter × 4 quarters.',
          curriculum: 'CBSE',
          notes: 'Quarterly tuition fee.'
        },
        {
          gradeGroup: 'Classes IX to X',
          grades: ['Class IX', 'Class X'],
          tuitionFee: '₹24,300+ / quarter',
          tuitionFrequency: 'quarterly',
          calculatedAnnualEquivalent: '₹97,200+ / year (Calculated)',
          totalAnnualPayable: '₹97,200+',
          isCalculated: true,
          calculationNotes: 'Calculated as ₹24,300+/quarter × 4 quarters.',
          curriculum: 'CBSE Secondary',
          notes: 'Quarterly tuition fee.'
        }
      ],
      concessions: [],
      disclaimer: 'Caution money of ₹7,500–₹10,000 is a refundable security deposit. Quarterly ranges are preserved as supplied.'
    };
    audit.push({ name: sx.name, slug: sx.slug, oldVal, newVal: sx.fees.rangeText });
  }
});

// 4. THE WISDOM TREE SCHOOL
const wt = getSchool('the-wisdom-tree-school');
if (wt) {
  const oldVal = wt.fees?.rangeText;
  wt.studentTeacherRatio = '18:1';
  wt.fees = {
    cardFee: 87000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹7,250 – ₹12,300 / month (Grade-wise monthly composite)',
    registrationFee: 500,
    admissionFee: 20000,
    tuitionMonthly: '7,250 – 12,300',
    tuitionQuarterly: null,
    tuitionAnnual: '₹87,000 – ₹1,47,600 (Calculated)',
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
      { type: 'Registration Fee', cost: '₹500' },
      { type: 'Admission Fee', cost: '₹20,000' },
      { type: 'Caution Money (Refundable)', cost: '₹5,000' },
      { type: 'Tuition (Pre-KG)', cost: '₹7,250 / month' },
      { type: 'Tuition (Classes I–V)', cost: '₹8,450 / month' },
      { type: 'Tuition (Classes VI–VIII)', cost: '₹9,700 / month' },
      { type: 'Tuition (Classes IX–X)', cost: '₹10,800 / month' },
      { type: 'Tuition (Classes XI–XII)', cost: '₹12,300 / month' }
    ],
    components: [
      {
        id: 'wt-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 500,
        formattedAmount: '₹500',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time registration fee.'
      },
      {
        id: 'wt-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 20000,
        formattedAmount: '₹20,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee.'
      },
      {
        id: 'wt-caution',
        name: 'Caution Money',
        category: 'deposit',
        amount: 5000,
        formattedAmount: '₹5,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: true,
        isOfficial: true,
        notes: 'Refundable security deposit.'
      },
      {
        id: 'wt-pre-kg',
        name: 'Monthly Tuition – Pre-KG',
        category: 'recurring',
        amount: 7250,
        formattedAmount: '₹7,250 / month',
        frequency: 'monthly',
        gradesApplicable: 'Pre-KG',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official monthly tuition.'
      },
      {
        id: 'wt-i-v',
        name: 'Monthly Tuition – Classes I to V',
        category: 'recurring',
        amount: 8450,
        formattedAmount: '₹8,450 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes I to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official monthly tuition.'
      },
      {
        id: 'wt-vi-viii',
        name: 'Monthly Tuition – Classes VI to VIII',
        category: 'recurring',
        amount: 9700,
        formattedAmount: '₹9,700 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes VI to VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official monthly tuition.'
      },
      {
        id: 'wt-ix-x',
        name: 'Monthly Tuition – Classes IX to X',
        category: 'recurring',
        amount: 10800,
        formattedAmount: '₹10,800 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes IX to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official monthly tuition.'
      },
      {
        id: 'wt-xi-xii',
        name: 'Monthly Tuition – Classes XI to XII',
        category: 'recurring',
        amount: 12300,
        formattedAmount: '₹12,300 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes XI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official monthly tuition.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-KG',
        grades: ['Pre-KG'],
        tuitionFee: '₹7,250 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹87,000 / year (Calculated)',
        totalAnnualPayable: '₹87,000',
        isCalculated: true,
        calculationNotes: '₹7,250 × 12 = ₹87,000/yr.',
        curriculum: 'CBSE',
        notes: 'Pre-KG tuition.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
        tuitionFee: '₹8,450 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,01,400 / year (Calculated)',
        totalAnnualPayable: '₹1,01,400',
        isCalculated: true,
        calculationNotes: '₹8,450 × 12 = ₹1,01,400/yr.',
        curriculum: 'CBSE',
        notes: 'Classes I–V tuition.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class VI', 'Class VII', 'Class VIII'],
        tuitionFee: '₹9,700 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,16,400 / year (Calculated)',
        totalAnnualPayable: '₹1,16,400',
        isCalculated: true,
        calculationNotes: '₹9,700 × 12 = ₹1,16,400/yr.',
        curriculum: 'CBSE',
        notes: 'Classes VI–VIII tuition.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: '₹10,800 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,29,600 / year (Calculated)',
        totalAnnualPayable: '₹1,29,600',
        isCalculated: true,
        calculationNotes: '₹10,800 × 12 = ₹1,29,600/yr.',
        curriculum: 'CBSE Secondary',
        notes: 'Classes IX–X tuition.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class XI', 'Class XII'],
        tuitionFee: '₹12,300 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,47,600 / year (Calculated)',
        totalAnnualPayable: '₹1,47,600',
        isCalculated: true,
        calculationNotes: '₹12,300 × 12 = ₹1,47,600/yr.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Classes XI–XII tuition.'
      }
    ],
    concessions: [],
    disclaimer: 'Tuition fees are structured grade-wise and billed monthly.'
  };
  audit.push({ name: wt.name, slug: wt.slug, oldVal, newVal: wt.fees.rangeText });
}

// 5. THE INFINITY SCHOOL
const inf = getSchool('the-infinity-school');
if (inf) {
  const oldVal = inf.fees?.rangeText;
  inf.fees = {
    cardFee: 108000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹9,000 – ₹11,500 / month (Historical Reference: 2023–24)',
    registrationFee: 1200,
    admissionFee: 35000,
    tuitionMonthly: '9,000 – 11,500 (Historical 2023–24)',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,08,000 – ₹1,38,000 (Historical Reference: 2023–24)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'estimated_historical',
    isVerified: false,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2023–24',
    source: 'Historical Fee Circular (2023–24)',
    table: [
      { type: 'Registration Fee', cost: '₹1,200 (Historical 2023–24)' },
      { type: 'Admission Fee', cost: '₹35,000 (Historical 2023–24)' },
      { type: 'Caution Deposit (Refundable)', cost: '₹10,000 (Historical 2023–24)' },
      { type: 'Monthly Composite (Reception)', cost: '₹9,000 / month (Sibling: ₹8,000 / mo)' },
      { type: 'Monthly Composite (PP1–Grade 1)', cost: '₹10,500 / month (Sibling: ₹8,000 / mo)' },
      { type: 'Monthly Composite (Grades 2–5)', cost: '₹11,000 / month (Sibling: ₹8,000 / mo)' },
      { type: 'Monthly Composite (Grades 6–10)', cost: '₹11,500 / month (Sibling: ₹8,000 / mo)' }
    ],
    components: [
      {
        id: 'inf-reg',
        name: 'Registration Fee (Historical)',
        category: 'one_time',
        amount: 1200,
        formattedAmount: '₹1,200',
        frequency: 'one_time',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'Historical 2023–24 fee schedule.'
      },
      {
        id: 'inf-adm',
        name: 'Admission Fee (Historical)',
        category: 'one_time',
        amount: 35000,
        formattedAmount: '₹35,000',
        frequency: 'one_time',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'Historical 2023–24 fee schedule.'
      },
      {
        id: 'inf-caution',
        name: 'Caution Deposit (Historical)',
        category: 'deposit',
        amount: 10000,
        formattedAmount: '₹10,000',
        frequency: 'one_time',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: true,
        isOfficial: false,
        notes: 'Refundable security deposit (2023–24).'
      },
      {
        id: 'inf-comp-reception',
        name: 'Monthly Composite – Reception',
        category: 'recurring',
        amount: 9000,
        formattedAmount: '₹9,000 / month',
        frequency: 'monthly',
        gradesApplicable: 'Reception',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'First child: ₹9,000/mo, Sibling: ₹8,000/mo (Historical 2023–24).'
      },
      {
        id: 'inf-comp-pp1-1',
        name: 'Monthly Composite – PP1 / PP2 / Grade 1',
        category: 'recurring',
        amount: 10500,
        formattedAmount: '₹10,500 / month',
        frequency: 'monthly',
        gradesApplicable: 'PP1, PP2, Grade 1',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'First child: ₹10,500/mo, Sibling: ₹8,000/mo (Historical 2023–24).'
      },
      {
        id: 'inf-comp-2-5',
        name: 'Monthly Composite – Grades 2 to 5',
        category: 'recurring',
        amount: 11000,
        formattedAmount: '₹11,000 / month',
        frequency: 'monthly',
        gradesApplicable: 'Grades 2 to 5',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'First child: ₹11,000/mo, Sibling: ₹8,000/mo (Historical 2023–24).'
      },
      {
        id: 'inf-comp-6-10',
        name: 'Monthly Composite – Grades 6 to 10',
        category: 'recurring',
        amount: 11500,
        formattedAmount: '₹11,500 / month',
        frequency: 'monthly',
        gradesApplicable: 'Grades 6 to 10',
        mandatory: true,
        refundable: false,
        isOfficial: false,
        notes: 'First child: ₹11,500/mo, Sibling: ₹8,000/mo (Historical 2023–24).'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Reception',
        grades: ['Reception'],
        tuitionFee: '₹9,000 / month (Sibling: ₹8,000 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,08,000 / year (Historical Reference)',
        totalAnnualPayable: '₹1,08,000',
        isCalculated: true,
        calculationNotes: '₹9,000 × 12 = ₹1,08,000/yr.',
        curriculum: 'CBSE / Early Years',
        notes: 'Historical 2023–24 reference.'
      },
      {
        gradeGroup: 'PP1 / PP2 / Grade 1',
        grades: ['PP1', 'PP2', 'Grade 1'],
        tuitionFee: '₹10,500 / month (Sibling: ₹8,000 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,26,000 / year (Historical Reference)',
        totalAnnualPayable: '₹1,26,000',
        isCalculated: true,
        calculationNotes: '₹10,500 × 12 = ₹1,26,000/yr.',
        curriculum: 'CBSE',
        notes: 'Historical 2023–24 reference.'
      },
      {
        gradeGroup: 'Grades 2 to 5',
        grades: ['Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        tuitionFee: '₹11,000 / month (Sibling: ₹8,000 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,32,000 / year (Historical Reference)',
        totalAnnualPayable: '₹1,32,000',
        isCalculated: true,
        calculationNotes: '₹11,000 × 12 = ₹1,32,000/yr.',
        curriculum: 'CBSE',
        notes: 'Historical 2023–24 reference.'
      },
      {
        gradeGroup: 'Grades 6 to 10',
        grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
        tuitionFee: '₹11,500 / month (Sibling: ₹8,000 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,38,000 / year (Historical Reference)',
        totalAnnualPayable: '₹1,38,000',
        isCalculated: true,
        calculationNotes: '₹11,500 × 12 = ₹1,38,000/yr.',
        curriculum: 'CBSE',
        notes: 'Historical 2023–24 reference.'
      }
    ],
    concessions: [
      {
        title: 'Sibling Discount',
        category: 'sibling',
        discountDescription: 'Sibling rate of ₹8,000/month applies across all grade levels (Historical 2023–24).',
        discountValue: 'Flat ₹8,000 / month',
        isOfficial: true
      }
    ],
    disclaimer: 'Estimated / inferred current fee based on 2023–24 historical fee structure; not an official 2026–27 school fee.'
  };
  audit.push({ name: inf.name, slug: inf.slug, oldVal, newVal: inf.fees.rangeText });
}

// 6. RAMAGYA SCHOOL NOIDA EXTENSION
const ram = getSchool('ramagya-school-noida-extension');
if (ram) {
  const oldVal = ram.fees?.rangeText;
  if (ram.location) {
    ram.location.address = 'Plot No. A-229, Knowledge Park V, Greater Noida West (Noida Extension), Uttar Pradesh';
  }
  ram.affiliationNumber = null;
  if (ram.verification) ram.verification.cbseAffiliationNumber = null;
  ram.board = ['State Board / Private (CBSE affiliation pending)'];
  ram.studentTeacherRatio = '30:1';
  if (ram.admissions) {
    ram.admissions.status = 'open_2027_2028';
    ram.admissions.academicYear = '2027–28';
  }
  ram.fees = {
    cardFee: 108000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹9,000 – ₹14,396 / month (Published base; ₹10,796 with 25% discount)',
    registrationFee: 1000,
    admissionFee: 30000,
    tuitionMonthly: '9,000 – 14,396',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,08,000 – ₹1,72,752 (Published) | ₹1,29,552 (Discounted)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2027–28',
    source: 'Official School Admission & Fee Schedule',
    table: [
      { type: 'Registration Fee (Non-Refundable)', cost: '₹1,000' },
      { type: 'Admission Fee (Published Catalog)', cost: '₹99,000' },
      { type: 'Admission Fee (Supplied Discounted Payable)', cost: '₹30,000' },
      { type: 'Security Deposit', cost: '₹0 (Waived from ₹10,000)' },
      { type: 'Monthly Tuition (Toddlers)', cost: '₹9,000 / month' },
      { type: 'Monthly Tuition (Nursery–Class XI)', cost: '₹14,396 / month (Published) | ₹10,796 / mo (25% Disc)' }
    ],
    components: [
      {
        id: 'ramagya-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1000,
        formattedAmount: '₹1,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time non-refundable registration.'
      },
      {
        id: 'ramagya-adm-pub',
        name: 'Admission Fee (Published)',
        category: 'one_time',
        amount: 99000,
        formattedAmount: '₹99,000 (Published)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'Published catalog admission fee before concessions.'
      },
      {
        id: 'ramagya-adm-disc',
        name: 'Admission Fee (Payable Discounted Amount)',
        category: 'one_time',
        amount: 30000,
        formattedAmount: '₹30,000 (Payable)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Supplied discounted admission fee payable on enrollment.'
      },
      {
        id: 'ramagya-sec',
        name: 'Security Deposit (Waived)',
        category: 'deposit',
        amount: 0,
        formattedAmount: '₹0 (100% Waived from ₹10,000)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: false,
        refundable: true,
        isOfficial: true,
        notes: 'Security deposit listed as ₹10,000 but 100% waived off.'
      },
      {
        id: 'ramagya-toddlers',
        name: 'Monthly Tuition – Toddlers',
        category: 'recurring',
        amount: 9000,
        formattedAmount: '₹9,000 / month',
        frequency: 'monthly',
        gradesApplicable: 'Toddlers',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Monthly tuition for toddlers.'
      },
      {
        id: 'ramagya-nur-xi',
        name: 'Monthly Tuition – Nursery to Class XI',
        category: 'recurring',
        amount: 14396,
        formattedAmount: '₹14,396 / month (Published) | ₹10,796 / mo (25% Disc)',
        frequency: 'monthly',
        gradesApplicable: 'Nursery to Class XI',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Published monthly tuition is ₹14,396; 25% discount gives ₹10,796/month; 10% sibling discount gives ₹9,716/month.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Toddlers',
        grades: ['Toddlers'],
        tuitionFee: '₹9,000 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,08,000 / year (Calculated)',
        totalAnnualPayable: '₹1,08,000',
        isCalculated: true,
        calculationNotes: '₹9,000 × 12 = ₹1,08,000/yr.',
        curriculum: 'Early Years',
        notes: 'Toddlers grade tuition.'
      },
      {
        gradeGroup: 'Nursery to KG II',
        grades: ['Nursery', 'KG I', 'KG II'],
        tuitionFee: '₹14,396 / month (Discounted: ₹10,796 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,72,752 / yr (Published) | ₹1,29,552 / yr (Discounted)',
        totalAnnualPayable: '₹1,29,552',
        isCalculated: true,
        calculationNotes: '25% discount: ₹10,796 × 12 = ₹1,29,552/yr.',
        curriculum: 'Pre-Primary',
        notes: '25% general concession available.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
        tuitionFee: '₹14,396 / month (Discounted: ₹10,796 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,72,752 / yr (Published) | ₹1,29,552 / yr (Discounted)',
        totalAnnualPayable: '₹1,29,552',
        isCalculated: true,
        calculationNotes: '25% discount: ₹10,796 × 12 = ₹1,29,552/yr.',
        curriculum: 'Primary',
        notes: '25% general concession available.'
      },
      {
        gradeGroup: 'Classes VI to XI',
        grades: ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI'],
        tuitionFee: '₹14,396 / month (Discounted: ₹10,796 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,72,752 / yr (Published) | ₹1,29,552 / yr (Discounted)',
        totalAnnualPayable: '₹1,29,552',
        isCalculated: true,
        calculationNotes: '25% discount: ₹10,796 × 12 = ₹1,29,552/yr.',
        curriculum: 'Middle & Secondary',
        notes: '25% general concession available.'
      }
    ],
    concessions: [
      {
        title: '25% Tuition Concession',
        category: 'other',
        discountDescription: '25% discount applied on standard tuition of ₹14,396/mo bringing monthly fee to ₹10,796/mo.',
        discountValue: '25% off monthly tuition',
        isOfficial: true
      },
      {
        title: 'Sibling Discount',
        category: 'sibling',
        discountDescription: '10% additional sibling discount brings monthly tuition to ₹9,716/month.',
        discountValue: '10% off monthly tuition',
        isOfficial: true
      }
    ],
    disclaimer: 'Published admission fee is ₹99,000 with a supplied payable discounted amount of ₹30,000. Security deposit is 100% waived off.'
  };
  audit.push({ name: ram.name, slug: ram.slug, oldVal, newVal: ram.fees.rangeText });
}

// 7. GD GOENKA INTERNATIONAL SCHOOL
const gdg = getSchool('gd-goenka-international-school');
if (gdg) {
  const oldVal = gdg.fees?.rangeText;
  gdg.affiliationNumber = '2133662';
  if (gdg.verification) gdg.verification.cbseAffiliationNumber = '2133662';
  gdg.studentTeacherRatio = '25:1';
  gdg.fees = {
    cardFee: 106260,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹8,855 – ₹12,925 / month (Composite monthly fee)',
    registrationFee: 1000,
    admissionFee: 25000,
    tuitionMonthly: '8,855 – 12,925',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,06,260 – ₹1,55,100 (Calculated)',
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
      { type: 'Admission Fee', cost: '₹25,000' },
      { type: 'Security Deposit (Refundable)', cost: '₹20,000' },
      { type: 'Composite Fee (Nursery–KG)', cost: '₹8,855 / month' },
      { type: 'Composite Fee (Classes I–V)', cost: '₹10,175 / month' },
      { type: 'Composite Fee (Classes VI–VIII)', cost: '₹10,725 / month' },
      { type: 'Composite Fee (Classes IX–X)', cost: '₹11,825 / month' },
      { type: 'Composite Fee (Classes XI–XII)', cost: '₹12,925 / month' }
    ],
    components: [
      {
        id: 'gdg-reg',
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
        id: 'gdg-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 25000,
        formattedAmount: '₹25,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee.'
      },
      {
        id: 'gdg-sec',
        name: 'Security Deposit',
        category: 'deposit',
        amount: 20000,
        formattedAmount: '₹20,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: true,
        isOfficial: true,
        notes: 'Refundable security deposit.'
      },
      {
        id: 'gdg-comp-nur-kg',
        name: 'Monthly Composite – Nursery & KG',
        category: 'recurring',
        amount: 8855,
        formattedAmount: '₹8,855 / month',
        frequency: 'monthly',
        gradesApplicable: 'Nursery, KG',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Tuition ₹8,662 + ID-card monthly equivalent ₹233 = ₹8,855/mo.'
      },
      {
        id: 'gdg-comp-i-v',
        name: 'Monthly Composite – Classes I to V',
        category: 'recurring',
        amount: 10175,
        formattedAmount: '₹10,175 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes I to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Tuition ₹9,908 + ID-card monthly equivalent ₹267 = ₹10,175/mo.'
      },
      {
        id: 'gdg-comp-vi-viii',
        name: 'Monthly Composite – Classes VI to VIII',
        category: 'recurring',
        amount: 10725,
        formattedAmount: '₹10,725 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes VI to VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Tuition ₹10,443 + ID-card monthly equivalent ₹282 = ₹10,725/mo.'
      },
      {
        id: 'gdg-comp-ix-x',
        name: 'Monthly Composite – Classes IX to X',
        category: 'recurring',
        amount: 11825,
        formattedAmount: '₹11,825 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes IX to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Tuition ₹11,514 + ID-card monthly equivalent ₹311 = ₹11,825/mo.'
      },
      {
        id: 'gdg-comp-xi-xii',
        name: 'Monthly Composite – Classes XI to XII',
        category: 'recurring',
        amount: 12925,
        formattedAmount: '₹12,925 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes XI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Tuition ₹12,586 + ID-card monthly equivalent ₹339 = ₹12,925/mo.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'NUR–KG',
        grades: ['Nursery', 'KG'],
        tuitionFee: '₹8,855 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,06,260 / year (Calculated)',
        totalAnnualPayable: '₹1,06,260',
        isCalculated: true,
        calculationNotes: '₹8,855 × 12 = ₹1,06,260/yr.',
        curriculum: 'CBSE',
        notes: 'Composite monthly fee.'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
        tuitionFee: '₹10,175 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,22,100 / year (Calculated)',
        totalAnnualPayable: '₹1,22,100',
        isCalculated: true,
        calculationNotes: '₹10,175 × 12 = ₹1,22,100/yr.',
        curriculum: 'CBSE',
        notes: 'Composite monthly fee.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class VI', 'Class VII', 'Class VIII'],
        tuitionFee: '₹10,725 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,28,700 / year (Calculated)',
        totalAnnualPayable: '₹1,28,700',
        isCalculated: true,
        calculationNotes: '₹10,725 × 12 = ₹1,28,700/yr.',
        curriculum: 'CBSE',
        notes: 'Composite monthly fee.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: '₹11,825 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,41,900 / year (Calculated)',
        totalAnnualPayable: '₹1,41,900',
        isCalculated: true,
        calculationNotes: '₹11,825 × 12 = ₹1,41,900/yr.',
        curriculum: 'CBSE Secondary',
        notes: 'Composite monthly fee.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class XI', 'Class XII'],
        tuitionFee: '₹12,925 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,55,100 / year (Calculated)',
        totalAnnualPayable: '₹1,55,100',
        isCalculated: true,
        calculationNotes: '₹12,925 × 12 = ₹1,55,100/yr.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Composite monthly fee.'
      }
    ],
    concessions: [],
    disclaimer: 'Monthly composite fee includes tuition and prorated ID card charge. Calculated annual equivalents are derived directly from monthly composite figures.'
  };
  audit.push({ name: gdg.name, slug: gdg.slug, oldVal, newVal: gdg.fees.rangeText });
}

// 8. SALVATION TREE SCHOOL
const sts = getSchool('salvation-tree-school');
if (sts) {
  const oldVal = sts.fees?.rangeText;
  if (sts.location) {
    sts.location.address = 'HS-5, Techzone-VII, Milak Lachchhi, Greater Noida, Uttar Pradesh 203207';
  }
  sts.studentTeacherRatio = '19:1';
  sts.fees = {
    cardFee: 60195,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹60,195 – ₹1,12,371 / year (Grade-wise annual tuition)',
    registrationFee: 1500,
    admissionFee: 30000,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: '₹60,195 – ₹1,12,371',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'annual',
    academicSession: '2026–27',
    source: 'Official School Annual Fee Schedule',
    table: [
      { type: 'Registration / Prospectus (Non-Refundable)', cost: '₹1,500' },
      { type: 'Admission Fee', cost: '₹30,000' },
      { type: 'Annual Tuition (Pre-Nur / Nursery / KG)', cost: '₹60,195 / year' },
      { type: 'Annual Tuition (Classes I–III)', cost: '₹66,898 / year' },
      { type: 'Annual Tuition (Classes IV–V)', cost: '₹80,268 / year' },
      { type: 'Annual Tuition (Classes VI–VIII)', cost: '₹86,947 / year' },
      { type: 'Annual Tuition (Classes IX–X)', cost: '₹93,650 / year' },
      { type: 'Annual Tuition (XI–XII Commerce/Humanities)', cost: '₹1,07,020 / year' },
      { type: 'Annual Tuition (XI–XII Science)', cost: '₹1,12,371 / year' }
    ],
    components: [
      {
        id: 'sts-reg',
        name: 'Registration / Prospectus',
        category: 'one_time',
        amount: 1500,
        formattedAmount: '₹1,500',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time non-refundable fee.'
      },
      {
        id: 'sts-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 30000,
        formattedAmount: '₹30,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee.'
      },
      {
        id: 'sts-ann-pre-nur',
        name: 'Annual Tuition – Pre-Nur / Nursery / KG',
        category: 'recurring',
        amount: 60195,
        formattedAmount: '₹60,195 / year',
        frequency: 'annual',
        gradesApplicable: 'Pre-Nur, Nursery, KG',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      },
      {
        id: 'sts-ann-i-iii',
        name: 'Annual Tuition – Classes I to III',
        category: 'recurring',
        amount: 66898,
        formattedAmount: '₹66,898 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes I to III',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      },
      {
        id: 'sts-ann-iv-v',
        name: 'Annual Tuition – Classes IV to V',
        category: 'recurring',
        amount: 80268,
        formattedAmount: '₹80,268 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes IV to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      },
      {
        id: 'sts-ann-vi-viii',
        name: 'Annual Tuition – Classes VI to VIII',
        category: 'recurring',
        amount: 86947,
        formattedAmount: '₹86,947 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes VI to VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      },
      {
        id: 'sts-ann-ix-x',
        name: 'Annual Tuition – Classes IX to X',
        category: 'recurring',
        amount: 93650,
        formattedAmount: '₹93,650 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes IX to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      },
      {
        id: 'sts-ann-xi-xii-com',
        name: 'Annual Tuition – Classes XI to XII (Commerce/Humanities)',
        category: 'recurring',
        amount: 107020,
        formattedAmount: '₹1,07,020 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes XI to XII (Commerce/Humanities)',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      },
      {
        id: 'sts-ann-xi-xii-sci',
        name: 'Annual Tuition – Classes XI to XII (Science)',
        category: 'recurring',
        amount: 112371,
        formattedAmount: '₹1,12,371 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes XI to XII (Science)',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official annual tuition fee.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nur / Nursery / KG',
        grades: ['Pre-Nursery', 'Nursery', 'KG'],
        tuitionFee: '₹60,195 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹60,195',
        totalAnnualPayable: '₹60,195',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Official annual tuition.'
      },
      {
        gradeGroup: 'Classes I to III',
        grades: ['Class I', 'Class II', 'Class III'],
        tuitionFee: '₹66,898 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹66,898',
        totalAnnualPayable: '₹66,898',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Official annual tuition.'
      },
      {
        gradeGroup: 'Classes IV to V',
        grades: ['Class IV', 'Class V'],
        tuitionFee: '₹80,268 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹80,268',
        totalAnnualPayable: '₹80,268',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Official annual tuition.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class VI', 'Class VII', 'Class VIII'],
        tuitionFee: '₹86,947 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹86,947',
        totalAnnualPayable: '₹86,947',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Official annual tuition.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: '₹93,650 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹93,650',
        totalAnnualPayable: '₹93,650',
        isCalculated: false,
        curriculum: 'CBSE Secondary',
        notes: 'Official annual tuition.'
      },
      {
        gradeGroup: 'Classes XI to XII (Commerce / Humanities)',
        grades: ['Class XI Commerce/Humanities', 'Class XII Commerce/Humanities'],
        tuitionFee: '₹1,07,020 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,07,020',
        totalAnnualPayable: '₹1,07,020',
        isCalculated: false,
        curriculum: 'CBSE Senior Secondary',
        notes: 'Official annual tuition.'
      },
      {
        gradeGroup: 'Classes XI to XII (Science)',
        grades: ['Class XI Science', 'Class XII Science'],
        tuitionFee: '₹1,12,371 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,12,371',
        totalAnnualPayable: '₹1,12,371',
        isCalculated: false,
        curriculum: 'CBSE Senior Secondary',
        notes: 'Official annual tuition.'
      }
    ],
    concessions: [],
    disclaimer: 'Supplied tuition figures are published annual fees.'
  };
  audit.push({ name: sts.name, slug: sts.slug, oldVal, newVal: sts.fees.rangeText });
}

// 9. BLS WORLD SCHOOL
const bls = getSchool('bls-world-school');
if (bls) {
  const oldVal = bls.fees?.rangeText;
  if (bls.location) {
    bls.location.address = 'HS 03, Sector 16 West, Panchsheel Greens 2, Greater Noida, Noida, Uttar Pradesh 201318';
  }
  bls.affiliationNumber = '2133923';
  if (bls.verification) bls.verification.cbseAffiliationNumber = '2133923';
  bls.studentTeacherRatio = '18:1';
  bls.fees = {
    cardFee: 97800,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹97,800 – ₹1,23,000 / year (Nursery to Class X)',
    registrationFee: 1700,
    admissionFee: 45000,
    tuitionMonthly: null,
    tuitionQuarterly: '24,450 – 30,750',
    tuitionAnnual: '₹97,800 – ₹1,23,000',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'annual',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Registration Fee', cost: '₹1,700' },
      { type: 'Admission Fee', cost: '₹45,000' },
      { type: 'Tuition (Nursery & Prep)', cost: '₹97,800 / yr (₹8,150/mo / ₹24,450/qtr)' },
      { type: 'Tuition (Classes I–V)', cost: '₹1,08,000 / yr (₹9,000/mo / ₹27,000/qtr)' },
      { type: 'Tuition (Classes VI–VIII)', cost: '₹1,14,000 / yr (₹9,500/mo / ₹28,500/qtr)' },
      { type: 'Tuition (Classes IX–X)', cost: '₹1,23,000 / yr (₹10,250/mo / ₹30,750/qtr)' }
    ],
    components: [
      {
        id: 'bls-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1700,
        formattedAmount: '₹1,700',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time registration fee.'
      },
      {
        id: 'bls-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 45000,
        formattedAmount: '₹45,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee.'
      },
      {
        id: 'bls-nur-prep',
        name: 'Annual Tuition – Nursery & Prep',
        category: 'recurring',
        amount: 97800,
        formattedAmount: '₹97,800 / year (₹8,150 / mo)',
        frequency: 'annual',
        gradesApplicable: 'Nursery & Prep',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: '₹8,150/month or ₹24,450 quarterly equivalent.'
      },
      {
        id: 'bls-i-v',
        name: 'Annual Tuition – Classes I to V',
        category: 'recurring',
        amount: 108000,
        formattedAmount: '₹1,08,000 / year (₹9,000 / mo)',
        frequency: 'annual',
        gradesApplicable: 'Classes I to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: '₹9,000/month or ₹27,000 quarterly equivalent.'
      },
      {
        id: 'bls-vi-viii',
        name: 'Annual Tuition – Classes VI to VIII',
        category: 'recurring',
        amount: 114000,
        formattedAmount: '₹1,14,000 / year (₹9,500 / mo)',
        frequency: 'annual',
        gradesApplicable: 'Classes VI to VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: '₹9,500/month or ₹28,500 quarterly equivalent.'
      },
      {
        id: 'bls-ix-x',
        name: 'Annual Tuition – Classes IX to X',
        category: 'recurring',
        amount: 12300,
        formattedAmount: '₹1,23,000 / year (₹10,250 / mo)',
        frequency: 'annual',
        gradesApplicable: 'Classes IX to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: '₹10,250/month or ₹30,750 quarterly equivalent.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Nursery & Prep',
        grades: ['Nursery', 'Prep'],
        tuitionFee: '₹97,800 / year (₹8,150 / mo)',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹97,800',
        totalAnnualPayable: '₹97,800',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Payable annually or quarterly (₹24,450/qtr).'
      },
      {
        gradeGroup: 'Classes I to V',
        grades: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
        tuitionFee: '₹1,08,000 / year (₹9,000 / mo)',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,08,000',
        totalAnnualPayable: '₹1,08,000',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Payable annually or quarterly (₹27,000/qtr).'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class VI', 'Class VII', 'Class VIII'],
        tuitionFee: '₹1,14,000 / year (₹9,500 / mo)',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,14,000',
        totalAnnualPayable: '₹1,14,000',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Payable annually or quarterly (₹28,500/qtr).'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: '₹1,23,000 / year (₹10,250 / mo)',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,23,000',
        totalAnnualPayable: '₹1,23,000',
        isCalculated: false,
        curriculum: 'CBSE Secondary',
        notes: 'Payable annually or quarterly (₹30,750/qtr).'
      }
    ],
    concessions: [],
    disclaimer: 'Classes XI–XII fees are not published in supplied schedule. 2027–28 session pre-registration expected late December.'
  };
  audit.push({ name: bls.name, slug: bls.slug, oldVal, newVal: bls.fees.rangeText });
}

// 10. SHRI RAM GLOBAL SCHOOL
const srg = getSchool('shri-ram-global-school');
if (srg) {
  const oldVal = srg.fees?.rangeText;
  if (srg.location) {
    srg.location.address = 'HS-03, Shri Ram Global School, Sector Techzone 7, West, Milak Lachchhi, Greater Noida, Uttar Pradesh 203207';
  }
  srg.affiliationNumber = '2133800';
  if (srg.verification) srg.verification.cbseAffiliationNumber = '2133800';
  srg.studentTeacherRatio = '15:1 (Pre-Nursery to Prep) | 30:1 (Grade 1 onward)';
  srg.fees = {
    cardFee: 114120,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹9,510 – ₹11,245 / month (Discounted; Published: ₹13,314 – ₹16,488 / mo)',
    registrationFee: 1000,
    admissionFee: 40000,
    tuitionMonthly: '9,510 – 11,245',
    tuitionQuarterly: null,
    tuitionAnnual: '₹1,14,120 – ₹1,34,940 (Discounted) | ₹1,59,768 – ₹1,97,856 (Published)',
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
      { type: 'Admission Fee (Published)', cost: '₹60,000' },
      { type: 'Admission Fee (Payable after 33% waiver)', cost: '₹40,000' },
      { type: 'Security Deposit', cost: '₹0 (100% waived from ₹10,000)' },
      { type: 'Examination Fee (Grade V onward)', cost: '₹1,000 / year (in April)' },
      { type: 'Monthly Composite (Pre-Nursery)', cost: '₹13,314 / mo (Discounted: ₹9,510 / mo)' },
      { type: 'Monthly Composite (Nursery/KG/Prep)', cost: '₹13,826 / mo (Discounted: ₹9,830 / mo)' },
      { type: 'Monthly Composite (Grades 1–5)', cost: '₹15,076 / mo (Discounted: ₹10,510 / mo)' },
      { type: 'Monthly Composite (Grades 6–12)', cost: '₹16,488 / mo (Discounted: ₹11,245 / mo)' }
    ],
    components: [
      {
        id: 'srg-reg',
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
        id: 'srg-adm-pub',
        name: 'Admission Fee (Published)',
        category: 'one_time',
        amount: 60000,
        formattedAmount: '₹60,000 (Published)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'Published catalog admission fee before 33% waiver.'
      },
      {
        id: 'srg-adm-disc',
        name: 'Admission Fee (Payable after 33% waiver)',
        category: 'one_time',
        amount: 40000,
        formattedAmount: '₹40,000 (Payable)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: '33% waiver applied on published admission fee.'
      },
      {
        id: 'srg-sec',
        name: 'Security Deposit (Waived)',
        category: 'deposit',
        amount: 0,
        formattedAmount: '₹0 (100% Waived from ₹10,000)',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: false,
        refundable: true,
        isOfficial: true,
        notes: '100% waiver applied on security deposit.'
      },
      {
        id: 'srg-exam',
        name: 'Examination Fee (Grade V onward)',
        category: 'examination',
        amount: 1000,
        formattedAmount: '₹1,000 / year',
        frequency: 'annual',
        gradesApplicable: 'Grades 5 to 12',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Payable annually in April.'
      },
      {
        id: 'srg-pre-nur',
        name: 'Monthly Composite – Pre-Nursery',
        category: 'recurring',
        amount: 9510,
        formattedAmount: '₹9,510 / month (Published: ₹13,314 / mo)',
        frequency: 'monthly',
        gradesApplicable: 'Pre-Nursery',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Discounted rate: ₹9,510/mo vs published ₹13,314/mo.'
      },
      {
        id: 'srg-nur-prep',
        name: 'Monthly Composite – Nursery / KG / Prep',
        category: 'recurring',
        amount: 9830,
        formattedAmount: '₹9,830 / month (Published: ₹13,826 / mo)',
        frequency: 'monthly',
        gradesApplicable: 'Nursery, KG, Prep',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Discounted rate: ₹9,830/mo vs published ₹13,826/mo.'
      },
      {
        id: 'srg-1-5',
        name: 'Monthly Composite – Grades 1 to 5',
        category: 'recurring',
        amount: 10510,
        formattedAmount: '₹10,510 / month (Published: ₹15,076 / mo)',
        frequency: 'monthly',
        gradesApplicable: 'Grades 1 to 5',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Discounted rate: ₹10,510/mo vs published ₹15,076/mo.'
      },
      {
        id: 'srg-6-12',
        name: 'Monthly Composite – Grades 6 to 12',
        category: 'recurring',
        amount: 11245,
        formattedAmount: '₹11,245 / month (Published: ₹16,488 / mo)',
        frequency: 'monthly',
        gradesApplicable: 'Grades 6 to 12',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Discounted rate: ₹11,245/mo vs published ₹16,488/mo.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nursery',
        grades: ['Pre-Nursery'],
        tuitionFee: '₹9,510 / month (Published: ₹13,314 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,14,120 / year (Discounted)',
        totalAnnualPayable: '₹1,14,120',
        isCalculated: true,
        calculationNotes: '₹9,510 × 12 = ₹1,14,120/yr.',
        curriculum: 'CBSE',
        notes: 'Discounted monthly composite fee.'
      },
      {
        gradeGroup: 'Nursery / KG / Prep',
        grades: ['Nursery', 'KG', 'Prep'],
        tuitionFee: '₹9,830 / month (Published: ₹13,826 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,17,960 / year (Discounted)',
        totalAnnualPayable: '₹1,17,960',
        isCalculated: true,
        calculationNotes: '₹9,830 × 12 = ₹1,17,960/yr.',
        curriculum: 'CBSE',
        notes: 'Discounted monthly composite fee.'
      },
      {
        gradeGroup: 'Grades 1 to 5',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        tuitionFee: '₹10,510 / month (Published: ₹15,076 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,26,120 / year (Discounted)',
        totalAnnualPayable: '₹1,26,120',
        isCalculated: true,
        calculationNotes: '₹10,510 × 12 = ₹1,26,120/yr.',
        curriculum: 'CBSE',
        notes: 'Discounted monthly composite fee.'
      },
      {
        gradeGroup: 'Grades 6 to 12',
        grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        tuitionFee: '₹11,245 / month (Published: ₹16,488 / mo)',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,34,940 / year (Discounted)',
        totalAnnualPayable: '₹1,34,940',
        isCalculated: true,
        calculationNotes: '₹11,245 × 12 = ₹1,34,940/yr.',
        curriculum: 'CBSE',
        notes: 'Discounted monthly composite fee.'
      }
    ],
    concessions: [
      {
        title: '33% Admission Fee Waiver',
        category: 'other',
        discountDescription: 'Published admission fee of ₹60,000 is discounted by 33% to ₹40,000 payable amount.',
        discountValue: '₹20,000 waiver',
        isOfficial: true
      },
      {
        title: '100% Security Deposit Waiver',
        category: 'other',
        discountDescription: '₹10,000 security deposit is 100% waived off.',
        discountValue: '100% waiver',
        isOfficial: true
      }
    ],
    disclaimer: 'Both published catalog rates and active discounted rates are provided transparently.'
  };
  audit.push({ name: srg.name, slug: srg.slug, oldVal, newVal: srg.fees.rangeText });
}

// Save back
fs.writeFileSync(schoolsPath, JSON.stringify(schools, null, 2), 'utf8');
console.log(`Phase 1 applied. Updated ${audit.length} records.`);
audit.forEach(a => console.log(`  - ${a.name} (${a.slug}): ${a.oldVal} -> ${a.newVal}`));
