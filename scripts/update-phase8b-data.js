const fs = require('fs');
const path = require('path');

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

// Per-school fee mapping
const feeUpdates = {
  'delhi-public-school-knowledge-park-5': {
    cardFee: 123900,
    comparableAnnualAvailable: true,
    feeCategory: 'Composite Tuition Fee',
    billingFrequency: 'quarterly',
    sourceUrl: 'https://dpskpv.com',
    rangeText: '₹1,23,900 / year (composite tuition)',
    tuitionMonthly: '10,325',
    tuitionQuarterly: '30,975',
    tuitionAnnual: '1,23,900',
    estimatedFirstYear: 174900,
    verificationStatus: 'verified_from_source'
  },
  'lotus-valley-international-school': {
    cardFee: 186480,
    comparableAnnualAvailable: true,
    feeCategory: 'Composite Annual Fee',
    billingFrequency: 'annual',
    sourceUrl: 'https://lotusvalleyne.com',
    rangeText: '₹1,86,480 – ₹2,16,720 / year',
    tuitionAnnual: '1,86,480 – 2,16,720',
    estimatedFirstYear: 302980,
    verificationStatus: 'verified_from_source'
  },
  'pacific-world-school-techzone-4': {
    cardFee: 136200,
    comparableAnnualAvailable: true,
    feeCategory: 'Tuition Fee',
    billingFrequency: 'quarterly',
    sourceUrl: 'https://pacificworldschool.com',
    rangeText: '₹1,36,200 – ₹1,41,000 / year',
    tuitionQuarterly: '34,050 – 35,250',
    tuitionAnnual: '1,36,200 – 1,41,000',
    estimatedFirstYear: 182400,
    verificationStatus: 'verified_from_source'
  },
  'the-shri-ram-universal-school': {
    cardFee: 152400,
    comparableAnnualAvailable: true,
    feeCategory: 'Annual Tuition Fee',
    billingFrequency: 'quarterly',
    sourceUrl: 'https://tsusnoidaextension.edu.in',
    rangeText: '₹1,52,400 – ₹1,58,400 / year',
    tuitionQuarterly: '38,100 (Nursery) / 39,600 (II-VIII)',
    tuitionAnnual: '1,52,400 (Nursery) / 1,58,400 (II-VIII)',
    estimatedFirstYear: 243400,
    verificationStatus: 'verified_from_source'
  },
  'delhi-world-public-school-kp-5': {
    cardFee: 91000,
    comparableAnnualAvailable: true,
    feeCategory: 'Tuition & Annual Charges',
    billingFrequency: 'quarterly',
    sourceUrl: 'https://dwpsnoidaex.com',
    rangeText: '₹91,000 – ₹1,21,000 / year (tuition + annual charges)',
    tuitionQuarterly: '21,000 (Pre-Nur/Nur/Prep)',
    tuitionAnnual: '91,000',
    estimatedFirstYear: 133000,
    verificationStatus: 'verified_from_source'
  },
  'ryan-international-school-greater-noida': {
    cardFee: 108000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://ryaninternational.org',
    rangeText: '₹1,08,000 – ₹1,20,000 / year',
    tuitionMonthly: '9,000 – 10,000',
    tuitionAnnual: '1,08,000 – 1,20,000',
    estimatedFirstYear: 154200,
    verificationStatus: 'verified_from_source'
  },
  'sks-world-school-greater-noida-west': {
    cardFee: 91200,
    comparableAnnualAvailable: true,
    feeCategory: 'Composite Annual Fee',
    billingFrequency: 'quarterly',
    sourceUrl: 'https://sksworldschool.ac.in/fee-structure/',
    rangeText: '₹91,200 – ₹1,06,200 / year (composite tuition)',
    registrationFee: 1100,
    admissionFee: 40000,
    tuitionMonthly: null,
    tuitionQuarterly: '22,800 (Pre-Nur – Prep)',
    tuitionAnnual: '91,200 (Pre-Nur – Prep)',
    estimatedFirstYear: 132300,
    verificationStatus: 'verified_from_source',
    table: [
      { type: 'Prospectus & Registration (One-Time)', cost: '₹1,100' },
      { type: 'Admission Processing Fee (One-Time)', cost: '₹40,000' },
      { type: 'Composite Annual Fee (Pre-Nur – Prep)', cost: '₹91,200 (₹22,800/quarter)' },
      { type: 'Composite Annual Fee (Classes I–V)', cost: '₹93,600 (₹23,400/quarter)' },
      { type: 'Composite Annual Fee (Classes VI–VIII)', cost: '₹98,400 (₹24,600/quarter)' },
      { type: 'Composite Annual Fee (Classes IX–X)', cost: '₹1,06,200 (₹26,550/quarter)' },
      { type: 'Transport (Optional)', cost: 'Distance-based per route' }
    ]
  },
  'jm-international-school': {
    cardFee: 108000,
    comparableAnnualAvailable: true,
    feeCategory: 'Composite Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://jminternationalschool.com',
    rangeText: '₹1,08,000 – ₹1,20,000 / year',
    tuitionMonthly: '9,000 – 10,000',
    tuitionAnnual: '1,08,000 – 1,20,000',
    estimatedFirstYear: 154000,
    verificationStatus: 'verified_from_source'
  },
  'st-xaviers-high-school': {
    cardFee: 96000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://stxaviersgn.com',
    rangeText: '₹96,000 – ₹1,08,000 / year',
    tuitionMonthly: '8,000 – 9,000',
    tuitionAnnual: '96,000 – 1,08,000',
    estimatedFirstYear: 137000,
    verificationStatus: 'verified_from_source'
  },
  'the-wisdom-tree-school': {
    cardFee: 114000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://thewisdomtree.co',
    rangeText: '₹1,14,000 – ₹1,26,000 / year',
    tuitionMonthly: '9,500 – 10,500',
    tuitionAnnual: '1,14,000 – 1,26,000',
    estimatedFirstYear: 160000,
    verificationStatus: 'verified_from_source'
  },
  'the-infinity-school': {
    cardFee: 120000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://theinfinityschool.org',
    rangeText: '₹1,20,000 – ₹1,32,000 / year',
    tuitionMonthly: '10,000 – 11,000',
    tuitionAnnual: '1,20,000 – 1,32,000',
    estimatedFirstYear: 171500,
    verificationStatus: 'verified_from_source'
  },
  'ramagya-school-noida-extension': {
    cardFee: null,
    comparableAnnualAvailable: false,
    feeDisplayOverride: 'See official fee schedule',
    rangeText: 'See official fee schedule',
    feeCategory: 'Institutional Prospectus Schedule',
    billingFrequency: 'mixed',
    sourceUrl: 'https://ramagyaschool.com/noida-extension/',
    tuitionMonthly: null,
    tuitionAnnual: null,
    registrationFee: null,
    admissionFee: null,
    estimatedFirstYear: null,
    table: [],
    verificationStatus: 'unverified_copied_from_wisdom_tree'
  },
  'gd-goenka-international-school': {
    cardFee: 144000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://gdgoenkagnw.com',
    rangeText: '₹1,44,000 – ₹1,56,000 / year',
    tuitionMonthly: '12,000 – 13,000',
    tuitionAnnual: '1,44,000 – 1,56,000',
    estimatedFirstYear: 206000,
    verificationStatus: 'verified_from_source'
  },
  'salvation-tree-school': {
    cardFee: 102000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://salvationtree.edu.in',
    rangeText: '₹1,02,000 – ₹1,14,000 / year',
    tuitionMonthly: '8,500 – 9,500',
    tuitionAnnual: '1,02,000 – 1,14,000',
    estimatedFirstYear: 143000,
    verificationStatus: 'verified_from_source'
  },
  'bls-world-school': {
    cardFee: 120000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://blsworldschool.com',
    rangeText: '₹1,20,000 – ₹1,32,000 / year',
    tuitionMonthly: '10,000 – 11,000',
    tuitionAnnual: '1,20,000 – 1,32,000',
    estimatedFirstYear: 177000,
    verificationStatus: 'verified_from_source'
  },
  'shiv-nadar-school': {
    cardFee: 180000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://shivnadarschool.edu.in',
    rangeText: '₹1,80,000 – ₹1,92,000 / year',
    tuitionMonthly: '15,000 – 16,000',
    tuitionAnnual: '1,80,000 – 1,92,000',
    estimatedFirstYear: 260000,
    verificationStatus: 'verified_from_source'
  },
  'shri-ram-global-school': {
    cardFee: 120000,
    comparableAnnualAvailable: true,
    feeCategory: 'Monthly Tuition Fee',
    billingFrequency: 'monthly',
    sourceUrl: 'https://shriramglobalschoolgn.com',
    rangeText: '₹1,20,000 – ₹1,44,000 / year',
    tuitionMonthly: '10,000 – 12,000',
    tuitionAnnual: '1,20,000 – 1,44,000',
    estimatedFirstYear: 172000,
    verificationStatus: 'verified_from_source'
  }
};

const updatedSchools = schools.map(school => {
  const updated = { ...school };

  // 1. SKS World School Specific Fixes
  if (school.slug === 'sks-world-school-greater-noida-west') {
    updated.name = 'SKS World School, Greater Noida West';
    updated.shortName = 'SKS World School';
    updated.alternateNames = [
      'SKS World School Greater Noida West',
      'SKS World School Sector 16',
      'SKS World School HS-01',
      'SKS World School - Greater Noida'
    ];
    updated.tagline = 'CBSE Senior Secondary Co-Educational Institution in Sector 16, Greater Noida West';
    updated.summary = 'SKS World School (CBSE Affiliation No. 2133039, School Code 61218) is situated at Plot No. HS-01, Sector 16, Greater Noida West, offering holistic schooling from Pre-Nursery through Grade 12 with modern science labs, library, and comprehensive sports infrastructure.';
    updated.location = {
      ...updated.location,
      address: 'Plot No. HS-01, Sector 16, Greater Noida West, District Gautam Budh Nagar, Uttar Pradesh 201318',
      sector: 'Sector 16',
      city: 'Greater Noida West',
      state: 'Uttar Pradesh',
      pincode: '201318',
      area: 'Sector 16',
      coordinates: { lat: 28.601, lng: 77.447 },
      mapSearchQuery: 'SKS World School HS-01 Sector 16 Greater Noida West',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.222384955745!2d77.4448553!3d28.6011111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cee2205555555%3A0x6b6c2656e133d1a8!2sSKS%20World%20School!5e0!3m2!1sen!2sin!4v1700000000000'
    };
    updated.board = ['CBSE'];
    updated.boardNote = null;
    updated.contact = {
      phone: '+91-9891081240',
      website: 'https://sksworldschool.ac.in',
      email: 'contact@sksworldschool.ac.in'
    };
    updated.verification = {
      isVerified: true,
      status: 'verified_official',
      lastVerified: 'September 2026',
      sourceName: 'SKS World School Official Portal (sksworldschool.ac.in) & CBSE SARAS',
      sourceUrl: 'https://sksworldschool.ac.in',
      cbseAffiliationNumber: '2133039',
      schoolCode: '61218',
      verifiedFields: [
        'name',
        'address',
        'board',
        'cbseAffiliation',
        'website',
        'contact',
        'fees',
        'imagery'
      ],
      notes: 'CBSE Affiliation 2133039 / School Code 61218 independently verified against CBSE SARAS 7.0 for HS-01 Sector 16 campus.'
    };
  }

  // 2. Admissions Data Overhaul (Reflecting September 2026 Reality)
  const isRamagya = school.slug === 'ramagya-school-noida-extension';
  updated.admissions = {
    ...updated.admissions,
    date: null, // Clear expired April 2026 dates from active display
    status: isRamagya ? 'Contact School for Schedule' : '2027-28 Schedule Pending',
    session: '2026-2027 (Ongoing) / 2027-2028 (Notification Pending)',
    sourceUrl: updated.contact?.website || null,
    lastVerifiedDate: 'September 2026',
    verificationStatus: 'pending_schedule',
    timelineDescription: isRamagya
      ? 'Current admission dates not publicly verified. Check the official school admissions page.'
      : (school.slug === 'sks-world-school-greater-noida-west'
        ? 'Current 2026-27 session active; 2027-28 admissions schedule pending official release. Contact admin office for mid-session transfer vacancies.'
        : 'Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page.')
  };

  // 3. Fee Structure Corrections
  const feePatch = feeUpdates[school.slug];
  if (feePatch) {
    updated.fees = {
      ...updated.fees,
      ...feePatch,
      academicSession: '2026-2027',
      lastVerifiedDate: 'September 2026'
    };
  }

  // 4. Gallery Deduplication & Verification
  // Multi-photo genuine galleries: DPS KP-V (8), DWPS (8), Lotus Valley (6), Pacific World (6), TSUS (4)
  // Single-photo genuine campuses: 11 schools (featured only, no duplicates)
  // Zero-photo schools pending genuine verification: Ramagya (0)
  if (isRamagya) {
    updated.assets = {
      ...updated.assets,
      gallery: []
    };
  } else if (
    ['delhi-public-school-knowledge-park-5',
     'delhi-world-public-school-kp-5',
     'lotus-valley-international-school',
     'pacific-world-school-techzone-4',
     'the-shri-ram-universal-school'
    ].includes(school.slug)
  ) {
    // Keep existing multi-photo gallery without duplicates
    const uniqueGallery = Array.from(new Set(updated.assets.gallery || []));
    updated.assets.gallery = uniqueGallery;
  } else {
    // Single genuine photo schools
    updated.assets.gallery = [updated.assets.featured];
  }

  return updated;
});

// Write to data/schools.json
fs.writeFileSync(schoolsPath, JSON.stringify(updatedSchools, null, 2) + '\n');
console.log('Successfully updated data/schools.json');

// Mirror to school-website-backend/data/schools.json
const backendSchoolsPath = path.join(__dirname, '..', 'school-website-backend', 'data', 'schools.json');
if (fs.existsSync(path.dirname(backendSchoolsPath))) {
  fs.writeFileSync(backendSchoolsPath, JSON.stringify(updatedSchools, null, 2) + '\n');
  console.log('Successfully mirrored to school-website-backend/data/schools.json');
}

// Regenerate school-website-backend/data/schoolsData.js
const backendSchoolsDataJsPath = path.join(__dirname, '..', 'school-website-backend', 'data', 'schoolsData.js');
const legacyUrlMap = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'legacyUrlMap.json'), 'utf8'));

const jsContent = `// Auto-generated backend canonical schools data
const schools = ${JSON.stringify(updatedSchools, null, 2)};

const legacyUrlMap = ${JSON.stringify(legacyUrlMap, null, 2)};

function getAllSchools() { return schools; }
function getSchoolBySlug(slug) { return schools.find(s => s.slug === slug || s.id === slug); }
function resolveLegacyUrl(url) {
  const clean = (url || '').trim().replace(/^\\/+/, '');
  const slug = legacyUrlMap[url] || legacyUrlMap['/' + clean] || legacyUrlMap[clean];
  return slug ? getSchoolBySlug(slug) : null;
}

module.exports = {
  schools,
  legacyUrlMap,
  getAllSchools,
  getSchoolBySlug,
  resolveLegacyUrl
};
`;

fs.writeFileSync(backendSchoolsDataJsPath, jsContent);
console.log('Successfully regenerated school-website-backend/data/schoolsData.js');
