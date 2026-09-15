import crypto from 'crypto';

export interface ParentUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  locality: string;
  preferredBoards?: string[];
  childGrade?: string;
  passwordHash: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  marketingConsent: boolean;
  createdAt: string;
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

// In-memory persistent server store
const globalAuthStore = globalThis as unknown as {
  __ADMISSION_PITARA_USERS__?: Map<string, ParentUser>;
  __ADMISSION_PITARA_OTPS__?: Map<string, OtpRecord>;
  __ADMISSION_PITARA_VERIFICATION_TOKENS__?: Map<string, { identifier: string; email?: string; expiresAt: number }>;
  __ADMISSION_PITARA_RATE_LIMITS__?: Map<string, { count: number; resetAt: number }>;
};

if (!globalAuthStore.__ADMISSION_PITARA_USERS__) {
  globalAuthStore.__ADMISSION_PITARA_USERS__ = new Map();

  // Seed sample verified parent account for seamless review
  const demoSalt = 'ap_salt_demo_2025';
  const demoHash = crypto.pbkdf2Sync('Parent@12345', demoSalt, 10000, 64, 'sha512').toString('hex') + ':' + demoSalt;
  
  const demoUser: ParentUser = {
    id: 'usr_demo_parent_gnw',
    name: 'Rohit Sharma',
    mobile: '9876543210',
    email: 'parent@example.com',
    locality: 'Sector 16B, Greater Noida West',
    preferredBoards: ['CBSE', 'IB'],
    childGrade: 'Grade 1 (Primary)',
    passwordHash: demoHash,
    mobileVerified: true,
    emailVerified: true,
    marketingConsent: false,
    createdAt: new Date().toISOString(),
    wishlist: ['dps-greater-noida-west', 'lotus-valley-international-school'],
    compareList: ['dps-greater-noida-west', 'lotus-valley-international-school', 'ryan-international-school'],
  };

  globalAuthStore.__ADMISSION_PITARA_USERS__.set(demoUser.email.toLowerCase(), demoUser);
  globalAuthStore.__ADMISSION_PITARA_USERS__.set(demoUser.mobile, demoUser);
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

const users = globalAuthStore.__ADMISSION_PITARA_USERS__;
const otps = globalAuthStore.__ADMISSION_PITARA_OTPS__;
const verificationTokens = globalAuthStore.__ADMISSION_PITARA_VERIFICATION_TOKENS__;
const rateLimits = globalAuthStore.__ADMISSION_PITARA_RATE_LIMITS__;

const JWT_SECRET = process.env.JWT_SECRET || 'ap_super_secure_jwt_secret_greater_noida_2025';

// Password Hashing
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
    mobile: user.mobile,
    locality: user.locality,
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

export function verifySessionToken(token: string): { sub: string; email: string; name: string; mobile: string; locality: string } | null {
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

// Rate Limiting (Max 3 OTP requests per 10 minutes)
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

// OTP Operations
export function generateAndStoreOtp(identifier: string, purpose: 'register' | 'login'): { code: string; expiresInSeconds: number } {
  const cleanId = identifier.trim().toLowerCase();
  // Clean, 6-digit cryptographically secure OTP
  const code = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const expiresInSeconds = 10 * 60; // 10 minutes
  const expiresAt = Date.now() + expiresInSeconds * 1000;

  otps.set(cleanId, {
    code,
    expiresAt,
    attempts: 0,
    verified: false,
    purpose,
  });

  return {
    code,
    expiresInSeconds,
  };
}

export function verifyOtpCode(
  identifier: string,
  inputCode: string
): { success: boolean; error?: string; verificationToken?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const record = otps.get(cleanId);

  if (!record) {
    return { success: false, error: 'No active OTP found. Please request a new verification code.' };
  }

  if (Date.now() > record.expiresAt) {
    otps.delete(cleanId);
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (record.attempts >= 5) {
    otps.delete(cleanId);
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  record.attempts += 1;

  if (record.code !== inputCode.trim()) {
    return { success: false, error: `Invalid verification code. ${5 - record.attempts} attempts remaining.` };
  }

  // Mark verified & invalidate OTP immediately (single-use)
  record.verified = true;
  otps.delete(cleanId);

  const verificationToken = crypto.randomBytes(24).toString('hex');
  verificationTokens.set(verificationToken, {
    identifier: cleanId,
    email: cleanId,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  return {
    success: true,
    verificationToken,
  };
}

export function checkVerificationToken(token: string): string | null {
  const record = verificationTokens.get(token);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    verificationTokens.delete(token);
    return null;
  }
  return record.identifier;
}

// User CRUD Operations
export function getUserByEmailOrMobile(identifier: string): ParentUser | null {
  const normalized = identifier.trim().toLowerCase();
  const cleanMobile = identifier.replace(/\D/g, '').slice(-10);
  return users.get(normalized) || (cleanMobile ? users.get(cleanMobile) : null) || null;
}

export function getUserById(id: string): ParentUser | null {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export function createParentUser(userData: {
  name: string;
  mobile: string;
  email: string;
  locality: string;
  password: string;
  preferredBoards?: string[];
  childGrade?: string;
  marketingConsent?: boolean;
}): { user?: ParentUser; error?: string } {
  const emailKey = userData.email.trim().toLowerCase();
  const mobileKey = userData.mobile.replace(/\D/g, '').slice(-10);

  if (users.has(emailKey)) {
    return { error: 'An account with this email address already exists.' };
  }

  if (mobileKey && users.has(mobileKey)) {
    return { error: 'An account with this mobile number already exists.' };
  }

  const newUser: ParentUser = {
    id: `usr_${crypto.randomBytes(8).toString('hex')}`,
    name: userData.name.trim(),
    mobile: mobileKey || userData.mobile.trim(),
    email: emailKey,
    locality: userData.locality.trim(),
    preferredBoards: userData.preferredBoards || [],
    childGrade: userData.childGrade || '',
    passwordHash: hashPassword(userData.password),
    mobileVerified: true,
    emailVerified: true,
    marketingConsent: Boolean(userData.marketingConsent),
    createdAt: new Date().toISOString(),
    wishlist: [],
    compareList: [],
  };

  users.set(emailKey, newUser);
  if (mobileKey) {
    users.set(mobileKey, newUser);
  }

  return { user: newUser };
}

export function updateUserLists(userId: string, wishlist?: string[], compareList?: string[]) {
  const user = getUserById(userId);
  if (user) {
    if (wishlist) user.wishlist = wishlist;
    if (compareList) user.compareList = compareList;
  }
}

export function sanitizeUser(user: ParentUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}
