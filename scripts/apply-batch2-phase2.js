const fs = require('fs');
const path = require('path');

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

const audit = [];
function getSchool(slug) {
  return schools.find(s => s.slug === slug);
}

// 11. FLORENCE INTERNATIONAL SCHOOL
const fis = getSchool('florence-international-school');
if (fis) {
  const oldVal = fis.fees?.rangeText;
  fis.affiliationNumber = '2130579';
  if (fis.verification) fis.verification.cbseAffiliationNumber = '2130579';
  fis.studentTeacherRatio = '25:1';
  fis.fees = {
    cardFee: 81000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹6,750 / month (Calculated annual: ₹81,000 / year)',
    registrationFee: 50,
    admissionFee: 25000,
    tuitionMonthly: '6,750',
    tuitionQuarterly: null,
    tuitionAnnual: '₹81,000 (Calculated)',
    transportMonthly: '2,000 – 3,000 (Optional)',
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'monthly',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Prospectus Fee', cost: '₹1,200' },
      { type: 'Registration Fee', cost: '₹50' },
      { type: 'Admission Fee', cost: '₹25,000' },
      { type: 'Monthly Tuition Fee', cost: '₹6,750 / month' },
      { type: 'Calculated Annual Equivalent', cost: '₹81,000 / year' },
      { type: 'Transport Fee (Optional)', cost: '₹2,000 – ₹3,000 / month' }
    ],
    components: [
      {
        id: 'fis-prospectus',
        name: 'Prospectus Fee',
        category: 'one_time',
        amount: 1200,
        formattedAmount: '₹1,200',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Prospectus fee.'
      },
      {
        id: 'fis-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 50,
        formattedAmount: '₹50',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official registration fee.'
      },
      {
        id: 'fis-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 25000,
        formattedAmount: '₹25,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Official admission fee.'
      },
      {
        id: 'fis-tuition',
        name: 'Monthly Tuition Fee',
        category: 'recurring',
        amount: 6750,
        formattedAmount: '₹6,750 / month',
        frequency: 'monthly',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Monthly tuition.'
      },
      {
        id: 'fis-transport',
        name: 'Transport Fee (Optional)',
        category: 'transport',
        amount: null,
        formattedAmount: '₹2,000 – ₹3,000 / month',
        frequency: 'monthly',
        gradesApplicable: 'All Grades (Optional)',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'Optional route-based transport.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'All Grades',
        grades: ['Nursery to Class XII'],
        tuitionFee: '₹6,750 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹81,000 / year (Calculated)',
        totalAnnualPayable: '₹81,000',
        isCalculated: true,
        calculationNotes: '₹6,750 × 12 = ₹81,000/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly tuition.'
      }
    ],
    concessions: [],
    disclaimer: 'Transport is optional (₹2,000–₹3,000/mo) and not added to composite tuition.'
  };
  audit.push({ name: fis.name, slug: fis.slug, oldVal, newVal: fis.fees.rangeText });
}

// 12. ST. TERESA SCHOOL
const stt = getSchool('st-teresa-school-greater-noida-west');
if (stt) {
  const oldVal = stt.fees?.rangeText;
  if (stt.location) {
    stt.location.address = 'Plot No: HS-3, Sector 3 Rd, Sector 3, West, Greater Noida West';
  }
  stt.affiliationNumber = null;
  if (stt.verification) stt.verification.cbseAffiliationNumber = null;
  stt.studentTeacherRatio = '15:1';
  stt.fees = {
    cardFee: 73000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹73,000 – ₹1,40,500 / year (Approximate grade ranges)',
    registrationFee: 1000,
    admissionFee: 20000,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: '₹73,000 – ₹1,40,500 (Approximate)',
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
      { type: 'Registration Fee (Approximate)', cost: '₹1,000' },
      { type: 'Admission Fee (Up to)', cost: '₹20,000' },
      { type: 'Annual Tuition (Pre-Nursery–Class VIII)', cost: 'approx ₹73,000 – ₹1,12,900 / year' },
      { type: 'Annual Tuition (Classes IX–X)', cost: 'approx ₹1,16,500 – ₹1,28,500 / year' },
      { type: 'Annual Tuition (Classes XI–XII)', cost: 'Up to approx ₹1,40,500 / year' }
    ],
    components: [
      {
        id: 'stt-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1000,
        formattedAmount: 'approx ₹1,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate registration fee.'
      },
      {
        id: 'stt-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 20000,
        formattedAmount: 'Up to ₹20,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee up to ₹20,000.'
      },
      {
        id: 'stt-ann-pre-viii',
        name: 'Annual Tuition – Pre-Nursery to Class VIII',
        category: 'recurring',
        amount: 73000,
        formattedAmount: 'approx ₹73,000 – ₹1,12,900 / year',
        frequency: 'annual',
        gradesApplicable: 'Pre-Nursery to Class VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate annual fee range.'
      },
      {
        id: 'stt-ann-ix-x',
        name: 'Annual Tuition – Classes IX to X',
        category: 'recurring',
        amount: 116500,
        formattedAmount: 'approx ₹1,16,500 – ₹1,28,500 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes IX to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate annual fee range.'
      },
      {
        id: 'stt-ann-xi-xii',
        name: 'Annual Tuition – Classes XI to XII',
        category: 'recurring',
        amount: 140500,
        formattedAmount: 'Up to approx ₹1,40,500 / year',
        frequency: 'annual',
        gradesApplicable: 'Classes XI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Approximate annual fee depending on stream.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nursery to Class VIII',
        grades: ['Pre-Nursery to Class VIII'],
        tuitionFee: 'approx ₹73,000 – ₹1,12,900 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹73,000 – ₹1,12,900',
        totalAnnualPayable: '₹73,000 – ₹1,12,900',
        isCalculated: false,
        curriculum: 'CBSE Curriculum',
        notes: 'Approximate range across early and middle grades.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: 'approx ₹1,16,500 – ₹1,28,500 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,16,500 – ₹1,28,500',
        totalAnnualPayable: '₹1,16,500 – ₹1,28,500',
        isCalculated: false,
        curriculum: 'CBSE Curriculum Secondary',
        notes: 'Secondary grades range.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class XI', 'Class XII'],
        tuitionFee: 'Up to approx ₹1,40,500 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: 'Up to ₹1,40,500',
        totalAnnualPayable: 'Up to ₹1,40,500',
        isCalculated: false,
        curriculum: 'CBSE Curriculum Senior Secondary',
        notes: 'Stream dependent.'
      }
    ],
    concessions: [],
    disclaimer: 'Figures reflect approximate fee schedules; contact school for exact stream pricing.'
  };
  audit.push({ name: stt.name, slug: stt.slug, oldVal, newVal: stt.fees.rangeText });
}

// 13. ST. JOHN'S SENIOR SECONDARY SCHOOL
const stj = getSchool('st-johns-senior-secondary-school-noida-ext');
if (stj) {
  const oldVal = stj.fees?.rangeText;
  stj.affiliationNumber = '2133271';
  if (stj.verification) stj.verification.cbseAffiliationNumber = '2133271';
  stj.studentTeacherRatio = '30:1';
  stj.fees = {
    cardFee: 78000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹6,500 – ₹8,364 / month (Composite monthly tuition)',
    registrationFee: 1000,
    admissionFee: 40000,
    tuitionMonthly: '6,500 – 8,364',
    tuitionQuarterly: null,
    tuitionAnnual: '₹78,000 – ₹1,00,368 (Calculated)',
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
      { type: 'Admission Fee', cost: '₹40,000' },
      { type: 'Total Initial Enrolment Charge', cost: '₹41,000' },
      { type: 'Monthly Composite (Nursery–V)', cost: '₹6,500 / month' },
      { type: 'Monthly Composite (VI–VIII)', cost: '₹6,970 / month' },
      { type: 'Monthly Composite (IX–X)', cost: '₹7,184 / month' },
      { type: 'Monthly Composite (XI–XII)', cost: '₹8,364 / month' },
      { type: 'Practical Subject Fee (XI–XII)', cost: '₹400 / subject' }
    ],
    components: [
      {
        id: 'stj-reg',
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
        id: 'stj-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 40000,
        formattedAmount: '₹40,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission fee. Total initial charge ₹41,000.'
      },
      {
        id: 'stj-comp-nur-v',
        name: 'Monthly Composite – Nursery to Class V',
        category: 'recurring',
        amount: 6500,
        formattedAmount: '₹6,500 / month',
        frequency: 'monthly',
        gradesApplicable: 'Nursery to Class V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹78,000/yr.'
      },
      {
        id: 'stj-comp-vi-viii',
        name: 'Monthly Composite – Classes VI to VIII',
        category: 'recurring',
        amount: 6970,
        formattedAmount: '₹6,970 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes VI to VIII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹83,640/yr.'
      },
      {
        id: 'stj-comp-ix-x',
        name: 'Monthly Composite – Classes IX to X',
        category: 'recurring',
        amount: 7184,
        formattedAmount: '₹7,184 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes IX to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹86,208/yr.'
      },
      {
        id: 'stj-comp-xi-xii',
        name: 'Monthly Composite – Classes XI to XII',
        category: 'recurring',
        amount: 8364,
        formattedAmount: '₹8,364 / month',
        frequency: 'monthly',
        gradesApplicable: 'Classes XI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,00,368/yr.'
      },
      {
        id: 'stj-practical',
        name: 'Practical Subject Fee (XI–XII)',
        category: 'activity',
        amount: 400,
        formattedAmount: '₹400 / subject',
        frequency: 'as_applicable',
        gradesApplicable: 'Classes XI to XII',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'Per practical subject.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Nursery to Class V',
        grades: ['Nursery', 'KG', 'Classes I–V'],
        tuitionFee: '₹6,500 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹78,000 / year (Calculated)',
        totalAnnualPayable: '₹78,000',
        isCalculated: true,
        calculationNotes: '₹6,500 × 12 = ₹78,000/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes VI to VIII',
        grades: ['Class VI', 'Class VII', 'Class VIII'],
        tuitionFee: '₹6,970 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹83,640 / year (Calculated)',
        totalAnnualPayable: '₹83,640',
        isCalculated: true,
        calculationNotes: '₹6,970 × 12 = ₹83,640/yr.',
        curriculum: 'CBSE',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes IX to X',
        grades: ['Class IX', 'Class X'],
        tuitionFee: '₹7,184 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹86,208 / year (Calculated)',
        totalAnnualPayable: '₹86,208',
        isCalculated: true,
        calculationNotes: '₹7,184 × 12 = ₹86,208/yr.',
        curriculum: 'CBSE Secondary',
        notes: 'Monthly composite fee.'
      },
      {
        gradeGroup: 'Classes XI to XII',
        grades: ['Class XI', 'Class XII'],
        tuitionFee: '₹8,364 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,00,368 / year (Calculated)',
        totalAnnualPayable: '₹1,00,368',
        isCalculated: true,
        calculationNotes: '₹8,364 × 12 = ₹1,00,368/yr.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Monthly composite fee.'
      }
    ],
    concessions: [],
    disclaimer: 'Initial enrolment requires ₹1,000 registration + ₹40,000 admission fee = ₹41,000. Practical subjects ₹400/subject.'
  };
  audit.push({ name: stj.name, slug: stj.slug, oldVal, newVal: stj.fees.rangeText });
}

// 14 & 15. ASTER PUBLIC SCHOOL (KP5 & SEC 3)
const asterList = [
  {
    slug: 'aster-public-school-kp5',
    addr: 'Plot No 40, Chauganpur, Knowledge Park V, Greater Noida, Uttar Pradesh 201306',
    aff: '2133802'
  },
  {
    slug: 'aster-public-school-sector-3',
    addr: 'HS-1, Sector 3, Greater Noida West (Noida Extension), Uttar Pradesh 201318',
    aff: '2131649'
  }
];

asterList.forEach(item => {
  const ast = getSchool(item.slug);
  if (ast) {
    const oldVal = ast.fees?.rangeText;
    if (ast.location) ast.location.address = item.addr;
    ast.affiliationNumber = item.aff;
    if (ast.verification) ast.verification.cbseAffiliationNumber = item.aff;
    ast.studentTeacherRatio = '15:1';
    ast.fees = {
      cardFee: 78000,
      estimatedFirstYear: null,
      currency: 'INR',
      rangeText: '₹6,500 – ₹8,000 / month (₹19,500 – ₹24,000 / quarter)',
      registrationFee: 750,
      admissionFee: 35000,
      tuitionMonthly: '6,500 – 8,000',
      tuitionQuarterly: '19,500 – 24,000',
      tuitionAnnual: '₹78,000 – ₹96,000 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      isVerified: true,
      disclosed: true,
      comparableAnnualAvailable: true,
      billingFrequency: 'quarterly',
      academicSession: '2026–27',
      source: 'Official School Fee Schedule',
      table: [
        { type: 'Registration Fee', cost: '₹500 – ₹1,000' },
        { type: 'Admission Fee', cost: '₹30,000 – ₹40,000' },
        { type: 'Monthly Tuition Range', cost: '₹6,500 – ₹8,000 / month' },
        { type: 'Quarterly Composite Range', cost: '₹19,500 – ₹24,000 / quarter' },
        { type: 'Typical Composite Monthly', cost: 'approx ₹7,700 / month' }
      ],
      components: [
        {
          id: 'ast-reg',
          name: 'Registration Fee',
          category: 'one_time',
          amount: 750,
          formattedAmount: '₹500 – ₹1,000',
          frequency: 'one_time',
          gradesApplicable: 'All Entry Grades',
          mandatory: true,
          refundable: false,
          isOfficial: true,
          notes: 'Registration fee.'
        },
        {
          id: 'ast-adm',
          name: 'Admission Fee',
          category: 'one_time',
          amount: 35000,
          formattedAmount: '₹30,000 – ₹40,000',
          frequency: 'one_time',
          gradesApplicable: 'All Entry Grades',
          mandatory: true,
          refundable: false,
          isOfficial: true,
          notes: 'Admission fee.'
        },
        {
          id: 'ast-tuition-qtr',
          name: 'Quarterly Composite Tuition',
          category: 'recurring',
          amount: 19500,
          formattedAmount: '₹19,500 – ₹24,000 / quarter (₹6,500 – ₹8,000 / mo)',
          frequency: 'quarterly',
          gradesApplicable: 'All Grades',
          mandatory: true,
          refundable: false,
          isOfficial: true,
          notes: 'Quarterly composite tuition range.'
        }
      ],
      gradeWiseTiers: [
        {
          gradeGroup: 'All Grades (Nursery to Class XII)',
          grades: ['Nursery to Class XII'],
          tuitionFee: '₹19,500 – ₹24,000 / quarter (₹6,500 – ₹8,000 / mo)',
          tuitionFrequency: 'quarterly',
          calculatedAnnualEquivalent: '₹78,000 – ₹96,000 / year (Calculated)',
          totalAnnualPayable: '₹78,000 – ₹96,000',
          isCalculated: true,
          calculationNotes: '₹19,500–₹24,000/qtr × 4 = ₹78,000–₹96,000/yr.',
          curriculum: 'CBSE',
          notes: 'Composite tuition.'
        }
      ],
      concessions: [],
      disclaimer: 'Composite monthly fee is approximately ₹7,700/month (billed quarterly as ₹19,500–₹24,000/quarter).'
    };
    audit.push({ name: ast.name, slug: ast.slug, oldVal, newVal: ast.fees.rangeText });
  }
});

// 16. THE MANTHAN SCHOOL
const man = getSchool('the-manthan-school-greater-noida-west');
if (man) {
  const oldVal = man.fees?.rangeText;
  if (man.location) {
    man.location.address = 'GH 04, 16th Ave, Sector 16C, Gaur City 2, Greater Noida, Ghaziabad, UP 201309';
  }
  man.studentTeacherRatio = '25:1';
  man.fees = {
    cardFee: 84000,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹21,000 – ₹27,300 / quarter (Composite quarterly tuition)',
    registrationFee: 1000,
    admissionFee: 20000,
    tuitionMonthly: null,
    tuitionQuarterly: '21,000 – 27,300',
    tuitionAnnual: '₹84,000 – ₹1,09,200 (Calculated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'quarterly',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Registration Fee', cost: '₹1,000' },
      { type: 'Admission Fee (Pre-Nursery)', cost: '₹15,000' },
      { type: 'Admission Fee (Nursery to Class XI)', cost: '₹20,000' },
      { type: 'Quarterly Composite (Pre-Nursery)', cost: '₹21,000 / quarter (₹84,000 / yr)' },
      { type: 'Quarterly Composite (Nursery to Class 5)', cost: '₹26,100 / quarter (₹1,04,400 / yr)' },
      { type: 'Quarterly Composite (Classes 6 to 11)', cost: '₹27,300 / quarter (₹1,09,200 / yr)' }
    ],
    components: [
      {
        id: 'man-reg',
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
        id: 'man-adm-pre-nur',
        name: 'Admission Fee (Pre-Nursery)',
        category: 'one_time',
        amount: 15000,
        formattedAmount: '₹15,000',
        frequency: 'one_time',
        gradesApplicable: 'Pre-Nursery',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee for Pre-Nursery.'
      },
      {
        id: 'man-adm-nur-xi',
        name: 'Admission Fee (Nursery to Class XI)',
        category: 'one_time',
        amount: 20000,
        formattedAmount: '₹20,000',
        frequency: 'one_time',
        gradesApplicable: 'Nursery to Class XI',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee for Nursery to Class XI.'
      },
      {
        id: 'man-comp-pre-nur',
        name: 'Quarterly Composite – Pre-Nursery',
        category: 'recurring',
        amount: 21000,
        formattedAmount: '₹21,000 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'Pre-Nursery',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹84,000/yr.'
      },
      {
        id: 'man-comp-nur-5',
        name: 'Quarterly Composite – Nursery to Class 5',
        category: 'recurring',
        amount: 26100,
        formattedAmount: '₹26,100 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'Nursery to Class 5',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,04,400/yr.'
      },
      {
        id: 'man-comp-6-11',
        name: 'Quarterly Composite – Classes 6 to 11',
        category: 'recurring',
        amount: 27300,
        formattedAmount: '₹27,300 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'Classes 6 to 11',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,09,200/yr.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Pre-Nursery',
        grades: ['Pre-Nursery'],
        tuitionFee: '₹21,000 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹84,000 / year (Calculated)',
        totalAnnualPayable: '₹84,000',
        isCalculated: true,
        calculationNotes: '₹21,000 × 4 = ₹84,000/yr.',
        curriculum: 'CBSE',
        notes: 'Quarterly composite.'
      },
      {
        gradeGroup: 'Nursery to Class 5',
        grades: ['Nursery', 'KG', 'Classes 1–5'],
        tuitionFee: '₹26,100 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹1,04,400 / year (Calculated)',
        totalAnnualPayable: '₹1,04,400',
        isCalculated: true,
        calculationNotes: '₹26,100 × 4 = ₹1,04,400/yr.',
        curriculum: 'CBSE',
        notes: 'Quarterly composite.'
      },
      {
        gradeGroup: 'Classes 6 to 11',
        grades: ['Classes 6–11'],
        tuitionFee: '₹27,300 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹1,09,200 / year (Calculated)',
        totalAnnualPayable: '₹1,09,200',
        isCalculated: true,
        calculationNotes: '₹27,300 × 4 = ₹1,09,200/yr.',
        curriculum: 'CBSE',
        notes: 'Quarterly composite.'
      }
    ],
    concessions: [
      {
        title: '5% Advance Payment Rebate',
        category: 'advance_payment',
        discountDescription: '5% rebate on advance annual composite fee (excluding transport).',
        discountValue: '5% rebate',
        isOfficial: true
      },
      {
        title: '25% Sibling Concession',
        category: 'sibling',
        discountDescription: '25% offline composite discount for younger siblings.',
        discountValue: '25% off composite',
        isOfficial: true
      }
    ],
    disclaimer: 'Concessions (5% advance rebate or 25% sibling discount) are applied on eligible accounts and not automatically deducted from base tuition.'
  };
  audit.push({ name: man.name, slug: man.slug, oldVal, newVal: man.fees.rangeText });
}

// 17. SARVOTTAM INTERNATIONAL SCHOOL
const sar = getSchool('sarvottam-international-school');
if (sar) {
  const oldVal = sar.fees?.rangeText;
  if (sar.location) {
    sar.location.address = 'Plot No. 6, Greater Noida W Rd, Tech Zone IV, Noida Phase-2, Patwari, Greater Noida, UP 201318';
  }
  sar.affiliationNumber = '2132551';
  if (sar.verification) sar.verification.cbseAffiliationNumber = '2132551';
  sar.studentTeacherRatio = '16:1';
  sar.fees = {
    cardFee: 157068,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: 'CBSE: ₹39,267 – ₹42,158 / quarter | Cambridge: ₹18,755 / month',
    registrationFee: 1500,
    admissionFee: 40000,
    tuitionMonthly: null,
    tuitionQuarterly: '39,267 – 42,158',
    tuitionAnnual: '₹1,57,068 – ₹1,68,632 (CBSE Calculated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'quarterly',
    academicSession: '2026–27',
    source: 'Official School Dual-Curriculum Fee Circular',
    table: [
      { type: 'Registration Fee (One-Time)', cost: '₹1,500' },
      { type: 'CBSE Admission (Toddlers–SR KG)', cost: '1st child ₹40,000 | 2nd/3rd child ₹30,000' },
      { type: 'CBSE Admission (Grades I–XII)', cost: '1st child ₹60,000 | 2nd/3rd child ₹50,000' },
      { type: 'CBSE Quarterly Composite (Toddlers–X)', cost: '₹39,267 / quarter (₹1,57,068 / yr)' },
      { type: 'CBSE Quarterly Composite (XI–XII)', cost: '₹42,158 / quarter (₹1,68,632 / yr)' },
      { type: 'CBSE Practical Lab Fee', cost: '₹500 / quarter / subject (PCB, CS, Arts)' },
      { type: 'Cambridge Admission', cost: '1st child ₹60,000 | 2nd/3rd child ₹50,000' },
      { type: 'Cambridge Monthly Tuition (Grades I–V)', cost: '₹18,755 / month (₹2,25,060 / yr)' }
    ],
    components: [
      {
        id: 'sar-reg',
        name: 'Registration Fee',
        category: 'one_time',
        amount: 1500,
        formattedAmount: '₹1,500',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Non-refundable registration fee.'
      },
      {
        id: 'sar-adm-cbse-toddler',
        name: 'CBSE Admission Fee (Toddlers to SR KG)',
        category: 'one_time',
        amount: 40000,
        formattedAmount: '₹40,000 (1st child) | ₹30,000 (2nd/3rd child)',
        frequency: 'one_time',
        gradesApplicable: 'Toddlers to SR KG',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission charge for CBSE early years.'
      },
      {
        id: 'sar-adm-cbse-i-xii',
        name: 'CBSE Admission Fee (Grades I to XII)',
        category: 'one_time',
        amount: 60000,
        formattedAmount: '₹60,000 (1st child) | ₹50,000 (2nd/3rd child)',
        frequency: 'one_time',
        gradesApplicable: 'Grades I to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission charge for CBSE Grades I–XII.'
      },
      {
        id: 'sar-cbse-comp-toddler-x',
        name: 'CBSE Quarterly Composite – Toddlers to Class X',
        category: 'recurring',
        amount: 39267,
        formattedAmount: '₹39,267 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'Toddlers to Class X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,57,068/yr.'
      },
      {
        id: 'sar-cbse-comp-xi-xii',
        name: 'CBSE Quarterly Composite – Classes XI to XII',
        category: 'recurring',
        amount: 42158,
        formattedAmount: '₹42,158 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'Classes XI to XII',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹1,68,632/yr.'
      },
      {
        id: 'sar-lab',
        name: 'Practical / Lab Charge (CBSE)',
        category: 'activity',
        amount: 500,
        formattedAmount: '₹500 / quarter / subject',
        frequency: 'quarterly',
        gradesApplicable: 'Secondary & Senior Secondary',
        mandatory: false,
        refundable: false,
        isOfficial: true,
        notes: 'PCB, Computer, Fashion Studies, Fine Arts.'
      },
      {
        id: 'sar-cam-adm',
        name: 'Cambridge Admission Fee',
        category: 'special_curriculum',
        amount: 60000,
        formattedAmount: '₹60,000 (1st child) | ₹50,000 (2nd/3rd child)',
        frequency: 'one_time',
        gradesApplicable: 'Cambridge Primary (Grades I–V)',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time admission charge for Cambridge curriculum.'
      },
      {
        id: 'sar-cam-tuition',
        name: 'Cambridge Monthly Tuition (Grades I–V)',
        category: 'special_curriculum',
        amount: 18755,
        formattedAmount: '₹18,755 / month',
        frequency: 'monthly',
        gradesApplicable: 'Cambridge Grades I to V',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Calculated annual: ₹2,25,060/yr.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'CBSE: Toddlers to Class X',
        grades: ['Toddlers to Class X'],
        tuitionFee: '₹39,267 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹1,57,068 / year (Calculated)',
        totalAnnualPayable: '₹1,57,068',
        isCalculated: true,
        calculationNotes: '₹39,267 × 4 = ₹1,57,068/yr.',
        curriculum: 'CBSE',
        notes: 'Quarterly composite fee.'
      },
      {
        gradeGroup: 'CBSE: Classes XI to XII',
        grades: ['Class XI', 'Class XII'],
        tuitionFee: '₹42,158 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹1,68,632 / year (Calculated)',
        totalAnnualPayable: '₹1,68,632',
        isCalculated: true,
        calculationNotes: '₹42,158 × 4 = ₹1,68,632/yr.',
        curriculum: 'CBSE Senior Secondary',
        notes: 'Quarterly composite fee.'
      },
      {
        gradeGroup: 'Cambridge: Primary Grades I to V',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        tuitionFee: '₹18,755 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹2,25,060 / year (Calculated)',
        totalAnnualPayable: '₹2,25,060',
        isCalculated: true,
        calculationNotes: '₹18,755 × 12 = ₹2,25,060/yr.',
        curriculum: 'Cambridge Primary (CIPP)',
        notes: 'Dedicated Cambridge International curriculum stream.'
      }
    ],
    concessions: [
      {
        title: 'Sibling Admission Concession',
        category: 'sibling',
        discountDescription: '₹10,000 reduction on admission fee for 2nd and 3rd child (₹30,000 vs ₹40,000 early years; ₹50,000 vs ₹60,000 primary+).',
        discountValue: '₹10,000 admission discount',
        isOfficial: true
      }
    ],
    disclaimer: 'CBSE and Cambridge are distinct curriculum streams with separate fee structures. Practical subjects carry ₹500/qtr/subject lab fees.'
  };
  audit.push({ name: sar.name, slug: sar.slug, oldVal, newVal: sar.fees.rangeText });
}

// 18. THE MILLENNIUM SCHOOL NOIDA EXTENSION
const mil = getSchool('the-millennium-school-noida-extension');
if (mil) {
  const oldVal = mil.fees?.rangeText;
  if (mil.location) {
    mil.location.address = 'Near Plot No SS-1, 108, RG Residency, Sector 119, Noida, UP 201316';
  }
  mil.affiliationNumber = '2133481';
  if (mil.verification) mil.verification.cbseAffiliationNumber = '2133481';
  mil.studentTeacherRatio = '15:1';
  mil.fees = {
    cardFee: 128520,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: 'Nursery: ~₹10,710 / mo | Middle Grades: ~₹1.4L – ₹1.5L / yr (Approximate)',
    registrationFee: 1000,
    admissionFee: 70000,
    tuitionMonthly: '10,710 (Nursery approx)',
    tuitionQuarterly: null,
    tuitionAnnual: 'approx ₹1,40,000 – ₹1,50,000 / year (Middle grades)',
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
      { type: 'Admission Fee (Pre-Nursery to Class X)', cost: '₹70,000' },
      { type: 'Admission Fee (Class XI)', cost: '₹48,000' },
      { type: 'Nursery Monthly Tuition', cost: 'approx ₹10,710 / month' },
      { type: 'Middle Grades Annual Total', cost: 'approx ₹1.4L – ₹1.5L / year' }
    ],
    components: [
      {
        id: 'mil-reg',
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
        id: 'mil-adm-pre-x',
        name: 'Admission Fee (Pre-Nursery to Class X)',
        category: 'one_time',
        amount: 70000,
        formattedAmount: '₹70,000',
        frequency: 'one_time',
        gradesApplicable: 'Pre-Nursery to Class X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee.'
      },
      {
        id: 'mil-adm-xi',
        name: 'Admission Fee (Class XI)',
        category: 'one_time',
        amount: 48000,
        formattedAmount: '₹48,000',
        frequency: 'one_time',
        gradesApplicable: 'Class XI',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee for Class XI.'
      },
      {
        id: 'mil-tuition-nur',
        name: 'Monthly Tuition – Nursery',
        category: 'recurring',
        amount: 10710,
        formattedAmount: 'approx ₹10,710 / month',
        frequency: 'monthly',
        gradesApplicable: 'Nursery',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Nursery monthly tuition.'
      },
      {
        id: 'mil-ann-middle',
        name: 'Annual Fee – Middle Grades',
        category: 'recurring',
        amount: 140000,
        formattedAmount: 'approx ₹1,40,000 – ₹1,50,000 / year',
        frequency: 'annual',
        gradesApplicable: 'Middle Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Middle grades annual range.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'Nursery',
        grades: ['Nursery'],
        tuitionFee: 'approx ₹10,710 / month',
        tuitionFrequency: 'monthly',
        calculatedAnnualEquivalent: '₹1,28,520 / year (Calculated)',
        totalAnnualPayable: '₹1,28,520',
        isCalculated: true,
        calculationNotes: '₹10,710 × 12 = ₹1,28,520/yr.',
        curriculum: 'CBSE',
        notes: 'Early years monthly tuition.'
      },
      {
        gradeGroup: 'Middle Grades',
        grades: ['Middle Grades'],
        tuitionFee: 'approx ₹1,40,000 – ₹1,50,000 / year',
        tuitionFrequency: 'annual',
        calculatedAnnualEquivalent: '₹1,40,000 – ₹1,50,000',
        totalAnnualPayable: '₹1,40,000 – ₹1,50,000',
        isCalculated: false,
        curriculum: 'CBSE',
        notes: 'Approximate annual fee.'
      }
    ],
    concessions: [],
    disclaimer: 'Middle grade annual totals are approximate ranges based on published school circulars. Located in Sector 119 Noida.'
  };
  audit.push({ name: mil.name, slug: mil.slug, oldVal, newVal: mil.fees.rangeText });
}

// 19. GAURS INTERNATIONAL SCHOOL GAUR CITY 2
const gis = getSchool('gaurs-international-school-gaur-city-2');
if (gis) {
  const oldVal = gis.fees?.rangeText;
  if (gis.location) {
    gis.location.address = 'Plot No GH 03, Sector 16C, Gaur City 2, Greater Noida, Ghaziabad, UP 201009';
  }
  gis.affiliationNumber = '2132595';
  if (gis.verification) gis.verification.cbseAffiliationNumber = '2132595';
  gis.studentTeacherRatio = '20:1';
  gis.fees = {
    cardFee: 129512,
    estimatedFirstYear: null,
    currency: 'INR',
    rangeText: '₹32,378 – ₹32,475 / quarter (Composite quarterly tuition)',
    registrationFee: 1500,
    admissionFee: 35000,
    tuitionMonthly: null,
    tuitionQuarterly: '32,378 – 32,475',
    tuitionAnnual: '₹1,29,512 – ₹1,29,900 (Calculated)',
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'verified_from_source',
    isVerified: true,
    disclosed: true,
    comparableAnnualAvailable: true,
    billingFrequency: 'quarterly',
    academicSession: '2026–27',
    source: 'Official School Fee Schedule',
    table: [
      { type: 'Prospectus Fee', cost: '₹1,000' },
      { type: 'Registration Fee', cost: '₹1,500' },
      { type: 'Admission Fee', cost: '₹35,000' },
      { type: 'Miscellaneous Charges (One-Time)', cost: '₹1,100' },
      { type: 'Digital Learning Fee (Grade I–X One-Time)', cost: '₹600' },
      { type: 'Quarterly Composite Tuition Range', cost: '₹32,378 – ₹32,475 / quarter' },
      { type: 'Quarterly Transport – Gaur City (Optional)', cost: '₹7,826 / quarter' },
      { type: 'Quarterly Transport – Crossings Republik (Optional)', cost: '₹8,803 / quarter' },
      { type: 'Quarterly Transport – Noida/Noida Ext (Optional)', cost: '₹12,229 / quarter' }
    ],
    components: [
      {
        id: 'gis-prospectus',
        name: 'Prospectus Fee',
        category: 'one_time',
        amount: 1000,
        formattedAmount: '₹1,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Prospectus fee.'
      },
      {
        id: 'gis-reg',
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
        id: 'gis-adm',
        name: 'Admission Fee',
        category: 'one_time',
        amount: 35000,
        formattedAmount: '₹35,000',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Admission fee.'
      },
      {
        id: 'gis-misc',
        name: 'Miscellaneous Charges',
        category: 'one_time',
        amount: 1100,
        formattedAmount: '₹1,100',
        frequency: 'one_time',
        gradesApplicable: 'All Entry Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time miscellaneous charge.'
      },
      {
        id: 'gis-digital',
        name: 'Digital Learning Fee (Grade I–X)',
        category: 'one_time',
        amount: 600,
        formattedAmount: '₹600',
        frequency: 'one_time',
        gradesApplicable: 'Grades I to X',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'One-time digital learning charge.'
      },
      {
        id: 'gis-tuition-qtr',
        name: 'Quarterly Composite Tuition',
        category: 'recurring',
        amount: 32378,
        formattedAmount: '₹32,378 – ₹32,475 / quarter',
        frequency: 'quarterly',
        gradesApplicable: 'All Grades',
        mandatory: true,
        refundable: false,
        isOfficial: true,
        notes: 'Quarterly composite fee.'
      }
    ],
    gradeWiseTiers: [
      {
        gradeGroup: 'All Grades',
        grades: ['Pre-Primary to Class XII'],
        tuitionFee: '₹32,378 – ₹32,475 / quarter',
        tuitionFrequency: 'quarterly',
        calculatedAnnualEquivalent: '₹1,29,512 – ₹1,29,900 / year (Calculated)',
        totalAnnualPayable: '₹1,29,512 – ₹1,29,900',
        isCalculated: true,
        calculationNotes: '₹32,378–₹32,475 × 4 = ₹1,29,512–₹1,29,900/yr.',
        curriculum: 'CBSE',
        notes: 'Quarterly composite tuition.'
      }
    ],
    concessions: [],
    disclaimer: 'Transport is optional and billed quarterly by zone (Gaur City: ₹7,826/qtr; Crossings: ₹8,803/qtr; Noida/Noida Ext: ₹12,229/qtr).'
  };
  audit.push({ name: gis.name, slug: gis.slug, oldVal, newVal: gis.fees.rangeText });
}

// Save back
fs.writeFileSync(schoolsPath, JSON.stringify(schools, null, 2), 'utf8');
console.log(`Phase 2 applied. Updated ${audit.length} records.`);
audit.forEach(a => console.log(`  - ${a.name} (${a.slug}): ${a.oldVal} -> ${a.newVal}`));
