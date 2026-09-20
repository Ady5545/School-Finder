/**
 * FORENSIC FEE-DATA & SCHOOL METADATA CORRECTIONS SCRIPT
 * 
 * Applies authoritative data for the 33 schools specified in the audit request.
 * Strictly adheres to supplied figures with ZERO synthetic additions or cross-contamination.
 */

const fs = require('fs');
const path = require('path');

const schoolsPath = path.join(__dirname, '../data/schools.json');
let schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

const audit = [];

function findSchool(slugOrId) {
  return schools.find(s => s.slug === slugOrId || s.id === slugOrId);
}

// 1. THE SHRI RAM UNIVERSAL SCHOOL — GREATER NOIDA WEST
{
  const s = findSchool('the-shri-ram-universal-school');
  if (s) {
    const oldFees = JSON.stringify(s.fees);
    s.affiliationNumber = '2134175';
    s.cbseAffiliationNumber = '2134175';
    s.studentTeacherRatio = '10:1';
    
    // Fee corrections:
    // Remove books/uniform fees.
    // Remove estimated annual tuition for Nursery and Classes I–VII.
    // Classes IX–XII: ₹41,100 / quarter
    // DO NOT invent Registration ₹1,500, Admission ₹75,000, Caution ₹20,000
    // Only supplied fee figure is Classes IX–XII: ₹41,100
    s.fees = {
      isVerified: true,
      cardFee: 41100,
      currency: 'INR',
      rangeText: '₹41,100 / quarter (Classes IX–XII; Junior grades not publicly specified)',
      registrationFee: null,
      admissionFee: null,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionQuarterly: '₹41,100 (Classes IX–XII)',
      tuitionAnnual: '₹1,64,400 (Classes IX–XII calculated equivalent)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        {
          name: 'Composite Tuition (Classes IX–XII)',
          amount: 41100,
          frequency: 'quarterly',
          type: 'recurring',
          isMandatory: true,
          isOfficial: true,
          description: 'Official composite quarterly fee for secondary & senior secondary grades (Classes IX–XII).'
        }
      ],
      gradeWiseTiers: [
        {
          grades: 'Nursery to Class VII',
          tuitionQuarterly: null,
          tuitionAnnual: null,
          totalAnnual: null,
          notes: 'Junior grade fees not publicly specified in authoritative disclosure.'
        },
        {
          grades: 'Classes IX–XII',
          tuitionQuarterly: 41100,
          tuitionAnnual: 164400,
          totalAnnual: 164400,
          isOfficial: true,
          calculationNotes: 'Calculated annual equivalent based on ₹41,100 / quarter composite fee.'
        }
      ],
      concessions: [],
      disclaimer: 'Official fee disclosed for Classes IX–XII is ₹41,100 per quarter. Junior grade fees are not publicly specified.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '1. Shri Ram Universal forensic fix' });
  }
}

// 2. JM INTERNATIONAL
{
  const s = findSchool('jm-international-school');
  if (s) {
    s.studentTeacherRatio = '30:1';
    s.fees = {
      isVerified: true,
      cardFee: 9500,
      currency: 'INR',
      rangeText: '₹9,500 – ₹12,000 / month (Calculated annual: ₹1,14,000 – ₹1,44,000 / year)',
      registrationFee: null,
      admissionFee: 55000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹9,500 – ₹12,000',
      tuitionAnnual: '₹1,14,000 – ₹1,44,000 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        {
          name: 'Admission Fee',
          amount: 55000,
          frequency: 'one_time',
          type: 'one_time',
          isMandatory: true,
          isOfficial: true,
          refundable: false,
          description: 'One-time admission fee.'
        },
        {
          name: 'Composite Tuition',
          amount: '₹9,500 – ₹12,000',
          frequency: 'monthly',
          type: 'recurring',
          isMandatory: true,
          isOfficial: true,
          description: 'Monthly composite tuition across grades.'
        }
      ],
      gradeWiseTiers: [
        {
          grades: 'All Grades',
          tuitionMonthly: '₹9,500 – ₹12,000',
          tuitionAnnual: '₹1,14,000 – ₹1,44,000 (Calculated)',
          calculationNotes: 'Calculated annual equivalent range (₹9,500 × 12 to ₹12,000 × 12).'
        }
      ],
      concessions: [],
      disclaimer: 'Admission fee is ₹55,000. Composite monthly tuition ranges from ₹9,500 to ₹12,000. Annual figures are calculated.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '2. JM International forensic fix' });
  }
}

// 3. ST. XAVIER'S HIGH SCHOOL (Primary & Secondary records)
['st-xaviers-high-school', 'st-xaviers-high-school-greater-noida-west'].forEach(slug => {
  const s = findSchool(slug);
  if (s) {
    s.location.address = 'Plot No 20 C, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201308';
    s.studentTeacherRatio = '14:1';
    s.fees = {
      isVerified: true,
      cardFee: 22500,
      currency: 'INR',
      rangeText: 'Quarterly: ₹22,500 – ₹29,700 (Nur–V) | ₹23,400 – ₹30,000+ (VI–VIII) | ₹24,300+ (IX–X)',
      registrationFee: null,
      admissionFee: null,
      cautionDeposit: '₹7,500 – ₹10,000 (Refundable)',
      refundableSecurity: '₹7,500 – ₹10,000',
      tuitionMonthly: null,
      tuitionQuarterly: '₹22,500 – ₹30,000+',
      tuitionAnnual: null,
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        {
          name: 'Caution / Security Deposit',
          amount: '₹7,500 – ₹10,000',
          frequency: 'one_time',
          type: 'deposit',
          isMandatory: true,
          refundable: true,
          isOfficial: true,
          description: 'Refundable one-time caution money.'
        },
        {
          name: 'Quarterly Tuition (Nursery–V)',
          amount: '₹22,500 – ₹29,700',
          frequency: 'quarterly',
          type: 'recurring',
          isMandatory: true,
          isOfficial: true
        },
        {
          name: 'Quarterly Tuition (VI–VIII)',
          amount: '₹23,400 – ₹30,000+',
          frequency: 'quarterly',
          type: 'recurring',
          isMandatory: true,
          isOfficial: true
        },
        {
          name: 'Quarterly Tuition (IX–X)',
          amount: '₹24,300+',
          frequency: 'quarterly',
          type: 'recurring',
          isMandatory: true,
          isOfficial: true
        }
      ],
      gradeWiseTiers: [
        { grades: 'Nursery–V', tuitionQuarterly: '₹22,500 – ₹29,700', isOfficial: true },
        { grades: 'VI–VIII', tuitionQuarterly: '₹23,400 – ₹30,000+', isOfficial: true },
        { grades: 'IX–X', tuitionQuarterly: '₹24,300+', isOfficial: true }
      ],
      concessions: [],
      disclaimer: 'Official quarterly grade tiers: Nursery–V (₹22,500–₹29,700), VI–VIII (₹23,400–₹30,000+), IX–X (₹24,300+). Refundable caution is ₹7,500–₹10,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '3. St. Xaviers forensic fix' });
  }
});

// 4. THE WISDOM TREE SCHOOL
{
  const s = findSchool('the-wisdom-tree-school');
  if (s) {
    s.studentTeacherRatio = '18:1';
    s.fees = {
      isVerified: true,
      cardFee: 7250,
      currency: 'INR',
      rangeText: '₹7,250 – ₹12,300 / month (Pre-KG: ₹7,250 | I–V: ₹8,450 | VI–VIII: ₹9,700 | IX–X: ₹10,800 | XI–XII: ₹12,300)',
      registrationFee: 500,
      admissionFee: 20000,
      cautionDeposit: 5000,
      refundableSecurity: 5000,
      tuitionMonthly: '₹7,250 – ₹12,300',
      tuitionAnnual: '₹87,000 – ₹1,47,600 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 500, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 20000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Caution Money', amount: 5000, frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: true, refundable: true }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-KG', tuitionMonthly: 7250, tuitionAnnual: 87000, isOfficial: true, calculationNotes: 'Calculated annual (7250 * 12)' },
        { grades: 'Classes I–V', tuitionMonthly: 8450, tuitionAnnual: 101400, isOfficial: true, calculationNotes: 'Calculated annual (8450 * 12)' },
        { grades: 'Classes VI–VIII', tuitionMonthly: 9700, tuitionAnnual: 116400, isOfficial: true, calculationNotes: 'Calculated annual (9700 * 12)' },
        { grades: 'Classes IX–X', tuitionMonthly: 10800, tuitionAnnual: 129600, isOfficial: true, calculationNotes: 'Calculated annual (10800 * 12)' },
        { grades: 'Classes XI–XII', tuitionMonthly: 12300, tuitionAnnual: 147600, isOfficial: true, calculationNotes: 'Calculated annual (12300 * 12)' }
      ],
      concessions: [],
      disclaimer: 'Official monthly fees: Pre-KG ₹7,250, I–V ₹8,450, VI–VIII ₹9,700, IX–X ₹10,800, XI–XII ₹12,300. Registration ₹500, Admission ₹20,000, Refundable Caution ₹5,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '4. Wisdom Tree forensic fix' });
  }
}

// 5. THE INFINITY SCHOOL
{
  const s = findSchool('the-infinity-school');
  if (s) {
    s.fees = {
      isVerified: false,
      cardFee: 9000,
      currency: 'INR',
      academicSession: '2023–24 (Historical Reference)',
      rangeText: '₹9,000 – ₹11,500 / month (Historical Reference: 2023–24 session; not official 2026–27)',
      registrationFee: 1200,
      admissionFee: 35000,
      cautionDeposit: 10000,
      refundableSecurity: 10000,
      tuitionMonthly: '₹9,000 – ₹11,500 (Historical 2023–24)',
      tuitionAnnual: '₹1,08,000 – ₹1,38,000 (Historical 2023–24)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'estimated_historical',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1200, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false, description: 'Historical 2023–24 fee structure.' },
        { name: 'Admission Fee', amount: 35000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false, refundable: false, description: 'Historical 2023–24 fee structure.' },
        { name: 'Caution Money', amount: 10000, frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: false, refundable: true, description: 'Historical 2023–24 refundable caution.' }
      ],
      gradeWiseTiers: [
        { grades: 'Reception', tuitionMonthly: '₹9,000 (1st child) / ₹8,000 (sibling)', notes: 'Historical 2023–24 reference.' },
        { grades: 'PP1 / PP2 / Grade 1', tuitionMonthly: '₹10,500 (1st child) / ₹8,000 (sibling)', notes: 'Historical 2023–24 reference.' },
        { grades: 'Grades 2–5', tuitionMonthly: '₹11,000 (1st child) / ₹8,000 (sibling)', notes: 'Historical 2023–24 reference.' },
        { grades: 'Grades 6–10', tuitionMonthly: '₹11,500 (1st child) / ₹8,000 (sibling)', notes: 'Historical 2023–24 reference.' }
      ],
      concessions: [
        { type: 'sibling', description: 'Flat ₹8,000 / month sibling rate in historical structure.' }
      ],
      disclaimer: 'Estimated / inferred: The supplied fee data is HISTORICAL (2023–24 session). It is not official current 2026–27 or 2027–28 pricing.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '5. Infinity School forensic fix' });
  }
}

// 6. RAMAGYA SCHOOL
{
  const s = findSchool('ramagya-school-noida-extension');
  if (s) {
    s.location.address = 'Plot No. A-229, Knowledge Park V, Greater Noida West (Noida Extension), Uttar Pradesh';
    s.affiliationNumber = 'Not registered';
    s.cbseAffiliationNumber = 'Not registered';
    s.fees = {
      isVerified: true,
      cardFee: 9000,
      currency: 'INR',
      rangeText: '₹9,000 – ₹14,396 / month (Toddlers: ₹9,000 | Nursery–XI: ₹14,396; 25% discount: ₹10,796)',
      registrationFee: 1000,
      admissionFee: 99000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹9,000 – ₹14,396',
      tuitionAnnual: '₹1,08,000 – ₹1,72,752 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false, description: 'Non-refundable registration fee.' },
        { name: 'Admission Fee (Standard)', amount: 99000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false, description: 'Standard published one-time non-refundable admission fee.' },
        { name: 'Admission Fee (Discounted / Prevailing)', amount: 30000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false, description: 'Prevailing discounted admission fee.' },
        { name: 'Security Deposit', amount: 10000, frequency: 'one_time', type: 'deposit', isMandatory: false, isOfficial: true, refundable: true, description: '₹10,000 listed in schedule but currently waived.' }
      ],
      gradeWiseTiers: [
        { grades: 'Toddlers', tuitionMonthly: 9000, tuitionAnnual: 108000, isOfficial: true, calculationNotes: 'Calculated annual: ₹9,000 × 12.' },
        { grades: 'Nursery–KG II', tuitionMonthly: 14396, tuitionAnnual: 172752, isOfficial: true, notes: 'Discounted monthly: ₹10,796 (25% off) / ₹9,716 (10% sibling).', calculationNotes: 'Calculated annual: ₹14,396 × 12.' },
        { grades: 'Classes I–V', tuitionMonthly: 14396, tuitionAnnual: 172752, isOfficial: true, notes: 'Discounted monthly: ₹10,796 (25% off) / ₹9,716 (10% sibling).', calculationNotes: 'Calculated annual: ₹14,396 × 12.' },
        { grades: 'Classes VI–XI', tuitionMonthly: 14396, tuitionAnnual: 172752, isOfficial: true, notes: 'Discounted monthly: ₹10,796 (25% off) / ₹9,716 (10% sibling).', calculationNotes: 'Calculated annual: ₹14,396 × 12.' }
      ],
      concessions: [
        { type: 'discounted_tuition', description: '25% discounted monthly tuition: ₹10,796 / month.' },
        { type: 'sibling', description: '10% sibling discount: ₹9,716 / month.' },
        { type: 'admission_discount', description: 'Admission fee discounted from ₹99,000 to ₹30,000; ₹10,000 security waived.' }
      ],
      disclaimer: 'Standard admission fee is ₹99,000 (discounted to ₹30,000). Monthly tuition: Toddlers ₹9,000, Nursery–XI ₹14,396 (discounted to ₹10,796). Registration ₹1,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '6. Ramagya forensic fix' });
  }
}

// 7. GD GOENKA INTERNATIONAL SCHOOL — GREATER NOIDA
{
  const s = findSchool('gd-goenka-international-school');
  if (s) {
    s.affiliationNumber = '2133662';
    s.cbseAffiliationNumber = '2133662';
    s.studentTeacherRatio = '25:1';
    s.fees = {
      isVerified: true,
      cardFee: 8855,
      currency: 'INR',
      rangeText: '₹8,855 – ₹12,925 / month composite (Nur–KG: ₹8,855 | I–V: ₹10,175 | VI–VIII: ₹10,725 | IX–X: ₹11,825 | XI–XII: ₹12,925)',
      registrationFee: 1000,
      admissionFee: 25000,
      cautionDeposit: 20000,
      refundableSecurity: 20000,
      tuitionMonthly: '₹8,855 – ₹12,925',
      tuitionAnnual: '₹1,06,260 – ₹1,55,100 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 25000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Security Deposit', amount: 20000, frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: true, refundable: true }
      ],
      gradeWiseTiers: [
        { grades: 'Nursery–KG', tuitionMonthly: 8855, tuitionAnnual: 106260, isOfficial: true, calculationNotes: 'Composite monthly fee: ₹8,855. Calculated annual: ₹1,06,260.' },
        { grades: 'Classes I–V', tuitionMonthly: 10175, tuitionAnnual: 122100, isOfficial: true, calculationNotes: 'Composite monthly fee: ₹10,175. Calculated annual: ₹1,22,100.' },
        { grades: 'Classes VI–VIII', tuitionMonthly: 10725, tuitionAnnual: 128700, isOfficial: true, calculationNotes: 'Composite monthly fee: ₹10,725. Calculated annual: ₹1,28,700.' },
        { grades: 'Classes IX–X', tuitionMonthly: 11825, tuitionAnnual: 141900, isOfficial: true, calculationNotes: 'Composite monthly fee: ₹11,825. Calculated annual: ₹1,41,900.' },
        { grades: 'Classes XI–XII', tuitionMonthly: 12925, tuitionAnnual: 155100, isOfficial: true, calculationNotes: 'Composite monthly fee: ₹12,925. Calculated annual: ₹1,55,100.' }
      ],
      concessions: [],
      disclaimer: 'Authoritative monthly composite fees: Nursery–KG ₹8,855, I–V ₹10,175, VI–VIII ₹10,725, IX–X ₹11,825, XI–XII ₹12,925. Registration ₹1,000, Admission ₹25,000, Security ₹20,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '7. GD Goenka forensic fix' });
  }
}

// 8. SALVATION TREE SCHOOL
{
  const s = findSchool('salvation-tree-school');
  if (s) {
    s.location.address = 'HS-5, Techzone-VII, Milak Lachchhi, Greater Noida, Uttar Pradesh 203207';
    s.studentTeacherRatio = '19:1';
    s.fees = {
      isVerified: true,
      cardFee: 60195,
      currency: 'INR',
      rangeText: '₹60,195 – ₹1,12,371 / year (Grade-wise annual tuition schedule)',
      registrationFee: 1500,
      admissionFee: 30000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionAnnual: '₹60,195 – ₹1,12,371',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration / Prospectus', amount: 1500, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 30000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nur / Nursery / KG', tuitionAnnual: 60195, totalAnnual: 60195, isOfficial: true },
        { grades: 'Classes I–III', tuitionAnnual: 66898, totalAnnual: 66898, isOfficial: true },
        { grades: 'Classes IV–V', tuitionAnnual: 80268, totalAnnual: 80268, isOfficial: true },
        { grades: 'Classes VI–VIII', tuitionAnnual: 86947, totalAnnual: 86947, isOfficial: true },
        { grades: 'Classes IX–X', tuitionAnnual: 93650, totalAnnual: 93650, isOfficial: true },
        { grades: 'Classes XI–XII Commerce/Humanities', tuitionAnnual: 107020, totalAnnual: 107020, isOfficial: true },
        { grades: 'Classes XI–XII Science', tuitionAnnual: 112371, totalAnnual: 112371, isOfficial: true }
      ],
      concessions: [],
      disclaimer: 'Official annual tuition schedule: Pre-Nur–KG ₹60,195, I–III ₹66,898, IV–V ₹80,268, VI–VIII ₹86,947, IX–X ₹93,650, XI–XII Commerce ₹1,07,020, XI–XII Science ₹1,12,371. Registration ₹1,500, Admission ₹30,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '8. Salvation Tree forensic fix' });
  }
}

// 9. BLS WORLD SCHOOL
{
  const s = findSchool('bls-world-school');
  if (s) {
    s.location.address = 'HS 03, Sector 16 West, Panchsheel Greens 2, Greater Noida, Noida, Uttar Pradesh 201318';
    s.affiliationNumber = '2133923';
    s.cbseAffiliationNumber = '2133923';
    s.studentTeacherRatio = '18:1';
    s.admissions.process = '2027–28 admissions expected late December. Pre-registration available.';
    s.fees = {
      isVerified: true,
      cardFee: 97800,
      currency: 'INR',
      rangeText: '₹97,800 – ₹1,23,000 / year (Nursery & Prep: ₹97,800 | I–V: ₹1,08,000 | VI–VIII: ₹1,14,000 | IX–X: ₹1,23,000)',
      registrationFee: 1700,
      admissionFee: 45000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹8,150 – ₹10,250',
      tuitionQuarterly: '₹24,450 – ₹30,750',
      tuitionAnnual: '₹97,800 – ₹1,23,000',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1700, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 45000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false }
      ],
      gradeWiseTiers: [
        { grades: 'Nursery & Prep', tuitionMonthly: 8150, tuitionQuarterly: 24450, tuitionAnnual: 97800, isOfficial: true },
        { grades: 'Classes I–V', tuitionMonthly: 9000, tuitionQuarterly: 27000, tuitionAnnual: 108000, isOfficial: true },
        { grades: 'Classes VI–VIII', tuitionMonthly: 9500, tuitionQuarterly: 28500, tuitionAnnual: 114000, isOfficial: true },
        { grades: 'Classes IX–X', tuitionMonthly: 10250, tuitionQuarterly: 30750, tuitionAnnual: 123000, isOfficial: true }
      ],
      concessions: [],
      disclaimer: 'Official annual tuition: Nursery & Prep ₹97,800 (₹8,150/mo), I–V ₹1,08,000 (₹9,000/mo), VI–VIII ₹1,14,000 (₹9,500/mo), IX–X ₹1,23,000 (₹10,250/mo). Registration ₹1,700, Admission ₹45,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '9. BLS World School forensic fix' });
  }
}

// 10. SHRI RAM GLOBAL SCHOOL
{
  const s = findSchool('shri-ram-global-school');
  if (s) {
    s.location.address = 'HS-03, Shri Ram Global School, Sector Techzone 7, West, Milak Lachchhi, Greater Noida, Uttar Pradesh 203207';
    s.affiliationNumber = '2133800';
    s.cbseAffiliationNumber = '2133800';
    s.studentTeacherRatio = 'Pre-Nursery–Prep: 15:1 | Grade 1 onward: 30:1';
    s.fees = {
      isVerified: true,
      cardFee: 13314,
      currency: 'INR',
      rangeText: '₹13,314 – ₹16,488 / month (Discounted: ₹9,510 – ₹11,245 / month)',
      registrationFee: 1000,
      admissionFee: 40000,
      cautionDeposit: 0,
      refundableSecurity: 0,
      tuitionMonthly: '₹13,314 – ₹16,488',
      tuitionAnnual: '₹1,59,768 – ₹1,97,856 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Published ₹60k, 33% waiver)', amount: 40000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false, description: 'Published ₹60,000 with 33% waiver; payable ₹40,000.' },
        { name: 'Security Deposit (Published ₹10k, 100% waiver)', amount: 0, frequency: 'one_time', type: 'deposit', isMandatory: false, isOfficial: true, refundable: true, description: 'Published ₹10,000 with 100% waiver; payable ₹0.' },
        { name: 'Examination Fee (Grade V onward)', amount: 1000, frequency: 'annual', type: 'recurring', isMandatory: true, isOfficial: true, description: '₹1,000 annually payable in April from Grade V onward.' }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nursery', tuitionMonthly: 13314, tuitionAnnual: 159768, notes: 'Discounted payable: ₹9,510 / month.', isOfficial: true, calculationNotes: 'Calculated annual: ₹13,314 × 12.' },
        { grades: 'Nursery / KG / Prep', tuitionMonthly: 13826, tuitionAnnual: 165912, notes: 'Discounted payable: ₹9,830 / month.', isOfficial: true, calculationNotes: 'Calculated annual: ₹13,826 × 12.' },
        { grades: 'Grade 1–5', tuitionMonthly: 15076, tuitionAnnual: 180912, notes: 'Discounted payable: ₹10,510 / month.', isOfficial: true, calculationNotes: 'Calculated annual: ₹15,076 × 12.' },
        { grades: 'Grade 6–12', tuitionMonthly: 16488, tuitionAnnual: 197856, notes: 'Discounted payable: ₹11,245 / month.', isOfficial: true, calculationNotes: 'Calculated annual: ₹16,488 × 12.' }
      ],
      concessions: [
        { type: 'admission_waiver', description: '33% admission fee waiver (payable ₹40,000 vs ₹60,000).' },
        { type: 'security_waiver', description: '100% security fee waiver (payable ₹0 vs ₹10,000).' }
      ],
      disclaimer: 'Monthly composite: Pre-Nur ₹13,314 (discounted ₹9,510), Nur/KG ₹13,826 (discounted ₹9,830), Gr 1–5 ₹15,076 (discounted ₹10,510), Gr 6–12 ₹16,488 (discounted ₹11,245). Registration ₹1,000, Admission ₹40,000 (after 33% waiver), Security ₹0 (100% waived).'
    };
    audit.push({ name: s.name, slug: s.slug, change: '10. Shri Ram Global forensic fix' });
  }
}

// 11. FLORENCE INTERNATIONAL SCHOOL
{
  const s = findSchool('florence-international-school');
  if (s) {
    s.affiliationNumber = '2130579';
    s.cbseAffiliationNumber = '2130579';
    s.studentTeacherRatio = '25:1';
    s.fees = {
      isVerified: true,
      cardFee: 6750,
      currency: 'INR',
      rangeText: '₹6,750 / month (Calculated annual: ₹81,000 / year)',
      registrationFee: 50,
      admissionFee: 25000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹6,750',
      tuitionAnnual: '₹81,000 (Calculated)',
      transportMonthly: '₹2,000 – ₹3,000 (Optional)',
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Prospectus', amount: 1200, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Registration Fee', amount: 50, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 25000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Tuition Fee', amount: 6750, frequency: 'monthly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Transport (Optional)', amount: '₹2,000 – ₹3,000', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionMonthly: 6750, tuitionAnnual: 81000, calculationNotes: 'Calculated annual: ₹6,750 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Official tuition: ₹6,750/month (calculated annual: ₹81,000/yr). Prospectus ₹1,200, Registration ₹50, Admission ₹25,000. Transport ₹2,000–₹3,000/month optional.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '11. Florence International forensic fix' });
  }
}

// 12. ST. TERESA SCHOOL
{
  const s = findSchool('st-teresa-school-greater-noida-west');
  if (s) {
    s.location.address = 'Plot No HS-3, Sector 3 Rd, Sector 3, West, Greater Noida West';
    s.studentTeacherRatio = '15:1';
    s.affiliationNumber = 'Not publicly disclosed';
    s.cbseAffiliationNumber = 'Not publicly disclosed';
    s.fees = {
      isVerified: false,
      cardFee: 73000,
      currency: 'INR',
      rangeText: '₹73,000 – ₹1,40,500 / year (Approximate annual grade ranges)',
      registrationFee: 1000,
      admissionFee: 20000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionAnnual: '₹73,000 – ₹1,40,500 (Approximate)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'estimated_historical',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee (Approximate)', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false },
        { name: 'Admission Fee (Up to)', amount: 20000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nursery–VIII', tuitionAnnual: '₹73,000 – ₹1,12,900', notes: 'Approximate annual fee.' },
        { grades: 'Classes IX–X', tuitionAnnual: '₹1,16,500 – ₹1,28,500', notes: 'Approximate annual fee.' },
        { grades: 'Classes XI–XII', tuitionAnnual: 'Up to approx ₹1,40,500', notes: 'Depending on stream.' }
      ],
      concessions: [],
      disclaimer: 'Approximate annual fee ranges: Pre-Nur–VIII (₹73,000–₹1,12,900), IX–X (₹1,16,500–₹1,28,500), XI–XII (up to approx ₹1,40,500). Registration approx ₹1,000, Admission up to ₹20,000. CBSE affiliation is not publicly disclosed.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '12. St. Teresa forensic fix' });
  }
}

// 13. ST. JOHN'S SENIOR SECONDARY SCHOOL
{
  const s = findSchool('st-johns-senior-secondary-school-noida-ext');
  if (s) {
    s.affiliationNumber = '2133271';
    s.cbseAffiliationNumber = '2133271';
    s.studentTeacherRatio = '30:1';
    s.fees = {
      isVerified: true,
      cardFee: 6500,
      currency: 'INR',
      rangeText: '₹6,500 – ₹8,364 / month (Nursery–V: ₹6,500 | VI–VIII: ₹6,970 | IX–X: ₹7,184 | XI–XII: ₹8,364)',
      registrationFee: 1000,
      admissionFee: 40000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹6,500 – ₹8,364',
      tuitionAnnual: '₹78,000 – ₹1,00,368 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 40000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Practical Fee (per subject)', amount: 400, frequency: 'recurring', type: 'recurring', isMandatory: false, isOfficial: true, description: '₹400 per practical subject where applicable.' }
      ],
      gradeWiseTiers: [
        { grades: 'Nursery–V', tuitionMonthly: 6500, tuitionAnnual: 78000, isOfficial: true, calculationNotes: 'Calculated annual: ₹6,500 × 12.' },
        { grades: 'Classes VI–VIII', tuitionMonthly: 6970, tuitionAnnual: 83640, isOfficial: true, calculationNotes: 'Calculated annual: ₹6,970 × 12.' },
        { grades: 'Classes IX–X', tuitionMonthly: 7184, tuitionAnnual: 86208, isOfficial: true, calculationNotes: 'Calculated annual: ₹7,184 × 12.' },
        { grades: 'Classes XI–XII', tuitionMonthly: 8364, tuitionAnnual: 100368, isOfficial: true, calculationNotes: 'Calculated annual: ₹8,364 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Official monthly composite: Nursery–V ₹6,500, VI–VIII ₹6,970, IX–X ₹7,184, XI–XII ₹8,364. Registration ₹1,000, Admission ₹40,000. Practical ₹400/subject.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '13. St. Johns forensic fix' });
  }
}

// 14. ASTER PUBLIC SCHOOL — KNOWLEDGE PARK V
{
  const s = findSchool('aster-public-school-kp5');
  if (s) {
    s.affiliationNumber = '2133802';
    s.cbseAffiliationNumber = '2133802';
    s.studentTeacherRatio = '15:1';
    s.fees = {
      isVerified: true,
      cardFee: 6500,
      currency: 'INR',
      rangeText: '₹6,500 – ₹8,000 / month (₹19,500 – ₹24,000 / quarter; Typical composite ~₹7,700 / month)',
      registrationFee: '₹500 – ₹1,000',
      admissionFee: '₹30,000 – ₹40,000',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹6,500 – ₹8,000',
      tuitionQuarterly: '₹19,500 – ₹24,000',
      tuitionAnnual: '₹78,000 – ₹96,000 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: '₹500 – ₹1,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Admission Fee', amount: '₹30,000 – ₹40,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Quarterly Composite Tuition', amount: '₹19,500 – ₹24,000', frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionMonthly: '₹6,500 – ₹8,000', tuitionQuarterly: '₹19,500 – ₹24,000', notes: 'Typical composite ~₹7,700 / month.' }
      ],
      concessions: [],
      disclaimer: 'Tuition: ₹6,500–₹8,000/month (₹19,500–₹24,000/quarter). Registration: ₹500–₹1,000, Admission: ₹30,000–₹40,000. Composite approximate: ₹7,700/month.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '14. Aster KP5 forensic fix' });
  }
}

// 15. ASTER PUBLIC SCHOOL — SECTOR 3
{
  const s = findSchool('aster-public-school-sector-3');
  if (s) {
    s.fees = {
      isVerified: true,
      cardFee: 6500,
      currency: 'INR',
      rangeText: '₹6,500 – ₹8,000 / month (₹19,500 – ₹24,000 / quarter; Typical composite ~₹7,700 / month)',
      registrationFee: '₹500 – ₹1,000',
      admissionFee: '₹30,000 – ₹40,000',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹6,500 – ₹8,000',
      tuitionQuarterly: '₹19,500 – ₹24,000',
      tuitionAnnual: '₹78,000 – ₹96,000 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: '₹500 – ₹1,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Admission Fee', amount: '₹30,000 – ₹40,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Quarterly Composite Tuition', amount: '₹19,500 – ₹24,000', frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionMonthly: '₹6,500 – ₹8,000', tuitionQuarterly: '₹19,500 – ₹24,000', notes: 'Typical composite ~₹7,700 / month.' }
      ],
      concessions: [],
      disclaimer: 'Tuition: ₹6,500–₹8,000/month (₹19,500–₹24,000/quarter). Registration: ₹500–₹1,000, Admission: ₹30,000–₹40,000. Composite approximate: ₹7,700/month.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '15. Aster Sector 3 forensic fix' });
  }
}

// 16. THE MANTHAN SCHOOL
{
  const s = findSchool('the-manthan-school-greater-noida-west');
  if (s) {
    s.studentTeacherRatio = '1:25';
    s.fees = {
      isVerified: true,
      cardFee: 21000,
      currency: 'INR',
      rangeText: 'Quarterly composite: ₹21,000 (Pre-Nur) | ₹26,100 (Nur–5) | ₹27,300 (6–11)',
      registrationFee: 1000,
      admissionFee: 'Pre-Nursery ₹15,000 | Nursery–XI ₹20,000',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionQuarterly: '₹21,000 – ₹27,300',
      tuitionAnnual: '₹84,000 – ₹1,09,200 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Pre-Nursery)', amount: 15000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Nursery–XI)', amount: 20000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Quarterly Composite (Pre-Nursery)', amount: 21000, frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Quarterly Composite (Nursery–5)', amount: 26100, frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Quarterly Composite (Classes 6–11)', amount: 27300, frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nursery', tuitionQuarterly: 21000, tuitionAnnual: 84000, isOfficial: true, calculationNotes: 'Calculated annual: ₹21,000 × 4.' },
        { grades: 'Nursery–5', tuitionQuarterly: 26100, tuitionAnnual: 104400, isOfficial: true, calculationNotes: 'Calculated annual: ₹26,100 × 4.' },
        { grades: 'Classes 6–11', tuitionQuarterly: 27300, tuitionAnnual: 109200, isOfficial: true, calculationNotes: 'Calculated annual: ₹27,300 × 4.' }
      ],
      concessions: [
        { type: 'advance_rebate', description: '5% advance annual composite rebate excluding transport (available on request).' },
        { type: 'sibling', description: '25% younger sibling offline composite discount (available on request).' }
      ],
      disclaimer: 'Official quarterly composite: Pre-Nursery ₹21,000, Nursery–5 ₹26,100, Classes 6–11 ₹27,300. Registration ₹1,000, Admission ₹15,000 (Pre-Nur) / ₹20,000 (Nur–XI). Concessions: 5% advance annual rebate, 25% sibling discount.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '16. The Manthan School forensic fix' });
  }
}

// 17. SARVOTTAM INTERNATIONAL
{
  const s = findSchool('sarvottam-international-school');
  if (s) {
    s.affiliationNumber = '2132551';
    s.cbseAffiliationNumber = '2132551';
    s.studentTeacherRatio = '16:1';
    s.fees = {
      isVerified: true,
      cardFee: 39267,
      currency: 'INR',
      rangeText: 'CBSE: ₹39,267 – ₹42,158 / quarter | Cambridge: ₹18,755 / month',
      registrationFee: 1500,
      admissionFee: 'Toddlers–SR KG: ₹40,000 (1st) / ₹30,000 (2nd/3rd) | Gr I–XII: ₹60,000 (1st) / ₹50,000 (2nd/3rd)',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionQuarterly: '₹39,267 – ₹42,158 (CBSE)',
      tuitionAnnual: null,
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1500, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission (Toddlers–SR KG 1st Child)', amount: 40000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Admission (Toddlers–SR KG 2nd/3rd Child)', amount: 30000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Admission (Grades I–XII 1st Child)', amount: 60000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Admission (Grades I–XII 2nd/3rd Child)', amount: 50000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Lab Fee', amount: '₹500 / quarter / subject', frequency: 'quarterly', type: 'recurring', isMandatory: false, isOfficial: true, description: '₹500 per quarter per subject for applicable subjects.' }
      ],
      gradeWiseTiers: [
        { curriculum: 'CBSE', grades: 'Toddlers–Class X', tuitionQuarterly: 39267, isOfficial: true },
        { curriculum: 'CBSE', grades: 'Classes XI–XII', tuitionQuarterly: 42158, isOfficial: true },
        { curriculum: 'Cambridge', grades: 'Classes I–V (Cambridge Primary)', tuitionMonthly: 18755, tuitionAnnual: 225060, isOfficial: true, calculationNotes: 'Calculated annual: ₹18,755 × 12.' }
      ],
      concessions: [
        { type: 'sibling_admission', description: '₹10,000 reduction on admission fee for second and third child.' }
      ],
      disclaimer: 'CBSE composite: Toddlers–X ₹39,267/qtr, XI–XII ₹42,158/qtr. Cambridge Primary: ₹18,755/month. Registration ₹1,500. Admission: Toddlers–SR KG ₹40,000 (₹30k sibling); Gr I–XII ₹60,000 (₹50k sibling).'
    };
    audit.push({ name: s.name, slug: s.slug, change: '17. Sarvottam International forensic fix' });
  }
}

// 18. THE MILLENNIUM SCHOOL — SECTOR 119 NOIDA
{
  const s = findSchool('the-millennium-school-noida-extension');
  if (s) {
    s.location.address = 'Near Plot No SS-1, 108, RG Residency, Sector 119, Noida, UP 201316';
    s.location.city = 'Noida';
    s.location.subLocality = 'Sector 119';
    s.affiliationNumber = '2133481';
    s.cbseAffiliationNumber = '2133481';
    s.studentTeacherRatio = '15:1';
    s.fees = {
      isVerified: false,
      cardFee: 10710,
      currency: 'INR',
      rangeText: 'Nursery: ~₹10,710 / mo | Middle Grades: ~₹1.4L – ₹1.5L / yr (Approximate)',
      registrationFee: 1000,
      admissionFee: 'Pre-Nursery–X ₹70,000 | XI ₹48,000',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: 'Approx ₹10,710 (Nursery)',
      tuitionAnnual: 'Approx ₹1,40,000 – ₹1,50,000 (Middle Grades)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'estimated_historical',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Pre-Nursery–X)', amount: 70000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Class XI)', amount: 48000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false }
      ],
      gradeWiseTiers: [
        { grades: 'Nursery', tuitionMonthly: '~₹10,710', notes: 'Approximate monthly tuition.' },
        { grades: 'Middle Grades', tuitionAnnual: '~₹1,40,000 – ₹1,50,000', notes: 'Approximate annual total.' }
      ],
      concessions: [],
      disclaimer: 'Nursery tuition is approx ₹10,710/month; middle-grade annual totals are approx ₹1.4–₹1.5 lakh/year. Registration ₹1,000, Admission ₹70,000 (Pre-Nur–X) / ₹48,000 (XI). Located in Sector 119 Noida.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '18. Millennium School Sector 119 forensic fix' });
  }
}

// 19. GAURS INTERNATIONAL SCHOOL
{
  const s = findSchool('gaurs-international-school-gaur-city-2');
  if (s) {
    s.affiliationNumber = '2132595';
    s.cbseAffiliationNumber = '2132595';
    s.studentTeacherRatio = '20:1';
    s.fees = {
      isVerified: true,
      cardFee: 32378,
      currency: 'INR',
      rangeText: '₹32,378 – ₹32,475 / quarter composite (₹1,29,512 – ₹1,29,900 / year)',
      registrationFee: 1500,
      admissionFee: 35000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionQuarterly: '₹32,378 – ₹32,475',
      tuitionAnnual: '₹1,29,512 – ₹1,29,900',
      transportMonthly: null,
      transportQuarterly: 'Gaur City: ₹7,826 | Crossing Republic: ₹8,803 | Noida/Noida Ext: ₹12,229 (Optional)',
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Prospectus', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Registration Fee', amount: 1500, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 35000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Miscellaneous', amount: 1100, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Digital Learning (Grade I–X)', amount: 600, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Quarterly Composite Tuition', amount: '₹32,378 – ₹32,475', frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Transport Quarterly (Optional)', amount: 'Gaur City: ₹7,826 | Crossing Republic: ₹8,803 | Noida/Ext: ₹12,229', frequency: 'quarterly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'Classes I–X', tuitionQuarterly: 32378, tuitionAnnual: 129512, isOfficial: true },
        { grades: 'Classes XI–XII', tuitionQuarterly: 32475, tuitionAnnual: 129900, isOfficial: true }
      ],
      concessions: [],
      disclaimer: 'Quarterly composite: ₹32,378–₹32,475. Prospectus ₹1,000, Registration ₹1,500, Admission ₹35,000, Misc ₹1,100, Digital Learning (I–X) ₹600. Optional quarterly transport: Gaur City ₹7,826, Crossing Republic ₹8,803, Noida/Ext ₹12,229.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '19. Gaurs International forensic fix' });
  }
}

// 20. MOUNT VINSON SCHOOL
// Intentionally not reintroduced: the school was removed from public discovery
// and retained only as archived historical data in data/schools.json.

// 21. MOUNT LITERA ZEE SCHOOL GNW
{
  const s = findSchool('mount-litera-zee-school-greater-noida-west');
  if (s) {
    s.affiliationNumber = 'Not publicly listed';
    s.cbseAffiliationNumber = 'Not publicly listed';
    s.studentTeacherRatio = '18:1';
    s.fees = {
      isVerified: false,
      disclosed: false,
      cardFee: null,
      currency: 'INR',
      rangeText: 'Fees not publicly disclosed',
      registrationFee: null,
      admissionFee: null,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionAnnual: null,
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'not_publicly_verified',
      lastVerifiedDate: '2026-09-18',
      components: [],
      gradeWiseTiers: [],
      concessions: [],
      disclaimer: 'Fee structure for Mount Litera Zee School Greater Noida West is not publicly disclosed.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '21. Mount Litera Zee forensic fix' });
  }
}

// 22. MODERN PUBLIC SCHOOL
{
  const s = findSchool('modern-public-school-noida-extension');
  if (s) {
    s.affiliationNumber = '2132062';
    s.cbseAffiliationNumber = '2132062';
    s.studentTeacherRatio = '25:1';
    s.fees = {
      isVerified: true,
      cardFee: 5600,
      currency: 'INR',
      rangeText: '₹5,600 – ₹8,800 / month (Pre-Nur: ₹5,600 | Nur: ₹6,000 | LKG: ₹6,100 | UKG: ₹6,400 | I: ₹6,600 | II: ₹7,150 | III: ₹7,750 | IV–V: ₹8,300 | VI–VIII: ₹8,600 | IX–X: ₹8,700 | XI–XII: ₹8,800)',
      registrationFee: 1000,
      admissionFee: 'Pre-Nursery/Muskan: ₹10,000 | Nursery–XII: ₹24,000',
      cautionDeposit: 'Pre-Nursery/Muskan: ₹6,000 | Nursery–XII: ₹10,000 (Refundable)',
      refundableSecurity: 'Pre-Nursery: ₹6,000 | Nursery–XII: ₹10,000',
      tuitionMonthly: '₹5,600 – ₹8,800',
      tuitionAnnual: '₹67,200 – ₹1,05,600 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Pre-Nursery/Muskan)', amount: 10000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee (Nursery–XII)', amount: 24000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Caution Money (Pre-Nursery)', amount: 6000, frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: true, refundable: true },
        { name: 'Caution Money (Nursery–XII)', amount: 10000, frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: true, refundable: true },
        { name: 'Development Fee (Nursery–XII)', amount: 6000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Orientation Fee', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Annual Exam Fee (Nur–UKG)', amount: 3000, frequency: 'annual', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Annual Exam Fee (I–XII)', amount: 6000, frequency: 'annual', type: 'recurring', isMandatory: true, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nursery', tuitionMonthly: 5600, tuitionAnnual: 67200, isOfficial: true, calculationNotes: 'Calculated annual: ₹5,600 × 12.' },
        { grades: 'Nursery', tuitionMonthly: 6000, tuitionAnnual: 72000, isOfficial: true, calculationNotes: 'Calculated annual: ₹6,000 × 12.' },
        { grades: 'LKG', tuitionMonthly: 6100, tuitionAnnual: 73200, isOfficial: true, calculationNotes: 'Calculated annual: ₹6,100 × 12.' },
        { grades: 'UKG', tuitionMonthly: 6400, tuitionAnnual: 76800, isOfficial: true, calculationNotes: 'Calculated annual: ₹6,400 × 12.' },
        { grades: 'Class I', tuitionMonthly: 6600, tuitionAnnual: 79200, isOfficial: true, calculationNotes: 'Calculated annual: ₹6,600 × 12.' },
        { grades: 'Class II', tuitionMonthly: 7150, tuitionAnnual: 85800, isOfficial: true, calculationNotes: 'Calculated annual: ₹7,150 × 12.' },
        { grades: 'Class III', tuitionMonthly: 7750, tuitionAnnual: 93000, isOfficial: true, calculationNotes: 'Calculated annual: ₹7,750 × 12.' },
        { grades: 'Classes IV–V', tuitionMonthly: 8300, tuitionAnnual: 99600, isOfficial: true, calculationNotes: 'Calculated annual: ₹8,300 × 12.' },
        { grades: 'Classes VI–VIII', tuitionMonthly: 8600, tuitionAnnual: 103200, isOfficial: true, calculationNotes: 'Calculated annual: ₹8,600 × 12.' },
        { grades: 'Classes IX–X', tuitionMonthly: 8700, tuitionAnnual: 104400, isOfficial: true, calculationNotes: 'Calculated annual: ₹8,700 × 12.' },
        { grades: 'Classes XI–XII', tuitionMonthly: 8800, tuitionAnnual: 105600, isOfficial: true, calculationNotes: 'Calculated annual: ₹8,800 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Official monthly tuition schedule: Pre-Nur ₹5,600, Nur ₹6,000, LKG ₹6,100, UKG ₹6,400, I ₹6,600, II ₹7,150, III ₹7,750, IV–V ₹8,300, VI–VIII ₹8,600, IX–X ₹8,700, XI–XII ₹8,800. Registration ₹1,000, Admission ₹10,000 (Pre-Nur) / ₹24,000 (Nur–XII), Caution ₹6,000/₹10,000 refundable, Dev ₹6,000, Orientation ₹1,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '22. Modern Public School forensic fix' });
  }
}

// 23. SUNSHINE PUBLIC SCHOOL
{
  const s = findSchool('sunshine-public-school-noida-ext');
  if (s) {
    s.board = ['State Board', 'UP Board'];
    s.affiliationNumber = null;
    s.cbseAffiliationNumber = null;
    s.studentTeacherRatio = 'approx 25:1';
    s.fees = {
      isVerified: false,
      cardFee: 18000,
      currency: 'INR',
      rangeText: '₹18,000 – ₹30,000 / year (Kindergarten: ~₹18k | I–V: ~₹24k | VI–VIII: ~₹30k)',
      registrationFee: null,
      admissionFee: null,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionAnnual: '₹18,000 – ₹30,000 (Approximate)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'estimated_historical',
      lastVerifiedDate: '2026-09-18',
      components: [],
      gradeWiseTiers: [
        { grades: 'Kindergarten', tuitionAnnual: '~₹18,000', notes: 'Approximate annual tuition.' },
        { grades: 'Classes I–V', tuitionAnnual: '~₹24,000', notes: 'Approximate annual tuition.' },
        { grades: 'Classes VI–VIII', tuitionAnnual: '~₹30,000', notes: 'Approximate annual tuition.' }
      ],
      concessions: [],
      disclaimer: 'State Board / UP Board affiliation. Approximate annual tuition: Kindergarten ~₹18,000, Classes I–V ~₹24,000, Classes VI–VIII ~₹30,000. (Not to be confused with Sunshine Public School in Sector 68 Noida).'
    };
    audit.push({ name: s.name, slug: s.slug, change: '23. Sunshine Public School forensic fix' });
  }
}

// 24. BGS VIJNATHAM
{
  const s = findSchool('bgs-vijnatham-school');
  if (s) {
    s.affiliationNumber = '2133804';
    s.cbseAffiliationNumber = '2133804';
    s.location.address = 'Plot No.2, Techzone VII, Milak Lachchhi, Greater Noida, UP 203207';
    // Do not invent a single STR from supplied conflicting ratio data
    s.studentTeacherRatio = 'Conflicting sources: 12:1 to 1:20 (requires verification)';
    s.fees = {
      isVerified: true,
      cardFee: 8550,
      currency: 'INR',
      rangeText: '₹8,550 – ₹11,250 / month composite (Pre-primary: ₹8,550 | I–V: ₹10,150 | VI–X: ₹10,650 | XI–XII: ₹11,250)',
      registrationFee: 1250,
      admissionFee: 40000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹8,550 – ₹11,250',
      tuitionAnnual: '₹1,02,600 – ₹1,35,000 (Calculated)',
      transportMonthly: '₹1,500 – ₹3,000 (Optional)',
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1250, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 40000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Exam Fee (Grade VI onward)', amount: 1250, frequency: 'annual', type: 'recurring', isMandatory: true, isOfficial: true, description: '₹1,250 annually from Grade VI onward.' },
        { name: 'Lab Fee (XI–XII)', amount: '₹250 / quarter / subject', frequency: 'quarterly', type: 'recurring', isMandatory: false, isOfficial: true, description: '₹250 per quarter per practical subject for XI–XII.' },
        { name: 'Transport (Optional)', amount: '₹1,500 – ₹3,000', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-primary', tuitionMonthly: 8550, tuitionAnnual: 102600, isOfficial: true, calculationNotes: 'Calculated annual: ₹8,550 × 12.' },
        { grades: 'Classes I–V', tuitionMonthly: 10150, tuitionAnnual: 121800, isOfficial: true, calculationNotes: 'Calculated annual: ₹10,150 × 12.' },
        { grades: 'Classes VI–X', tuitionMonthly: 10650, tuitionAnnual: 127800, isOfficial: true, calculationNotes: 'Calculated annual: ₹10,650 × 12.' },
        { grades: 'Classes XI–XII', tuitionMonthly: 11250, tuitionAnnual: 135000, isOfficial: true, calculationNotes: 'Calculated annual: ₹11,250 × 12.' }
      ],
      concessions: [
        { type: 'sibling', description: '40% concession on monthly composite for second child.' }
      ],
      disclaimer: 'Official monthly composite: Pre-primary ₹8,550, I–V ₹10,150, VI–X ₹10,650, XI–XII ₹11,250. Registration ₹1,250, Admission ₹40,000. Exam fee ₹1,250/yr (VI+), Lab ₹250/qtr/subject (XI–XII). Optional transport ₹1,500–₹3,000/mo. Sibling concession 40% on monthly composite.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '24. BGS Vijnatham forensic fix' });
  }
}

// 25. BLOOM INTERNATIONAL SCHOOL
{
  const s = findSchool('bloom-international-school-techzone-7');
  if (s) {
    s.affiliationNumber = '2132289';
    s.cbseAffiliationNumber = '2132289';
    s.studentTeacherRatio = '36:1';
    s.fees = {
      isVerified: true,
      cardFee: 81700,
      currency: 'INR',
      rangeText: '₹81,700 – ₹1,37,100 / year (2027–28 grade-wise annual tuition schedule)',
      registrationFee: 1100,
      admissionFee: 11000,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹5,800 onwards',
      tuitionAnnual: '₹81,700 – ₹1,37,100',
      transportMonthly: '₹1,750 – ₹2,150',
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1100, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 11000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Transport', amount: '₹1,750 – ₹2,150', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nur / Nur / LKG / UKG', tuitionAnnual: 81700, isOfficial: true },
        { grades: 'Classes I–III', tuitionAnnual: 84100, isOfficial: true },
        { grades: 'Class IV', tuitionAnnual: 85300, isOfficial: true },
        { grades: 'Class V', tuitionAnnual: 86500, isOfficial: true },
        { grades: 'Class VI', tuitionAnnual: 87700, isOfficial: true },
        { grades: 'Class VII', tuitionAnnual: 88900, isOfficial: true },
        { grades: 'Class VIII', tuitionAnnual: 90100, isOfficial: true },
        { grades: 'Class IX', tuitionAnnual: 108700, isOfficial: true },
        { grades: 'Class X', tuitionAnnual: 131100, isOfficial: true },
        { grades: 'Class XI', tuitionAnnual: 113500, isOfficial: true },
        { grades: 'Class XII', tuitionAnnual: 137100, isOfficial: true }
      ],
      concessions: [],
      disclaimer: '2027–28 grade-wise annual tuition schedule: Pre-Nur–UKG ₹81,700, I–III ₹84,100, IV ₹85,300, V ₹86,500, VI ₹87,700, VII ₹88,900, VIII ₹90,100, IX ₹1,08,700, X ₹1,31,100, XI ₹1,13,500, XII ₹1,37,100. Registration ₹1,100, Admission ₹11,000, Transport ₹1,750–₹2,150/month.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '25. Bloom International forensic fix' });
  }
}

// 26. SPARSH GLOBAL SCHOOL
{
  const s = findSchool('sparsh-global-school-greater-noida-west');
  if (s) {
    s.affiliationNumber = '2134159';
    s.cbseAffiliationNumber = '2134159';
    s.studentTeacherRatio = '12:1–15:1';
    s.fees = {
      isVerified: true,
      cardFee: 21000,
      currency: 'INR',
      rangeText: '₹21,000 – ₹29,250 / quarter (Calculated annual: ₹84,000 – ₹1,17,000 / year)',
      registrationFee: 1000,
      admissionFee: '₹25,000 – ₹45,000',
      cautionDeposit: '₹8,000 – ₹10,000 (Refundable)',
      refundableSecurity: '₹8,000 – ₹10,000',
      tuitionMonthly: null,
      tuitionQuarterly: '₹21,000 – ₹29,250',
      tuitionAnnual: '₹84,000 – ₹1,17,000 (Calculated)',
      transportMonthly: null,
      transportQuarterly: '₹9,900 – ₹15,000 (Optional)',
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration / Application', amount: 1000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: '₹25,000 – ₹45,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Caution Deposit', amount: '₹8,000 – ₹10,000', frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: true, refundable: true },
        { name: 'Quarterly Composite Tuition', amount: '₹21,000 – ₹29,250', frequency: 'quarterly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Quarterly Transport (Optional)', amount: '₹9,900 – ₹15,000', frequency: 'quarterly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionQuarterly: '₹21,000 – ₹29,250', tuitionAnnual: '₹84,000 – ₹1,17,000', calculationNotes: 'Calculated annual equivalent range: quarterly × 4.' }
      ],
      concessions: [],
      disclaimer: 'Quarterly composite: ₹21,000–₹29,250 (calculated annual ₹84,000–₹1,17,000). Registration ₹1,000, Admission ₹25,000–₹45,000, Refundable caution ₹8,000–₹10,000. Optional quarterly transport ₹9,900–₹15,000.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '26. Sparsh Global forensic fix' });
  }
}

// 27. LPS GLOBAL SCHOOL (If present or searched)
{
  const s = findSchool('lps-global-school-sector-51-noida') || schools.find(sch => sch.slug.includes('lps') || sch.name.includes('LPS Global'));
  if (s) {
    s.location.address = 'D-196/2, Sector 51, Noida, UP 201301';
    s.affiliationNumber = '2133139';
    s.cbseAffiliationNumber = '2133139';
    s.studentTeacherRatio = 'Conflicting sources: 18:1–25:1 vs official disclosure 1:40 (requires verification)';
    s.fees = {
      isVerified: true,
      cardFee: 9000,
      currency: 'INR',
      rangeText: '₹9,000 – ₹11,000 / month (Annual charges: ~₹20,000)',
      registrationFee: 950,
      admissionFee: 40000,
      cautionDeposit: 22000,
      refundableSecurity: 22000,
      tuitionMonthly: '₹9,000 – ₹11,000',
      tuitionAnnual: '₹1,08,000 – ₹1,32,000 (Calculated)',
      transportMonthly: '₹2,600 – ₹5,200 (Optional)',
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 950, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: 40000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Caution Money', amount: 22000, frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: true, refundable: true },
        { name: 'Annual Charges', amount: 20000, frequency: 'annual', type: 'recurring', isMandatory: true, isOfficial: false, description: 'Approximate annual charges.' },
        { name: 'Transport (Optional)', amount: '₹2,600 – ₹5,200', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionMonthly: '₹9,000 – ₹11,000', tuitionAnnual: '₹1,08,000 – ₹1,32,000', calculationNotes: 'Calculated annual: ₹9,000 × 12 to ₹11,000 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Located in Sector 51 Noida (not Greater Noida West). Tuition: ₹9,000–₹11,000/month, Annual charges approx ₹20,000. Registration ₹950, Admission ₹40,000, Refundable Caution ₹22,000. Optional transport ₹2,600–₹5,200/month.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '27. LPS Global forensic fix' });
  }
}

// 28. SETH ANANDRAM JAIPURIA SCHOOL
{
  const s = findSchool('seth-anandram-jaipuria-school-greater-noida-west');
  if (s) {
    s.affiliationNumber = '2134145';
    s.cbseAffiliationNumber = '2134145';
    s.location.address = 'Plot No 2A & 2B, Chauganpur, Knowledge Park V, Greater Noida, UP 201306';
    s.admissions.process = '2027–28 admissions expected late 2026/early 2027.';
    s.fees = {
      isVerified: false,
      cardFee: 102800,
      currency: 'INR',
      rangeText: '₹1,02,800 – ₹1,27,050 / year (Estimated annual totals; not officially verified)',
      registrationFee: '₹1,000 – ₹2,000',
      admissionFee: 'Up to ₹45,000',
      cautionDeposit: '₹5,000 – ₹7,500 (Refundable)',
      refundableSecurity: '₹5,000 – ₹7,500',
      tuitionMonthly: null,
      tuitionAnnual: '₹1,02,800 – ₹1,27,050 (Estimated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'estimated_historical',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: '₹1,000 – ₹2,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false },
        { name: 'Admission Fee', amount: 'Up to ₹45,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false },
        { name: 'Security Deposit', amount: '₹5,000 – ₹7,500', frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: false, refundable: true },
        { name: 'Exam Fee', amount: 2500, frequency: 'annual', type: 'recurring', isMandatory: true, isOfficial: false, description: '₹2,500 annually.' }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nur–UKG', tuitionAnnual: 102800, totalAnnual: 102800, notes: 'Estimated annual total.' },
        { grades: 'Classes I–VIII', tuitionAnnual: 113850, totalAnnual: 113850, notes: 'Estimated annual total.' },
        { grades: 'Classes IX–X', tuitionAnnual: 125150, totalAnnual: 125150, notes: 'Estimated annual total.' },
        { grades: 'Classes XI–XII', tuitionAnnual: 127050, totalAnnual: 127050, notes: 'Estimated annual total.' }
      ],
      concessions: [],
      disclaimer: 'IMPORTANT: Estimated annual totals (Pre-Nur–UKG ₹1,02,800, I–VIII ₹1,13,850, IX–X ₹1,25,150, XI–XII ₹1,27,050). Not officially verified. Registration ₹1,000–₹2,000, Admission up to ₹45,000, Refundable security ₹5,000–₹7,500, Exam ₹2,500/yr.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '28. Seth Anandram Jaipuria forensic fix' });
  }
}

// 29. GAGAN PUBLIC SCHOOL
{
  const s = findSchool('gagan-public-school-sector-4');
  if (s) {
    s.location.address = 'Plot HS 1, near Gaur City 1, Sector 4, Greater Noida, Ghaziabad, UP 201318';
    // Retain verified affiliation 2132338 with note on 2132689
    s.affiliationNumber = '2132338';
    s.cbseAffiliationNumber = '2132338';
    s.auditNotes = s.auditNotes || [];
    s.auditNotes.push('Affiliation 2132338 confirmed from verified source metadata; secondary source mentions 2132689.');
    s.fees = {
      isVerified: true,
      cardFee: 5450,
      currency: 'INR',
      rangeText: '₹5,450 – ₹6,800 / month (Estimated 1st-year total: ₹48,800 – ₹89,400)',
      registrationFee: 5000,
      admissionFee: '₹16,000 – ₹22,000',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹5,450 – ₹6,800',
      tuitionAnnual: '₹65,400 – ₹81,600 (Calculated)',
      transportMonthly: '₹1,300 – ₹2,900',
      transportAnnual: null,
      estimatedFirstYear: '₹48,800 – ₹89,400 (Estimated / Calculated)',
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Prospectus', amount: 500, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Registration Fee', amount: 5000, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Admission Fee', amount: '₹16,000 – ₹22,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true, refundable: false },
        { name: 'Monthly Tuition / Composite', amount: '₹5,450 – ₹6,800', frequency: 'monthly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Transport (Optional)', amount: '₹1,300 – ₹2,900', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionMonthly: '₹5,450 – ₹6,800', tuitionAnnual: '₹65,400 – ₹81,600', calculationNotes: 'Calculated annual: ₹5,450 × 12 to ₹6,800 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Monthly tuition: ₹5,450–₹6,800. Prospectus ₹500, Registration ₹5,000, Admission ₹16,000–₹22,000. Transport ₹1,300–₹2,900/month. Estimated 1st-year total: ₹48,800–₹89,400.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '29. Gagan Public School forensic fix' });
  }
}

// 30. INDIRAPURAM PUBLIC SCHOOL — CROSSINGS REPUBLIK
{
  const s = findSchool('indirapuram-public-school-crossings-republik');
  if (s) {
    s.affiliationNumber = '2132548';
    s.cbseAffiliationNumber = '2132548';
    s.studentTeacherRatio = 'approx 14:1';
    s.fees = {
      isVerified: true,
      cardFee: 9768,
      currency: 'INR',
      rangeText: '₹9,768 – ₹10,328 / month composite (Nur–UKG: ₹10,328 | I: ₹9,984 | II–VI: ₹9,860 | VII: ₹10,012 | VIII–X: ₹10,204 | XI–XII: ₹9,768)',
      registrationFee: null,
      admissionFee: null,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹9,768 – ₹10,328',
      tuitionAnnual: '₹1,17,216 – ₹1,23,936 (Calculated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Exam Fee', amount: '₹354 / month (₹1,062 / quarter)', frequency: 'monthly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Optional Lab Fee (XI–XII CS / AI)', amount: '₹836 / month (₹2,508 / quarter)', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true },
        { name: 'Optional Lab Fee (XI–XII Physics/Chem/Bio)', amount: '₹536 / month', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'Nursery / LKG / UKG', tuitionMonthly: 10328, tuitionAnnual: 123936, isOfficial: true, calculationNotes: 'Calculated annual: ₹10,328 × 12.' },
        { grades: 'Class I', tuitionMonthly: 9984, tuitionAnnual: 119808, isOfficial: true, calculationNotes: 'Calculated annual: ₹9,984 × 12.' },
        { grades: 'Classes II–VI', tuitionMonthly: 9860, tuitionAnnual: 118320, isOfficial: true, calculationNotes: 'Calculated annual: ₹9,860 × 12.' },
        { grades: 'Class VII', tuitionMonthly: 10012, tuitionAnnual: 120144, isOfficial: true, calculationNotes: 'Calculated annual: ₹10,012 × 12.' },
        { grades: 'Classes VIII–X', tuitionMonthly: 10204, tuitionAnnual: 122448, isOfficial: true, calculationNotes: 'Calculated annual: ₹10,204 × 12.' },
        { grades: 'Classes XI–XII', tuitionMonthly: 9768, tuitionAnnual: 117216, isOfficial: true, calculationNotes: 'Calculated annual: ₹9,768 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Official monthly composite: Nursery–UKG ₹10,328, I ₹9,984, II–VI ₹9,860, VII ₹10,012, VIII–X ₹10,204, XI–XII ₹9,768. Exam fee ₹354/month (₹1,062/quarter). Optional XI–XII labs: CS/AI ₹836/month (₹2,508/quarter), PCB ₹536/month.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '30. Indirapuram Public School forensic fix' });
  }
}

// 31. SAPPHIRE INTERNATIONAL — CROSSINGS REPUBLIK
{
  const s = findSchool('sapphire-international-school-crossings-republik');
  if (s) {
    s.affiliationNumber = '2133627';
    s.cbseAffiliationNumber = '2133627';
    s.studentTeacherRatio = '15:1';
    s.fees = {
      isVerified: false,
      cardFee: 202100,
      currency: 'INR',
      rangeText: '₹2,02,100 – ₹2,24,900 / year (Estimated grade-wise total; not official)',
      registrationFee: 1500,
      admissionFee: '₹33,000 – ₹40,000',
      cautionDeposit: '₹20,000 – ₹25,000 (Refundable)',
      refundableSecurity: '₹20,000 – ₹25,000',
      tuitionMonthly: null,
      tuitionAnnual: '₹2,02,100 – ₹2,24,900 (Estimated)',
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'estimated_historical',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: 1500, frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false },
        { name: 'Admission Fee', amount: '₹33,000 – ₹40,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: false },
        { name: 'Security Deposit', amount: '₹20,000 – ₹25,000', frequency: 'one_time', type: 'deposit', isMandatory: true, isOfficial: false, refundable: true }
      ],
      gradeWiseTiers: [
        { grades: 'Pre-Nur / EYPL', tuitionAnnual: '~₹2,04,200', notes: 'Estimated annual total.' },
        { grades: 'Nursery / UKG', tuitionAnnual: '~₹2,02,100', notes: 'Estimated annual total.' },
        { grades: 'Classes I–X', tuitionAnnual: '~₹2,08,700', notes: 'Estimated annual total.' },
        { grades: 'Classes XI–XII', tuitionAnnual: '~₹2,24,900', notes: 'Estimated annual total.' }
      ],
      concessions: [],
      disclaimer: 'Estimated annual totals: Pre-Nur ~₹2,04,200, Nursery/UKG ~₹2,02,100, I–X ~₹2,08,700, XI–XII ~₹2,24,900. Registration ₹1,500, Admission ₹33,000–₹40,000, Refundable security ₹20,000–₹25,000. Not officially verified.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '31. Sapphire International forensic fix' });
  }
}

// 32. KAUSHALYA WORLD SCHOOL (If present in dataset)
{
  const s = findSchool('kaushalya-world-school-greater-noida') || schools.find(sch => sch.slug.includes('kaushalya') || sch.name.includes('Kaushalya'));
  if (s) {
    s.affiliationNumber = '2131608';
    s.cbseAffiliationNumber = '2131608';
    s.studentTeacherRatio = 'approx 15:1–20:1';
    s.fees = {
      isVerified: true,
      cardFee: 5000,
      currency: 'INR',
      rangeText: '₹5,000 – ₹5,500 / month (Estimated 1st-year lower classes: ₹70,500 – ₹87,900)',
      registrationFee: '₹500 – ₹700',
      admissionFee: '₹10,000 – ₹30,000',
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: '₹5,000 – ₹5,500',
      tuitionAnnual: '₹60,000 – ₹66,000 (Calculated)',
      transportMonthly: '₹800 – ₹4,000 (Optional)',
      transportAnnual: null,
      estimatedFirstYear: '₹70,500 – ₹87,900 (Estimated)',
      verificationStatus: 'verified_from_source',
      lastVerifiedDate: '2026-09-18',
      components: [
        { name: 'Registration Fee', amount: '₹500 – ₹700', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Admission Fee', amount: '₹10,000 – ₹30,000', frequency: 'one_time', type: 'one_time', isMandatory: true, isOfficial: true },
        { name: 'Monthly Tuition', amount: '₹5,000 – ₹5,500', frequency: 'monthly', type: 'recurring', isMandatory: true, isOfficial: true },
        { name: 'Transport (Optional)', amount: '₹800 – ₹4,000', frequency: 'monthly', type: 'optional', isMandatory: false, isOfficial: true }
      ],
      gradeWiseTiers: [
        { grades: 'All Grades', tuitionMonthly: '₹5,000 – ₹5,500', tuitionAnnual: '₹60,000 – ₹66,000', calculationNotes: 'Calculated annual: ₹5,000 × 12 to ₹5,500 × 12.' }
      ],
      concessions: [],
      disclaimer: 'Monthly tuition: ₹5,000–₹5,500. Registration ₹500–₹700, Admission ₹10,000–₹30,000, Optional transport ₹800–₹4,000/month. Estimated 1st-year lower class range: ₹70,500–₹87,900.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '32. Kaushalya World School forensic fix' });
  }
}

// 33. GOLDEN VALLEY SCHOOL
{
  const s = findSchool('golden-valley-public-school-noida-ext');
  if (s) {
    s.location.address = 'Maripat Road Roza Yakubpur, Roza Jalalpur Village, Greater Noida, UP 201009';
    s.fees = {
      isVerified: false,
      disclosed: false,
      cardFee: null,
      currency: 'INR',
      rangeText: 'Not publicly disclosed',
      registrationFee: null,
      admissionFee: null,
      cautionDeposit: null,
      refundableSecurity: null,
      tuitionMonthly: null,
      tuitionAnnual: null,
      transportMonthly: null,
      transportAnnual: null,
      verificationStatus: 'not_publicly_verified',
      lastVerifiedDate: '2026-09-18',
      components: [],
      gradeWiseTiers: [],
      table: [],
      concessions: [],
      disclaimer: 'Fee structure is not publicly disclosed.'
    };
    audit.push({ name: s.name, slug: s.slug, change: '33. Golden Valley forensic fix' });
  }
}

// Write back to disk
fs.writeFileSync(schoolsPath, JSON.stringify(schools, null, 2), 'utf8');

console.log('Forensic corrections applied cleanly. Updated records:', audit.length);
audit.forEach(a => console.log(`  - ${a.name} (${a.slug}): ${a.change}`));
