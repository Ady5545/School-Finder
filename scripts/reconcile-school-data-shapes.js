const fs = require('fs');
const path = require('path');

const SCHOOLS_FILE = path.join(__dirname, '..', 'data', 'schools.json');
const schools = JSON.parse(fs.readFileSync(SCHOOLS_FILE, 'utf8'));

let modCount = 0;

schools.forEach((s) => {
  // 1. Board verification
  if (!Array.isArray(s.board)) {
    s.board = typeof s.board === 'string' ? [s.board] : ['CBSE'];
    modCount++;
  }
  if (s.slug === 'sunshine-public-school-noida-ext') {
    s.board = ['State Board', 'UP Board'];
  }

  // 2. Fees normalization
  if (s.fees) {
    // registrationFee
    if (typeof s.fees.registrationFee === 'string') {
      const parsed = parseInt(s.fees.registrationFee.replace(/[^0-9]/g, ''));
      s.fees.registrationFee = isNaN(parsed) ? null : parsed;
      modCount++;
    }

    // admissionFee
    if (typeof s.fees.admissionFee === 'string') {
      const parsed = parseInt(s.fees.admissionFee.replace(/[^0-9]/g, ''));
      s.fees.admissionFee = isNaN(parsed) ? null : parsed;
      modCount++;
    }

    // components
    if (s.fees.components && Array.isArray(s.fees.components)) {
      s.fees.components = s.fees.components.map((c, idx) => {
        const id = c.id || `${s.slug}-comp-${idx + 1}`;
        const name = c.name || 'Fee Component';
        const category = c.category || c.type || 'other';
        const frequency = c.frequency || 'one_time';
        const mandatory = c.mandatory !== undefined ? c.mandatory : (c.isMandatory !== undefined ? c.isMandatory : true);
        const refundable = c.refundable !== undefined ? c.refundable : false;
        const isOfficial = c.isOfficial !== undefined ? c.isOfficial : true;
        const notes = c.notes || c.description || (c.calculationNotes || '');
        
        let amount = c.amount;
        let formattedAmount = c.formattedAmount;

        if (typeof amount === 'string') {
          formattedAmount = formattedAmount || amount;
          const num = parseInt(amount.replace(/[^0-9]/g, ''));
          amount = isNaN(num) ? null : num;
        } else if (typeof amount === 'number') {
          formattedAmount = formattedAmount || `₹${amount.toLocaleString('en-IN')}`;
        } else {
          amount = null;
          formattedAmount = formattedAmount || 'Available on request';
        }

        return {
          id,
          name,
          category,
          amount,
          formattedAmount,
          frequency,
          mandatory,
          refundable,
          isOfficial,
          ...(notes ? { notes } : {}),
          ...(c.gradesApplicable ? { gradesApplicable: c.gradesApplicable } : {}),
          ...(c.isCalculated ? { isCalculated: true } : {}),
          ...(c.calculationNotes ? { calculationNotes: c.calculationNotes } : {})
        };
      });
      modCount++;
    }

    // gradeWiseTiers
    if (s.fees.gradeWiseTiers && Array.isArray(s.fees.gradeWiseTiers)) {
      s.fees.gradeWiseTiers = s.fees.gradeWiseTiers.map((t) => {
        const gradeGroup = t.gradeGroup || (typeof t.grades === 'string' ? t.grades : (Array.isArray(t.grades) ? t.grades.join(', ') : 'All Grades'));
        let tuitionFee = t.tuitionFee;
        let tuitionFrequency = t.tuitionFrequency;

        if (!tuitionFee) {
          if (t.tuitionMonthly) {
            tuitionFee = typeof t.tuitionMonthly === 'number' ? `₹${t.tuitionMonthly.toLocaleString('en-IN')} / month` : String(t.tuitionMonthly);
            tuitionFrequency = tuitionFrequency || 'monthly';
          } else if (t.tuitionQuarterly) {
            tuitionFee = typeof t.tuitionQuarterly === 'number' ? `₹${t.tuitionQuarterly.toLocaleString('en-IN')} / quarter` : String(t.tuitionQuarterly);
            tuitionFrequency = tuitionFrequency || 'quarterly';
          } else if (t.tuitionAnnual) {
            tuitionFee = typeof t.tuitionAnnual === 'number' ? `₹${t.tuitionAnnual.toLocaleString('en-IN')} / year` : String(t.tuitionAnnual);
            tuitionFrequency = tuitionFrequency || 'annual';
          } else if (t.totalAnnual) {
            tuitionFee = typeof t.totalAnnual === 'number' ? `₹${t.totalAnnual.toLocaleString('en-IN')} / year` : String(t.totalAnnual);
            tuitionFrequency = tuitionFrequency || 'annual';
          } else {
            tuitionFee = 'Available on request';
            tuitionFrequency = tuitionFrequency || 'annual';
          }
        }

        tuitionFrequency = tuitionFrequency || 'annual';

        let calculatedAnnualEquivalent = t.calculatedAnnualEquivalent;
        if (!calculatedAnnualEquivalent) {
          if (t.tuitionAnnual) {
            calculatedAnnualEquivalent = typeof t.tuitionAnnual === 'number' ? `₹${t.tuitionAnnual.toLocaleString('en-IN')} / year` : String(t.tuitionAnnual);
          } else if (t.totalAnnual) {
            calculatedAnnualEquivalent = typeof t.totalAnnual === 'number' ? `₹${t.totalAnnual.toLocaleString('en-IN')} / year` : String(t.totalAnnual);
          }
        }

        return {
          gradeGroup,
          tuitionFee,
          tuitionFrequency,
          ...(calculatedAnnualEquivalent ? { calculatedAnnualEquivalent } : {}),
          ...(t.totalAnnualPayable ? { totalAnnualPayable: t.totalAnnualPayable } : {}),
          ...(t.isOfficial !== undefined ? { isOfficial: t.isOfficial } : {}),
          ...(t.isCalculated !== undefined ? { isCalculated: t.isCalculated } : {}),
          ...(t.calculationNotes ? { calculationNotes: t.calculationNotes } : {}),
          ...(t.notes ? { notes: t.notes } : {})
        };
      });
      modCount++;
    }
  }
});

fs.writeFileSync(SCHOOLS_FILE, JSON.stringify(schools, null, 2), 'utf8');
console.log(`Successfully reconciled data/schools.json. Modified operations: ${modCount}`);
