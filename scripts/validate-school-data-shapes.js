/**
 * ============================================================================
 * ADMISSION PITARA - DETERMINISTIC SCHOOL DATA-SHAPE INTEGRITY VALIDATOR
 * ============================================================================
 * 
 * Verifies every canonical school record in data/schools.json against the
 * runtime schema expectations of the application.
 * 
 * Fails loudly with detailed diagnostics (School, Field, Expected, Actual, Value)
 * if any property has an invalid runtime type, missing mandatory structure,
 * malformed coordinates, or improper array/object shape.
 */

const fs = require('fs');
const path = require('path');

const SCHOOLS_FILE = path.join(__dirname, '..', 'data', 'schools.json');

function runAudit() {
  console.log('================================================================');
  console.log('    ADMISSION PITARA - SCHOOL DATA-SHAPE INTEGRITY AUDIT        ');
  console.log('================================================================\n');

  if (!fs.existsSync(SCHOOLS_FILE)) {
    console.error(`CRITICAL: School data file not found at ${SCHOOLS_FILE}`);
    process.exit(1);
  }

  let schools;
  try {
    const raw = fs.readFileSync(SCHOOLS_FILE, 'utf8');
    schools = JSON.parse(raw);
  } catch (err) {
    console.error(`CRITICAL: Failed to parse ${SCHOOLS_FILE}: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(schools) || schools.length === 0) {
    console.error('CRITICAL: schools.json must be a non-empty array of school objects.');
    process.exit(1);
  }

  console.log(`Auditing ${schools.length} school records in data/schools.json...\n`);

  const errors = [];
  const warnings = [];
  let checksCount = 0;

  function reportError(school, field, expected, actual, value) {
    errors.push({
      school: school.slug || school.name || school.id || 'unknown',
      field,
      expected,
      actual,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value)
    });
  }

  function reportWarning(school, field, message) {
    warnings.push({
      school: school.slug || school.name || school.id || 'unknown',
      field,
      message
    });
  }

  function check(school, field, condition, expected, actual, value) {
    checksCount++;
    if (!condition) {
      reportError(school, field, expected, actual, value);
    }
  }

  const seenIds = new Set();
  const seenSlugs = new Set();

  schools.forEach((s, idx) => {
    // 1. Identity & Naming
    check(s, 'id', typeof s.id === 'string' && s.id.trim().length > 0, 'non-empty string', typeof s.id, s.id);
    if (s.id) {
      check(s, 'id uniqueness', !seenIds.has(s.id), 'unique ID', 'duplicate ID', s.id);
      seenIds.add(s.id);
    }

    check(s, 'slug', typeof s.slug === 'string' && /^[a-z0-9-]+$/.test(s.slug), 'kebab-case non-empty string', typeof s.slug, s.slug);
    if (s.slug) {
      check(s, 'slug uniqueness', !seenSlugs.has(s.slug), 'unique slug', 'duplicate slug', s.slug);
      seenSlugs.add(s.slug);
    }

    check(s, 'name', typeof s.name === 'string' && s.name.trim().length > 0, 'non-empty string', typeof s.name, s.name);
    check(s, 'shortName', typeof s.shortName === 'string', 'string', typeof s.shortName, s.shortName);
    check(s, 'tagline', typeof s.tagline === 'string', 'string', typeof s.tagline, s.tagline);
    check(s, 'summary', typeof s.summary === 'string', 'string', typeof s.summary, s.summary);

    check(s, 'alternateNames', Array.isArray(s.alternateNames), 'string[]', typeof s.alternateNames, s.alternateNames);
    if (Array.isArray(s.alternateNames)) {
      s.alternateNames.forEach((alt, aIdx) => {
        check(s, `alternateNames[${aIdx}]`, typeof alt === 'string', 'string', typeof alt, alt);
      });
    }

    // 2. Affiliation & Board (Crucial runtime check)
    check(s, 'board', Array.isArray(s.board) && s.board.length > 0, 'non-empty string[]', Array.isArray(s.board) ? `array(len=${s.board.length})` : typeof s.board, s.board);
    if (Array.isArray(s.board)) {
      s.board.forEach((b, bIdx) => {
        check(s, `board[${bIdx}]`, typeof b === 'string' && b.trim().length > 0, 'non-empty string', typeof b, b);
      });
    }

    // Explicit check for Sunshine Public School
    if (s.slug === 'sunshine-public-school-noida-ext') {
      const isCorrectArray = Array.isArray(s.board) && s.board.includes('State Board') && s.board.includes('UP Board');
      check(s, 'sunshine-public-school board values', isCorrectArray, '["State Board", "UP Board"]', typeof s.board, s.board);
    }

    check(s, 'curriculum', typeof s.curriculum === 'string', 'string', typeof s.curriculum, s.curriculum);
    if (s.boardNote !== null && s.boardNote !== undefined) {
      check(s, 'boardNote', typeof s.boardNote === 'string', 'string | null', typeof s.boardNote, s.boardNote);
    }

    // 3. Demographics & Institutional Metadata
    check(s, 'gradeRange', typeof s.gradeRange === 'object' && s.gradeRange !== null, 'object', typeof s.gradeRange, s.gradeRange);
    if (s.gradeRange && typeof s.gradeRange === 'object') {
      check(s, 'gradeRange.from', typeof s.gradeRange.from === 'string', 'string', typeof s.gradeRange.from, s.gradeRange.from);
      check(s, 'gradeRange.to', typeof s.gradeRange.to === 'string', 'string', typeof s.gradeRange.to, s.gradeRange.to);
      check(s, 'gradeRange.raw', typeof s.gradeRange.raw === 'string', 'string', typeof s.gradeRange.raw, s.gradeRange.raw);
    }

    check(s, 'admissionAge', typeof s.admissionAge === 'string', 'string', typeof s.admissionAge, s.admissionAge);
    check(s, 'studentTeacherRatio', typeof s.studentTeacherRatio === 'string', 'string', typeof s.studentTeacherRatio, s.studentTeacherRatio);
    check(s, 'schoolType', typeof s.schoolType === 'string', 'string', typeof s.schoolType, s.schoolType);
    check(s, 'dayOrBoarding', typeof s.dayOrBoarding === 'string', 'string', typeof s.dayOrBoarding, s.dayOrBoarding);

    // 4. Location & Coordinates
    check(s, 'location', typeof s.location === 'object' && s.location !== null, 'object', typeof s.location, s.location);
    if (s.location && typeof s.location === 'object') {
      check(s, 'location.address', typeof s.location.address === 'string', 'string', typeof s.location.address, s.location.address);
      check(s, 'location.sector', typeof s.location.sector === 'string', 'string', typeof s.location.sector, s.location.sector);
      check(s, 'location.area', typeof s.location.area === 'string', 'string', typeof s.location.area, s.location.area);

      check(s, 'location.coordinates', typeof s.location.coordinates === 'object' && s.location.coordinates !== null, 'object', typeof s.location.coordinates, s.location.coordinates);
      if (s.location.coordinates && typeof s.location.coordinates === 'object') {
        const { lat, lng } = s.location.coordinates;
        check(s, 'location.coordinates.lat', lat === null || typeof lat === 'number', 'number | null', typeof lat, lat);
        check(s, 'location.coordinates.lng', lng === null || typeof lng === 'number', 'number | null', typeof lng, lng);
        if (typeof lat === 'number') {
          check(s, 'location.coordinates.lat range', lat >= 25 && lat <= 32, 'valid latitude (25-32 for NCR)', 'out of range', lat);
        }
        if (typeof lng === 'number') {
          check(s, 'location.coordinates.lng range', lng >= 75 && lng <= 80, 'valid longitude (75-80 for NCR)', 'out of range', lng);
        }
      }
    }

    // 5. Fees Structure
    check(s, 'fees', typeof s.fees === 'object' && s.fees !== null, 'object', typeof s.fees, s.fees);
    if (s.fees && typeof s.fees === 'object') {
      const { cardFee, rangeText, table, components, gradeWiseTiers, concessions, history } = s.fees;
      check(s, 'fees.cardFee', cardFee === null || (typeof cardFee === 'number' && cardFee >= 0), 'non-negative number | null', typeof cardFee, cardFee);
      check(s, 'fees.rangeText', typeof rangeText === 'string' && rangeText.trim().length > 0, 'non-empty string', typeof rangeText, rangeText);

      if (table !== undefined && table !== null) {
        check(s, 'fees.table', Array.isArray(table), 'FeeItem[]', typeof table, table);
        if (Array.isArray(table)) {
          table.forEach((item, tIdx) => {
            check(s, `fees.table[${tIdx}].type`, typeof item.type === 'string', 'string', typeof item.type, item.type);
            check(s, `fees.table[${tIdx}].cost`, typeof item.cost === 'string', 'string', typeof item.cost, item.cost);
          });
        }
      }

      if (components !== undefined && components !== null) {
        check(s, 'fees.components', Array.isArray(components), 'DetailedFeeComponent[]', typeof components, components);
        if (Array.isArray(components)) {
          components.forEach((comp, cIdx) => {
            check(s, `fees.components[${cIdx}].id`, typeof comp.id === 'string', 'string', typeof comp.id, comp.id);
            check(s, `fees.components[${cIdx}].name`, typeof comp.name === 'string', 'string', typeof comp.name, comp.name);
            check(s, `fees.components[${cIdx}].formattedAmount`, typeof comp.formattedAmount === 'string', 'string', typeof comp.formattedAmount, comp.formattedAmount);
          });
        }
      }

      if (gradeWiseTiers !== undefined && gradeWiseTiers !== null) {
        check(s, 'fees.gradeWiseTiers', Array.isArray(gradeWiseTiers), 'GradeWiseFeeTier[]', typeof gradeWiseTiers, gradeWiseTiers);
      }

      if (concessions !== undefined && concessions !== null) {
        check(s, 'fees.concessions', Array.isArray(concessions), 'FeeConcession[]', typeof concessions, concessions);
      }

      if (history !== undefined && history !== null) {
        check(s, 'fees.history', Array.isArray(history), 'HistoricalFeeStructure[]', typeof history, history);
      }
    }

    // 6. Facilities Array
    check(s, 'facilities', Array.isArray(s.facilities), 'Facility[]', typeof s.facilities, s.facilities);
    if (Array.isArray(s.facilities)) {
      s.facilities.forEach((fac, fIdx) => {
        check(s, `facilities[${fIdx}].name`, typeof fac === 'object' && fac !== null && typeof fac.name === 'string', 'string', typeof fac?.name, fac?.name);
        check(s, `facilities[${fIdx}].category`, typeof fac === 'object' && fac !== null && typeof fac.category === 'string', 'string', typeof fac?.category, fac?.category);
      });
    }

    // 7. Admissions & Milestones
    check(s, 'admissions', typeof s.admissions === 'object' && s.admissions !== null, 'object', typeof s.admissions, s.admissions);
    if (s.admissions && typeof s.admissions === 'object') {
      check(s, 'admissions.status', typeof s.admissions.status === 'string', 'string', typeof s.admissions.status, s.admissions.status);
      check(s, 'admissions.process', typeof s.admissions.process === 'string', 'string', typeof s.admissions.process, s.admissions.process);

      if (s.admissions.milestones !== undefined && s.admissions.milestones !== null) {
        check(s, 'admissions.milestones', Array.isArray(s.admissions.milestones), 'AdmissionMilestone[]', typeof s.admissions.milestones, s.admissions.milestones);
        if (Array.isArray(s.admissions.milestones)) {
          s.admissions.milestones.forEach((m, mIdx) => {
            check(s, `admissions.milestones[${mIdx}].id`, typeof m.id === 'string', 'string', typeof m.id, m.id);
            check(s, `admissions.milestones[${mIdx}].label`, typeof m.label === 'string', 'string', typeof m.label, m.label);
            check(s, `admissions.milestones[${mIdx}].date`, typeof m.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.date), 'YYYY-MM-DD date string', typeof m.date, m.date);
          });
        }
      }
    }

    // 8. Contact Information
    check(s, 'contact', typeof s.contact === 'object' && s.contact !== null, 'object', typeof s.contact, s.contact);
    if (s.contact && typeof s.contact === 'object') {
      check(s, 'contact.phone', s.contact.phone === null || typeof s.contact.phone === 'string', 'string | null', typeof s.contact.phone, s.contact.phone);
      check(s, 'contact.email', s.contact.email === null || typeof s.contact.email === 'string', 'string | null', typeof s.contact.email, s.contact.email);
      check(s, 'contact.website', s.contact.website === null || typeof s.contact.website === 'string', 'string | null', typeof s.contact.website, s.contact.website);
    }

    // 9. Rating
    check(s, 'rating', typeof s.rating === 'object' && s.rating !== null, 'object', typeof s.rating, s.rating);
    if (s.rating && typeof s.rating === 'object') {
      check(s, 'rating.score', typeof s.rating.score === 'number' && s.rating.score >= 0 && s.rating.score <= 5, 'number (0-5)', typeof s.rating.score, s.rating.score);
      check(s, 'rating.reviewsCount', typeof s.rating.reviewsCount === 'number' && s.rating.reviewsCount >= 0, 'non-negative number', typeof s.rating.reviewsCount, s.rating.reviewsCount);
    }

    // 10. Assets & Gallery
    check(s, 'assets', typeof s.assets === 'object' && s.assets !== null, 'object', typeof s.assets, s.assets);
    if (s.assets && typeof s.assets === 'object') {
      check(s, 'assets.gallery', Array.isArray(s.assets.gallery), 'string[]', typeof s.assets.gallery, s.assets.gallery);
      if (Array.isArray(s.assets.gallery)) {
        s.assets.gallery.forEach((g, gIdx) => {
          check(s, `assets.gallery[${gIdx}]`, typeof g === 'string', 'string', typeof g, g);
        });
      }
    }

    // 11. Optional Array Collections (sports, achievements, auditNotes)
    if (s.sports !== undefined && s.sports !== null) {
      check(s, 'sports', Array.isArray(s.sports), 'string[]', typeof s.sports, s.sports);
    }
    if (s.achievements !== undefined && s.achievements !== null) {
      check(s, 'achievements', Array.isArray(s.achievements), 'string[]', typeof s.achievements, s.achievements);
    }
    if (s.auditNotes !== undefined && s.auditNotes !== null) {
      check(s, 'auditNotes', Array.isArray(s.auditNotes), 'string[]', typeof s.auditNotes, s.auditNotes);
    }
  });

  console.log(`Ran ${checksCount} structural assertion checks across ${schools.length} records.`);

  if (errors.length > 0) {
    console.error('\n----------------------------------------------------------------');
    console.error(`FAILED: Found ${errors.length} data shape integrity violations:`);
    console.error('----------------------------------------------------------------');
    errors.forEach((err, idx) => {
      console.error(`\n[Violation #${idx + 1}]`);
      console.error(`  School:   ${err.school}`);
      console.error(`  Field:    ${err.field}`);
      console.error(`  Expected: ${err.expected}`);
      console.error(`  Actual:   ${err.actual}`);
      console.error(`  Value:    ${err.value}`);
    });
    console.error('\n================================================================');
    console.error('STATUS: SCHOOL DATA-SHAPE VALIDATION FAILED [FAIL]');
    console.error('================================================================');
    process.exit(1);
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`Results: All ${checksCount} checks passed cleanly with 0 errors.`);
  console.log('----------------------------------------------------------------');
  console.log('STATUS: ALL SCHOOL DATA SHAPES VERIFIED CLEANLY [PASS]\n');
}

runAudit();
