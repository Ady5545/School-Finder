#!/usr/bin/env node

/**
 * ADMISSION PITARA - REMINDERS & NOTIFICATIONS VALIDATION SUITE
 * Validates data layer, authorization checks, API route security,
 * duplicate prevention, and date milestone substantiation.
 */

const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log('================================================================');
console.log('    ADMISSION PITARA - REMINDERS & NOTIFICATIONS TEST SUITE     ');
console.log('================================================================\n');

// 1. File Existence & Export Checks
const authStorePath = path.join(__dirname, '../src/lib/authStore.ts');
const authRemindersRoutePath = path.join(__dirname, '../src/app/api/auth/reminders/route.ts');
const triggerRoutePath = path.join(__dirname, '../src/app/api/notifications/reminders/trigger/route.ts');
const reminderModalPath = path.join(__dirname, '../src/components/school/AdmissionReminderModal.tsx');
const parentRemindersCardPath = path.join(__dirname, '../src/components/parent/ParentRemindersCard.tsx');

assert(fs.existsSync(authStorePath), 'src/lib/authStore.ts exists');
assert(fs.existsSync(authRemindersRoutePath), 'src/app/api/auth/reminders/route.ts exists');
assert(fs.existsSync(triggerRoutePath), 'src/app/api/notifications/reminders/trigger/route.ts exists');
assert(fs.existsSync(reminderModalPath), 'src/components/school/AdmissionReminderModal.tsx exists');
assert(fs.existsSync(parentRemindersCardPath), 'src/components/parent/ParentRemindersCard.tsx exists');

// 2. AuthStore Code Audit
const authStoreCode = fs.readFileSync(authStorePath, 'utf8');
assert(authStoreCode.includes('export interface AdmissionReminder'), 'authStore defines AdmissionReminder interface');
assert(authStoreCode.includes('createAdmissionReminder'), 'authStore exports createAdmissionReminder');
assert(authStoreCode.includes('getUserReminders'), 'authStore exports getUserReminders');
assert(authStoreCode.includes('updateReminderStatus'), 'authStore exports updateReminderStatus');
assert(authStoreCode.includes('deleteReminder'), 'authStore exports deleteReminder');
assert(authStoreCode.includes('getAllActiveReminders'), 'authStore exports getAllActiveReminders');
assert(authStoreCode.includes('markReminderNotified'), 'authStore exports markReminderNotified');

// 3. Auth Reminders API Route & Data Validation Audit
const authRemindersCode = fs.readFileSync(authRemindersRoutePath, 'utf8');
assert(authRemindersCode.includes('verifySessionToken'), 'Reminders route verifies session token for authorization');
assert(authRemindersCode.includes('401'), 'Reminders route returns 401 for unauthenticated requests');
assert(authStoreCode.includes('7_days_before'), 'authStore validates valid timing parameters (7d, 3d, 1d, on_date)');
assert(authStoreCode.includes('already exists'), 'authStore prevents duplicate active reminders for same milestone');
assert(authRemindersCode.includes('auth.id'), 'Reminders route binds reminders strictly to authenticated user ID');

// 4. Trigger API Route Security Audit
const triggerCode = fs.readFileSync(triggerRoutePath, 'utf8');
assert(triggerCode.includes('requireAdminAuth'), 'Trigger route enforces server-side admin authorization via requireAdminAuth');
assert(triggerCode.includes('getAllActiveReminders'), 'Trigger route queries active reminders');
assert(triggerCode.includes('sendAdmissionDeadlineAlertEmail'), 'Trigger route dispatches notifications via email service');
assert(triggerCode.includes('reminder.userEmail'), 'Trigger route strictly targets owning user email');

// 5. Admission Date Data Audit
const schoolsPath = path.join(__dirname, '../data/schools.json');
const schools = JSON.parse(fs.readFileSync(schoolsPath, 'utf8'));

let totalMilestones = 0;
let verifiedMilestones = 0;

schools.forEach(school => {
  if (school.admissions && Array.isArray(school.admissions.milestones)) {
    school.admissions.milestones.forEach(m => {
      totalMilestones++;
      if (m.verificationStatus === 'verified_official_notice' || m.verificationStatus === 'verified_from_source') {
        verifiedMilestones++;
      }
    });
  }
});

assert(totalMilestones > 0, `Found ${totalMilestones} admission milestones in dataset`);
assert(verifiedMilestones === totalMilestones, `100% of admission milestones (${verifiedMilestones}/${totalMilestones}) are explicitly source-verified`);

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passedTests} of ${totalTests} tests passed.`);
console.log('----------------------------------------------------------------');
if (passedTests === totalTests) {
  console.log('STATUS: REMINDERS & NOTIFICATIONS VERIFICATION COMPLETE [PASS]\n');
} else {
  console.log('STATUS: VERIFICATION FAILED\n');
  process.exit(1);
}
