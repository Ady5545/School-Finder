import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { NextRequest } from 'next/server';
import type { ApplicationTrackerItem } from './applicationTracker';
import {
  getUsersCollection,
  getRatingsCollection,
  getRemindersCollection,
  getActivityCollection,
  getAuditLogsCollection,
  getPromotionsCollection,
  getSchoolViewsCollection,
  getSchoolSavesCollection,
  getOtpsCollection,
  getRateLimitsCollection,
  getSubmissionsCollection,
  isMongoConfigured,
} from './mongodb';

export interface ParentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  childName?: string;
  childGrade?: string;
  residentialSociety?: string;
  fatherName?: string;
  motherName?: string;
  status: 'active' | 'disabled' | 'suspended' | 'banned';
  suspensionReason?: string;
  suspensionDuration?: string;
  suspensionExpiresAt?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  adminRole?: 'super_admin' | 'directory_admin' | 'review_moderator' | 'support_admin' | 'editorial_admin' | 'business_admin' | 'analyst';
  preferredSchoolLocality?: string; // e.g. "Sector 16B", "Techzone 4", "Knowledge Park 5", "Greater Noida West"
  preferredBoards?: string[];
  passwordHash?: string;
  emailVerified: boolean;
  analyticsConsent: boolean;
  role: 'parent' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
  lastActivityAt?: string;
  wishlist: string[];
  compareList: string[];
  applicationTracker?: ApplicationTrackerItem[];
}

// ----------------------------------------------------------------------------
// PARENT PROFILE VALIDATION & SANITIZATION HELPERS
// ----------------------------------------------------------------------------

/**
 * Validates and standardizes Indian mobile numbers.
 * Accepts 10 digits, optionally prefixed with +91, 91, or 0.
 * Must start with valid Indian mobile prefixes: 6, 7, 8, or 9.
 */
export function normalizeIndianPhone(input: string): { valid: boolean; normalized?: string; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  if (!match) {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 98765 43210).',
    };
  }
  const tenDigits = match[1];
  const formatted = `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
  return { valid: true, normalized: formatted };
}

/**
 * Validates residential society name.
 * Respects strict parent privacy: collects ONLY society/apartment complex name,
 * forbidding flat, house, tower, or floor numbers.
 */
export function validateResidentialSociety(input: string): { valid: boolean; cleaned?: string; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Residential society or apartment complex name is required.' };
  }
  const trimmed = input.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: 'Residential society name must be at least 3 characters.' };
  }
  if (trimmed.length > 120) {
    return { valid: false, error: 'Residential society name must not exceed 120 characters.' };
  }
  return { valid: true, cleaned: trimmed };
}

/**
 * Validates child / student full name.
 */
export function validateChildName(input: string): { valid: boolean; cleaned?: string; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Child / student name is required.' };
  }
  const trimmed = input.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Child / student name must be at least 2 characters.' };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: 'Child / student name must not exceed 80 characters.' };
  }
  return { valid: true, cleaned: trimmed };
}

/**
 * Validates optional parent names (Father or Mother).
 * Either or both may be omitted.
 */
export function validateOptionalParentName(input?: string): { valid: boolean; cleaned?: string; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: true, cleaned: undefined };
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: true, cleaned: undefined };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters if provided.' };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: 'Name must not exceed 80 characters.' };
  }
  return { valid: true, cleaned: trimmed };
}

export interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  purpose: 'register' | 'login';
}

export interface SchoolRating {
  id: string;
  schoolSlug: string;
  userId: string;
  userName: string;
  userChildGrade?: string;
  score: number; // 1 to 5
  title?: string;
  comment: string;
  categories?: {
    academics?: number;
    infrastructure?: number;
    faculty?: number;
    safety?: number;
  };
  verifiedParent: boolean;
  isAnonymous?: boolean;
  status: 'published' | 'deleted';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
}

export type ActivityEventType =
  | 'school_view'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'compare_add'
  | 'compare_view'
  | 'rating_submitted'
  | 'rating_edited'
  | 'rating_deleted'
  | 'search_performed'
  | 'search_area_selected'
  | 'user_signup'
  | 'user_login'
  | 'admission_registration'
  | 'admission_preregistration'
  | 'admin_action';

export interface ActivityEvent {
  id: string;
  /** Stable pseudonymous browser visitor ID for anonymous analytics when available. */
  visitorId?: string;
  type: ActivityEventType;
  userId?: string;
  targetType?: 'school' | 'user' | 'review' | 'search' | 'promotion' | 'system';
  targetId?: string;
  schoolSlug?: string;
  locality?: string;
  searchQuery?: string;
  approximateTimeSpent?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface SchoolPromotionCampaign {
  id: string;
  schoolSlug: string;
  campaignName: string;
  placementType: 'homepage_hero' | 'featured_card' | 'sponsored_search' | 'sponsored_category';
  title: string;
  description: string;
  badgeLabel: string; // e.g. "Sponsored", "Promoted", "Featured Partner"
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'expired' | 'draft';
  priority: number;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
  result: 'success' | 'failed';
  timestamp: string;
}

export type ReminderTiming = '7_days_before' | '3_days_before' | '1_day_before' | 'on_date';

export interface AdmissionReminder {
  id: string;
  userId: string;
  userEmail: string;
  schoolSlug: string;
  schoolName: string;
  milestoneId: string;
  milestoneLabel: string;
  targetDate: string; // YYYY-MM-DD
  timing: ReminderTiming;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
  lastNotifiedAt?: string;
}

interface PersistentDbSchema {
  users: Record<string, ParentUser>;
  ratings: SchoolRating[];
  schoolViews: Record<string, number>;
  schoolSaves: Record<string, number>;
  activityEvents: ActivityEvent[];
  promotions: SchoolPromotionCampaign[];
  auditLogs: AdminAuditLog[];
  reminders?: AdmissionReminder[];
}

// Global reference to withstand HMR and serverless restarts
const globalAuthStore = globalThis as unknown as {
  __ADMISSION_PITARA_USERS__?: Map<string, ParentUser>;
  __ADMISSION_PITARA_OTPS__?: Map<string, OtpRecord>;
  __ADMISSION_PITARA_VERIFICATION_TOKENS__?: Map<string, { email: string; expiresAt: number }>;
  __ADMISSION_PITARA_RATE_LIMITS__?: Map<string, { count: number; resetAt: number }>;
  __ADMISSION_PITARA_RATINGS__?: SchoolRating[];
  __ADMISSION_PITARA_SCHOOL_VIEWS__?: Map<string, number>;
  __ADMISSION_PITARA_SCHOOL_SAVES__?: Map<string, number>;
  __ADMISSION_PITARA_ACTIVITY__?: ActivityEvent[];
  __ADMISSION_PITARA_PROMOTIONS__?: SchoolPromotionCampaign[];
  __ADMISSION_PITARA_AUDIT_LOGS__?: AdminAuditLog[];
  __ADMISSION_PITARA_REMINDERS__?: AdmissionReminder[];
  __ADMISSION_PITARA_DB_LOADED__?: boolean;
};

if (!globalAuthStore.__ADMISSION_PITARA_USERS__) {
  globalAuthStore.__ADMISSION_PITARA_USERS__ = new Map();
}
if (!globalAuthStore.__ADMISSION_PITARA_OTPS__) {
  globalAuthStore.__ADMISSION_PITARA_OTPS__ = new Map();
}
if (!globalAuthStore.__ADMISSION_PITARA_VERIFICATION_TOKENS__) {
  globalAuthStore.__ADMISSION_PITARA_VERIFICATION_TOKENS__ = new Map();
}
if (!globalAuthStore.__ADMISSION_PITARA_RATE_LIMITS__) {
  globalAuthStore.__ADMISSION_PITARA_RATE_LIMITS__ = new Map();
}
if (!globalAuthStore.__ADMISSION_PITARA_RATINGS__) {
  globalAuthStore.__ADMISSION_PITARA_RATINGS__ = [];
}
if (!globalAuthStore.__ADMISSION_PITARA_SCHOOL_VIEWS__) {
  globalAuthStore.__ADMISSION_PITARA_SCHOOL_VIEWS__ = new Map();
}
if (!globalAuthStore.__ADMISSION_PITARA_SCHOOL_SAVES__) {
  globalAuthStore.__ADMISSION_PITARA_SCHOOL_SAVES__ = new Map();
}
if (!globalAuthStore.__ADMISSION_PITARA_ACTIVITY__) {
  globalAuthStore.__ADMISSION_PITARA_ACTIVITY__ = [];
}
if (!globalAuthStore.__ADMISSION_PITARA_PROMOTIONS__) {
  globalAuthStore.__ADMISSION_PITARA_PROMOTIONS__ = [];
}
if (!globalAuthStore.__ADMISSION_PITARA_AUDIT_LOGS__) {
  globalAuthStore.__ADMISSION_PITARA_AUDIT_LOGS__ = [];
}
if (!globalAuthStore.__ADMISSION_PITARA_REMINDERS__) {
  globalAuthStore.__ADMISSION_PITARA_REMINDERS__ = [];
}

const users = globalAuthStore.__ADMISSION_PITARA_USERS__;
const otps = globalAuthStore.__ADMISSION_PITARA_OTPS__;
const verificationTokens = globalAuthStore.__ADMISSION_PITARA_VERIFICATION_TOKENS__;
const rateLimits = globalAuthStore.__ADMISSION_PITARA_RATE_LIMITS__;
let ratings = globalAuthStore.__ADMISSION_PITARA_RATINGS__;
const schoolViews = globalAuthStore.__ADMISSION_PITARA_SCHOOL_VIEWS__;
const schoolSaves = globalAuthStore.__ADMISSION_PITARA_SCHOOL_SAVES__;
let activityEvents = globalAuthStore.__ADMISSION_PITARA_ACTIVITY__;
let promotions = globalAuthStore.__ADMISSION_PITARA_PROMOTIONS__;
let auditLogs = globalAuthStore.__ADMISSION_PITARA_AUDIT_LOGS__;
let reminders = globalAuthStore.__ADMISSION_PITARA_REMINDERS__;

/**
 * Resolves the JWT signing secret.
 * In production, fails closed if no secret is configured.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET (or AUTH_SECRET / SESSION_SECRET) environment variable is required in production.');
    }
    return 'dev_insecure_local_secret_admission_pitara_only';
  }
  return secret;
}

/**
 * Resolves the initial administrative password.
 * In production, fails closed if no password is configured.
 */
/**
 * Returns the configured administrative email allowlist.
 * ADMIN_EMAILS is a comma-separated environment variable; the primary
 * Admission Pitara admin is used as the safe default for local/dev setups.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || 'admin@admissionpitara.com';
  return raw
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminInitialPassword(): string {
  const pass = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!pass) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_INITIAL_PASSWORD (or ADMIN_PASSWORD) environment variable is required in production.');
    }
    return 'dev_admin_local_password_only';
  }
  return pass;
}

// Path for persistent atomic storage (development/local only)
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'auth_db.json');

let saveTimeout: NodeJS.Timeout | null = null;
let isSaving = false;
let pendingSave = false;

/**
 * Persist database atomically and asynchronously to disk with debouncing
 * (Disabled in production where MongoDB is the single authoritative store).
 */
export function saveStoreToDisk(immediate = false): void {
  // In production, file persistence is disabled - MongoDB is the sole source of truth
  if (process.env.NODE_ENV === 'production') {
    return; // In production, file persistence is disabled
  }

  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  const executeSave = async () => {
    if (isSaving) {
      pendingSave = true;
      return;
    }

    isSaving = true;
    try {
      if (!fs.existsSync(DB_DIR)) {
        await fs.promises.mkdir(DB_DIR, { recursive: true });
      }

      const usersRecord: Record<string, ParentUser> = {};
      for (const [key, user] of users.entries()) {
        if (key === user.email.toLowerCase()) {
          usersRecord[user.id] = user;
        }
      }

      const viewsRecord: Record<string, number> = {};
      for (const [slug, count] of schoolViews.entries()) {
        viewsRecord[slug] = count;
      }

      const savesRecord: Record<string, number> = {};
      for (const [slug, count] of schoolSaves.entries()) {
        savesRecord[slug] = count;
      }

      const payload: PersistentDbSchema = {
        users: usersRecord,
        ratings,
        schoolViews: viewsRecord,
        schoolSaves: savesRecord,
        activityEvents: activityEvents.slice(0, 5000), // Retain up to 5,000 persistent activity events
        promotions,
        auditLogs: auditLogs.slice(0, 1000),
        reminders,
      };

      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      await fs.promises.writeFile(tempFile, JSON.stringify(payload, null, 2), 'utf8');
      await fs.promises.rename(tempFile, DB_FILE);
    } catch (err) {
      console.warn('[AUTH_DB_WARN] Could not persist to disk:', err instanceof Error ? err.message : err);
    } finally {
      isSaving = false;
      if (pendingSave) {
        pendingSave = false;
        saveStoreToDisk(false);
      }
    }
  };

  if (immediate) {
    executeSave();
  } else {
    saveTimeout = setTimeout(executeSave, 400);
  }
}

/**
 * Initialize and load database (local fallback or initial bootstrap)
 */
function initDb(): void {
  if (globalAuthStore.__ADMISSION_PITARA_DB_LOADED__) return;
  globalAuthStore.__ADMISSION_PITARA_DB_LOADED__ = true;

  // In production, file persistence is disabled; MongoDB is the sole source of truth
  if (process.env.NODE_ENV !== 'production') {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf8');
        const data = JSON.parse(content) as PersistentDbSchema;

        if (data.users) {
          for (const user of Object.values(data.users)) {
            // ensure default status
            if (!user.status) user.status = 'active';
            if (!user.role) user.role = 'parent';
            users.set(user.email.toLowerCase(), user);
          }
        }

        if (Array.isArray(data.ratings)) {
          ratings.length = 0;
          ratings.push(...data.ratings.map(r => ({ ...r, status: r.status || 'published' })));
        }

        if (data.schoolViews) {
          for (const [slug, count] of Object.entries(data.schoolViews)) {
            schoolViews.set(slug, count);
          }
        }

        if (data.schoolSaves) {
          for (const [slug, count] of Object.entries(data.schoolSaves)) {
            schoolSaves.set(slug, count);
          }
        }

        if (Array.isArray(data.activityEvents)) {
          activityEvents.length = 0;
          activityEvents.push(...data.activityEvents);
        }

        if (Array.isArray(data.promotions)) {
          promotions.length = 0;
          promotions.push(...data.promotions);
        }

        if (Array.isArray(data.auditLogs)) {
          auditLogs.length = 0;
          auditLogs.push(...data.auditLogs);
        }

        if (Array.isArray(data.reminders)) {
          reminders.length = 0;
          reminders.push(...data.reminders);
        }
      }
    } catch (err) {
      console.warn('[AUTH_DB_WARN] Failed reading existing DB file, re-initializing:', err);
    }
  }

  // Ensure default administrative account exists
  const adminEmail = 'admin@admissionpitara.com';
  let adminUser = users.get(adminEmail);
  if (!adminUser) {
    try {
      const adminInitPass = getAdminInitialPassword();
      const adminHash = hashPassword(adminInitPass);

      adminUser = {
        id: 'usr_admin_portal_lead',
        name: 'Admissions Lead Administrator',
        email: adminEmail,
        status: 'active',
        preferredSchoolLocality: 'Knowledge Park 5',
        passwordHash: adminHash,
        emailVerified: true,
        analyticsConsent: true,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        wishlist: [],
        compareList: [],
        applicationTracker: [],
      };

      users.set(adminUser.email.toLowerCase(), adminUser);
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('[AUTH_WARN] Admin user initialization deferred pending ADMIN_INITIAL_PASSWORD env configuration');
      }
    }
  }

  // Initial Promotion: Delhi World Public School (admin controllable, easily modified/expired)
  if (promotions.length === 0) {
    const initialCampaign: SchoolPromotionCampaign = {
      id: 'promo_dwps_inaugural_2026',
      schoolSlug: 'delhi-world-public-school-kp-5',
      campaignName: 'DWPS Greater Noida West - Premier Admissions 2027-28',
      placementType: 'homepage_hero',
      title: 'Delhi World Public School, Knowledge Park 5',
      description: 'Admissions open for Nursery to Grade XI. World-class 5-acre smart campus with audited transparent fee structure.',
      badgeLabel: 'Sponsored',
      ctaText: 'Explore Campus & Fee Structure',
      ctaLink: '/schools/delhi-world-public-school-kp-5',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
      status: 'active',
      priority: 1,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    promotions.push(initialCampaign);
  }

  saveStoreToDisk();
}

let mongoSyncPromise: Promise<void> | null = null;

export async function ensureMongoSync(): Promise<void> {
  if (!isMongoConfigured()) return;
  if (mongoSyncPromise) return mongoSyncPromise;

  mongoSyncPromise = (async () => {
    try {
      const usersCol = await getUsersCollection();
      if (!usersCol) return;

      // 1. Fetch all users from Mongo into memory
      const mongoUsers = await usersCol.find({}).toArray();
      if (mongoUsers.length > 0) {
        for (const u of mongoUsers) {
          if (!u.status) u.status = 'active';
          if (!u.role) u.role = 'parent';
          users.set(u.email.toLowerCase(), u);
        }
      } else {
        // Mongo is empty, seed with current memory / file users
        for (const u of users.values()) {
          await usersCol.updateOne({ id: u.id }, { $set: u }, { upsert: true });
        }
      }

      // 2. Ratings
      const ratingsCol = await getRatingsCollection();
      if (ratingsCol) {
        const mongoRatings = await ratingsCol.find({}).toArray();
        if (mongoRatings.length > 0) {
          ratings.length = 0;
          ratings.push(...mongoRatings.map(r => ({ ...r, status: r.status || 'published' })));
        } else if (ratings.length > 0) {
          for (const r of ratings) {
            await ratingsCol.updateOne({ id: r.id }, { $set: r }, { upsert: true });
          }
        }
      }

      // 3. Reminders
      const remindersCol = await getRemindersCollection();
      if (remindersCol) {
        const mongoReminders = await remindersCol.find({}).toArray();
        if (mongoReminders.length > 0) {
          reminders.length = 0;
          reminders.push(...mongoReminders);
        } else if (reminders.length > 0) {
          for (const rem of reminders) {
            await remindersCol.updateOne({ id: rem.id }, { $set: rem }, { upsert: true });
          }
        }
      }

      // 4. Promotions
      const promoCol = await getPromotionsCollection();
      if (promoCol) {
        const mongoPromos = await promoCol.find({}).toArray();
        if (mongoPromos.length > 0) {
          promotions.length = 0;
          promotions.push(...mongoPromos);
        } else if (promotions.length > 0) {
          for (const p of promotions) {
            await promoCol.updateOne({ id: p.id }, { $set: p }, { upsert: true });
          }
        }
      }

      // 5. School views & saves
      const viewsCol = await getSchoolViewsCollection();
      if (viewsCol) {
        const mongoViews = await viewsCol.find({}).toArray();
        for (const v of mongoViews) {
          const count = typeof v.totalViews === 'number' ? v.totalViews : (typeof v.count === 'number' ? v.count : 0);
          schoolViews.set(v.slug, count);
        }
      }

      const savesCol = await getSchoolSavesCollection();
      if (savesCol) {
        const mongoSaves = await savesCol.find({}).toArray();
        for (const s of mongoSaves) {
          schoolSaves.set(s.slug, s.count);
        }
      }
    } catch (err) {
      console.warn('[MONGO_INIT_SYNC_ERROR]', err);
    }
  })();

  return mongoSyncPromise;
}

// Initialize immediately
initDb();
if (isMongoConfigured()) {
  ensureMongoSync().catch(() => {});
}

// ----------------------------------------------------------------------------
// PASSWORD HASHING & JWT SESSION UTILITIES
// ----------------------------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${hash}:${salt}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [hash, salt] = storedHash.split(':');
    if (!hash || !salt) return false;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
  } catch {
    return false;
  }
}

export function updateUserPassword(userId: string, newPassword: string): boolean {
  initDb();
  const user = getUserById(userId);
  if (!user) return false;

  user.passwordHash = hashPassword(newPassword);
  user.lastActivityAt = new Date().toISOString();
  saveStoreToDisk(true);
  return true;
}

export async function updateUserPasswordAsync(userId: string, newPassword: string): Promise<boolean> {
  const newHash = hashPassword(newPassword);
  const nowIso = new Date().toISOString();
  let updated = false;

  if (isMongoConfigured()) {
    const usersCol = await getUsersCollection(true);
    if (usersCol) {
      const res = await usersCol.updateOne(
        { id: userId },
        { $set: { passwordHash: newHash, lastActivityAt: nowIso } }
      );
      if (res.matchedCount > 0) {
        updated = true;
      }
    }
  }

  // Update memory cache and disk store
  const user = getUserById(userId);
  if (user) {
    user.passwordHash = newHash;
    user.lastActivityAt = nowIso;
    saveStoreToDisk(true);
    updated = true;
  }

  return updated;
}

export function createSessionToken(user: ParentUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    childName: user.childName || '',
    childGrade: user.childGrade || '',
    residentialSociety: user.residentialSociety || '',
    preferredSchoolLocality: user.preferredSchoolLocality || '',
    role: user.role || 'parent',
    status: user.status || 'active',
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string): {
  sub: string;
  email: string;
  name: string;
  phone?: string;
  childName?: string;
  childGrade?: string;
  residentialSociety?: string;
  preferredSchoolLocality?: string;
  role?: 'parent' | 'admin';
  status?: 'active' | 'disabled';
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(`${header}.${body}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Rate Limiting (Max 5 requests per 10 minutes)
export function getClientIp(req: NextRequest): string {
  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp.trim()) return realIp.trim();
  const reqWithIp = req as { ip?: string };
  if (reqWithIp.ip && typeof reqWithIp.ip === 'string') return reqWithIp.ip;
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const parts = xForwardedFor.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return '127.0.0.1';
}

export function checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || now > current.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function checkRateLimitAsync(key: string, maxRequests: number = 5, windowMs: number = 10 * 60 * 1000): Promise<boolean> {
  const allowedInMemory = checkRateLimit(key, maxRequests, windowMs);
  if (!allowedInMemory) return false;

  if (isMongoConfigured()) {
    try {
      const rlCol = await getRateLimitsCollection();
      if (rlCol) {
        const now = Date.now();
        const existing = await rlCol.findOne({ key });
        if (!existing || now > existing.resetAt) {
          await rlCol.updateOne(
            { key },
            { $set: { key, count: 1, resetAt: now + windowMs } },
            { upsert: true }
          );
          return true;
        }
        if (existing.count >= maxRequests) {
          return false;
        }
        await rlCol.updateOne({ key }, { $inc: { count: 1 } });
        return true;
      }
    } catch (err) {
      console.warn('[MONGO_RATE_LIMIT_WARN]', err);
    }
  }
  return allowedInMemory;
}

// Stateless HMAC OTP token generation for email verification
export function createStatelessOtpToken(
  email: string,
  code: string,
  purpose: 'register' | 'login',
  expiresInSeconds: number = 600
): string {
  const cleanEmail = email.trim().toLowerCase();
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const hmac = crypto
    .createHmac('sha256', getJwtSecret())
    .update(`otp:email:${cleanEmail}:${code}:${purpose}:${exp}`)
    .digest('hex');

  const payload = {
    email: cleanEmail,
    purpose,
    channel: 'email',
    exp,
    h: hmac,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(`otp_session:${payloadStr}`)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

export function createSignedVerificationToken(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const exp = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes validity

  const payload = {
    email: cleanEmail,
    exp,
    purpose: 'verified_email',
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(`verify_tok:${payloadStr}`)
    .digest('base64url');

  const token = `${payloadStr}.${signature}`;

  verificationTokens.set(token, {
    email: cleanEmail,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  return token;
}

// OTP Operations
export function generateAndStoreOtp(
  email: string,
  purpose: 'register' | 'login'
): { code: string; expiresInSeconds: number; otpSessionToken: string } {
  const cleanEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const expiresInSeconds = 10 * 60; // 10 minutes
  const expiresAt = Date.now() + expiresInSeconds * 1000;

  otps.set(cleanEmail, {
    code,
    expiresAt,
    attempts: 0,
    verified: false,
    purpose,
  });

  const otpSessionToken = createStatelessOtpToken(cleanEmail, code, purpose, expiresInSeconds);

  return {
    code,
    expiresInSeconds,
    otpSessionToken,
  };
}

export function verifyOtpCode(
  email: string,
  inputCode: string,
  statelessSessionToken?: string
): { success: boolean; error?: string; verificationToken?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanInput = inputCode.trim();

  // 1. In-memory store check
  const record = otps.get(cleanEmail);
  if (record) {
    if (Date.now() > record.expiresAt) {
      otps.delete(cleanEmail);
      return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }

    if (record.attempts >= 5) {
      otps.delete(cleanEmail);
      return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
    }

    record.attempts += 1;

    if (record.code !== cleanInput) {
      return { success: false, error: `Invalid verification code. ${5 - record.attempts} attempts remaining.` };
    }

    record.verified = true;
    otps.delete(cleanEmail);

    const verificationToken = createSignedVerificationToken(cleanEmail);
    return {
      success: true,
      verificationToken,
    };
  }

  // 2. Stateless HMAC token verification
  if (statelessSessionToken) {
    try {
      const parts = statelessSessionToken.split('.');
      if (parts.length === 2) {
        const [payloadStr, signature] = parts;
        const expectedSig = crypto
          .createHmac('sha256', getJwtSecret())
          .update(`otp_session:${payloadStr}`)
          .digest('base64url');

        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
          const data = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
          if (data.email === cleanEmail && data.exp > Math.floor(Date.now() / 1000)) {
            const testHmac = crypto
              .createHmac('sha256', getJwtSecret())
              .update(`otp:email:${cleanEmail}:${cleanInput}:${data.purpose}:${data.exp}`)
              .digest('hex');

            if (crypto.timingSafeEqual(Buffer.from(testHmac), Buffer.from(data.h))) {
              const verificationToken = createSignedVerificationToken(cleanEmail);
              return {
                success: true,
                verificationToken,
              };
            } else {
              return { success: false, error: 'Invalid verification code.' };
            }
          } else if (data.exp <= Math.floor(Date.now() / 1000)) {
            return { success: false, error: 'Verification code has expired. Please request a new code.' };
          }
        }
      }
    } catch {
      // Fall through
    }
  }

  return { success: false, error: 'No active OTP found. Please request a new verification code.' };
}

export async function generateAndStoreOtpAsync(
  email: string,
  purpose: 'register' | 'login'
): Promise<{ code: string; expiresInSeconds: number; otpSessionToken: string }> {
  const syncRes = generateAndStoreOtp(email, purpose);
  if (isMongoConfigured()) {
    try {
      const otpsCol = await getOtpsCollection();
      if (otpsCol) {
        const cleanEmail = email.trim().toLowerCase();
        const nowIso = new Date().toISOString();
        await otpsCol.updateOne(
          { email: cleanEmail },
          {
            $set: {
              email: cleanEmail,
              code: syncRes.code,
              purpose,
              expiresAt: Date.now() + syncRes.expiresInSeconds * 1000,
              attempts: 0,
              verified: false,
              createdAt: nowIso,
              updatedAt: nowIso,
            },
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('[MONGO_STORE_OTP_WARN]', err);
    }
  }
  return syncRes;
}

export async function verifyOtpCodeAsync(
  email: string,
  inputCode: string,
  statelessSessionToken?: string
): Promise<{ success: boolean; error?: string; verificationToken?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanInput = inputCode.trim();

  if (isMongoConfigured()) {
    try {
      const otpsCol = await getOtpsCollection();
      if (otpsCol) {
        const doc = await otpsCol.findOne({ email: cleanEmail });
        if (doc) {
          if (Date.now() > doc.expiresAt) {
            await otpsCol.deleteOne({ email: cleanEmail });
            otps.delete(cleanEmail);
            return { success: false, error: 'Verification code has expired. Please request a new code.' };
          }
          if (doc.attempts >= 5) {
            await otpsCol.deleteOne({ email: cleanEmail });
            otps.delete(cleanEmail);
            return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
          }

          const newAttempts = doc.attempts + 1;
          await otpsCol.updateOne({ email: cleanEmail }, { $inc: { attempts: 1 } });

          if (doc.code !== cleanInput) {
            if (newAttempts >= 5) {
              await otpsCol.deleteOne({ email: cleanEmail });
              otps.delete(cleanEmail);
              return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
            }
            return { success: false, error: `Invalid verification code. ${5 - newAttempts} attempts remaining.` };
          }

          await otpsCol.deleteOne({ email: cleanEmail });
          otps.delete(cleanEmail);
          const verificationToken = createSignedVerificationToken(cleanEmail);
          return { success: true, verificationToken };
        }
      }
    } catch (err) {
      console.warn('[MONGO_VERIFY_OTP_WARN]', err);
    }
  }

  return verifyOtpCode(cleanEmail, cleanInput, statelessSessionToken);
}

export function checkVerificationToken(token: string): string | null {
  if (!token || typeof token !== 'string') return null;

  const record = verificationTokens.get(token);
  if (record) {
    if (Date.now() > record.expiresAt) {
      verificationTokens.delete(token);
      return null;
    }
    return record.email;
  }

  try {
    const parts = token.split('.');
    if (parts.length === 2) {
      const [payloadStr, signature] = parts;
      const expectedSig = crypto
        .createHmac('sha256', getJwtSecret())
        .update(`verify_tok:${payloadStr}`)
        .digest('base64url');

      if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
        if (payload.exp && payload.exp > Math.floor(Date.now() / 1000)) {
          return payload.email || null;
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}

// ----------------------------------------------------------------------------
// USER DIRECTORY & MANAGEMENT CRUD (Sync & Async with MongoDB)
// ----------------------------------------------------------------------------

export function getUserByEmail(email: string): ParentUser | null {
  const normalized = email.trim().toLowerCase();
  return users.get(normalized) || null;
}

export function getUserByEmailOrMobile(identifier: string): ParentUser | null {
  return getUserByEmail(identifier);
}

export function getUserById(id: string): ParentUser | null {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function getUserByEmailAsync(email: string): Promise<ParentUser | null> {
  const normalized = email.trim().toLowerCase();

  if (isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection(true);
      if (usersCol) {
        const doc = await usersCol.findOne({ email: normalized });
        if (doc) {
          if (!doc.status) doc.status = 'active';
          if (!doc.role) doc.role = 'parent';
          users.set(normalized, doc);
          return doc;
        }
        return null;
      }
    } catch (err) {
      console.error('[MONGO_GET_USER_BY_EMAIL_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getUserByEmail(normalized);
}

export async function getUserByEmailOrMobileAsync(identifier: string): Promise<ParentUser | null> {
  return getUserByEmailAsync(identifier);
}

export async function getUserByIdAsync(id: string): Promise<ParentUser | null> {
  if (!id) return null;

  if (isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection(true);
      if (usersCol) {
        const doc = await usersCol.findOne({ id });
        if (doc) {
          if (!doc.status) doc.status = 'active';
          if (!doc.role) doc.role = 'parent';
          users.set(doc.email.toLowerCase(), doc);
          return doc;
        }
        return null;
      }
    } catch (err) {
      console.error('[MONGO_GET_USER_BY_ID_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getUserById(id);
}

export function createParentUser(userData: {
  name: string;
  email: string;
  phone?: string;
  childName?: string;
  childGrade?: string;
  residentialSociety?: string;
  fatherName?: string;
  motherName?: string;
  preferredSchoolLocality?: string;
  password?: string;
  preferredBoards?: string[];
  analyticsConsent?: boolean;
  role?: 'parent' | 'admin';
}): { user?: ParentUser; error?: string } {
  const emailKey = userData.email.trim().toLowerCase();

  if (users.has(emailKey)) {
    return { error: 'An account with this email address already exists.' };
  }

  const now = new Date().toISOString();
  const newUser: ParentUser = {
    id: `usr_${crypto.randomBytes(8).toString('hex')}`,
    name: userData.name.trim(),
    email: emailKey,
    phone: userData.phone ? userData.phone.trim() : undefined,
    childName: userData.childName ? userData.childName.trim() : undefined,
    childGrade: userData.childGrade ? userData.childGrade.trim() : '',
    residentialSociety: userData.residentialSociety ? userData.residentialSociety.trim() : undefined,
    fatherName: userData.fatherName ? userData.fatherName.trim() : undefined,
    motherName: userData.motherName ? userData.motherName.trim() : undefined,
    status: 'active',
    preferredSchoolLocality: userData.preferredSchoolLocality?.trim() || '',
    preferredBoards: userData.preferredBoards || [],
    passwordHash: userData.password ? hashPassword(userData.password) : undefined,
    emailVerified: true,
    analyticsConsent: userData.analyticsConsent ?? true,
    role: userData.role || 'parent',
    createdAt: now,
    lastLoginAt: now,
    lastActivityAt: now,
    wishlist: [],
    compareList: [],
    applicationTracker: [],
  };

  users.set(emailKey, newUser);
  saveStoreToDisk();

  recordActivityEvent({
    type: 'user_signup',
    userId: newUser.id,
    targetType: 'user',
    targetId: newUser.id,
    locality: newUser.preferredSchoolLocality,
  });

  return { user: newUser };
}

export async function createParentUserAsync(userData: {
  name: string;
  email: string;
  phone?: string;
  childName?: string;
  childGrade?: string;
  residentialSociety?: string;
  fatherName?: string;
  motherName?: string;
  preferredSchoolLocality?: string;
  password?: string;
  preferredBoards?: string[];
  analyticsConsent?: boolean;
  role?: 'parent' | 'admin';
}): Promise<{ user?: ParentUser; error?: string }> {
  await ensureMongoSync();
  const emailKey = userData.email.trim().toLowerCase();

  const existing = await getUserByEmailAsync(emailKey);
  if (existing) {
    return { error: 'An account with this email address already exists.' };
  }

  const res = createParentUser(userData);
  if (res.user && isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection();
      if (usersCol) {
        await usersCol.updateOne({ id: res.user.id }, { $set: res.user }, { upsert: true });
      }
    } catch (err) {
      console.warn('[MONGO_CREATE_PARENT_USER_ERROR]', err);
    }
  }
  return res;
}

export function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    childName?: string;
    childGrade?: string;
    residentialSociety?: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    preferredBoards?: string[];
    analyticsConsent?: boolean;
    applicationTracker?: ApplicationTrackerItem[];
    status?: 'active' | 'disabled';
    role?: 'parent' | 'admin';
  }
): ParentUser | null {
  const user = getUserById(userId);
  if (!user) return null;

  if (updates.name !== undefined) user.name = updates.name.trim();
  if (updates.phone !== undefined) user.phone = updates.phone ? updates.phone.trim() : undefined;
  if (updates.childName !== undefined) user.childName = updates.childName ? updates.childName.trim() : undefined;
  if (updates.childGrade !== undefined) user.childGrade = updates.childGrade.trim();
  if (updates.residentialSociety !== undefined) user.residentialSociety = updates.residentialSociety ? updates.residentialSociety.trim() : undefined;
  if (updates.fatherName !== undefined) user.fatherName = updates.fatherName ? updates.fatherName.trim() : undefined;
  if (updates.motherName !== undefined) user.motherName = updates.motherName ? updates.motherName.trim() : undefined;
  if (updates.preferredSchoolLocality !== undefined) {
    user.preferredSchoolLocality = updates.preferredSchoolLocality.trim();
    recordActivityEvent({
      type: 'search_area_selected',
      userId,
      locality: user.preferredSchoolLocality,
    });
  }
  if (updates.preferredBoards !== undefined) user.preferredBoards = updates.preferredBoards;
  if (updates.childGrade !== undefined) user.childGrade = updates.childGrade;
  if (updates.analyticsConsent !== undefined) user.analyticsConsent = updates.analyticsConsent;
  if (updates.applicationTracker !== undefined) user.applicationTracker = updates.applicationTracker;
  if (updates.status !== undefined) user.status = updates.status;
  if (updates.role !== undefined) user.role = updates.role;

  user.lastActivityAt = new Date().toISOString();
  saveStoreToDisk();
  return user;
}

export async function updateUserProfileAsync(
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    childName?: string;
    childGrade?: string;
    residentialSociety?: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    preferredBoards?: string[];
    analyticsConsent?: boolean;
    applicationTracker?: ApplicationTrackerItem[];
    status?: 'active' | 'disabled';
    role?: 'parent' | 'admin';
  }
): Promise<ParentUser | null> {
  await ensureMongoSync();
  const user = updateUserProfile(userId, updates);
  if (user && isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection();
      if (usersCol) {
        await usersCol.updateOne({ id: user.id }, { $set: user }, { upsert: true });
      }
    } catch (err) {
      console.warn('[MONGO_UPDATE_USER_PROFILE_ERROR]', err);
    }
  }
  return user;
}

export function updateUserStatus(
  userId: string,
  status: 'active' | 'disabled' | 'suspended' | 'banned',
  adminUserId?: string,
  reason?: string,
  durationDays?: number
): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  user.status = status;
  user.lastActivityAt = new Date().toISOString();

  if (status === 'suspended' || status === 'banned') {
    user.suspensionReason = reason || 'Administrative action';
    user.suspendedAt = new Date().toISOString();
    user.suspendedBy = adminUserId;
    if (status === 'suspended' && durationDays && durationDays > 0) {
      user.suspensionDuration = `${durationDays} days`;
      user.suspensionExpiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    } else {
      delete user.suspensionDuration;
      delete user.suspensionExpiresAt;
    }
  } else {
    delete user.suspensionReason;
    delete user.suspensionDuration;
    delete user.suspensionExpiresAt;
    delete user.suspendedAt;
    delete user.suspendedBy;
  }

  saveStoreToDisk();

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      status === 'disabled' || status === 'banned' || status === 'suspended' ? `account_${status}` : 'enable_account',
      'user',
      userId,
      { targetEmail: user.email, reason, durationDays },
      'success'
    );
  }

  return true;
}

export async function updateUserStatusAsync(
  userId: string,
  status: 'active' | 'disabled' | 'suspended' | 'banned',
  adminUserId?: string,
  reason?: string,
  durationDays?: number
): Promise<boolean> {
  await ensureMongoSync();
  const res = updateUserStatus(userId, status, adminUserId, reason, durationDays);
  if (res && isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection();
      const user = getUserById(userId);
      if (usersCol && user) {
        await usersCol.updateOne({ id: user.id }, { $set: user }, { upsert: true });
      }
    } catch (err) {
      console.warn('[MONGO_UPDATE_STATUS_ERROR]', err);
    }
  }
  return res;
}

export function isUserSuspendedOrBanned(userId: string): { blocked: boolean; status?: string; reason?: string } {
  const user = getUserById(userId);
  if (!user) return { blocked: true, status: 'not_found', reason: 'Account not found.' };
  if (user.status === 'banned') {
    return { blocked: true, status: 'banned', reason: user.suspensionReason || 'Account permanently banned.' };
  }
  if (user.status === 'suspended') {
    if (user.suspensionExpiresAt && new Date(user.suspensionExpiresAt).getTime() < Date.now()) {
      user.status = 'active';
      delete user.suspensionReason;
      delete user.suspensionExpiresAt;
      saveStoreToDisk();
      return { blocked: false };
    }
    return { blocked: true, status: 'suspended', reason: user.suspensionReason || 'Account suspended.' };
  }
  if (user.status === 'disabled') {
    return { blocked: true, status: 'disabled', reason: 'Account disabled.' };
  }
  return { blocked: false };
}

export function updateUserRole(userId: string, role: 'parent' | 'admin', adminUserId?: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  user.role = role;
  user.lastActivityAt = new Date().toISOString();
  saveStoreToDisk();

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'change_user_role',
      'user',
      userId,
      { targetEmail: user.email, newRole: role },
      'success'
    );
  }

  return true;
}

export async function updateUserRoleAsync(userId: string, role: 'parent' | 'admin', adminUserId?: string): Promise<boolean> {
  await ensureMongoSync();
  const res = updateUserRole(userId, role, adminUserId);
  if (res && isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection();
      const user = getUserById(userId);
      if (usersCol && user) {
        await usersCol.updateOne({ id: user.id }, { $set: user }, { upsert: true });
      }
    } catch (err) {
      console.warn('[MONGO_UPDATE_ROLE_ERROR]', err);
    }
  }
  return res;
}

export function updateUserLists(userId: string, wishlist?: string[], compareList?: string[]) {
  const user = getUserById(userId);
  if (user) {
    if (wishlist) user.wishlist = wishlist;
    if (compareList) user.compareList = compareList;
    user.lastActivityAt = new Date().toISOString();
    saveStoreToDisk();
  }
}

export async function updateUserListsAsync(userId: string, wishlist?: string[], compareList?: string[]): Promise<ParentUser | null> {
  if (isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection(true);
      if (usersCol) {
        const updateDoc: Record<string, unknown> = { lastActivityAt: new Date().toISOString() };
        if (wishlist !== undefined) updateDoc.wishlist = wishlist;
        if (compareList !== undefined) updateDoc.compareList = compareList;

        await usersCol.updateOne({ id: userId }, { $set: updateDoc });
        const updatedDoc = await usersCol.findOne({ id: userId });
        if (updatedDoc) {
          const { _id, ...safeUser } = updatedDoc as unknown as ParentUser & { _id?: unknown };
          users.set(safeUser.email.toLowerCase(), safeUser as ParentUser);
          saveStoreToDisk();
          return safeUser as ParentUser;
        }
      }
    } catch (err) {
      console.error('[MONGO_UPDATE_LISTS_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  const user = await getUserByIdAsync(userId);
  if (user) {
    if (wishlist) user.wishlist = wishlist;
    if (compareList) user.compareList = compareList;
    user.lastActivityAt = new Date().toISOString();
    users.set(user.email.toLowerCase(), user);
    saveStoreToDisk();
    return user;
  }
  return null;
}

export function removeWishlistItemForUser(userId: string, schoolSlug: string, adminUserId?: string): boolean {
  const user = getUserById(userId);
  if (!user || !user.wishlist.includes(schoolSlug)) return false;

  user.wishlist = user.wishlist.filter(s => s !== schoolSlug);
  user.lastActivityAt = new Date().toISOString();

  // Decrement aggregate school save
  const current = schoolSaves.get(schoolSlug) || 0;
  schoolSaves.set(schoolSlug, Math.max(0, current - 1));

  recordActivityEvent({
    type: 'wishlist_remove',
    userId,
    schoolSlug,
    targetType: 'school',
    targetId: schoolSlug,
    details: adminUserId ? { removedByAdmin: adminUserId } : undefined,
  });

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'remove_user_shortlist_item',
      'user',
      userId,
      { schoolSlug, targetEmail: user.email },
      'success'
    );
  }

  saveStoreToDisk();
  return true;
}

export async function removeWishlistItemForUserAsync(userId: string, schoolSlug: string, adminUserId?: string): Promise<boolean> {
  if (isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection(true);
      if (usersCol) {
        const user = await usersCol.findOne({ id: userId });
        if (!user || !Array.isArray(user.wishlist) || !user.wishlist.includes(schoolSlug)) {
          return false;
        }
        const newWishlist = user.wishlist.filter((s: string) => s !== schoolSlug);
        const now = new Date().toISOString();
        await usersCol.updateOne({ id: userId }, { $set: { wishlist: newWishlist, lastActivityAt: now } });

        const savesCol = await getSchoolSavesCollection(true);
        if (savesCol) {
          await savesCol.updateOne(
            { slug: schoolSlug },
            { $inc: { count: -1 }, $set: { lastSavedAt: now } },
            { upsert: true }
          );
        }

        await recordActivityEventAsync({
          type: 'wishlist_remove',
          userId,
          schoolSlug,
          targetType: 'school',
          targetId: schoolSlug,
          details: adminUserId ? { removedByAdmin: adminUserId } : undefined,
        });

        if (adminUserId) {
          const adminUser = await getUserByIdAsync(adminUserId);
          await recordAdminAuditAsync(
            adminUserId,
            adminUser?.email || 'admin@admissionpitara.com',
            'remove_user_shortlist_item',
            'user',
            userId,
            { schoolSlug, targetEmail: user.email },
            'success'
          );
        }

        const localUser = getUserById(userId);
        if (localUser) {
          localUser.wishlist = newWishlist;
          localUser.lastActivityAt = now;
          users.set(localUser.email.toLowerCase(), localUser);
        }
        return true;
      }
    } catch (err) {
      console.error('[MONGO_REMOVE_WISHLIST_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  const res = removeWishlistItemForUser(userId, schoolSlug, adminUserId);
  return res;
}

export function deleteParentUser(userId: string, adminUserId?: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  // Cleanup: Remove ratings authored by this user
  ratings = ratings.filter(r => r.userId !== userId);
  globalAuthStore.__ADMISSION_PITARA_RATINGS__ = ratings;

  // Adjust school save tallies
  if (Array.isArray(user.wishlist)) {
    for (const slug of user.wishlist) {
      const current = schoolSaves.get(slug) || 0;
      schoolSaves.set(slug, Math.max(0, current - 1));
    }
  }

  // Delete user record
  users.delete(user.email.toLowerCase());
  saveStoreToDisk();

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'delete_user_account',
      'user',
      userId,
      { targetEmail: user.email, name: user.name },
      'success'
    );
  }

  return true;
}

export async function deleteParentUserAsync(userId: string, adminUserId?: string): Promise<boolean> {
  if (isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection(true);
      const user = usersCol ? await usersCol.findOne({ id: userId }) : null;
      if (usersCol) {
        await usersCol.deleteOne({ id: userId });
      }
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        await ratingsCol.deleteMany({ userId });
      }

      // Keep the school-save aggregate consistent with the user's current shortlist.
      if (user && Array.isArray(user.wishlist) && user.wishlist.length > 0) {
        const savesCol = await getSchoolSavesCollection(true);
        if (savesCol) {
          const decrement = new Map<string, number>();
          for (const slug of user.wishlist) {
            decrement.set(slug, (decrement.get(slug) || 0) + 1);
          }
          for (const [slug, amount] of decrement) {
            await savesCol.updateOne(
              { slug },
              { $inc: { count: -amount }, $set: { lastSavedAt: new Date().toISOString() } },
              { upsert: true }
            );
          }
        }
      }

      if (adminUserId) {
        const adminUser = await getUserByIdAsync(adminUserId);
        await recordAdminAuditAsync(
          adminUserId,
          adminUser?.email || 'admin@admissionpitara.com',
          'delete_user_account',
          'user',
          userId,
          { targetEmail: user?.email, name: user?.name },
          'success'
        );
      }

      deleteParentUser(userId, adminUserId);
      return true;
    } catch (err) {
      console.error('[MONGO_DELETE_USER_ASYNC_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return deleteParentUser(userId, adminUserId);
}

export function sanitizeUser(user: ParentUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export function getAllUsersSanitized() {
  const uniqueUsers = new Map<string, ReturnType<typeof sanitizeUser>>();
  for (const user of users.values()) {
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, sanitizeUser(user));
    }
  }
  return Array.from(uniqueUsers.values());
}

export async function getAllUsersSanitizedAsync() {
  if (isMongoConfigured()) {
    try {
      const usersCol = await getUsersCollection(true);
      if (usersCol) {
        const mongoUsers = await usersCol.find({}).sort({ createdAt: -1 }).toArray();
        const uniqueUsers = new Map<string, ReturnType<typeof sanitizeUser>>();
        for (const u of mongoUsers) {
          if (!u.status) u.status = 'active';
          if (!u.role) u.role = 'parent';
          users.set(u.email.toLowerCase(), u);
          if (!uniqueUsers.has(u.id)) {
            uniqueUsers.set(u.id, sanitizeUser(u));
          }
        }
        return Array.from(uniqueUsers.values());
      }
    } catch (err) {
      console.error('[MONGO_GET_ALL_USERS_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getAllUsersSanitized();
}

export function getAllParentUsers() {
  return getAllUsersSanitized();
}

export async function getAllParentUsersAsync() {
  return getAllUsersSanitizedAsync();
}

// ----------------------------------------------------------------------------
// ACTIVITY TRACKING & CONCURRENCY-ISOLATED TELEMETRY
// ----------------------------------------------------------------------------

export function recordActivityEvent(params: {
  type: ActivityEventType;
  userId?: string;
  visitorId?: string;
  targetType?: 'school' | 'user' | 'review' | 'search' | 'promotion' | 'system';
  targetId?: string;
  schoolSlug?: string;
  locality?: string;
  searchQuery?: string;
  approximateTimeSpent?: string;
  details?: Record<string, unknown>;
  persistMongo?: boolean;
}): ActivityEvent {
  const { type, userId, visitorId, targetType, targetId, schoolSlug, locality, searchQuery, approximateTimeSpent, details, persistMongo = true } = params;

  // Update user's lastActivityAt if userId is provided
  if (userId) {
    const user = getUserById(userId);
    if (user) {
      user.lastActivityAt = new Date().toISOString();
    }
  }

  // Aggregate counters for school metrics
  if (schoolSlug) {
    if (type === 'school_view') {
      const current = schoolViews.get(schoolSlug) || 0;
      schoolViews.set(schoolSlug, current + 1);
    } else if (type === 'wishlist_add') {
      const current = schoolSaves.get(schoolSlug) || 0;
      schoolSaves.set(schoolSlug, current + 1);
    } else if (type === 'wishlist_remove') {
      const current = schoolSaves.get(schoolSlug) || 0;
      schoolSaves.set(schoolSlug, Math.max(0, current - 1));
    }
  }

  const evt: ActivityEvent = {
    id: `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    type,
    userId,
    visitorId,
    targetType: targetType || (schoolSlug ? 'school' : undefined),
    targetId: targetId || schoolSlug,
    schoolSlug,
    locality,
    searchQuery,
    approximateTimeSpent,
    details,
    timestamp: new Date().toISOString(),
  };

  activityEvents.unshift(evt);
  if (activityEvents.length > 100000) {
    activityEvents.length = 100000;
  }

  saveStoreToDisk();

  // Async persist to MongoDB without blocking synchronous callers
  if (persistMongo && isMongoConfigured()) {
    getActivityCollection().then(async col => {
      if (col) {
        await col.insertOne(evt);
      }
    }).catch(err => console.error('[MONGO_ACTIVITY_INSERT_ASYNC_ERR]', err));

    if (schoolSlug && type === 'school_view') {
      getSchoolViewsCollection().then(async col => {
        if (col) {
          const incFields: Record<string, number> = { totalViews: 1, count: 1 };
          if (userId) {
            incFields.authenticatedViews = 1;
          } else {
            incFields.anonymousViews = 1;
          }
          await col.updateOne(
            { slug: schoolSlug },
            {
              $inc: incFields,
              $set: { lastViewedAt: new Date().toISOString() },
            },
            { upsert: true }
          );
        }
      }).catch(err => console.error('[MONGO_SCHOOL_VIEW_ASYNC_ERR]', err));
    } else if (schoolSlug && (type === 'wishlist_add' || type === 'wishlist_remove')) {
      getSchoolSavesCollection().then(async col => {
        if (col) {
          const inc = type === 'wishlist_add' ? 1 : -1;
          await col.updateOne(
            { slug: schoolSlug },
            {
              $inc: { count: inc },
              $set: { lastSavedAt: new Date().toISOString() },
            },
            { upsert: true }
          );
        }
      }).catch(err => console.error('[MONGO_SCHOOL_SAVE_ASYNC_ERR]', err));
    }
  }

  return evt;
}

export async function recordActivityEventAsync(params: {
  type: ActivityEventType;
  userId?: string;
  visitorId?: string;
  targetType?: 'school' | 'user' | 'review' | 'search' | 'promotion' | 'system';
  targetId?: string;
  schoolSlug?: string;
  locality?: string;
  searchQuery?: string;
  approximateTimeSpent?: string;
  details?: Record<string, unknown>;
  failOnMongoError?: boolean;
}): Promise<ActivityEvent> {
  const { failOnMongoError = false, ...eventParams } = params;
  const evt = recordActivityEvent({ ...eventParams, persistMongo: false });

  if (isMongoConfigured()) {
    try {
      const col = await getActivityCollection(true);
      if (col) {
        await col.updateOne({ id: evt.id }, { $set: evt }, { upsert: true });
      } else if (failOnMongoError) {
        throw new Error('MongoDB activity collection is unavailable.');
      }

      if (eventParams.schoolSlug && eventParams.type === 'school_view') {
        const viewsCol = await getSchoolViewsCollection(true);
        if (viewsCol) {
          const incFields: Record<string, number> = { totalViews: 1, count: 1 };
          if (eventParams.userId) {
            incFields.authenticatedViews = 1;
          } else {
            incFields.anonymousViews = 1;
          }
          await viewsCol.updateOne(
            { slug: eventParams.schoolSlug },
            {
              $inc: incFields,
              $set: { lastViewedAt: new Date().toISOString() },
            },
            { upsert: true }
          );
        } else if (failOnMongoError) {
          throw new Error('MongoDB school views collection is unavailable.');
        }
      } else if (eventParams.schoolSlug && (eventParams.type === 'wishlist_add' || eventParams.type === 'wishlist_remove')) {
        const savesCol = await getSchoolSavesCollection(true);
        if (savesCol) {
          const inc = eventParams.type === 'wishlist_add' ? 1 : -1;
          await savesCol.updateOne(
            { slug: eventParams.schoolSlug },
            {
              $inc: { count: inc },
              $set: { lastSavedAt: new Date().toISOString() },
            },
            { upsert: true }
          );
        }
      }
    } catch (err) {
      console.error('[MONGO_RECORD_ACTIVITY_ASYNC_ERR]', err);
      if (failOnMongoError) throw err;
    }
  }

  return evt;
}

export function recordSchoolView(slug: string, userIdOrTimeSpent?: string, maybeUserId?: string): void {
  const userId = maybeUserId || (userIdOrTimeSpent && userIdOrTimeSpent.startsWith('usr_') ? userIdOrTimeSpent : undefined);
  const approximateTimeSpent = userIdOrTimeSpent && !userIdOrTimeSpent.startsWith('usr_') ? userIdOrTimeSpent : undefined;
  recordActivityEvent({
    type: 'school_view',
    schoolSlug: slug,
    targetType: 'school',
    targetId: slug,
    userId,
    approximateTimeSpent,
  });
}

export async function recordSchoolViewAsync(slug: string, userIdOrTimeSpent?: string, maybeUserId?: string): Promise<void> {
  const userId = maybeUserId || (userIdOrTimeSpent && userIdOrTimeSpent.startsWith('usr_') ? userIdOrTimeSpent : undefined);
  const approximateTimeSpent = userIdOrTimeSpent && !userIdOrTimeSpent.startsWith('usr_') ? userIdOrTimeSpent : undefined;
  await recordActivityEventAsync({
    type: 'school_view',
    schoolSlug: slug,
    targetType: 'school',
    targetId: slug,
    userId,
    approximateTimeSpent,
  });
}

export function recordSchoolSave(slug: string, userId?: string): void {
  recordActivityEvent({
    type: 'wishlist_add',
    schoolSlug: slug,
    targetType: 'school',
    targetId: slug,
    userId,
  });
}

export async function recordSchoolSaveAsync(slug: string, userId?: string): Promise<void> {
  await recordActivityEventAsync({
    type: 'wishlist_add',
    schoolSlug: slug,
    targetType: 'school',
    targetId: slug,
    userId,
  });
}

export function recordSearchEvent(params: {
  query: string;
  locality?: string;
  resultsCount?: number;
  userId?: string;
}): ActivityEvent {
  return recordActivityEvent({
    type: 'search_performed',
    userId: params.userId,
    targetType: 'search',
    searchQuery: params.query,
    locality: params.locality,
    details: {
      resultsCount: params.resultsCount,
    },
  });
}

export async function recordSearchEventAsync(params: {
  query: string;
  locality?: string;
  resultsCount?: number;
  userId?: string;
}): Promise<ActivityEvent> {
  return recordActivityEventAsync({
    type: 'search_performed',
    userId: params.userId,
    targetType: 'search',
    searchQuery: params.query,
    locality: params.locality,
    details: {
      resultsCount: params.resultsCount,
    },
  });
}

export function recordCompareEvent(params: {
  schoolSlugs: string[];
  userId?: string;
}): ActivityEvent {
  return recordActivityEvent({
    type: 'compare_view',
    userId: params.userId,
    targetType: 'school',
    details: {
      schools: params.schoolSlugs,
    },
  });
}

export async function recordCompareEventAsync(params: {
  schoolSlugs: string[];
  userId?: string;
}): Promise<ActivityEvent> {
  return recordActivityEventAsync({
    type: 'compare_view',
    userId: params.userId,
    targetType: 'school',
    details: {
      schools: params.schoolSlugs,
    },
  });
}

export function getActivityEvents(
  limit = 100,
  filters?: { type?: string; userId?: string; schoolSlug?: string; since?: string; until?: string }
): ActivityEvent[] {
  initDb();
  let events = [...activityEvents];

  if (filters?.type) {
    events = events.filter(e => e.type === filters.type);
  }
  if (filters?.userId) {
    events = events.filter(e => e.userId === filters.userId);
  }
  if (filters?.schoolSlug) {
    events = events.filter(e => e.schoolSlug === filters.schoolSlug || (Array.isArray(e.details?.schools) && (e.details.schools as string[]).includes(filters.schoolSlug!)));
  }
  if (filters?.since) {
    const sinceTime = new Date(filters.since).getTime();
    if (!isNaN(sinceTime)) {
      events = events.filter(e => new Date(e.timestamp).getTime() >= sinceTime);
    }
  }
  if (filters?.until) {
    const untilTime = new Date(filters.until).getTime();
    if (!isNaN(untilTime)) {
      events = events.filter(e => new Date(e.timestamp).getTime() <= untilTime);
    }
  }

  return events.slice(0, limit);
}

export async function getActivityEventsAsync(
  limit = 100,
  filters?: { type?: string; userId?: string; schoolSlug?: string; since?: string; until?: string }
): Promise<ActivityEvent[]> {
  if (isMongoConfigured()) {
    try {
      const col = await getActivityCollection(true);
      if (col) {
        const query: Record<string, unknown> = {};
        if (filters?.type) query.type = filters.type;
        if (filters?.userId) query.userId = filters.userId;
        if (filters?.schoolSlug) {
          query.$or = [
            { schoolSlug: filters.schoolSlug },
            { 'details.schools': filters.schoolSlug },
          ];
        }
        if (filters?.since || filters?.until) {
          query.timestamp = {
            ...(filters.since ? { $gte: filters.since } : {}),
            ...(filters.until ? { $lte: filters.until } : {}),
          };
        }

        const docs = await col
          .find(query)
          .sort({ timestamp: -1 })
          .limit(limit)
          .toArray();

        return docs.map(doc => {
          const { _id, ...rest } = doc as unknown as ActivityEvent & { _id?: unknown };
          return rest as ActivityEvent;
        });
      }
    } catch (err) {
      console.error('[MONGO_GET_ACTIVITY_EVENTS_ERROR]', err);
      throw err;
    }
  }

  return getActivityEvents(limit, filters);
}

export function getUserActivityTimeline(userId: string) {
  initDb();
  const userEvents = activityEvents.filter(e => e.userId === userId);

  let schoolsViewedCount = 0;
  let searchesPerformedCount = 0;
  let comparisonsCount = 0;
  let reviewsSubmittedCount = 0;

  const viewsMap = new Map<string, { slug: string; count: number; lastViewed: string }>();
  const searchHistory: { query: string; locality?: string; timestamp: string }[] = [];
  const comparisons: { pair: string[]; timestamp: string }[] = [];

  for (const evt of userEvents) {
    if (evt.type === 'school_view' && evt.schoolSlug) {
      schoolsViewedCount++;
      const current = viewsMap.get(evt.schoolSlug) || { slug: evt.schoolSlug, count: 0, lastViewed: evt.timestamp };
      current.count++;
      if (new Date(evt.timestamp) > new Date(current.lastViewed)) {
        current.lastViewed = evt.timestamp;
      }
      viewsMap.set(evt.schoolSlug, current);
    } else if (evt.type === 'search_performed') {
      searchesPerformedCount++;
      if (evt.searchQuery) {
        searchHistory.push({
          query: evt.searchQuery,
          locality: evt.locality,
          timestamp: evt.timestamp,
        });
      }
    } else if (evt.type === 'compare_view') {
      comparisonsCount++;
      if (Array.isArray(evt.details?.schools)) {
        comparisons.push({
          pair: evt.details.schools as string[],
          timestamp: evt.timestamp,
        });
      }
    } else if (evt.type === 'rating_submitted') {
      reviewsSubmittedCount++;
    }
  }

  const user = users.get(userId);
  const shortlistedCount = Array.isArray(user?.wishlist) ? user.wishlist.length : 0;

  return {
    summary: {
      schoolsViewedCount,
      searchesPerformedCount,
      comparisonsCount,
      shortlistedCount,
      reviewsSubmittedCount,
      totalEvents: userEvents.length,
    },
    timeline: userEvents.slice(0, 100),
    uniqueSchoolsViewed: Array.from(viewsMap.values()).sort((a, b) => b.count - a.count),
    searchHistory: searchHistory.slice(0, 50),
    comparisons: comparisons.slice(0, 50),
  };
}

export async function getUserActivityTimelineAsync(userId: string) {
  const userEvents = await getActivityEventsAsync(100000, { userId });
  const user = await getUserByIdAsync(userId);

  let schoolsViewedCount = 0;
  let searchesPerformedCount = 0;
  let comparisonsCount = 0;
  let reviewsSubmittedCount = 0;

  const viewsMap = new Map<string, { slug: string; count: number; lastViewed: string }>();
  const searchHistory: { query: string; locality?: string; timestamp: string }[] = [];
  const comparisons: { pair: string[]; timestamp: string }[] = [];

  for (const evt of userEvents) {
    if (evt.type === 'school_view' && evt.schoolSlug) {
      schoolsViewedCount++;
      const current = viewsMap.get(evt.schoolSlug) || { slug: evt.schoolSlug, count: 0, lastViewed: evt.timestamp };
      current.count++;
      if (new Date(evt.timestamp) > new Date(current.lastViewed)) {
        current.lastViewed = evt.timestamp;
      }
      viewsMap.set(evt.schoolSlug, current);
    } else if (evt.type === 'search_performed') {
      searchesPerformedCount++;
      if (evt.searchQuery) {
        searchHistory.push({
          query: evt.searchQuery,
          locality: evt.locality,
          timestamp: evt.timestamp,
        });
      }
    } else if (evt.type === 'compare_view') {
      comparisonsCount++;
      if (Array.isArray(evt.details?.schools)) {
        comparisons.push({
          pair: evt.details.schools as string[],
          timestamp: evt.timestamp,
        });
      }
    } else if (evt.type === 'rating_submitted') {
      reviewsSubmittedCount++;
    }
  }

  const shortlistedCount = Array.isArray(user?.wishlist) ? user.wishlist.length : 0;

  return {
    summary: {
      schoolsViewedCount,
      searchesPerformedCount,
      comparisonsCount,
      shortlistedCount,
      reviewsSubmittedCount,
      totalEvents: userEvents.length,
    },
    timeline: userEvents.slice(0, 100),
    uniqueSchoolsViewed: Array.from(viewsMap.values()).sort((a, b) => b.count - a.count),
    searchHistory: searchHistory.slice(0, 50),
    comparisons: comparisons.slice(0, 50),
  };
}

// ----------------------------------------------------------------------------
// RATINGS & REVIEWS SUBSYSTEM (Genuine Authenticated Reviews + Admin Moderation)
// ----------------------------------------------------------------------------

export function getSchoolRatings(slug: string): SchoolRating[] {
  return ratings
    .filter(r => r.schoolSlug === slug && r.status !== 'deleted')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSchoolRatingsAsync(slug: string): Promise<SchoolRating[]> {
  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const docs = await ratingsCol
          .find({ schoolSlug: slug, status: { $ne: 'deleted' } })
          .sort({ createdAt: -1 })
          .toArray();
        return docs;
      }
    } catch (err) {
      console.error('[MONGO_GET_SCHOOL_RATINGS_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getSchoolRatings(slug);
}

export function getAllRatings(includeDeleted = false): SchoolRating[] {
  const filtered = includeDeleted ? ratings : ratings.filter(r => r.status !== 'deleted');
  return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllRatingsAsync(includeDeleted = false): Promise<SchoolRating[]> {
  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const query = includeDeleted ? {} : { status: { $ne: 'deleted' as const } };
        const docs = await ratingsCol.find(query).sort({ createdAt: -1 }).toArray();
        return docs;
      }
    } catch (err) {
      console.error('[MONGO_GET_ALL_RATINGS_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getAllRatings(includeDeleted);
}

export function getUserRatingForSchool(schoolSlug: string, userId: string): SchoolRating | null {
  const found = ratings.find(r => r.schoolSlug === schoolSlug && r.userId === userId && r.status !== 'deleted');
  return found || null;
}

export async function getUserRatingForSchoolAsync(schoolSlug: string, userId: string): Promise<SchoolRating | null> {
  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const doc = await ratingsCol.findOne({ schoolSlug, userId, status: { $ne: 'deleted' } });
        return doc || null;
      }
    } catch (err) {
      console.error('[MONGO_GET_USER_RATING_FOR_SCHOOL_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getUserRatingForSchool(schoolSlug, userId);
}

export function getUserRatings(userId: string): SchoolRating[] {
  return ratings.filter(r => r.userId === userId && r.status !== 'deleted');
}

export async function getUserRatingsAsync(userId: string): Promise<SchoolRating[]> {
  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const docs = await ratingsCol.find({ userId, status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();
        return docs;
      }
    } catch (err) {
      console.error('[MONGO_GET_USER_RATINGS_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return getUserRatings(userId);
}

export function getSchoolRatingStats(slug: string): {
  averageScore: number;
  totalReviews: number;
  distribution: Record<number, number>;
  categoryAverages: {
    academics: number;
    infrastructure: number;
    faculty: number;
    safety: number;
  };
} {
  const schoolRats = getSchoolRatings(slug);
  return calculateStatsFromRatings(schoolRats);
}

function calculateStatsFromRatings(schoolRats: SchoolRating[]) {
  const totalReviews = schoolRats.length;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (totalReviews === 0) {
    return {
      averageScore: 0,
      totalReviews: 0,
      distribution,
      categoryAverages: { academics: 0, infrastructure: 0, faculty: 0, safety: 0 },
    };
  }

  let totalScore = 0;
  const catSum = { academics: 0, infrastructure: 0, faculty: 0, safety: 0 };
  const catCount = { academics: 0, infrastructure: 0, faculty: 0, safety: 0 };

  for (const r of schoolRats) {
    totalScore += r.score;
    const roundedStar = Math.min(5, Math.max(1, Math.round(r.score)));
    distribution[roundedStar] = (distribution[roundedStar] || 0) + 1;

    if (r.categories) {
      if (r.categories.academics) {
        catSum.academics += r.categories.academics;
        catCount.academics += 1;
      }
      if (r.categories.infrastructure) {
        catSum.infrastructure += r.categories.infrastructure;
        catCount.infrastructure += 1;
      }
      if (r.categories.faculty) {
        catSum.faculty += r.categories.faculty;
        catCount.faculty += 1;
      }
      if (r.categories.safety) {
        catSum.safety += r.categories.safety;
        catCount.safety += 1;
      }
    }
  }

  const averageScore = Math.round((totalScore / totalReviews) * 10) / 10;
  const categoryAverages = {
    academics: catCount.academics ? Math.round((catSum.academics / catCount.academics) * 10) / 10 : averageScore,
    infrastructure: catCount.infrastructure ? Math.round((catSum.infrastructure / catCount.infrastructure) * 10) / 10 : averageScore,
    faculty: catCount.faculty ? Math.round((catSum.faculty / catCount.faculty) * 10) / 10 : averageScore,
    safety: catCount.safety ? Math.round((catSum.safety / catCount.safety) * 10) / 10 : averageScore,
  };

  return {
    averageScore,
    totalReviews,
    distribution,
    categoryAverages,
  };
}

export async function getSchoolRatingStatsAsync(slug: string): Promise<{
  averageScore: number;
  totalReviews: number;
  distribution: Record<number, number>;
  categoryAverages: {
    academics: number;
    infrastructure: number;
    faculty: number;
    safety: number;
  };
}> {
  const schoolRats = await getSchoolRatingsAsync(slug);
  return calculateStatsFromRatings(schoolRats);
}

export function sanitizePublicRating(r: SchoolRating): Omit<SchoolRating, 'userId' | 'userEmail'> & { userId?: string } {
  if (r.isAnonymous) {
    return {
      id: r.id,
      schoolSlug: r.schoolSlug,
      score: r.score,
      title: r.title,
      comment: r.comment,
      categories: r.categories,
      verifiedParent: r.verifiedParent,
      isAnonymous: true,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      userName: 'Anonymous Parent',
    };
  }
  return {
    id: r.id,
    schoolSlug: r.schoolSlug,
    score: r.score,
    title: r.title,
    comment: r.comment,
    categories: r.categories,
    verifiedParent: r.verifiedParent,
    isAnonymous: false,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    userName: r.userName,
    userChildGrade: r.userChildGrade,
  };
}

export function getSanitizedSchoolRatings(slug: string) {
  return getSchoolRatings(slug).map(r => sanitizePublicRating(r));
}

export async function getSanitizedSchoolRatingsAsync(slug: string) {
  const schoolRats = await getSchoolRatingsAsync(slug);
  return schoolRats.map(r => sanitizePublicRating(r));
}

export function saveSchoolRating(ratingData: {
  schoolSlug: string;
  userId: string;
  userName: string;
  userChildGrade?: string;
  score: number;
  title?: string;
  comment: string;
  categories?: {
    academics?: number;
    infrastructure?: number;
    faculty?: number;
    safety?: number;
  };
  isAnonymous?: boolean;
}): SchoolRating {
  const boundedScore = Math.max(1, Math.min(5, Math.round(ratingData.score)));

  const existingIdx = ratings.findIndex(
    r => r.schoolSlug === ratingData.schoolSlug && r.userId === ratingData.userId
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    const existing = ratings[existingIdx];
    const updated: SchoolRating = {
      ...existing,
      score: boundedScore,
      title: ratingData.title !== undefined ? (ratingData.title ? ratingData.title.trim() : undefined) : existing.title,
      comment: ratingData.comment.trim(),
      categories: ratingData.categories || existing.categories,
      userChildGrade: ratingData.userChildGrade || existing.userChildGrade,
      userName: ratingData.userName || existing.userName,
      isAnonymous: ratingData.isAnonymous !== undefined ? Boolean(ratingData.isAnonymous) : Boolean(existing.isAnonymous),
      status: 'published',
      updatedAt: now,
    };
    ratings[existingIdx] = updated;
    saveStoreToDisk();

    recordActivityEvent({
      type: 'rating_edited',
      schoolSlug: ratingData.schoolSlug,
      userId: ratingData.userId,
      targetType: 'review',
      targetId: existing.id,
      details: { score: boundedScore, isAnonymous: updated.isAnonymous },
    });

    return updated;
  }

  const newRating: SchoolRating = {
    id: `rev_${crypto.randomBytes(8).toString('hex')}`,
    schoolSlug: ratingData.schoolSlug,
    userId: ratingData.userId,
    userName: ratingData.userName,
    userChildGrade: ratingData.userChildGrade,
    score: boundedScore,
    title: ratingData.title?.trim(),
    comment: ratingData.comment.trim(),
    categories: ratingData.categories,
    verifiedParent: true,
    isAnonymous: Boolean(ratingData.isAnonymous),
    status: 'published',
    createdAt: now,
    updatedAt: now,
  };

  ratings.push(newRating);
  saveStoreToDisk();

  recordActivityEvent({
    type: 'rating_submitted',
    schoolSlug: ratingData.schoolSlug,
    userId: ratingData.userId,
    targetType: 'review',
    targetId: newRating.id,
    details: { score: boundedScore, isAnonymous: newRating.isAnonymous },
  });

  return newRating;
}

export async function saveSchoolRatingAsync(ratingData: {
  schoolSlug: string;
  userId: string;
  userName: string;
  userChildGrade?: string;
  score: number;
  title?: string;
  comment: string;
  categories?: {
    academics?: number;
    infrastructure?: number;
    faculty?: number;
    safety?: number;
  };
  isAnonymous?: boolean;
}): Promise<SchoolRating> {
  const boundedScore = Math.max(1, Math.min(5, Math.round(ratingData.score)));
  const now = new Date().toISOString();

  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const existing = await ratingsCol.findOne({
          schoolSlug: ratingData.schoolSlug,
          userId: ratingData.userId,
          status: { $ne: 'deleted' },
        });

        if (existing) {
          const updated: SchoolRating = {
            ...existing,
            score: boundedScore,
            title: ratingData.title !== undefined ? (ratingData.title ? ratingData.title.trim() : undefined) : existing.title,
            comment: ratingData.comment.trim(),
            categories: ratingData.categories || existing.categories,
            userChildGrade: ratingData.userChildGrade || existing.userChildGrade,
            userName: ratingData.userName || existing.userName,
            isAnonymous: ratingData.isAnonymous !== undefined ? Boolean(ratingData.isAnonymous) : Boolean(existing.isAnonymous),
            status: 'published',
            updatedAt: now,
          };

          await ratingsCol.updateOne({ id: existing.id }, { $set: updated });

          // Update memory copy
          const idx = ratings.findIndex(r => r.id === existing.id);
          if (idx >= 0) ratings[idx] = updated;
          else ratings.push(updated);
          saveStoreToDisk();

          await recordActivityEventAsync({
            type: 'rating_edited',
            schoolSlug: ratingData.schoolSlug,
            userId: ratingData.userId,
            targetType: 'review',
            targetId: existing.id,
            details: { score: boundedScore, isAnonymous: updated.isAnonymous },
          });

          return updated;
        } else {
          const newRating: SchoolRating = {
            id: `rev_${crypto.randomBytes(8).toString('hex')}`,
            schoolSlug: ratingData.schoolSlug,
            userId: ratingData.userId,
            userName: ratingData.userName,
            userChildGrade: ratingData.userChildGrade,
            score: boundedScore,
            title: ratingData.title?.trim(),
            comment: ratingData.comment.trim(),
            categories: ratingData.categories,
            verifiedParent: true,
            isAnonymous: Boolean(ratingData.isAnonymous),
            status: 'published',
            createdAt: now,
            updatedAt: now,
          };

          await ratingsCol.insertOne(newRating);

          ratings.push(newRating);
          saveStoreToDisk();

          await recordActivityEventAsync({
            type: 'rating_submitted',
            schoolSlug: ratingData.schoolSlug,
            userId: ratingData.userId,
            targetType: 'review',
            targetId: newRating.id,
            details: { score: boundedScore, isAnonymous: newRating.isAnonymous },
          });

          return newRating;
        }
      }
    } catch (err) {
      console.error('[MONGO_SAVE_RATING_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return saveSchoolRating(ratingData);
}

export function deleteSchoolRating(schoolSlug: string, userId: string): boolean {
  const target = ratings.find(r => r.schoolSlug === schoolSlug && r.userId === userId && r.status !== 'deleted');
  if (!target) return false;

  target.status = 'deleted';
  target.deletedAt = new Date().toISOString();
  target.deletedBy = userId;
  saveStoreToDisk();

  recordActivityEvent({
    type: 'rating_deleted',
    schoolSlug,
    userId,
    targetType: 'review',
    targetId: target.id,
  });

  return true;
}

export async function deleteSchoolRatingAsync(schoolSlug: string, userId: string): Promise<boolean> {
  const now = new Date().toISOString();
  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const target = await ratingsCol.findOne({ schoolSlug, userId, status: { $ne: 'deleted' } });
        if (!target) return false;

        await ratingsCol.updateOne(
          { id: target.id },
          { $set: { status: 'deleted', deletedAt: now, deletedBy: userId } }
        );

        deleteSchoolRating(schoolSlug, userId);

        await recordActivityEventAsync({
          type: 'rating_deleted',
          schoolSlug,
          userId,
          targetType: 'review',
          targetId: target.id,
        });

        return true;
      }
    } catch (err) {
      console.error('[MONGO_DELETE_RATING_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return deleteSchoolRating(schoolSlug, userId);
}

export function adminDeleteRating(
  ratingId: string,
  adminUserId?: string,
  reason = 'Violates platform review guidelines'
): boolean {
  const target = ratings.find(r => r.id === ratingId);
  if (!target) return false;

  target.status = 'deleted';
  target.deletedAt = new Date().toISOString();
  target.deletedBy = adminUserId || 'admin';
  target.deletionReason = reason;
  saveStoreToDisk();

  recordActivityEvent({
    type: 'rating_deleted',
    schoolSlug: target.schoolSlug,
    targetType: 'review',
    targetId: ratingId,
    details: { ratingId, adminAction: true, reason, adminUserId },
  });

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'delete_school_review',
      'review',
      ratingId,
      { schoolSlug: target.schoolSlug, authorUserId: target.userId, reason },
      'success'
    );
  }

  return true;
}

export async function adminDeleteRatingAsync(
  ratingId: string,
  adminUserId?: string,
  reason = 'Violates platform review guidelines'
): Promise<boolean> {
  const now = new Date().toISOString();

  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const target = await ratingsCol.findOne({ id: ratingId });
        if (!target || target.status === 'deleted') return false;

        await ratingsCol.updateOne(
          { id: ratingId },
          {
            $set: {
              status: 'deleted',
              deletedAt: now,
              deletedBy: adminUserId || 'admin',
              deletionReason: reason,
            },
          }
        );

        const localTarget = ratings.find(r => r.id === ratingId);
        if (localTarget) {
          localTarget.status = 'deleted';
          localTarget.deletedAt = now;
          localTarget.deletedBy = adminUserId || 'admin';
          localTarget.deletionReason = reason;
          localTarget.updatedAt = now;
          saveStoreToDisk();
        }

        await recordActivityEventAsync({
          type: 'rating_deleted',
          schoolSlug: target.schoolSlug,
          targetType: 'review',
          targetId: ratingId,
          details: { ratingId, adminAction: true, reason, adminUserId },
        });

        if (adminUserId) {
          const adminUser = await getUserByIdAsync(adminUserId);
          await recordAdminAuditAsync(
            adminUserId,
            adminUser?.email || 'admin@admissionpitara.com',
            'delete_school_review',
            'review',
            ratingId,
            { schoolSlug: target.schoolSlug, authorUserId: target.userId, reason },
            'success'
          );
        }

        return true;
      }
    } catch (err) {
      console.error('[MONGO_ADMIN_DELETE_RATING_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return adminDeleteRating(ratingId, adminUserId, reason);
}

export function adminRestoreRating(ratingId: string, adminUserId?: string): boolean {
  const target = ratings.find(r => r.id === ratingId);
  if (!target || target.status !== 'deleted') return false;

  target.status = 'published';
  target.deletedAt = undefined;
  target.deletedBy = undefined;
  target.deletionReason = undefined;
  target.updatedAt = new Date().toISOString();
  saveStoreToDisk();

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'restore_school_review',
      'review',
      ratingId,
      { schoolSlug: target.schoolSlug, authorUserId: target.userId },
      'success'
    );
  }

  return true;
}

export async function adminRestoreRatingAsync(ratingId: string, adminUserId?: string): Promise<boolean> {
  const now = new Date().toISOString();

  if (isMongoConfigured()) {
    try {
      const ratingsCol = await getRatingsCollection(true);
      if (ratingsCol) {
        const target = await ratingsCol.findOne({ id: ratingId });
        if (!target || target.status !== 'deleted') return false;

        await ratingsCol.updateOne(
          { id: ratingId },
          {
            $set: { status: 'published', updatedAt: now },
            $unset: { deletedAt: '', deletedBy: '', deletionReason: '' },
          }
        );

        const localTarget = ratings.find(r => r.id === ratingId);
        if (localTarget) {
          localTarget.status = 'published';
          localTarget.deletedAt = undefined;
          localTarget.deletedBy = undefined;
          localTarget.deletionReason = undefined;
          localTarget.updatedAt = now;
          saveStoreToDisk();
        }

        if (adminUserId) {
          const adminUser = await getUserByIdAsync(adminUserId);
          await recordAdminAuditAsync(
            adminUserId,
            adminUser?.email || 'admin@admissionpitara.com',
            'restore_school_review',
            'review',
            ratingId,
            { schoolSlug: target.schoolSlug, authorUserId: target.userId },
            'success'
          );
        }

        return true;
      }
    } catch (err) {
      console.error('[MONGO_ADMIN_RESTORE_RATING_ERROR]', err);
      throw err;
    }
  }

  await ensureMongoSync();
  return adminRestoreRating(ratingId, adminUserId);
}

// ----------------------------------------------------------------------------
// SCHOOL CENTRIC & AGGREGATE ANALYTICS
// ----------------------------------------------------------------------------

export function getAdminSchoolAnalytics(slug: string) {
  initDb();
  const views = schoolViews.get(slug) || 0;
  const saves = schoolSaves.get(slug) || 0;
  const ratingStats = getSchoolRatingStats(slug);
  const schoolRatings = getSchoolRatings(slug);

  // Trace user interactions with this school
  const viewers = new Map<string, { count: number; first: string; last: string }>();
  const shortlisters: { userId: string; userEmail: string; userName: string; addedAt?: string }[] = [];
  const comparers = new Set<string>();

  for (const evt of activityEvents) {
    if (evt.schoolSlug === slug && evt.userId) {
      if (evt.type === 'school_view') {
        const cur = viewers.get(evt.userId) || { count: 0, first: evt.timestamp, last: evt.timestamp };
        cur.count += 1;
        cur.last = evt.timestamp;
        viewers.set(evt.userId, cur);
      }
    }
    if ((evt.type === 'compare_view' || evt.type === 'compare_add') && evt.userId) {
      const slugs = Array.isArray(evt.details?.schoolSlugs) ? (evt.details.schoolSlugs as string[]) : evt.schoolSlug ? [evt.schoolSlug] : [];
      if (slugs.includes(slug)) {
        comparers.add(evt.userId);
      }
    }
  }

  // Check which currently active users have it saved in wishlist
  for (const user of users.values()) {
    if (Array.isArray(user.wishlist) && user.wishlist.includes(slug)) {
      shortlisters.push({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
      });
    }
  }

  const uniqueViewersList = Array.from(viewers.entries()).map(([userId, data]) => {
    const user = getUserById(userId);
    return {
      userId,
      userName: user?.name || 'Parent User',
      userEmail: user?.email || '',
      viewCount: data.count,
      firstViewed: data.first,
      lastViewed: data.last,
    };
  });

  const repeatViewersCount = uniqueViewersList.filter(v => v.viewCount > 1).length;

  return {
    slug,
    traffic: {
      totalViews: views,
      uniqueAuthenticatedViewers: uniqueViewersList.length,
      uniqueAnonymousViewers: 0,
      uniqueViewers: uniqueViewersList.length,
      repeatViewers: repeatViewersCount,
      viewerDetails: uniqueViewersList,
    },
    engagement: {
      wishlistSaves: saves,
      shortlistedByUsers: shortlisters,
      comparedCount: comparers.size,
      comparersCount: comparers.size,
      reviewsCount: ratingStats.totalReviews,
      averageRating: ratingStats.averageScore,
      ratingDistribution: ratingStats.distribution,
      categoryAverages: ratingStats.categoryAverages,
      reviews: schoolRatings,
    },
  };
}

export async function getAdminSchoolAnalyticsAsync(slug: string) {
  let views = 0;
  let saves = 0;
  if (isMongoConfigured()) {
    try {
      const viewsCol = await getSchoolViewsCollection();
      if (viewsCol) {
        const doc = await viewsCol.findOne({ slug });
        if (doc) {
          views = typeof doc.totalViews === 'number' ? doc.totalViews : (doc.count || 0);
        }
      }
      const savesCol = await getSchoolSavesCollection();
      if (savesCol) {
        const doc = await savesCol.findOne({ slug });
        if (doc) {
          saves = Math.max(0, doc.count || 0);
        }
      }
    } catch (err) {
      console.warn('[MONGO_GET_SCHOOL_ANALYTICS_ERR]', err);
    }
  } else {
    views = schoolViews.get(slug) || 0;
    saves = schoolSaves.get(slug) || 0;
  }

  const ratingStats = await getSchoolRatingStatsAsync(slug);
  const schoolRatings = await getSchoolRatingsAsync(slug);

  const viewers = new Map<string, { count: number; first: string; last: string }>();
  const shortlisters: { userId: string; userEmail: string; userName: string; addedAt?: string }[] = [];
  const comparers = new Set<string>();

  // The event ledger is authoritative for profile activity. A hard 5,000-event cap can
  // silently undercount busy schools, so analytics reads a high ceiling from MongoDB.
  const events = await getActivityEventsAsync(1000000, { schoolSlug: slug });
  let eventViewCount = 0;
  const anonymousViewerIds = new Set<string>();
  for (const evt of events) {
    if (evt.type === 'school_view') {
      eventViewCount += 1;
      if (evt.visitorId) anonymousViewerIds.add(evt.visitorId);
    }
    if (evt.userId) {
      if (evt.type === 'school_view') {
        const cur = viewers.get(evt.userId) || { count: 0, first: evt.timestamp, last: evt.timestamp };
        cur.count += 1;
        cur.last = evt.timestamp;
        viewers.set(evt.userId, cur);
      }
      if (evt.type === 'compare_view' || evt.type === 'compare_add') {
        comparers.add(evt.userId);
      }
    }
  }

  const allUsers = await getAllUsersSanitizedAsync();
  for (const user of allUsers) {
    if (Array.isArray(user.wishlist) && user.wishlist.includes(slug)) {
      shortlisters.push({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
      });
    }
  }

  const usersById = new Map(allUsers.map(user => [user.id, user]));
  const uniqueViewersList = Array.from(viewers.entries()).map(([userId, data]) => {
    const user = usersById.get(userId);
    return {
      userId,
      userName: user?.name || 'Parent User',
      userEmail: user?.email || '',
      viewCount: data.count,
      firstViewed: data.first,
      lastViewed: data.last,
    };
  });

  const repeatViewersCount = uniqueViewersList.filter(v => v.viewCount > 1).length;

  return {
    slug,
    traffic: {
      totalViews: Math.max(eventViewCount, views),
      uniqueAuthenticatedViewers: uniqueViewersList.length,
      uniqueAnonymousViewers: anonymousViewerIds.size,
      uniqueViewers: uniqueViewersList.length + anonymousViewerIds.size,
      repeatViewers: repeatViewersCount,
      viewerDetails: uniqueViewersList,
    },
    engagement: {
      wishlistSaves: saves,
      shortlistedByUsers: shortlisters,
      comparedCount: comparers.size,
      comparersCount: comparers.size,
      reviewsCount: ratingStats.totalReviews,
      averageRating: ratingStats.averageScore,
      ratingDistribution: ratingStats.distribution,
      categoryAverages: ratingStats.categoryAverages,
      reviews: schoolRatings,
    },
  };
}

export function getAllSchoolsAdminOverview() {
  initDb();
  const summaryMap = new Map<
    string,
    {
      slug: string;
      views: number;
      saves: number;
      reviewsCount: number;
      averageRating: number;
      activePromotion?: SchoolPromotionCampaign;
    }
  >();

  for (const [slug, views] of schoolViews.entries()) {
    const saves = schoolSaves.get(slug) || 0;
    const stats = getSchoolRatingStats(slug);
    const activePromo = promotions.find(p => p.schoolSlug === slug && p.status === 'active');
    summaryMap.set(slug, {
      slug,
      views,
      saves,
      reviewsCount: stats.totalReviews,
      averageRating: stats.averageScore,
      activePromotion: activePromo,
    });
  }

  return Array.from(summaryMap.values());
}

export async function getAllSchoolsAdminOverviewAsync() {
  const summaryMap = new Map<
    string,
    {
      slug: string;
      views: number;
      saves: number;
      reviewsCount: number;
      averageRating: number;
      activePromotion?: SchoolPromotionCampaign;
    }
  >();

  const viewsMap = new Map<string, number>();
  const savesMap = new Map<string, number>();

  if (isMongoConfigured()) {
    try {
      const viewsCol = await getSchoolViewsCollection();
      if (viewsCol) {
        const docs = await viewsCol.find({}).toArray();
        for (const doc of docs) {
          const v = typeof doc.totalViews === 'number' ? doc.totalViews : (doc.count || 0);
          viewsMap.set(doc.slug, v);
        }
      }
      const savesCol = await getSchoolSavesCollection();
      if (savesCol) {
        const docs = await savesCol.find({}).toArray();
        for (const doc of docs) {
          savesMap.set(doc.slug, Math.max(0, doc.count || 0));
        }
      }
    } catch (err) {
      console.warn('[MONGO_ALL_SCHOOLS_OVERVIEW_ERR]', err);
    }
  } else {
    for (const [s, count] of schoolViews.entries()) viewsMap.set(s, count);
    for (const [s, count] of schoolSaves.entries()) savesMap.set(s, count);
  }

  const allPromos = getAllPromotions();
  const activeRatings = await getAllRatingsAsync(false);
  const ratingGroups = new Map<string, { totalScore: number; count: number }>();

  for (const rating of activeRatings) {
    const current = ratingGroups.get(rating.schoolSlug) || { totalScore: 0, count: 0 };
    current.totalScore += rating.score;
    current.count += 1;
    ratingGroups.set(rating.schoolSlug, current);
  }

  const allSlugs = new Set([...viewsMap.keys(), ...savesMap.keys()]);

  for (const slug of allSlugs) {
    const views = viewsMap.get(slug) || 0;
    const saves = savesMap.get(slug) || 0;
    const ratingStats = ratingGroups.get(slug) || { totalScore: 0, count: 0 };
    const averageRating = ratingStats.count
      ? Math.round((ratingStats.totalScore / ratingStats.count) * 10) / 10
      : 0;
    const activePromo = allPromos.find(p => p.schoolSlug === slug && p.status === 'active');
    summaryMap.set(slug, {
      slug,
      views,
      saves,
      reviewsCount: ratingStats.count,
      averageRating,
      activePromotion: activePromo,
    });
  }

  return Array.from(summaryMap.values());
}

export function getAdminOverviewMetrics(timeRange: 'today' | '7d' | '30d' | '90d' | 'all' = '30d') {
  initDb();
  let timeThreshold = 0;
  const now = Date.now();

  if (timeRange === 'today') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    timeThreshold = startOfToday.getTime();
  } else if (timeRange === '7d') {
    timeThreshold = now - 7 * 24 * 60 * 60 * 1000;
  } else if (timeRange === '30d') {
    timeThreshold = now - 30 * 24 * 60 * 60 * 1000;
  } else if (timeRange === '90d') {
    timeThreshold = now - 90 * 24 * 60 * 60 * 1000;
  }

  const allUsersList = Array.from(new Set(Array.from(users.values()).map(u => u.id)))
    .map(id => getUserById(id))
    .filter((u): u is ParentUser => u !== null);

  const totalAccounts = allUsersList.length;
  const verifiedAccounts = allUsersList.filter(u => u.emailVerified).length;
  const newAccountsInRange = allUsersList.filter(
    u => timeThreshold === 0 || new Date(u.createdAt).getTime() >= timeThreshold
  ).length;

  const activeUsersInRange = allUsersList.filter(u => {
    const actTime = u.lastActivityAt
      ? new Date(u.lastActivityAt).getTime()
      : u.lastLoginAt
      ? new Date(u.lastLoginAt).getTime()
      : new Date(u.createdAt).getTime();
    return timeThreshold === 0 ? actTime >= now - 30 * 24 * 60 * 60 * 1000 : actTime >= timeThreshold;
  }).length;

  const activeRatings = ratings.filter(r => r.status !== 'deleted');
  let ratingSum = 0;
  for (const r of activeRatings) ratingSum += r.score;
  const averageRating = activeRatings.length > 0 ? Math.round((ratingSum / activeRatings.length) * 10) / 10 : 0;

  // Recent activity in time range
  const filteredActivity = activityEvents.filter(
    e => timeThreshold === 0 || new Date(e.timestamp).getTime() >= timeThreshold
  );

  // Time-period filtered metrics
  const viewsEventsInRange = filteredActivity.filter(e => e.type === 'school_view');
  const savesEventsInRange = filteredActivity.filter(e => e.type === 'wishlist_add');

  const viewsCountInRange = viewsEventsInRange.length;
  const savesCountInRange = savesEventsInRange.length;

  // Count authenticated parents by user ID and anonymous visitors by their
  // stable visitor ID. Calling these "unique visitors" keeps the metric honest.
  const uniqueParentsViewing = new Set(
    viewsEventsInRange
      .map(e => e.userId || e.visitorId)
      .filter(Boolean)
  ).size;

  // Top viewed schools in selected time range
  const viewsMapInRange = new Map<string, number>();
  for (const ev of viewsEventsInRange) {
    if (ev.schoolSlug) {
      viewsMapInRange.set(ev.schoolSlug, (viewsMapInRange.get(ev.schoolSlug) || 0) + 1);
    }
  }
  const topViewedInRange = Array.from(viewsMapInRange.entries())
    .map(([slug, count]) => ({ slug, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // Top shortlisted schools in selected time range
  const savesMapInRange = new Map<string, number>();
  for (const ev of savesEventsInRange) {
    if (ev.schoolSlug) {
      savesMapInRange.set(ev.schoolSlug, (savesMapInRange.get(ev.schoolSlug) || 0) + 1);
    }
  }
  const topShortlistedInRange = Array.from(savesMapInRange.entries())
    .map(([slug, count]) => ({ slug, saves: count }))
    .sort((a, b) => b.saves - a.saves)
    .slice(0, 8);

  const topViewed = timeRange === 'all' || topViewedInRange.length === 0
    ? Array.from(schoolViews.entries())
        .map(([slug, count]) => ({ slug, views: count }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 8)
    : topViewedInRange;

  const topShortlisted = timeRange === 'all' || topShortlistedInRange.length === 0
    ? Array.from(schoolSaves.entries())
        .map(([slug, count]) => ({ slug, saves: count }))
        .sort((a, b) => b.saves - a.saves)
        .slice(0, 8)
    : topShortlistedInRange;

  const allTimeViews = Array.from(schoolViews.values()).reduce((a, b) => a + b, 0);
  const allTimeSaves = Array.from(schoolSaves.values()).reduce((a, b) => a + b, 0);

  // Highest rated schools (minimum 1 review)
  const highestRated = Object.keys(Object.fromEntries(schoolViews))
    .map(slug => {
      const stats = getSchoolRatingStats(slug);
      return { slug, averageScore: stats.averageScore, totalReviews: stats.totalReviews };
    })
    .filter(s => s.totalReviews > 0)
    .sort((a, b) => b.averageScore - a.averageScore || b.totalReviews - a.totalReviews)
    .slice(0, 8);

  return {
    timeRange,
    users: {
      totalAccounts,
      verifiedAccounts,
      newAccountsInRange,
      activeUsersInRange,
      disabledAccounts: allUsersList.filter(u => u.status === 'disabled').length,
    },
    schools: {
      topViewed,
      topShortlisted,
      highestRated,
      totalViewsCount: timeRange === 'all' ? allTimeViews : viewsCountInRange,
      totalSavesCount: timeRange === 'all' ? allTimeSaves : savesCountInRange,
      allTimeViewsCount: allTimeViews,
      allTimeSavesCount: allTimeSaves,
      viewsInRange: viewsCountInRange,
      savesInRange: savesCountInRange,
      uniqueViewersInRange: uniqueParentsViewing,
    },
    reviews: {
      totalReviews: activeRatings.length,
      averageRating,
      recentReviews: activeRatings.slice(0, 5),
    },
    activity: {
      totalEventsInRange: filteredActivity.length,
      recentEvents: filteredActivity.slice(0, 25),
    },
  };
}

export async function getAdminOverviewMetricsAsync(timeRange: 'today' | '7d' | '30d' | '90d' | 'all' = '30d') {
  let timeThreshold = 0;
  const now = Date.now();

  if (timeRange === 'today') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    timeThreshold = startOfToday.getTime();
  } else if (timeRange === '7d') {
    timeThreshold = now - 7 * 24 * 60 * 60 * 1000;
  } else if (timeRange === '30d') {
    timeThreshold = now - 30 * 24 * 60 * 60 * 1000;
  } else if (timeRange === '90d') {
    timeThreshold = now - 90 * 24 * 60 * 60 * 1000;
  }

  const allUsersList = await getAllUsersSanitizedAsync();
  const totalAccounts = allUsersList.length;
  const verifiedAccounts = allUsersList.filter(u => u.emailVerified).length;
  const newAccountsInRange = allUsersList.filter(
    u => timeThreshold === 0 || new Date(u.createdAt).getTime() >= timeThreshold
  ).length;

  const activeUsersInRange = allUsersList.filter(u => {
    const actTime = u.lastActivityAt
      ? new Date(u.lastActivityAt).getTime()
      : u.lastLoginAt
      ? new Date(u.lastLoginAt).getTime()
      : new Date(u.createdAt).getTime();
    return timeThreshold === 0 ? actTime >= now - 30 * 24 * 60 * 60 * 1000 : actTime >= timeThreshold;
  }).length;

  const activeRatings = await getAllRatingsAsync(false);
  let ratingSum = 0;
  for (const r of activeRatings) ratingSum += r.score;
  const averageRating = activeRatings.length > 0 ? Math.round((ratingSum / activeRatings.length) * 10) / 10 : 0;

  // Admin analytics must not silently truncate the selected time range after
  // 5,000 events. Production activity is persisted in MongoDB, so use a generous
  // ceiling for the admin analytics workload.
  const filteredActivity = await getActivityEventsAsync(
    100000,
    timeThreshold ? { since: new Date(timeThreshold).toISOString() } : undefined
  );

  const viewsEventsInRange = filteredActivity.filter(e => e.type === 'school_view');
  const savesEventsInRange = filteredActivity.filter(e => e.type === 'wishlist_add');

  const viewsCountInRange = viewsEventsInRange.length;
  const savesCountInRange = savesEventsInRange.length;

  const uniqueParentsViewing = new Set(
    viewsEventsInRange
      .map(e => e.userId || e.visitorId)
      .filter(Boolean)
  ).size;

  const viewsMapInRange = new Map<string, number>();
  for (const ev of viewsEventsInRange) {
    if (ev.schoolSlug) {
      viewsMapInRange.set(ev.schoolSlug, (viewsMapInRange.get(ev.schoolSlug) || 0) + 1);
    }
  }
  const topViewedInRange = Array.from(viewsMapInRange.entries())
    .map(([slug, count]) => ({ slug, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const savesMapInRange = new Map<string, number>();
  for (const ev of savesEventsInRange) {
    if (ev.schoolSlug) {
      savesMapInRange.set(ev.schoolSlug, (savesMapInRange.get(ev.schoolSlug) || 0) + 1);
    }
  }
  const topShortlistedInRange = Array.from(savesMapInRange.entries())
    .map(([slug, count]) => ({ slug, saves: count }))
    .sort((a, b) => b.saves - a.saves)
    .slice(0, 8);

  const allTimeViewsMap = new Map<string, number>();
  const allTimeSavesMap = new Map<string, number>();
  let allTimeViews = 0;
  let allTimeSaves = 0;

  if (isMongoConfigured()) {
    try {
      const viewsCol = await getSchoolViewsCollection();
      if (viewsCol) {
        const docs = await viewsCol.find({}).toArray();
        for (const d of docs) {
          const v = typeof d.totalViews === 'number' ? d.totalViews : (d.count || 0);
          allTimeViewsMap.set(d.slug, v);
          allTimeViews += v;
        }
      }
      const savesCol = await getSchoolSavesCollection();
      if (savesCol) {
        const docs = await savesCol.find({}).toArray();
        for (const d of docs) {
          const s = Math.max(0, d.count || 0);
          allTimeSavesMap.set(d.slug, s);
          allTimeSaves += s;
        }
      }
    } catch (err) {
      console.warn('[MONGO_GET_METRICS_OVERVIEW_ERR]', err);
    }
  } else {
    for (const [s, c] of schoolViews.entries()) {
      allTimeViewsMap.set(s, c);
      allTimeViews += c;
    }
    for (const [s, c] of schoolSaves.entries()) {
      allTimeSavesMap.set(s, c);
      allTimeSaves += c;
    }
  }

  const topViewed = timeRange === 'all' || topViewedInRange.length === 0
    ? Array.from(allTimeViewsMap.entries())
        .map(([slug, count]) => ({ slug, views: count }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 8)
    : topViewedInRange;

  const topShortlisted = timeRange === 'all' || topShortlistedInRange.length === 0
    ? Array.from(allTimeSavesMap.entries())
        .map(([slug, count]) => ({ slug, saves: count }))
        .sort((a, b) => b.saves - a.saves)
        .slice(0, 8)
    : topShortlistedInRange;

  const ratingGroups = new Map<string, { totalScore: number; count: number }>();
  for (const r of activeRatings) {
    const cur = ratingGroups.get(r.schoolSlug) || { totalScore: 0, count: 0 };
    cur.totalScore += r.score;
    cur.count += 1;
    ratingGroups.set(r.schoolSlug, cur);
  }

  const highestRated = Array.from(ratingGroups.entries())
    .map(([slug, data]) => ({
      slug,
      averageScore: Math.round((data.totalScore / data.count) * 10) / 10,
      totalReviews: data.count,
    }))
    .filter(s => s.totalReviews > 0)
    .sort((a, b) => b.averageScore - a.averageScore || b.totalReviews - a.totalReviews)
    .slice(0, 8);

  return {
    timeRange,
    users: {
      totalAccounts,
      verifiedAccounts,
      newAccountsInRange,
      activeUsersInRange,
      disabledAccounts: allUsersList.filter(u => u.status === 'disabled').length,
    },
    schools: {
      topViewed,
      topShortlisted,
      highestRated,
      totalViewsCount: timeRange === 'all' ? allTimeViews : viewsCountInRange,
      totalSavesCount: timeRange === 'all' ? allTimeSaves : savesCountInRange,
      allTimeViewsCount: allTimeViews,
      allTimeSavesCount: allTimeSaves,
      viewsInRange: viewsCountInRange,
      savesInRange: savesCountInRange,
      uniqueViewersInRange: uniqueParentsViewing,
    },
    reviews: {
      totalReviews: activeRatings.length,
      averageRating,
      recentReviews: activeRatings.slice(0, 5),
    },
    activity: {
      totalEventsInRange: filteredActivity.length,
      recentEvents: filteredActivity.slice(0, 25),
    },
  };
}

export function getWishlistAnalytics() {
  initDb();
  const schoolCounts = new Map<string, { count: number; users: { userId: string; email: string; name: string }[] }>();

  for (const user of users.values()) {
    if (Array.isArray(user.wishlist)) {
      for (const slug of user.wishlist) {
        const cur = schoolCounts.get(slug) || { count: 0, users: [] };
        cur.count += 1;
        cur.users.push({ userId: user.id, email: user.email, name: user.name });
        schoolCounts.set(slug, cur);
      }
    }
  }

  return Array.from(schoolCounts.entries())
    .map(([slug, data]) => ({ slug, count: data.count, users: data.users }))
    .sort((a, b) => b.count - a.count);
}

export async function getWishlistAnalyticsAsync() {
  const schoolCounts = new Map<string, { count: number; users: { userId: string; email: string; name: string }[] }>();
  const allUsers = await getAllUsersSanitizedAsync();

  for (const user of allUsers) {
    if (Array.isArray(user.wishlist)) {
      for (const slug of user.wishlist) {
        const cur = schoolCounts.get(slug) || { count: 0, users: [] };
        cur.count += 1;
        cur.users.push({ userId: user.id, email: user.email, name: user.name });
        schoolCounts.set(slug, cur);
      }
    }
  }

  return Array.from(schoolCounts.entries())
    .map(([slug, data]) => ({ slug, count: data.count, users: data.users }))
    .sort((a, b) => b.count - a.count);
}

export function getComparisonAnalytics() {
  initDb();
  const pairCounts = new Map<string, { pair: string[]; count: number }>();
  const schoolCompareFrequency = new Map<string, number>();

  for (const evt of activityEvents) {
    if ((evt.type === 'compare_view' || evt.type === 'compare_add') && evt.details?.schoolSlugs) {
      const slugs = evt.details.schoolSlugs as string[];
      if (Array.isArray(slugs) && slugs.length >= 2) {
        for (const s of slugs) {
          schoolCompareFrequency.set(s, (schoolCompareFrequency.get(s) || 0) + 1);
        }
        // sorted pair key
        for (let i = 0; i < slugs.length; i++) {
          for (let j = i + 1; j < slugs.length; j++) {
            const key = [slugs[i], slugs[j]].sort().join(' vs ');
            const current = pairCounts.get(key) || { pair: [slugs[i], slugs[j]].sort(), count: 0 };
            current.count += 1;
            pairCounts.set(key, current);
          }
        }
      }
    }
  }

  const commonPairs = Array.from(pairCounts.values()).sort((a, b) => b.count - a.count).slice(0, 10);
  const mostComparedSchools = Array.from(schoolCompareFrequency.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);

  return {
    commonPairs,
    mostComparedSchools,
  };
}

export async function getComparisonAnalyticsAsync() {
  const pairCounts = new Map<string, { pair: string[]; count: number }>();
  const schoolCompareFrequency = new Map<string, number>();

  const events = await getActivityEventsAsync(5000);

  for (const evt of events) {
    if ((evt.type === 'compare_view' || evt.type === 'compare_add') && evt.details?.schoolSlugs) {
      const slugs = evt.details.schoolSlugs as string[];
      if (Array.isArray(slugs) && slugs.length >= 2) {
        for (const s of slugs) {
          schoolCompareFrequency.set(s, (schoolCompareFrequency.get(s) || 0) + 1);
        }
        for (let i = 0; i < slugs.length; i++) {
          for (let j = i + 1; j < slugs.length; j++) {
            const key = [slugs[i], slugs[j]].sort().join(' vs ');
            const current = pairCounts.get(key) || { pair: [slugs[i], slugs[j]].sort(), count: 0 };
            current.count += 1;
            pairCounts.set(key, current);
          }
        }
      }
    }
  }

  const commonPairs = Array.from(pairCounts.values()).sort((a, b) => b.count - a.count).slice(0, 10);
  const mostComparedSchools = Array.from(schoolCompareFrequency.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);

  return {
    commonPairs,
    mostComparedSchools,
  };
}

export function getSearchAnalytics() {
  initDb();
  const queryCounts = new Map<string, { query: string; count: number; lastSearched: string; locality?: string }>();
  const localityCounts = new Map<string, number>();

  for (const evt of activityEvents) {
    if (evt.type === 'search_performed' && evt.searchQuery) {
      const q = evt.searchQuery.trim().toLowerCase();
      const current = queryCounts.get(q) || { query: evt.searchQuery, count: 0, lastSearched: evt.timestamp, locality: evt.locality };
      current.count += 1;
      current.lastSearched = evt.timestamp;
      queryCounts.set(q, current);
    }
    if (evt.locality) {
      localityCounts.set(evt.locality, (localityCounts.get(evt.locality) || 0) + 1);
    }
  }

  return {
    topQueries: Array.from(queryCounts.values()).sort((a, b) => b.count - a.count).slice(0, 20),
    topLocalities: Array.from(localityCounts.entries()).map(([locality, count]) => ({ locality, count })).sort((a, b) => b.count - a.count),
  };
}

export async function getSearchAnalyticsAsync() {
  const queryCounts = new Map<string, { query: string; count: number; lastSearched: string; locality?: string }>();
  const localityCounts = new Map<string, number>();

  const events = await getActivityEventsAsync(5000, { type: 'search_performed' });

  for (const evt of events) {
    if (evt.type === 'search_performed' && evt.searchQuery) {
      const q = evt.searchQuery.trim().toLowerCase();
      const current = queryCounts.get(q) || { query: evt.searchQuery, count: 0, lastSearched: evt.timestamp, locality: evt.locality };
      current.count += 1;
      current.lastSearched = evt.timestamp;
      queryCounts.set(q, current);
    }
    if (evt.locality) {
      localityCounts.set(evt.locality, (localityCounts.get(evt.locality) || 0) + 1);
    }
  }

  return {
    topQueries: Array.from(queryCounts.values()).sort((a, b) => b.count - a.count).slice(0, 20),
    topLocalities: Array.from(localityCounts.entries()).map(([locality, count]) => ({ locality, count })).sort((a, b) => b.count - a.count),
  };
}

// ----------------------------------------------------------------------------
// PAID SCHOOL PROMOTION SYSTEM (Transparent, Admin-Controlled, Organic-Preserving)
// ----------------------------------------------------------------------------

export function getActivePromotions(placement?: string): SchoolPromotionCampaign[] {
  initDb();
  const now = new Date().toISOString();
  return promotions.filter(p => {
    const isTimeValid = (!p.startDate || p.startDate <= now) && (!p.endDate || p.endDate >= now);
    const isPlacementValid = !placement || p.placementType === placement;
    return p.status === 'active' && isTimeValid && isPlacementValid;
  }).sort((a, b) => a.priority - b.priority);
}

export function getAllPromotions(): SchoolPromotionCampaign[] {
  initDb();
  return [...promotions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPromotionById(id: string): SchoolPromotionCampaign | null {
  initDb();
  return promotions.find(p => p.id === id) || null;
}

export function createPromotionCampaign(
  data: Omit<SchoolPromotionCampaign, 'id' | 'impressions' | 'clicks' | 'createdAt' | 'updatedAt'>,
  adminUserId?: string
): SchoolPromotionCampaign {
  initDb();
  const now = new Date().toISOString();
  const newPromo: SchoolPromotionCampaign = {
    ...data,
    id: `promo_${crypto.randomBytes(6).toString('hex')}`,
    impressions: 0,
    clicks: 0,
    createdAt: now,
    updatedAt: now,
  };

  promotions.push(newPromo);
  saveStoreToDisk();

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'create_promotion_campaign',
      'promotion',
      newPromo.id,
      { campaignName: newPromo.campaignName, schoolSlug: newPromo.schoolSlug },
      'success'
    );
  }

  return newPromo;
}

export function updatePromotionCampaign(
  id: string,
  updates: Partial<Omit<SchoolPromotionCampaign, 'id' | 'createdAt'>>,
  adminUserId?: string
): SchoolPromotionCampaign | null {
  initDb();
  const promo = promotions.find(p => p.id === id);
  if (!promo) return null;

  Object.assign(promo, updates, { updatedAt: new Date().toISOString() });
  saveStoreToDisk();

  if (adminUserId) {
    recordAdminAudit(
      adminUserId,
      getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
      'update_promotion_campaign',
      'promotion',
      id,
      { updates },
      'success'
    );
  }

  return promo;
}

export function deletePromotionCampaign(id: string, adminUserId?: string): boolean {
  initDb();
  const initialLen = promotions.length;
  promotions = promotions.filter(p => p.id !== id);
  globalAuthStore.__ADMISSION_PITARA_PROMOTIONS__ = promotions;

  if (promotions.length !== initialLen) {
    saveStoreToDisk();
    if (adminUserId) {
      recordAdminAudit(
        adminUserId,
        getUserById(adminUserId)?.email || 'admin@admissionpitara.com',
        'delete_promotion_campaign',
        'promotion',
        id,
        {},
        'success'
      );
    }
    return true;
  }
  return false;
}

export function recordPromotionImpression(id: string): void {
  const promo = promotions.find(p => p.id === id);
  if (promo) {
    promo.impressions = (promo.impressions || 0) + 1;
    saveStoreToDisk();
  }
}

export function recordPromotionClick(id: string): void {
  const promo = promotions.find(p => p.id === id);
  if (promo) {
    promo.clicks = (promo.clicks || 0) + 1;
    saveStoreToDisk();
  }
}

// ----------------------------------------------------------------------------
// ADMINISTRATIVE AUDIT LOG
// ----------------------------------------------------------------------------

export function recordAdminAudit(
  adminUserId: string,
  adminEmail: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
  result: 'success' | 'failed' = 'success'
): AdminAuditLog {
  const log: AdminAuditLog = {
    id: `aud_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    adminUserId,
    adminEmail,
    action,
    targetType,
    targetId,
    details,
    result,
    timestamp: new Date().toISOString(),
  };

  auditLogs.unshift(log);
  if (auditLogs.length > 1000) {
    auditLogs.length = 1000;
  }

  saveStoreToDisk();
  return log;
}

export function getAdminAuditLogs(limit = 100, filters?: { adminUserId?: string; action?: string; targetType?: string }): AdminAuditLog[] {
  initDb();
  let filtered = auditLogs;
  if (filters?.adminUserId) filtered = filtered.filter(l => l.adminUserId === filters.adminUserId);
  if (filters?.action) filtered = filtered.filter(l => l.action === filters.action);
  if (filters?.targetType) filtered = filtered.filter(l => l.targetType === filters.targetType);
  return filtered.slice(0, limit);
}

export async function recordAdminAuditAsync(
  adminUserId: string,
  adminEmail: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
  result: 'success' | 'failed' = 'success'
): Promise<AdminAuditLog> {
  const log = recordAdminAudit(adminUserId, adminEmail, action, targetType, targetId, details, result);
  if (isMongoConfigured()) {
    try {
      const col = await getAuditLogsCollection(true);
      if (col) {
        await col.updateOne({ id: log.id }, { $set: log }, { upsert: true });
      }
    } catch (err) {
      console.error('[MONGO_RECORD_AUDIT_LOG_ERROR]', err);
    }
  }
  return log;
}

export async function getAdminAuditLogsAsync(
  limit = 100,
  filters?: { adminUserId?: string; action?: string; targetType?: string }
): Promise<AdminAuditLog[]> {
  if (isMongoConfigured()) {
    try {
      const col = await getAuditLogsCollection(true);
      if (col) {
        const query: Record<string, unknown> = {};
        if (filters?.adminUserId) query.adminUserId = filters.adminUserId;
        if (filters?.action) query.action = filters.action;
        if (filters?.targetType) query.targetType = filters.targetType;

        const docs = await col
          .find(query)
          .sort({ timestamp: -1 })
          .limit(limit)
          .toArray();

        return docs.map(doc => {
          const { _id, ...rest } = doc as unknown as AdminAuditLog & { _id?: unknown };
          return rest as AdminAuditLog;
        });
      }
    } catch (err) {
      console.error('[MONGO_GET_AUDIT_LOGS_ERROR]', err);
      throw err;
    }
  }
  return getAdminAuditLogs(limit, filters);
}

// Backward-compatible export for existing components
export const getDashboardAnalytics = () => {
  const overview = getAdminOverviewMetrics('30d');
  const uniqueUsers = new Set<string>();
  let verifiedEmails = 0;
  const localityDistribution: Record<string, number> = {};

  for (const user of users.values()) {
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.add(user.id);
      if (user.emailVerified) verifiedEmails += 1;
      const loc = user.preferredSchoolLocality || 'Not Specified';
      localityDistribution[loc] = (localityDistribution[loc] || 0) + 1;
    }
  }

  return {
    totalParents: overview.users.totalAccounts,
    activeParents: overview.users.activeUsersInRange,
    verifiedEmails,
    totalViews: overview.schools.totalViewsCount,
    totalSaves: overview.schools.totalSavesCount,
    totalRatings: overview.reviews.totalReviews,
    averageRating: overview.reviews.averageRating,
    topViewedSchools: overview.schools.topViewed,
    topSavedSchools: overview.schools.topShortlisted,
    localityDistribution,
  };
};

export async function getDashboardAnalyticsAsync() {
  const overview = await getAdminOverviewMetricsAsync('30d');
  const allUsers = await getAllUsersSanitizedAsync();
  let verifiedEmails = 0;
  const localityDistribution: Record<string, number> = {};

  for (const user of allUsers) {
    if (user.emailVerified) verifiedEmails += 1;
    const loc = user.preferredSchoolLocality || 'Not Specified';
    localityDistribution[loc] = (localityDistribution[loc] || 0) + 1;
  }

  return {
    totalParents: overview.users.totalAccounts,
    activeParents: overview.users.activeUsersInRange,
    verifiedEmails,
    totalViews: overview.schools.totalViewsCount,
    totalSaves: overview.schools.totalSavesCount,
    totalRatings: overview.reviews.totalReviews,
    averageRating: overview.reviews.averageRating,
    topViewedSchools: overview.schools.topViewed,
    topSavedSchools: overview.schools.topShortlisted,
    localityDistribution,
  };
}

export const getActivityAnalytics = () => {
  const analytics = getDashboardAnalytics();
  return {
    totalRegisteredParents: analytics.totalParents,
    verifiedEmails: analytics.verifiedEmails,
    totalRatings: analytics.totalRatings,
    schoolViews: Object.fromEntries(schoolViews),
    schoolSaves: Object.fromEntries(schoolSaves),
    localityDistribution: analytics.localityDistribution,
    recentEvents: activityEvents.slice(0, 50),
  };
};

export const getSchoolRatingSummary = getSchoolRatingStats;

export function getPublicSchoolPopularity(slug?: string) {
  initDb();
  if (slug) {
    const views = schoolViews.get(slug) || 0;
    const saves = schoolSaves.get(slug) || 0;
    const stats = getSchoolRatingStats(slug);
    return {
      slug,
      views,
      saves,
      reviewsCount: stats.totalReviews,
      averageScore: stats.averageScore,
    };
  }

  const result: Record<string, { slug: string; views: number; saves: number; reviewsCount: number; averageScore: number }> = {};
  for (const [s, views] of schoolViews.entries()) {
    const saves = schoolSaves.get(s) || 0;
    const stats = getSchoolRatingStats(s);
    result[s] = {
      slug: s,
      views,
      saves,
      reviewsCount: stats.totalReviews,
      averageScore: stats.averageScore,
    };
  }
  return result;
}

// ----------------------------------------------------------------------------
// ADMISSION REMINDERS & NOTIFICATIONS PERSISTENCE
// ----------------------------------------------------------------------------

export function createAdmissionReminder({
  userId,
  userEmail,
  schoolSlug,
  schoolName,
  milestoneId,
  milestoneLabel,
  targetDate,
  timing,
}: {
  userId: string;
  userEmail: string;
  schoolSlug: string;
  schoolName: string;
  milestoneId: string;
  milestoneLabel: string;
  targetDate: string;
  timing: ReminderTiming;
}): { success: boolean; reminder?: AdmissionReminder; error?: string } {
  initDb();
  if (!userId || !userEmail) {
    return { success: false, error: 'Authentication required.' };
  }
  if (!schoolSlug || !schoolName) {
    return { success: false, error: 'School information is required.' };
  }
  if (!milestoneId || !milestoneLabel || !targetDate) {
    return { success: false, error: 'Valid admission milestone and date are required.' };
  }
  // Validate targetDate format YYYY-MM-DD or date
  const parsedDate = new Date(targetDate);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: 'Invalid target date for reminder.' };
  }
  const validTimings: ReminderTiming[] = ['7_days_before', '3_days_before', '1_day_before', 'on_date'];
  if (!validTimings.includes(timing)) {
    return { success: false, error: 'Invalid notification timing option.' };
  }

  const existingList = globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || [];
  const existing = existingList.find(
    r =>
      r.userId === userId &&
      r.schoolSlug === schoolSlug &&
      r.milestoneId === milestoneId &&
      r.timing === timing
  );
  if (existing) {
    if (existing.status === 'disabled') {
      existing.status = 'active';
      existing.updatedAt = new Date().toISOString();
      saveStoreToDisk();
      return { success: true, reminder: existing };
    }
    return { success: false, error: 'An active reminder for this school date and timing option already exists.' };
  }

  const newReminder: AdmissionReminder = {
    id: `rem_${crypto.randomBytes(8).toString('hex')}`,
    userId,
    userEmail,
    schoolSlug,
    schoolName,
    milestoneId,
    milestoneLabel,
    targetDate,
    timing,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!globalAuthStore.__ADMISSION_PITARA_REMINDERS__) {
    globalAuthStore.__ADMISSION_PITARA_REMINDERS__ = [];
  }
  globalAuthStore.__ADMISSION_PITARA_REMINDERS__.push(newReminder);
  saveStoreToDisk();

  return { success: true, reminder: newReminder };
}

export async function createAdmissionReminderAsync(params: {
  userId: string;
  userEmail: string;
  schoolSlug: string;
  schoolName: string;
  milestoneId: string;
  milestoneLabel: string;
  targetDate: string;
  timing: ReminderTiming;
}): Promise<{ success: boolean; reminder?: AdmissionReminder; error?: string }> {
  await ensureMongoSync();
  const res = createAdmissionReminder(params);
  if (res.success && res.reminder && isMongoConfigured()) {
    try {
      const remCol = await getRemindersCollection();
      if (remCol) {
        await remCol.updateOne({ id: res.reminder.id }, { $set: res.reminder }, { upsert: true });
      }
    } catch (err) {
      console.warn('[MONGO_CREATE_REMINDER_ERROR]', err);
    }
  }
  return res;
}

export function getUserReminders(userId: string): AdmissionReminder[] {
  initDb();
  if (!userId) return [];
  return (globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || []).filter(r => r.userId === userId);
}

export async function getUserRemindersAsync(userId: string): Promise<AdmissionReminder[]> {
  await ensureMongoSync();
  return getUserReminders(userId);
}

export function updateReminderStatus(
  userId: string,
  reminderId: string,
  status: 'active' | 'disabled'
): { success: boolean; reminder?: AdmissionReminder; error?: string } {
  initDb();
  if (!userId || !reminderId) return { success: false, error: 'Invalid parameters.' };
  const reminder = (globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || []).find(
    r => r.id === reminderId && r.userId === userId
  );
  if (!reminder) {
    return { success: false, error: 'Reminder not found or permission denied.' };
  }
  reminder.status = status;
  reminder.updatedAt = new Date().toISOString();
  saveStoreToDisk();
  return { success: true, reminder };
}

export async function updateReminderStatusAsync(
  userId: string,
  reminderId: string,
  status: 'active' | 'disabled'
): Promise<{ success: boolean; reminder?: AdmissionReminder; error?: string }> {
  await ensureMongoSync();
  const res = updateReminderStatus(userId, reminderId, status);
  if (res.success && res.reminder && isMongoConfigured()) {
    try {
      const remCol = await getRemindersCollection();
      if (remCol) {
        await remCol.updateOne(
          { id: reminderId, userId },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );
      }
    } catch (err) {
      console.warn('[MONGO_UPDATE_REMINDER_ERROR]', err);
    }
  }
  return res;
}

export function deleteReminder(
  userId: string,
  reminderId: string
): { success: boolean; error?: string } {
  initDb();
  if (!userId || !reminderId) return { success: false, error: 'Invalid parameters.' };
  const list = globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || [];
  const idx = list.findIndex(r => r.id === reminderId && r.userId === userId);
  if (idx === -1) {
    return { success: false, error: 'Reminder not found or permission denied.' };
  }
  list.splice(idx, 1);
  saveStoreToDisk();
  return { success: true };
}

export async function deleteReminderAsync(
  userId: string,
  reminderId: string
): Promise<{ success: boolean; error?: string }> {
  await ensureMongoSync();
  const res = deleteReminder(userId, reminderId);
  if (res.success && isMongoConfigured()) {
    try {
      const remCol = await getRemindersCollection();
      if (remCol) {
        await remCol.deleteOne({ id: reminderId, userId });
      }
    } catch (err) {
      console.warn('[MONGO_DELETE_REMINDER_ERROR]', err);
    }
  }
  return res;
}

export function getAllActiveReminders(): AdmissionReminder[] {
  initDb();
  return (globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || []).filter(r => r.status === 'active');
}

export async function getAllActiveRemindersAsync(): Promise<AdmissionReminder[]> {
  await ensureMongoSync();
  return (globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || []).filter(r => r.status === 'active');
}

export function markReminderNotified(reminderId: string): void {
  initDb();
  const reminder = (globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || []).find(r => r.id === reminderId);
  if (reminder) {
    reminder.lastNotifiedAt = new Date().toISOString();
    saveStoreToDisk();
  }
}

export async function markReminderNotifiedAsync(reminderId: string): Promise<void> {
  await ensureMongoSync();
  const reminder = (globalAuthStore.__ADMISSION_PITARA_REMINDERS__ || []).find(r => r.id === reminderId);
  if (reminder) {
    reminder.lastNotifiedAt = new Date().toISOString();
    saveStoreToDisk();

    try {
      const col = await getRemindersCollection();
      if (col) {
        await col.updateOne(
          { id: reminderId },
          { $set: { lastNotifiedAt: reminder.lastNotifiedAt } }
        );
      }
    } catch (e) {
      console.error('MongoDB sync error in markReminderNotifiedAsync:', e);
    }
  }
}

// ----------------------------------------------------------------------------
// PLATFORM ANNOUNCEMENTS
// ----------------------------------------------------------------------------
export interface PlatformAnnouncement {
  id: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  targetAudience: 'all' | 'parents' | 'unverified';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

const globalAnnouncementsStore = globalThis as unknown as {
  __ADMISSION_PITARA_ANNOUNCEMENTS__?: PlatformAnnouncement[];
};
if (!globalAnnouncementsStore.__ADMISSION_PITARA_ANNOUNCEMENTS__) {
  globalAnnouncementsStore.__ADMISSION_PITARA_ANNOUNCEMENTS__ = [];
}
const announcements = globalAnnouncementsStore.__ADMISSION_PITARA_ANNOUNCEMENTS__;

export function getAllAnnouncements(includeDrafts = true): PlatformAnnouncement[] {
  if (includeDrafts) return [...announcements];
  return announcements.filter(a => a.status === 'published');
}

export function createAnnouncement(data: Omit<PlatformAnnouncement, 'id' | 'createdAt' | 'updatedAt'>, adminEmail = 'admin@admissionpitara.com'): PlatformAnnouncement {
  const newAnn: PlatformAnnouncement = {
    ...data,
    id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: adminEmail,
  };
  announcements.unshift(newAnn);
  return newAnn;
}

export function updateAnnouncement(id: string, updates: Partial<PlatformAnnouncement>): PlatformAnnouncement | null {
  const ann = announcements.find(a => a.id === id);
  if (!ann) return null;
  Object.assign(ann, updates, { updatedAt: new Date().toISOString() });
  return ann;
}

export function deleteAnnouncement(id: string): boolean {
  const idx = announcements.findIndex(a => a.id === id);
  if (idx === -1) return false;
  announcements.splice(idx, 1);
  return true;
}

// ----------------------------------------------------------------------------
// INBOX: CORRECTIONS, ENQUIRIES & SCHOOL SUBMISSIONS
// ----------------------------------------------------------------------------
export interface SchoolSubmission {
  id: string;
  type: 'school_submission' | 'data_correction' | 'parent_enquiry' | 'partnership' | 'admission_registration' | 'admission_preregistration';
  schoolName?: string;
  schoolSlug?: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  submitterRole?: 'parent' | 'school_admin' | 'other';
  title: string;
  description: string;
  academicSession?: string;
  childGrade?: string;
  residentialSociety?: string;
  consent?: boolean;
  userId?: string;
  proposedChanges?: Record<string, unknown>;
  sourceReference?: string;
  status: 'new' | 'in_review' | 'resolved' | 'rejected';
  adminNotes?: string;
  assignedAdmin?: string;
  createdAt: string;
  updatedAt: string;
}

const globalSubmissionsStore = globalThis as unknown as {
  __ADMISSION_PITARA_SUBMISSIONS__?: SchoolSubmission[];
};
if (!globalSubmissionsStore.__ADMISSION_PITARA_SUBMISSIONS__) {
  globalSubmissionsStore.__ADMISSION_PITARA_SUBMISSIONS__ = [];
}
const submissions = globalSubmissionsStore.__ADMISSION_PITARA_SUBMISSIONS__;

export function getAllSubmissions(): SchoolSubmission[] {
  return [...submissions];
}

export async function getAllSubmissionsAsync(): Promise<SchoolSubmission[]> {
  if (isMongoConfigured()) {
    try {
      const subCol = await getSubmissionsCollection();
      if (subCol) {
        const items = await subCol.find({}).sort({ createdAt: -1 }).toArray();
        if (items && items.length > 0) {
          return items.map((doc) => {
            const { _id, ...rest } = doc;
            return rest as SchoolSubmission;
          });
        }
      }
    } catch (err) {
      console.warn('[MONGO_GET_SUBMISSIONS_WARN]', err);
    }
  }
  return getAllSubmissions();
}

export function createSchoolSubmission(data: Omit<SchoolSubmission, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SchoolSubmission {
  const newSub: SchoolSubmission = {
    ...data,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  submissions.unshift(newSub);
  return newSub;
}

export async function createSchoolSubmissionAsync(data: Omit<SchoolSubmission, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<SchoolSubmission> {
  const newSub = createSchoolSubmission(data);
  if (isMongoConfigured()) {
    try {
      const subCol = await getSubmissionsCollection();
      if (subCol) {
        await subCol.insertOne({ ...newSub });
      }
    } catch (err) {
      console.warn('[MONGO_CREATE_SUBMISSION_WARN]', err);
    }
  }
  return newSub;
}

export function updateSubmissionStatus(
  id: string,
  status: SchoolSubmission['status'],
  adminNotes?: string,
  assignedAdmin?: string
): SchoolSubmission | null {
  const item = submissions.find(s => s.id === id);
  if (!item) return null;
  item.status = status;
  if (adminNotes !== undefined) item.adminNotes = adminNotes;
  if (assignedAdmin !== undefined) item.assignedAdmin = assignedAdmin;
  item.updatedAt = new Date().toISOString();
  return item;
}

export async function updateSubmissionStatusAsync(
  id: string,
  status: SchoolSubmission['status'],
  adminNotes?: string,
  assignedAdmin?: string
): Promise<SchoolSubmission | null> {
  const updatedInMemory = updateSubmissionStatus(id, status, adminNotes, assignedAdmin);
  if (isMongoConfigured()) {
    try {
      const subCol = await getSubmissionsCollection();
      if (subCol) {
        const nowIso = new Date().toISOString();
        const updateFields: Partial<SchoolSubmission> = {
          status,
          updatedAt: nowIso,
        };
        if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;
        if (assignedAdmin !== undefined) updateFields.assignedAdmin = assignedAdmin;

        const res = await subCol.findOneAndUpdate(
          { id },
          { $set: updateFields },
          { returnDocument: 'after' }
        );
        if (res) {
          const { _id, ...rest } = res;
          return rest as SchoolSubmission;
        }
      }
    } catch (err) {
      console.warn('[MONGO_UPDATE_SUBMISSION_WARN]', err);
    }
  }
  return updatedInMemory;
}

// ----------------------------------------------------------------------------
// EMAIL CAMPAIGN HISTORY
// ----------------------------------------------------------------------------
export interface EmailCampaignRecord {
  id: string;
  subject: string;
  bodySnippet: string;
  recipientType: 'individual' | 'all_parents' | 'verified_parents' | 'schools';
  recipientCount: number;
  recipientsPreview: string[];
  sentBy: string;
  sentAt: string;
  status: 'sent' | 'partially_failed' | 'test';
}

const globalEmailHistory = globalThis as unknown as {
  __ADMISSION_PITARA_EMAIL_HISTORY__?: EmailCampaignRecord[];
};
if (!globalEmailHistory.__ADMISSION_PITARA_EMAIL_HISTORY__) {
  globalEmailHistory.__ADMISSION_PITARA_EMAIL_HISTORY__ = [];
}
const emailCampaigns = globalEmailHistory.__ADMISSION_PITARA_EMAIL_HISTORY__;

export function getEmailCampaigns(): EmailCampaignRecord[] {
  return [...emailCampaigns];
}

export function recordEmailCampaign(data: Omit<EmailCampaignRecord, 'id' | 'sentAt'>): EmailCampaignRecord {
  const record: EmailCampaignRecord = {
    ...data,
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sentAt: new Date().toISOString(),
  };
  emailCampaigns.unshift(record);
  return record;
}

// ----------------------------------------------------------------------------
// SECURITY EVENTS LOG
// ----------------------------------------------------------------------------
export interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'user_suspended' | 'user_banned' | 'unauthorized_admin_attempt' | 'bulk_operation';
  ip?: string;
  identifier?: string;
  userId?: string;
  userEmail?: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

const globalSecurityEvents = globalThis as unknown as {
  __ADMISSION_PITARA_SECURITY_EVENTS__?: SecurityEvent[];
};
if (!globalSecurityEvents.__ADMISSION_PITARA_SECURITY_EVENTS__) {
  globalSecurityEvents.__ADMISSION_PITARA_SECURITY_EVENTS__ = [];
}
const securityEvents = globalSecurityEvents.__ADMISSION_PITARA_SECURITY_EVENTS__;

export function getSecurityEvents(limit = 100): SecurityEvent[] {
  return securityEvents.slice(0, limit);
}

export function recordSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
  const newEv: SecurityEvent = {
    ...event,
    id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  securityEvents.unshift(newEv);
  return newEv;
}

// ----------------------------------------------------------------------------
// ADMIN NOTIFICATIONS BELL CENTER
// ----------------------------------------------------------------------------
export interface AdminNotification {
  id: string;
  type: 'new_submission' | 'flagged_review' | 'data_alert' | 'security_event' | 'reminder_failure';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const globalAdminNotifications = globalThis as unknown as {
  __ADMISSION_PITARA_ADMIN_NOTIFS__?: AdminNotification[];
};
if (!globalAdminNotifications.__ADMISSION_PITARA_ADMIN_NOTIFS__) {
  globalAdminNotifications.__ADMISSION_PITARA_ADMIN_NOTIFS__ = [];
}
const adminNotifs = globalAdminNotifications.__ADMISSION_PITARA_ADMIN_NOTIFS__;

export function getAdminNotifications(): AdminNotification[] {
  return [...adminNotifs];
}

export function markNotificationRead(id: string): void {
  const n = adminNotifs.find(item => item.id === id);
  if (n) n.read = true;
}

export function markAllNotificationsRead(): void {
  adminNotifs.forEach(n => { n.read = true; });
}

export function addAdminNotification(data: Omit<AdminNotification, 'id' | 'read' | 'createdAt'>): AdminNotification {
  const n: AdminNotification = {
    ...data,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  adminNotifs.unshift(n);
  return n;
}