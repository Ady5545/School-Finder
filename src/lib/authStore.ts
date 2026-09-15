import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface ParentUser {
  id: string;
  name: string;
  email: string;
  preferredSchoolLocality?: string; // e.g. "Sector 16B", "Techzone 4", "Knowledge Park 5", "Greater Noida West"
  preferredBoards?: string[];
  childGrade?: string;
  passwordHash?: string;
  emailVerified: boolean;
  analyticsConsent: boolean;
  role?: 'parent' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
  lastActivityAt?: string;
  wishlist: string[];
  compareList: string[];
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
  createdAt: string;
  updatedAt: string;
}

export type ActivityEventType =
  | 'school_view'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'compare_add'
  | 'rating_submitted'
  | 'rating_edited'
  | 'rating_deleted'
  | 'search_performed'
  | 'search_area_selected'
  | 'user_signup'
  | 'user_login';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  schoolSlug?: string;
  locality?: string;
  userId?: string;
  approximateTimeSpent?: string; // e.g., "< 1 min", "1-3 min", "3-5 min", "5+ min"
  details?: Record<string, unknown>;
  timestamp: string;
}

interface PersistentDbSchema {
  users: Record<string, ParentUser>;
  ratings: SchoolRating[];
  schoolViews: Record<string, number>;
  schoolSaves: Record<string, number>;
  activityEvents: ActivityEvent[];
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

const users = globalAuthStore.__ADMISSION_PITARA_USERS__;
const otps = globalAuthStore.__ADMISSION_PITARA_OTPS__;
const verificationTokens = globalAuthStore.__ADMISSION_PITARA_VERIFICATION_TOKENS__;
const rateLimits = globalAuthStore.__ADMISSION_PITARA_RATE_LIMITS__;
let ratings = globalAuthStore.__ADMISSION_PITARA_RATINGS__;
const schoolViews = globalAuthStore.__ADMISSION_PITARA_SCHOOL_VIEWS__;
const schoolSaves = globalAuthStore.__ADMISSION_PITARA_SCHOOL_SAVES__;
let activityEvents = globalAuthStore.__ADMISSION_PITARA_ACTIVITY__;

const JWT_SECRET = process.env.JWT_SECRET || 'ap_super_secure_jwt_secret_greater_noida_2025';

// Path for persistent atomic storage
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'auth_db.json');

let saveTimeout: NodeJS.Timeout | null = null;
let isSaving = false;
let pendingSave = false;

/**
 * Persist database atomically and asynchronously to disk with debouncing
 * to eliminate event loop blocking and request latency.
 */
export function saveStoreToDisk(immediate = false): void {
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
        activityEvents: activityEvents.slice(0, 500), // Retain latest 500 privacy-conscious events
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
 * Initialize and load database from disk
 */
function initDb(): void {
  if (globalAuthStore.__ADMISSION_PITARA_DB_LOADED__) return;
  globalAuthStore.__ADMISSION_PITARA_DB_LOADED__ = true;

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(content) as PersistentDbSchema;

      if (data.users) {
        for (const user of Object.values(data.users)) {
          users.set(user.email.toLowerCase(), user);
        }
      }

      if (Array.isArray(data.ratings)) {
        ratings.length = 0;
        ratings.push(...data.ratings);
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
    }
  } catch (err) {
    console.warn('[AUTH_DB_WARN] Failed reading existing DB file, re-initializing:', err);
  }

  // Ensure default demo parent account exists
  const demoEmail = 'parent@example.com';
  if (!users.has(demoEmail)) {
    const demoSalt = 'ap_salt_demo_2025';
    const demoHash = crypto.pbkdf2Sync('Parent@12345', demoSalt, 10000, 64, 'sha512').toString('hex') + ':' + demoSalt;
    
    const demoUser: ParentUser = {
      id: 'usr_demo_parent_gnw',
      name: 'Rohit Sharma',
      email: demoEmail,
      preferredSchoolLocality: 'Sector 16B',
      preferredBoards: ['CBSE', 'IB'],
      childGrade: 'Grade 1 (Primary)',
      passwordHash: demoHash,
      emailVerified: true,
      analyticsConsent: true,
      role: 'parent',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      wishlist: ['delhi-public-school-knowledge-park-5', 'lotus-valley-international-school-noida-extension'],
      compareList: ['delhi-public-school-knowledge-park-5', 'delhi-world-public-school-kp-5'],
    };

    users.set(demoUser.email.toLowerCase(), demoUser);
  }

  // Ensure default administrative auditor account exists
  const adminEmail = 'admin@admissionpitara.com';
  if (!users.has(adminEmail)) {
    const adminSalt = 'ap_salt_admin_2025';
    const adminHash = crypto.pbkdf2Sync('Admin@Pitara2025', adminSalt, 10000, 64, 'sha512').toString('hex') + ':' + adminSalt;

    const adminUser: ParentUser = {
      id: 'usr_admin_portal_lead',
      name: 'Admissions Lead Auditor',
      email: adminEmail,
      preferredSchoolLocality: 'Knowledge Park 5',
      passwordHash: adminHash,
      emailVerified: true,
      analyticsConsent: true,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      wishlist: [],
      compareList: [],
    };

    users.set(adminUser.email.toLowerCase(), adminUser);
  }

  // Real ratings start empty - no fake seeded reviews
  saveStoreToDisk();
}

// Initialize immediately
initDb();

// Password Hashing (PBKDF2 with salt)
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

// JWT Token Creation & Verification
export function createSessionToken(user: ParentUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    preferredSchoolLocality: user.preferredSchoolLocality || '',
    role: user.role || 'parent',
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string): {
  sub: string;
  email: string;
  name: string;
  preferredSchoolLocality?: string;
  role?: 'parent' | 'admin';
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
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
    .createHmac('sha256', JWT_SECRET)
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
    .createHmac('sha256', JWT_SECRET)
    .update(`otp_session:${payloadStr}`)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

// Signed verification token after OTP verification
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
    .createHmac('sha256', JWT_SECRET)
    .update(`verify_tok:${payloadStr}`)
    .digest('base64url');

  const token = `${payloadStr}.${signature}`;

  // Cache in memory
  verificationTokens.set(token, {
    email: cleanEmail,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  return token;
}

// OTP Operations (Email Only)
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
          .createHmac('sha256', JWT_SECRET)
          .update(`otp_session:${payloadStr}`)
          .digest('base64url');

        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
          const data = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
          if (data.email === cleanEmail && data.exp > Math.floor(Date.now() / 1000)) {
            const testHmac = crypto
              .createHmac('sha256', JWT_SECRET)
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

export function checkVerificationToken(token: string): string | null {
  if (!token || typeof token !== 'string') return null;

  // 1. In-memory map
  const record = verificationTokens.get(token);
  if (record) {
    if (Date.now() > record.expiresAt) {
      verificationTokens.delete(token);
      return null;
    }
    return record.email;
  }

  // 2. Stateless HMAC verification
  try {
    const parts = token.split('.');
    if (parts.length === 2) {
      const [payloadStr, signature] = parts;
      const expectedSig = crypto
        .createHmac('sha256', JWT_SECRET)
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

// User CRUD Operations
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

export function createParentUser(userData: {
  name: string;
  email: string;
  preferredSchoolLocality?: string;
  password?: string;
  preferredBoards?: string[];
  childGrade?: string;
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
    preferredSchoolLocality: userData.preferredSchoolLocality?.trim() || '',
    preferredBoards: userData.preferredBoards || [],
    childGrade: userData.childGrade || '',
    passwordHash: userData.password ? hashPassword(userData.password) : undefined,
    emailVerified: true,
    analyticsConsent: userData.analyticsConsent ?? true,
    role: userData.role || 'parent',
    createdAt: now,
    lastLoginAt: now,
    lastActivityAt: now,
    wishlist: [],
    compareList: [],
  };

  users.set(emailKey, newUser);
  saveStoreToDisk();

  recordActivityEvent({
    type: 'user_signup',
    userId: newUser.id,
    locality: newUser.preferredSchoolLocality,
  });

  return { user: newUser };
}

export function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    preferredSchoolLocality?: string;
    preferredBoards?: string[];
    childGrade?: string;
    analyticsConsent?: boolean;
  }
): ParentUser | null {
  const user = getUserById(userId);
  if (!user) return null;

  if (updates.name !== undefined) user.name = updates.name.trim();
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

  user.lastActivityAt = new Date().toISOString();
  saveStoreToDisk();
  return user;
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

export function deleteParentUser(userId: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  // Remove ratings authored by this user
  ratings = ratings.filter(r => r.userId !== userId);
  globalAuthStore.__ADMISSION_PITARA_RATINGS__ = ratings;

  // Delete user from map
  users.delete(user.email.toLowerCase());
  saveStoreToDisk();
  return true;
}

export function sanitizeUser(user: ParentUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// ----------------------------------------------------------------------------
// RATINGS & REVIEWS SUBSYSTEM (Genuine Authenticated Reviews Only)
// ----------------------------------------------------------------------------

export function getSchoolRatings(slug: string): SchoolRating[] {
  return ratings.filter(r => r.schoolSlug === slug).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllRatings(): SchoolRating[] {
  return [...ratings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUserRatingForSchool(schoolSlug: string, userId: string): SchoolRating | null {
  const found = ratings.find(r => r.schoolSlug === schoolSlug && r.userId === userId);
  return found || null;
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
}): SchoolRating {
  // Validate score bounds
  const boundedScore = Math.max(1, Math.min(5, Math.round(ratingData.score)));

  // Prevent duplicate review per user per school: update if exists
  const existingIdx = ratings.findIndex(
    r => r.schoolSlug === ratingData.schoolSlug && r.userId === ratingData.userId
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    const existing = ratings[existingIdx];
    const updated: SchoolRating = {
      ...existing,
      score: boundedScore,
      title: ratingData.title?.trim() || existing.title,
      comment: ratingData.comment.trim(),
      categories: ratingData.categories || existing.categories,
      userChildGrade: ratingData.userChildGrade || existing.userChildGrade,
      userName: ratingData.userName || existing.userName,
      updatedAt: now,
    };
    ratings[existingIdx] = updated;
    saveStoreToDisk();

    recordActivityEvent({
      type: 'rating_edited',
      schoolSlug: ratingData.schoolSlug,
      userId: ratingData.userId,
      details: { score: boundedScore },
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
    createdAt: now,
    updatedAt: now,
  };

  ratings.push(newRating);
  saveStoreToDisk();

  recordActivityEvent({
    type: 'rating_submitted',
    schoolSlug: ratingData.schoolSlug,
    userId: ratingData.userId,
    details: { score: boundedScore },
  });

  return newRating;
}

export function deleteSchoolRating(schoolSlug: string, userId: string): boolean {
  const initialLen = ratings.length;
  ratings = ratings.filter(r => !(r.schoolSlug === schoolSlug && r.userId === userId));
  globalAuthStore.__ADMISSION_PITARA_RATINGS__ = ratings;
  if (ratings.length !== initialLen) {
    saveStoreToDisk();
    recordActivityEvent({
      type: 'rating_deleted',
      schoolSlug,
      userId,
    });
    return true;
  }
  return false;
}

export function adminDeleteRating(ratingId: string): boolean {
  const target = ratings.find(r => r.id === ratingId);
  const initialLen = ratings.length;
  ratings = ratings.filter(r => r.id !== ratingId);
  globalAuthStore.__ADMISSION_PITARA_RATINGS__ = ratings;
  if (ratings.length !== initialLen) {
    saveStoreToDisk();
    if (target) {
      recordActivityEvent({
        type: 'rating_deleted',
        schoolSlug: target.schoolSlug,
        details: { ratingId, adminAction: true },
      });
    }
    return true;
  }
  return false;
}

// ----------------------------------------------------------------------------
// ACTIVITY TRACKING & PRIVACY-CONSCIOUS TELEMETRY
// ----------------------------------------------------------------------------

export function recordActivityEvent(
  arg1:
    | ActivityEventType
    | {
        type: ActivityEventType;
        schoolSlug?: string;
        locality?: string;
        userId?: string;
        approximateTimeSpent?: string;
        details?: Record<string, unknown>;
      },
  arg2?: string,
  arg3?: string
): void {
  let type: ActivityEventType;
  let schoolSlug: string | undefined;
  let locality: string | undefined;
  let userId: string | undefined;
  let approximateTimeSpent: string | undefined;
  let details: Record<string, unknown> | undefined;

  if (typeof arg1 === 'object' && arg1 !== null) {
    type = arg1.type;
    schoolSlug = arg1.schoolSlug;
    locality = arg1.locality;
    userId = arg1.userId;
    approximateTimeSpent = arg1.approximateTimeSpent;
    details = arg1.details;
  } else {
    type = arg1;
    schoolSlug = arg2;
    locality = arg3;
  }

  // Aggregate counters
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

  // Record zero-PII privacy event
  const evt: ActivityEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    schoolSlug,
    locality,
    userId,
    approximateTimeSpent,
    details,
    timestamp: new Date().toISOString(),
  };

  activityEvents.unshift(evt);
  if (activityEvents.length > 500) {
    activityEvents.length = 500;
  }

  saveStoreToDisk();
}

export function getActivityAnalytics() {
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

  const viewsObj: Record<string, number> = {};
  for (const [slug, count] of schoolViews.entries()) {
    viewsObj[slug] = count;
  }

  const savesObj: Record<string, number> = {};
  for (const [slug, count] of schoolSaves.entries()) {
    savesObj[slug] = count;
  }

  return {
    totalRegisteredParents: uniqueUsers.size,
    verifiedEmails,
    totalRatings: ratings.length,
    schoolViews: viewsObj,
    schoolSaves: savesObj,
    localityDistribution,
    recentEvents: activityEvents.slice(0, 50),
  };
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

// Convenient named exports for analytics and views
export const getSchoolRatingSummary = getSchoolRatingStats;

export function getActivityEvents(limit = 50): ActivityEvent[] {
  return activityEvents.slice(0, limit);
}

export function recordSchoolView(slug: string, approximateTimeSpent?: string, userId?: string): void {
  recordActivityEvent({
    type: 'school_view',
    schoolSlug: slug,
    userId,
    approximateTimeSpent,
  });
}

export function recordSchoolSave(slug: string, userId?: string): void {
  recordActivityEvent({
    type: 'wishlist_add',
    schoolSlug: slug,
    userId,
  });
}

export function getDashboardAnalytics() {
  const analytics = getActivityAnalytics();
  
  // Calculate active parents: users with lastActivityAt/lastLoginAt within last 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let activeParentsCount = 0;
  const uniqueUsers = new Set<string>();

  for (const user of users.values()) {
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.add(user.id);
      const activityTimestamp = user.lastActivityAt
        ? new Date(user.lastActivityAt).getTime()
        : user.lastLoginAt
        ? new Date(user.lastLoginAt).getTime()
        : new Date(user.createdAt).getTime();

      if (activityTimestamp >= thirtyDaysAgo) {
        activeParentsCount += 1;
      }
    }
  }

  // Calculate average rating across real ratings
  let totalScore = 0;
  for (const r of ratings) {
    totalScore += r.score;
  }
  const averageRating = ratings.length > 0 ? Math.round((totalScore / ratings.length) * 10) / 10 : 0;

  // Compute top viewed and saved schools
  const topViewedSchools = Object.entries(analytics.schoolViews)
    .map(([slug, views]) => ({ slug, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const topSavedSchools = Object.entries(analytics.schoolSaves)
    .map(([slug, saves]) => ({ slug, saves }))
    .sort((a, b) => b.saves - a.saves)
    .slice(0, 5);

  let totalViews = 0;
  for (const v of Object.values(analytics.schoolViews)) totalViews += v;

  let totalSaves = 0;
  for (const s of Object.values(analytics.schoolSaves)) totalSaves += s;

  return {
    totalParents: analytics.totalRegisteredParents,
    activeParents: activeParentsCount,
    verifiedEmails: analytics.verifiedEmails,
    totalViews,
    totalSaves,
    totalRatings: analytics.totalRatings,
    averageRating,
    topViewedSchools,
    topSavedSchools,
    localityDistribution: analytics.localityDistribution,
  };
}

export interface SchoolPopularityMetric {
  slug: string;
  views: number;
  saves: number;
  reviewsCount: number;
  averageScore: number;
}

export function getPublicSchoolPopularity(slug?: string): Record<string, SchoolPopularityMetric> | SchoolPopularityMetric {
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

  const result: Record<string, SchoolPopularityMetric> = {};
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
