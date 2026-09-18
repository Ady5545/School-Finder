const fs = require('fs');
const path = require('path');

const schoolsPath = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

// Format currency helper
function formatINR(val) {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'string') return val;
  return '₹' + val.toLocaleString('en-IN');
}

const correctedSchools = schools.map(school => {
  const slug = school.slug;

  // =========================================================================
  // 1. DELHI PUBLIC SCHOOL, KNOWLEDGE PARK 5
  // =========================================================================
  if (slug === 'delhi-public-school-knowledge-park-5') {
    return {
      ...school,
      board: ['CBSE', 'Cambridge'],
      curriculum: 'CBSE & Cambridge International Curriculum',
      fees: {
        cardFee: 132900,
        estimatedFirstYear: 183900,
        currency: 'INR',
        rangeText: '₹11,075 / month (₹33,225 / quarter · ₹1,32,900 calculated annual)',
        academicSession: '2026–27',
        lastVerifiedDate: 'September 2026',
        verificationStatus: 'verified_from_source',
        isVerified: true,
        disclosed: true,
        comparableAnnualAvailable: true,
        billingFrequency: 'quarterly',
        feeCategory: 'Composite School Fee (Inclusive of Tuition)',
        sourceUrl: 'https://dpskpv.com',
        registrationFee: 1000,
        admissionFee: 50000,
        tuitionMonthly: '11,075',
        tuitionQuarterly: '33,225',
        tuitionAnnual: '1,32,900 (Calculated: ₹11,075/mo × 12)',
        transportMonthly: '3,700 – 4,100',
        transportAnnual: null,
        calculatedAnnualNote: 'Calculated annual composite equivalent is ₹1,32,900 (derived as ₹11,075/month × 12 or ₹33,225/quarter × 4). For Cambridge International Curriculum, additional annual charges of ₹16,200 apply (payable in two installments of ₹8,100 in April and October).',
        disclaimer: 'Composite fee is ₹11,075/month (₹33,225/quarter). Cambridge curriculum includes additional annual charges of ₹16,200 payable in two installments of ₹8,100 (April and October). Science lab charges of ₹4,500/year apply for Classes XI & XII Science. Transport via AC buses is optional. Activities charged as per actuals.',
        footnotes: [
          'Admission fee (₹50,000) and registration fee (₹1,000) are one-time and non-refundable.',
          'Composite fee is ₹11,075 per month (or ₹33,225 quarterly). Annual equivalent of ₹1,32,900 is calculated as ₹11,075 × 12.',
          'Cambridge International Curriculum students pay additional annual charges of ₹16,200 in two installments of ₹8,100 (April and October).',
          'Science laboratory charges of ₹4,500 annually apply to Science stream students of Classes XI & XII.',
          'Transport via AC buses is optional: ₹3,700/month for Greater Noida West and ₹4,100/month for Noida, Greater Noida, Ghaziabad, Indirapuram, and Dadri.',
          'Optional sports academies (Swimming, Cricket, Soccer, Skating, Tennis) are charged as per actuals.'
        ],
        table: [
          { type: 'Registration Fee (One-time, non-refundable)', cost: '1,000' },
          { type: 'Admission Fee (One-time, non-refundable)', cost: '50,000' },
          { type: 'Composite Fee (Monthly, inclusive of tuition)', cost: '11,075 / month' },
          { type: 'Composite Fee (Quarterly)', cost: '33,225 / quarter' },
          { type: 'Cambridge International Stream (Additional Annual Charges)', cost: '16,200 / year (₹8,100 in Apr & Oct)' },
          { type: 'Science Lab Charges (Classes XI & XII Science)', cost: '4,500 / year' },
          { type: 'Transport - Greater Noida West (AC Bus, Optional)', cost: '3,700 / month' },
          { type: 'Transport - Noida / Gr Noida / Ghaziabad / Indirapuram / Dadri (AC Bus, Optional)', cost: '4,100 / month' },
          { type: 'Optional Academies (Swimming, Cricket, Soccer, Skating, Tennis)', cost: 'As per actuals' }
        ],
        components: [
          {
            id: 'dps-reg',
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
            id: 'dps-adm',
            name: 'Admission Fee',
            category: 'one_time',
            amount: 50000,
            formattedAmount: '₹50,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time, non-refundable admission fee.'
          },
          {
            id: 'dps-comp-monthly',
            name: 'Composite Fee (Monthly)',
            category: 'recurring',
            amount: 11075,
            formattedAmount: '₹11,075 / month',
            frequency: 'monthly',
            gradesApplicable: 'Pre-Nursery to Class XII',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Composite Fee per month, inclusive of Tuition Fee.'
          },
          {
            id: 'dps-comp-quarterly',
            name: 'Composite Fee (Quarterly)',
            category: 'recurring',
            amount: 33225,
            formattedAmount: '₹33,225 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Pre-Nursery to Class XII',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Composite Fee if paid quarterly (₹11,075 × 3).'
          },
          {
            id: 'dps-comp-annual',
            name: 'Annual Composite Equivalent (Calculated)',
            category: 'recurring',
            amount: 132900,
            formattedAmount: '₹1,32,900 / year',
            frequency: 'annual',
            gradesApplicable: 'Pre-Nursery to Class XII',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated annual composite equivalent: ₹11,075/month × 12 months = ₹1,32,900/year (or ₹33,225/quarter × 4 quarters).',
            isOfficial: false,
            notes: 'Derived annual equivalent from monthly composite fee.'
          },
          {
            id: 'dps-cambridge-fee',
            name: 'Cambridge International Stream Additional Charges',
            category: 'curriculum_addon',
            amount: 16200,
            formattedAmount: '₹16,200 / year (₹8,100 in Apr & Oct)',
            frequency: 'annual',
            gradesApplicable: 'Cambridge Stream Students',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Additional Annual Charges for Cambridge International Curriculum, payable in two installments of ₹8,100 (April and October).'
          },
          {
            id: 'dps-lab-fee',
            name: 'Science Lab Charges (Classes XI & XII)',
            category: 'lab_facility',
            amount: 4500,
            formattedAmount: '₹4,500 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes XI & XII Science',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Applicable only to Science stream students in Classes XI & XII.'
          },
          {
            id: 'dps-transport-gnw',
            name: 'Transport - Greater Noida West Area (AC Bus)',
            category: 'transport',
            amount: 3700,
            formattedAmount: '₹3,700 / month',
            frequency: 'monthly',
            gradesApplicable: 'Optional for all grades',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'AC Bus transportation for Greater Noida West area.'
          },
          {
            id: 'dps-transport-outer',
            name: 'Transport - Noida / Gr Noida / Ghaziabad / Indirapuram / Dadri (AC Bus)',
            category: 'transport',
            amount: 4100,
            formattedAmount: '₹4,100 / month',
            frequency: 'monthly',
            gradesApplicable: 'Optional for all grades',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'AC Bus transportation for Noida, Greater Noida, Ghaziabad, Indirapuram, and Dadri areas.'
          },
          {
            id: 'dps-academies',
            name: 'Sports & Academy Activities (Optional)',
            category: 'activity',
            amount: null,
            formattedAmount: 'As per actuals',
            frequency: 'per_term',
            gradesApplicable: 'Optional for enrolled students',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Optional sports academies: Swimming, Cricket Academy, Soccer Academy, Skating Academy, Tennis Academy. Charged as per actuals.'
          }
        ],
        gradeWiseTiers: [
          {
            gradeGroup: 'Pre-Nursery to Class XII (CBSE Stream)',
            grades: ['Pre-Nursery', 'Nursery', 'Prep', 'Classes I–XII (CBSE)'],
            tuitionFee: '₹11,075 / month (₹33,225 / quarter)',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,32,900 / year',
            totalAnnualPayable: '₹1,32,900',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated annual composite: ₹11,075 × 12 = ₹1,32,900/yr.'
          },
          {
            gradeGroup: 'Cambridge International Curriculum Stream',
            grades: ['Cambridge Early Years', 'Cambridge Primary', 'Cambridge Lower Secondary', 'Cambridge IGCSE'],
            tuitionFee: '₹11,075 / month + ₹16,200 annual add-on',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,49,100 / year',
            totalAnnualPayable: '₹1,49,100',
            isCalculated: true,
            curriculum: 'Cambridge International',
            notes: 'Includes ₹1,32,900 composite fee (calculated from ₹11,075/mo) + ₹16,200 official additional annual charges (paid in two ₹8,100 installments in April & October).'
          },
          {
            gradeGroup: 'Classes XI & XII (Science Stream with Labs)',
            grades: ['Class XI Science', 'Class XII Science'],
            tuitionFee: '₹11,075 / month + ₹4,500 annual lab fee',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,37,400 / year',
            totalAnnualPayable: '₹1,37,400',
            isCalculated: true,
            curriculum: 'CBSE Senior Secondary',
            notes: 'Includes ₹1,32,900 composite fee + ₹4,500 annual science laboratory charges.'
          }
        ],
        transportSchedule: [
          {
            zone: 'Zone 1: Greater Noida West Local Area',
            distanceSlab: 'Local sector routes',
            areasCovered: ['Greater Noida West / Noida Extension'],
            frequency: 'monthly',
            amount: '₹3,700 / month',
            isOptional: true
          },
          {
            zone: 'Zone 2: Extended NCR Routes',
            distanceSlab: 'Outstation / Inter-city routes',
            areasCovered: ['Noida', 'Greater Noida', 'Ghaziabad', 'Indirapuram', 'Dadri'],
            frequency: 'monthly',
            amount: '₹4,100 / month',
            isOptional: true
          }
        ],
        concessions: [],
        circular: {
          title: 'Delhi Public School Knowledge Park V Official Fee Schedule',
          academicSession: '2026–27',
          circularType: 'web_schedule',
          sourceUrl: 'https://dpskpv.com',
          summary: 'Official fee schedule for DPS Knowledge Park V detailing monthly/quarterly composite fees, Cambridge add-on charges, science lab fees, and AC transport slabs.',
          keyTerms: [
            'Composite fee payable monthly (₹11,075) or quarterly (₹33,225)',
            'Cambridge stream includes ₹16,200 annual charges payable in April and October installments of ₹8,100',
            'Transport by AC buses is optional'
          ],
          officialNotes: [
            'All one-time admission fees are non-refundable.',
            'Activities and sports academy sessions are billed on actuals.'
          ]
        }
      }
    };
  }

  // =========================================================================
  // 2. LOTUS VALLEY INTERNATIONAL SCHOOL — GREATER NOIDA WEST
  // =========================================================================
  if (slug === 'lotus-valley-international-school') {
    return {
      ...school,
      fees: {
        cardFee: 130800,
        estimatedFirstYear: 191800,
        currency: 'INR',
        rangeText: '₹10,900 – ₹13,130 / month (₹32,700 – ₹39,390 / quarter · ₹1,30,800 – ₹1,57,560 calculated annual)',
        academicSession: '2026–27',
        lastVerifiedDate: 'September 2026',
        verificationStatus: 'verified_from_source',
        isVerified: true,
        disclosed: true,
        comparableAnnualAvailable: true,
        billingFrequency: 'quarterly',
        feeCategory: 'Tuition & Composite Monthly Fee',
        sourceUrl: 'https://lotusvalleyne.com',
        registrationFee: 1000,
        admissionFee: 50000,
        tuitionMonthly: '10,900 – 13,130',
        tuitionQuarterly: '32,700 – 39,390',
        tuitionAnnual: '1,30,800 – 1,57,560 (Calculated from monthly/quarterly)',
        transportMonthly: 'Route-dependent',
        transportAnnual: null,
        calculatedAnnualNote: 'Annual values are calculated equivalents derived from supplied monthly/quarterly figures: Nursery–V (₹10,900/mo = ₹1,30,800/yr), VI–X (₹11,370/mo = ₹1,36,440/yr), XI–XII Comm/Hum (₹12,850/mo = ₹1,54,200/yr), XI–XII Science (₹13,130/mo = ₹1,57,560/yr).',
        disclaimer: 'Caution money of ₹10,000 is refundable upon withdrawal and clearance. Admission fee (₹50,000) and registration fee (₹1,000) are non-refundable. Transport is optional and calculated dynamically by route/distance.',
        footnotes: [
          'Registration fee (₹1,000) and admission fee (₹50,000) are one-time and non-refundable.',
          'Caution money of ₹10,000 is one-time and refundable upon student withdrawal and clearance.',
          'Tuition fee is payable monthly/quarterly. Annual amounts are calculated equivalents.',
          'Transport fee is optional and dynamically calculated according to route and distance.'
        ],
        table: [
          { type: 'Registration Fee (One-time, non-refundable)', cost: '1,000' },
          { type: 'Admission Fee (One-time, non-refundable)', cost: '50,000' },
          { type: 'Caution Money (One-time, refundable)', cost: '10,000' },
          { type: 'Tuition Fee – Nursery to Grade V', cost: '10,900 / month (₹32,700 / quarter · ₹1,30,800 / year calculated)' },
          { type: 'Tuition Fee – Grades VI to X', cost: '11,370 / month (₹34,110 / quarter · ₹1,36,440 / year calculated)' },
          { type: 'Tuition Fee – Grades XI & XII (Commerce & Humanities)', cost: '12,850 / month (₹38,550 / quarter · ₹1,54,200 / year calculated)' },
          { type: 'Tuition Fee – Grades XI & XII (Science)', cost: '13,130 / month (₹39,390 / quarter · ₹1,57,560 / year calculated)' },
          { type: 'Transport (Optional)', cost: 'Dynamically calculated according to route/distance' }
        ],
        components: [
          {
            id: 'lv-reg',
            name: 'Registration Fee',
            category: 'one_time',
            amount: 1000,
            formattedAmount: '₹1,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time registration fee for Greater Noida West campus.'
          },
          {
            id: 'lv-adm',
            name: 'Admission Fee',
            category: 'one_time',
            amount: 50000,
            formattedAmount: '₹50,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time non-refundable admission fee.'
          },
          {
            id: 'lv-caution',
            name: 'Caution Money (Security Deposit)',
            category: 'deposit',
            amount: 10000,
            formattedAmount: '₹10,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: true,
            isOfficial: true,
            notes: 'One-time refundable security caution deposit returned upon student withdrawal and clearance.'
          },
          {
            id: 'lv-tuition-nur-v-qtr',
            name: 'Tuition Fee – Nursery to Grade V (Quarterly)',
            category: 'recurring',
            amount: 32700,
            formattedAmount: '₹32,700 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Nursery to Grade V',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly tuition (₹10,900/month).'
          },
          {
            id: 'lv-tuition-nur-v-ann',
            name: 'Tuition Fee – Nursery to Grade V (Calculated Annual)',
            category: 'recurring',
            amount: 130800,
            formattedAmount: '₹1,30,800 / year',
            frequency: 'annual',
            gradesApplicable: 'Nursery to Grade V',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹10,900/month × 12 months = ₹1,30,800/year (or ₹32,700/quarter × 4 quarters).',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'lv-tuition-vi-x-qtr',
            name: 'Tuition Fee – Grades VI to X (Quarterly)',
            category: 'recurring',
            amount: 34110,
            formattedAmount: '₹34,110 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Grades VI to X',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly tuition (₹11,370/month).'
          },
          {
            id: 'lv-tuition-vi-x-ann',
            name: 'Tuition Fee – Grades VI to X (Calculated Annual)',
            category: 'recurring',
            amount: 136440,
            formattedAmount: '₹1,36,440 / year',
            frequency: 'annual',
            gradesApplicable: 'Grades VI to X',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹11,370/month × 12 months = ₹1,36,440/year (or ₹34,110/quarter × 4 quarters).',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'lv-tuition-xi-xii-comm-qtr',
            name: 'Tuition Fee – Grades XI & XII Commerce & Humanities (Quarterly)',
            category: 'recurring',
            amount: 38550,
            formattedAmount: '₹38,550 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Grades XI & XII Commerce / Arts',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly tuition (₹12,850/month).'
          },
          {
            id: 'lv-tuition-xi-xii-comm-ann',
            name: 'Tuition Fee – Grades XI & XII Commerce & Humanities (Calculated Annual)',
            category: 'recurring',
            amount: 154200,
            formattedAmount: '₹1,54,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Grades XI & XII Commerce / Arts',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹12,850/month × 12 months = ₹1,54,200/year (or ₹38,550/quarter × 4 quarters).',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'lv-tuition-xi-xii-sci-qtr',
            name: 'Tuition Fee – Grades XI & XII Science (Quarterly)',
            category: 'recurring',
            amount: 39390,
            formattedAmount: '₹39,390 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Grades XI & XII Science',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly tuition (₹13,130/month).'
          },
          {
            id: 'lv-tuition-xi-xii-sci-ann',
            name: 'Tuition Fee – Grades XI & XII Science (Calculated Annual)',
            category: 'recurring',
            amount: 157560,
            formattedAmount: '₹1,57,560 / year',
            frequency: 'annual',
            gradesApplicable: 'Grades XI & XII Science',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹13,130/month × 12 months = ₹1,57,560/year (or ₹39,390/quarter × 4 quarters).',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'lv-transport',
            name: 'Transport Service (Optional)',
            category: 'transport',
            amount: null,
            formattedAmount: 'Distance-based route calculation',
            frequency: 'monthly',
            gradesApplicable: 'Optional for all students',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Dynamically calculated according to route and distance.'
          }
        ],
        gradeWiseTiers: [
          {
            gradeGroup: 'Nursery to Grade V',
            grades: ['Nursery', 'KG', 'Grades I–V'],
            tuitionFee: '₹10,900 / month (₹32,700 / quarter)',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,30,800 / year',
            totalAnnualPayable: '₹1,30,800',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated as ₹10,900/mo × 12 = ₹1,30,800/yr.'
          },
          {
            gradeGroup: 'Grades VI to X',
            grades: ['Grades VI–X'],
            tuitionFee: '₹11,370 / month (₹34,110 / quarter)',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,36,440 / year',
            totalAnnualPayable: '₹1,36,440',
            isCalculated: true,
            curriculum: 'CBSE Secondary',
            notes: 'Calculated as ₹11,370/mo × 12 = ₹1,36,440/yr.'
          },
          {
            gradeGroup: 'Grades XI & XII (Commerce & Humanities)',
            grades: ['Grade XI Commerce/Arts', 'Grade XII Commerce/Arts'],
            tuitionFee: '₹12,850 / month (₹38,550 / quarter)',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,54,200 / year',
            totalAnnualPayable: '₹1,54,200',
            isCalculated: true,
            curriculum: 'CBSE Senior Secondary',
            notes: 'Calculated as ₹12,850/mo × 12 = ₹1,54,200/yr.'
          },
          {
            gradeGroup: 'Grades XI & XII (Science)',
            grades: ['Grade XI Science', 'Grade XII Science'],
            tuitionFee: '₹13,130 / month (₹39,390 / quarter)',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,57,560 / year',
            totalAnnualPayable: '₹1,57,560',
            isCalculated: true,
            curriculum: 'CBSE Senior Secondary',
            notes: 'Calculated as ₹13,130/mo × 12 = ₹1,57,560/yr.'
          }
        ],
        concessions: [],
        circular: {
          title: 'Lotus Valley International School Detailed Fee Schedule',
          academicSession: '2026–27',
          circularType: 'web_schedule',
          sourceUrl: 'https://lotusvalleyne.com',
          summary: 'Official fee policy for Lotus Valley International School Greater Noida West detailing monthly/quarterly tuition, admission charges, and refundable caution deposit.',
          keyTerms: [
            'Tuition fee payable monthly or quarterly',
            'Caution deposit refundable on student withdrawal',
            'Transport charges calculated dynamically by distance'
          ],
          officialNotes: [
            'Security caution deposit of ₹10,000 is refundable upon institutional clearance.'
          ]
        }
      }
    };
  }

  // =========================================================================
  // 3. PACIFIC WORLD SCHOOL
  // =========================================================================
  if (slug === 'pacific-world-school-techzone-4') {
    return {
      ...school,
      fees: {
        cardFee: 145200,
        estimatedFirstYear: 191400,
        currency: 'INR',
        rangeText: '₹36,300 – ₹45,300 / quarter (₹1,45,200 – ₹1,81,200 calculated annual)',
        academicSession: '2026–27',
        lastVerifiedDate: 'September 2026',
        verificationStatus: 'verified_from_source',
        isVerified: true,
        disclosed: true,
        comparableAnnualAvailable: true,
        billingFrequency: 'quarterly',
        feeCategory: 'Quarterly Tuition Fee',
        sourceUrl: 'https://pacificworldschool.com',
        registrationFee: 1200,
        admissionFee: 45000,
        tuitionMonthly: null,
        tuitionQuarterly: '36,300 – 45,300',
        tuitionAnnual: '1,45,200 – 1,81,200 (Calculated: quarterly × 4)',
        transportMonthly: 'Varies by distance',
        transportAnnual: null,
        calculatedAnnualNote: 'Annual tuition figures are calculated equivalents derived from official quarterly rates: Nursery–II (₹36,300/qtr × 4 = ₹1,45,200/yr), III–IX & XI (₹37,800/qtr × 4 = ₹1,51,200/yr), Cambridge CP-2 to LS-3 (₹45,300/qtr × 4 = ₹1,81,200/yr).',
        disclaimer: 'Tuition fee is payable quarterly in advance. Transport varies according to distance (bus fee may increase by up to 10%). Sibling admission fee of ₹25,000 is available under school criteria. Uniform, books, and stationery charged on actual usage. Late fee of ₹20/day and cheque bounce charge of ₹400 apply where applicable.',
        footnotes: [
          'Registration fee (₹1,200) and admission fee (₹45,000) are one-time and non-refundable.',
          'Sibling admission fee is ₹25,000 where applicable under the school\'s criteria.',
          'Tuition fee is payable quarterly in advance. Annual amounts are calculated as 4 × quarterly fee.',
          'Transport fee varies according to distance; bus fee may increase by up to 10%.',
          'Uniform, books, and stationery are charged on actual usage.',
          'Late fee of ₹20/day after due date and cheque bounce charge of ₹400 apply where applicable.'
        ],
        table: [
          { type: 'Registration Fee (One-time, non-refundable)', cost: '1,200' },
          { type: 'Admission Fee (One-time, non-refundable)', cost: '45,000' },
          { type: 'Sibling Admission Fee (Where applicable)', cost: '25,000' },
          { type: 'Tuition Fee – Nursery to Class II', cost: '36,300 / quarter (₹1,45,200 / year calculated)' },
          { type: 'Tuition Fee – Classes III to IX', cost: '37,800 / quarter (₹1,51,200 / year calculated)' },
          { type: 'Tuition Fee – Class XI', cost: '37,800 / quarter (₹1,51,200 / year calculated)' },
          { type: 'Cambridge Curriculum (CP-2 to LS-3)', cost: '45,300 / quarter (₹1,81,200 / year calculated)' },
          { type: 'Transport (Optional)', cost: 'Varies according to distance (may increase up to 10%)' },
          { type: 'Additional Policies', cost: 'Late fee ₹20/day; Cheque bounce ₹400; Uniform/books on actuals' }
        ],
        components: [
          {
            id: 'pacific-reg',
            name: 'Registration Fee',
            category: 'one_time',
            amount: 1200,
            formattedAmount: '₹1,200',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time registration fee.'
          },
          {
            id: 'pacific-adm',
            name: 'Admission Fee',
            category: 'one_time',
            amount: 45000,
            formattedAmount: '₹45,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time, non-refundable admission fee.'
          },
          {
            id: 'pacific-sibling-adm',
            name: 'Sibling Admission Fee (Concession)',
            category: 'one_time',
            amount: 25000,
            formattedAmount: '₹25,000',
            frequency: 'one_time',
            gradesApplicable: 'Sibling Enrolments',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Special admission fee for siblings where applicable under school criteria.'
          },
          {
            id: 'pacific-tuition-nur-ii-qtr',
            name: 'Tuition Fee – Nursery to Class II (Quarterly)',
            category: 'recurring',
            amount: 36300,
            formattedAmount: '₹36,300 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Nursery to Class II',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Payable quarterly in advance.'
          },
          {
            id: 'pacific-tuition-nur-ii-ann',
            name: 'Tuition Fee – Nursery to Class II (Calculated Annual)',
            category: 'recurring',
            amount: 145200,
            formattedAmount: '₹1,45,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Nursery to Class II',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹36,300 quarterly × 4 quarters = ₹1,45,200 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'pacific-tuition-iii-ix-qtr',
            name: 'Tuition Fee – Classes III to IX (Quarterly)',
            category: 'recurring',
            amount: 37800,
            formattedAmount: '₹37,800 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Classes III to IX',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Payable quarterly in advance.'
          },
          {
            id: 'pacific-tuition-iii-ix-ann',
            name: 'Tuition Fee – Classes III to IX (Calculated Annual)',
            category: 'recurring',
            amount: 151200,
            formattedAmount: '₹1,51,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes III to IX',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹37,800 quarterly × 4 quarters = ₹1,51,200 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'pacific-tuition-xi-qtr',
            name: 'Tuition Fee – Class XI (Quarterly)',
            category: 'recurring',
            amount: 37800,
            formattedAmount: '₹37,800 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Class XI',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Payable quarterly in advance.'
          },
          {
            id: 'pacific-tuition-xi-ann',
            name: 'Tuition Fee – Class XI (Calculated Annual)',
            category: 'recurring',
            amount: 151200,
            formattedAmount: '₹1,51,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Class XI',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹37,800 quarterly × 4 quarters = ₹1,51,200 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'pacific-cambridge-qtr',
            name: 'Cambridge Curriculum CP-2 to LS-3 (Quarterly)',
            category: 'recurring',
            amount: 45300,
            formattedAmount: '₹45,300 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Cambridge CP-2 to LS-3',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Quarterly fee for Cambridge Curriculum (CP-2 to LS-3).'
          },
          {
            id: 'pacific-cambridge-ann',
            name: 'Cambridge Curriculum CP-2 to LS-3 (Calculated Annual)',
            category: 'recurring',
            amount: 181200,
            formattedAmount: '₹1,81,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Cambridge CP-2 to LS-3',
            mandatory: false,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹45,300 quarterly × 4 quarters = ₹1,81,200 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'pacific-transport',
            name: 'Transport Service (Optional)',
            category: 'transport',
            amount: null,
            formattedAmount: 'Varies according to distance',
            frequency: 'monthly',
            gradesApplicable: 'Optional for all grades',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Transport fee varies by route/distance. Bus fee may increase by up to 10%.'
          }
        ],
        gradeWiseTiers: [
          {
            gradeGroup: 'Nursery to Class II',
            grades: ['Nursery', 'KG', 'Class I', 'Class II'],
            tuitionFee: '₹36,300 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,45,200 / year',
            totalAnnualPayable: '₹1,45,200',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated as ₹36,300 × 4 = ₹1,45,200/yr.'
          },
          {
            gradeGroup: 'Classes III to IX',
            grades: ['Classes III–IX'],
            tuitionFee: '₹37,800 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,51,200 / year',
            totalAnnualPayable: '₹1,51,200',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated as ₹37,800 × 4 = ₹1,51,200/yr.'
          },
          {
            gradeGroup: 'Class XI',
            grades: ['Class XI'],
            tuitionFee: '₹37,800 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,51,200 / year',
            totalAnnualPayable: '₹1,51,200',
            isCalculated: true,
            curriculum: 'CBSE Senior Secondary',
            notes: 'Calculated as ₹37,800 × 4 = ₹1,51,200/yr.'
          },
          {
            gradeGroup: 'Cambridge Curriculum (CP-2 to LS-3)',
            grades: ['CP-2', 'CP-3', 'CP-4', 'CP-5', 'LS-1', 'LS-2', 'LS-3'],
            tuitionFee: '₹45,300 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,81,200 / year',
            totalAnnualPayable: '₹1,81,200',
            isCalculated: true,
            curriculum: 'Cambridge International',
            notes: 'Calculated as ₹45,300 × 4 = ₹1,81,200/yr.'
          }
        ],
        concessions: [
          {
            title: 'Sibling Admission Concession',
            category: 'sibling',
            discountDescription: 'Sibling Admission Fee: ₹25,000 (instead of ₹45,000 standard admission fee)',
            eligibilityCriteria: 'Where applicable under school criteria for concurrent sibling enrolment.',
            isOfficial: true
          }
        ],
        circular: {
          title: 'Pacific World School Official Fee Schedule',
          academicSession: '2026–27',
          circularType: 'web_schedule',
          sourceUrl: 'https://pacificworldschool.com',
          summary: 'Official fee structure for Pacific World School covering quarterly tuition, one-time charges, Cambridge stream rates, and optional services.',
          keyTerms: [
            'Payment due quarterly in advance',
            'Sibling admission concession available (₹25,000)',
            'Late fee of ₹20/day after due date and cheque bounce charge of ₹400'
          ],
          officialNotes: [
            'Bus fee may increase by up to 10% during the session.'
          ]
        }
      }
    };
  }

  // =========================================================================
  // 4. SKS WORLD SCHOOL — GREATER NOIDA WEST
  // =========================================================================
  if (slug === 'sks-world-school-greater-noida-west') {
    return {
      ...school,
      fees: {
        cardFee: 91200,
        estimatedFirstYear: 132300,
        currency: 'INR',
        rangeText: '₹91,200 – ₹1,06,200 / year (₹22,800 – ₹26,550 / quarter)',
        academicSession: '2026–27',
        lastVerifiedDate: 'September 2026',
        verificationStatus: 'verified_from_source',
        isVerified: true,
        disclosed: true,
        comparableAnnualAvailable: true,
        billingFrequency: 'quarterly',
        feeCategory: 'Composite Annual Fee',
        sourceUrl: 'https://sksworldschool.com',
        registrationFee: 1100,
        admissionFee: 40000,
        tuitionMonthly: null,
        tuitionQuarterly: '22,800 – 26,550',
        tuitionAnnual: '91,200 – 1,06,200',
        transportMonthly: 'Distance-based',
        transportAnnual: null,
        calculatedAnnualNote: 'Published composite fee structure payable quarterly or annually across grade tiers: Pre-Nur–Prep (₹91,200/yr · ₹22,800/qtr), Classes I–V (₹93,600/yr · ₹23,400/qtr), Classes VI–VIII (₹98,400/yr · ₹24,600/qtr), Classes IX–X (₹1,06,200/yr · ₹26,550/qtr).',
        disclaimer: 'Composite fee is payable quarterly as published. Prospectus & registration fee (₹1,100) and admission processing fee (₹40,000) are one-time non-refundable fees. Transport is optional and charged based on distance.',
        footnotes: [
          'Prospectus & registration fee (₹1,100) and admission processing fee (₹40,000) are one-time and non-refundable.',
          'Composite fees are payable quarterly or annually as specified.',
          'Transport is optional and charges vary based on distance.'
        ],
        table: [
          { type: 'Prospectus + Registration Fee (One-time, non-refundable)', cost: '1,100' },
          { type: 'Admission Processing Fee (One-time, non-refundable)', cost: '40,000' },
          { type: 'Composite Fee – Pre-Nursery to Prep', cost: '91,200 / year (₹22,800 / quarter)' },
          { type: 'Composite Fee – Classes I to V', cost: '93,600 / year (₹23,400 / quarter)' },
          { type: 'Composite Fee – Classes VI to VIII', cost: '98,400 / year (₹24,600 / quarter)' },
          { type: 'Composite Fee – Classes IX to X', cost: '1,06,200 / year (₹26,550 / quarter)' },
          { type: 'Transport (Optional)', cost: 'Distance-based route calculation' }
        ],
        components: [
          {
            id: 'sks-reg',
            name: 'Prospectus & Registration Fee',
            category: 'one_time',
            amount: 1100,
            formattedAmount: '₹1,100',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time, non-refundable prospectus and registration fee.'
          },
          {
            id: 'sks-adm',
            name: 'Admission Processing Fee',
            category: 'one_time',
            amount: 40000,
            formattedAmount: '₹40,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time, non-refundable admission processing fee.'
          },
          {
            id: 'sks-comp-pre-nur-prep-qtr',
            name: 'Composite Fee – Pre-Nursery to Prep (Quarterly)',
            category: 'recurring',
            amount: 22800,
            formattedAmount: '₹22,800 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Pre-Nursery to Prep',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly composite fee.'
          },
          {
            id: 'sks-comp-pre-nur-prep-ann',
            name: 'Composite Fee – Pre-Nursery to Prep (Annual)',
            category: 'recurring',
            amount: 91200,
            formattedAmount: '₹91,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Pre-Nursery to Prep',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official annual composite fee.'
          },
          {
            id: 'sks-comp-i-v-qtr',
            name: 'Composite Fee – Classes I to V (Quarterly)',
            category: 'recurring',
            amount: 23400,
            formattedAmount: '₹23,400 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Classes I to V',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly composite fee.'
          },
          {
            id: 'sks-comp-i-v-ann',
            name: 'Composite Fee – Classes I to V (Annual)',
            category: 'recurring',
            amount: 93600,
            formattedAmount: '₹93,600 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes I to V',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official annual composite fee.'
          },
          {
            id: 'sks-comp-vi-viii-qtr',
            name: 'Composite Fee – Classes VI to VIII (Quarterly)',
            category: 'recurring',
            amount: 24600,
            formattedAmount: '₹24,600 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Classes VI to VIII',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly composite fee.'
          },
          {
            id: 'sks-comp-vi-viii-ann',
            name: 'Composite Fee – Classes VI to VIII (Annual)',
            category: 'recurring',
            amount: 98400,
            formattedAmount: '₹98,400 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes VI to VIII',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official annual composite fee.'
          },
          {
            id: 'sks-comp-ix-x-qtr',
            name: 'Composite Fee – Classes IX to X (Quarterly)',
            category: 'recurring',
            amount: 26550,
            formattedAmount: '₹26,550 / quarter',
            frequency: 'quarterly',
            gradesApplicable: 'Classes IX to X',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official quarterly composite fee.'
          },
          {
            id: 'sks-comp-ix-x-ann',
            name: 'Composite Fee – Classes IX to X (Annual)',
            category: 'recurring',
            amount: 106200,
            formattedAmount: '₹1,06,200 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes IX to X',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official annual composite fee.'
          },
          {
            id: 'sks-transport',
            name: 'Transport Service (Optional)',
            category: 'transport',
            amount: null,
            formattedAmount: 'Distance-based route calculation',
            frequency: 'monthly',
            gradesApplicable: 'Optional for all grades',
            mandatory: false,
            refundable: false,
            isOfficial: true,
            notes: 'Optional transport charged as per route.'
          }
        ],
        gradeWiseTiers: [
          {
            gradeGroup: 'Pre-Nursery to Prep',
            grades: ['Pre-Nursery', 'Nursery', 'Prep'],
            tuitionFee: '₹22,800 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹91,200 / year',
            totalAnnualPayable: '₹91,200',
            isCalculated: false,
            curriculum: 'CBSE',
            notes: 'Official annual fee: ₹91,200 (₹22,800/quarter).'
          },
          {
            gradeGroup: 'Classes I to V',
            grades: ['Classes I–V'],
            tuitionFee: '₹23,400 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹93,600 / year',
            totalAnnualPayable: '₹93,600',
            isCalculated: false,
            curriculum: 'CBSE',
            notes: 'Official annual fee: ₹93,600 (₹23,400/quarter).'
          },
          {
            gradeGroup: 'Classes VI to VIII',
            grades: ['Classes VI–VIII'],
            tuitionFee: '₹24,600 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹98,400 / year',
            totalAnnualPayable: '₹98,400',
            isCalculated: false,
            curriculum: 'CBSE',
            notes: 'Official annual fee: ₹98,400 (₹24,600/quarter).'
          },
          {
            gradeGroup: 'Classes IX to X',
            grades: ['Classes IX–X'],
            tuitionFee: '₹26,550 / quarter',
            tuitionFrequency: 'quarterly',
            calculatedAnnualEquivalent: '₹1,06,200 / year',
            totalAnnualPayable: '₹1,06,200',
            isCalculated: false,
            curriculum: 'CBSE',
            notes: 'Official annual fee: ₹1,06,200 (₹26,550/quarter).'
          }
        ],
        concessions: [],
        circular: {
          title: 'SKS World School Official Fee Schedule',
          academicSession: '2026–27',
          circularType: 'web_schedule',
          sourceUrl: 'https://sksworldschool.com',
          summary: 'Official published fee structure for SKS World School Greater Noida West covering grade-wise quarterly/annual composite fees and one-time admission charges.',
          keyTerms: [
            'Composite fees payable quarterly or annually',
            'Registration and admission processing fees are non-refundable'
          ],
          officialNotes: [
            'Transport is optional and calculated as per distance slab.'
          ]
        }
      }
    };
  }

  // =========================================================================
  // 5. INDUS VALLEY PUBLIC SCHOOL — SECTOR 62, NOIDA
  // =========================================================================
  if (slug === 'indus-valley-school-noida-ext') {
    return {
      ...school,
      summary: 'Indus Valley Public School in Sector 62, Noida, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.',
      location: {
        ...school.location,
        address: 'Sector 62, Noida, Uttar Pradesh 201301',
        sector: 'Sector 62',
        city: 'Noida',
        area: 'Noida',
        pincode: '201301',
        mapSearchQuery: 'Indus Valley Public School Sector 62 Noida'
      },
      fees: {
        cardFee: 128400,
        estimatedFirstYear: 198400,
        currency: 'INR',
        rangeText: '₹10,700 – ₹12,644 / month (₹1,28,400 – ₹1,51,728 calculated annual)',
        academicSession: '2026–27',
        lastVerifiedDate: 'September 2026',
        verificationStatus: 'verified_from_source',
        isVerified: true,
        disclosed: true,
        comparableAnnualAvailable: true,
        billingFrequency: 'monthly',
        feeCategory: 'Composite Monthly Fee',
        sourceUrl: 'https://indusvalleyschoolnoidaext.edu.in',
        registrationFee: 1000,
        admissionFee: 50000,
        tuitionMonthly: '10,700 – 12,644',
        tuitionQuarterly: null,
        tuitionAnnual: '1,28,400 – 1,51,728 (Calculated from monthly)',
        transportMonthly: 'Optional / Route-dependent',
        transportAnnual: null,
        calculatedAnnualNote: 'Annual amounts are calculated equivalents derived from official monthly figures: Nursery–UKG (₹10,700/mo × 12 = ₹1,28,400/yr), Classes I–III (₹11,200/mo × 12 = ₹1,34,400/yr), Classes IV–V (₹12,208/mo × 12 = ₹1,46,496/yr), Classes VI–X (₹12,535/mo × 12 = ₹1,50,420/yr), Classes XI–XII (₹12,644/mo × 12 = ₹1,51,728/yr).',
        disclaimer: 'Caution money of ₹10,000 is refundable. Registration (₹1,000), admission (₹50,000), and development charges (₹10,000) are one-time non-refundable fees. Annual composite amounts are calculated equivalents derived from monthly fees.',
        footnotes: [
          'Registration fee (₹1,000), admission fee (₹50,000), and development charges (₹10,000) are one-time and non-refundable.',
          'Caution money of ₹10,000 is one-time and refundable upon student withdrawal and clearance.',
          'Composite fee is charged monthly. Annual figures represent calculated equivalents (monthly × 12).'
        ],
        table: [
          { type: 'Registration Fee (One-time, non-refundable)', cost: '1,000' },
          { type: 'Admission Fee (One-time, non-refundable)', cost: '50,000' },
          { type: 'Development Charges (One-time, non-refundable)', cost: '10,000' },
          { type: 'Caution Money (One-time, refundable)', cost: '10,000' },
          { type: 'Composite Fee – Nursery to UKG', cost: '10,700 / month (₹1,28,400 / year calculated)' },
          { type: 'Composite Fee – Classes I to III', cost: '11,200 / month (₹1,34,400 / year calculated)' },
          { type: 'Composite Fee – Classes IV to V', cost: '12,208 / month (₹1,46,496 / year calculated)' },
          { type: 'Composite Fee – Classes VI to X', cost: '12,535 / month (₹1,50,420 / year calculated)' },
          { type: 'Composite Fee – Classes XI to XII', cost: '12,644 / month (₹1,51,728 / year calculated)' }
        ],
        components: [
          {
            id: 'iv-reg',
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
            id: 'iv-adm',
            name: 'Admission Fee',
            category: 'one_time',
            amount: 50000,
            formattedAmount: '₹50,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time non-refundable admission fee.'
          },
          {
            id: 'iv-dev',
            name: 'Development Charges',
            category: 'one_time',
            amount: 10000,
            formattedAmount: '₹10,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'One-time non-refundable development charges.'
          },
          {
            id: 'iv-caution',
            name: 'Caution Money (Security Deposit)',
            category: 'deposit',
            amount: 10000,
            formattedAmount: '₹10,000',
            frequency: 'one_time',
            gradesApplicable: 'All Entry Grades',
            mandatory: true,
            refundable: true,
            isOfficial: true,
            notes: 'One-time refundable security caution deposit returned upon student withdrawal and clearance.'
          },
          {
            id: 'iv-comp-nur-ukg-mo',
            name: 'Composite Fee – Nursery to UKG (Monthly)',
            category: 'recurring',
            amount: 10700,
            formattedAmount: '₹10,700 / month',
            frequency: 'monthly',
            gradesApplicable: 'Nursery to UKG',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official monthly composite fee.'
          },
          {
            id: 'iv-comp-nur-ukg-ann',
            name: 'Composite Fee – Nursery to UKG (Calculated Annual)',
            category: 'recurring',
            amount: 128400,
            formattedAmount: '₹1,28,400 / year',
            frequency: 'annual',
            gradesApplicable: 'Nursery to UKG',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹10,700/month × 12 months = ₹1,28,400 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'iv-comp-i-iii-mo',
            name: 'Composite Fee – Classes I to III (Monthly)',
            category: 'recurring',
            amount: 11200,
            formattedAmount: '₹11,200 / month',
            frequency: 'monthly',
            gradesApplicable: 'Classes I to III',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official monthly composite fee.'
          },
          {
            id: 'iv-comp-i-iii-ann',
            name: 'Composite Fee – Classes I to III (Calculated Annual)',
            category: 'recurring',
            amount: 134400,
            formattedAmount: '₹1,34,400 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes I to III',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹11,200/month × 12 months = ₹1,34,400 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'iv-comp-iv-v-mo',
            name: 'Composite Fee – Classes IV to V (Monthly)',
            category: 'recurring',
            amount: 12208,
            formattedAmount: '₹12,208 / month',
            frequency: 'monthly',
            gradesApplicable: 'Classes IV to V',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official monthly composite fee.'
          },
          {
            id: 'iv-comp-iv-v-ann',
            name: 'Composite Fee – Classes IV to V (Calculated Annual)',
            category: 'recurring',
            amount: 146496,
            formattedAmount: '₹1,46,496 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes IV to V',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹12,208/month × 12 months = ₹1,46,496 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'iv-comp-vi-x-mo',
            name: 'Composite Fee – Classes VI to X (Monthly)',
            category: 'recurring',
            amount: 12535,
            formattedAmount: '₹12,535 / month',
            frequency: 'monthly',
            gradesApplicable: 'Classes VI to X',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official monthly composite fee.'
          },
          {
            id: 'iv-comp-vi-x-ann',
            name: 'Composite Fee – Classes VI to X (Calculated Annual)',
            category: 'recurring',
            amount: 150420,
            formattedAmount: '₹1,50,420 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes VI to X',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹12,535/month × 12 months = ₹1,50,420 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          },
          {
            id: 'iv-comp-xi-xii-mo',
            name: 'Composite Fee – Classes XI to XII (Monthly)',
            category: 'recurring',
            amount: 12644,
            formattedAmount: '₹12,644 / month',
            frequency: 'monthly',
            gradesApplicable: 'Classes XI to XII',
            mandatory: true,
            refundable: false,
            isOfficial: true,
            notes: 'Official monthly composite fee.'
          },
          {
            id: 'iv-comp-xi-xii-ann',
            name: 'Composite Fee – Classes XI to XII (Calculated Annual)',
            category: 'recurring',
            amount: 151728,
            formattedAmount: '₹1,51,728 / year',
            frequency: 'annual',
            gradesApplicable: 'Classes XI to XII',
            mandatory: true,
            refundable: false,
            isCalculated: true,
            calculationNotes: 'Calculated as ₹12,644/month × 12 months = ₹1,51,728 / year.',
            isOfficial: false,
            notes: 'Calculated annual equivalent.'
          }
        ],
        gradeWiseTiers: [
          {
            gradeGroup: 'Nursery to UKG',
            grades: ['Nursery', 'LKG', 'UKG'],
            tuitionFee: '₹10,700 / month',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,28,400 / year',
            totalAnnualPayable: '₹1,28,400',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated as ₹10,700/mo × 12 = ₹1,28,400/yr.'
          },
          {
            gradeGroup: 'Classes I to III',
            grades: ['Class I', 'Class II', 'Class III'],
            tuitionFee: '₹11,200 / month',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,34,400 / year',
            totalAnnualPayable: '₹1,34,400',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated as ₹11,200/mo × 12 = ₹1,34,400/yr.'
          },
          {
            gradeGroup: 'Classes IV to V',
            grades: ['Class IV', 'Class V'],
            tuitionFee: '₹12,208 / month',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,46,496 / year',
            totalAnnualPayable: '₹1,46,496',
            isCalculated: true,
            curriculum: 'CBSE',
            notes: 'Calculated as ₹12,208/mo × 12 = ₹1,46,496/yr.'
          },
          {
            gradeGroup: 'Classes VI to X',
            grades: ['Classes VI–X'],
            tuitionFee: '₹12,535 / month',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,50,420 / year',
            totalAnnualPayable: '₹1,50,420',
            isCalculated: true,
            curriculum: 'CBSE Secondary',
            notes: 'Calculated as ₹12,535/mo × 12 = ₹1,50,420/yr.'
          },
          {
            gradeGroup: 'Classes XI to XII',
            grades: ['Classes XI–XII'],
            tuitionFee: '₹12,644 / month',
            tuitionFrequency: 'monthly',
            calculatedAnnualEquivalent: '₹1,51,728 / year',
            totalAnnualPayable: '₹1,51,728',
            isCalculated: true,
            curriculum: 'CBSE Senior Secondary',
            notes: 'Calculated as ₹12,644/mo × 12 = ₹1,51,728/yr.'
          }
        ],
        concessions: [],
        circular: {
          title: 'Indus Valley Public School Official Fee Schedule',
          academicSession: '2026–27',
          circularType: 'web_schedule',
          sourceUrl: 'https://indusvalleyschoolnoidaext.edu.in',
          summary: 'Official fee structure for Indus Valley Public School Sector 62 Noida detailing monthly composite fees, one-time charges, and refundable caution deposit.',
          keyTerms: [
            'Composite monthly fee payable per grade group',
            'Caution deposit of ₹10,000 is refundable',
            'Development charges of ₹10,000 are one-time and non-refundable'
          ],
          officialNotes: [
            'Annual values shown are calculated equivalents of the official monthly composite rates.'
          ]
        }
      }
    };
  }

  return school;
});

fs.writeFileSync(schoolsPath, JSON.stringify(correctedSchools, null, 2), 'utf8');
console.log('Successfully updated 5 schools with exact authoritative fee data in schools.json!');
