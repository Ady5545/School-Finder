import { MongoClient, Db, Collection } from 'mongodb';
import type {
  ParentUser,
  SchoolRating,
  AdmissionReminder,
  ActivityEvent,
  AdminAuditLog,
  SchoolPromotionCampaign,
  SchoolSubmission,
} from './authStore';

export interface SchoolViewDoc {
  slug: string;
  totalViews: number;
  authenticatedViews: number;
  anonymousViews: number;
  uniqueParentIds: string[];
  lastViewedAt: string;
  createdAt?: string;
  count?: number;
}

export interface OtpDoc {
  email: string;
  code: string;
  purpose: 'register' | 'login' | 'reset';
  expiresAt: number;
  attempts: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RateLimitDoc {
  key: string;
  count: number;
  resetAt: number;
}

// Global cache for MongoClient promise in serverless / development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || '';

let clientPromise: Promise<MongoClient> | null = null;
let indexesEnsured = false;

export function isMongoConfigured(): boolean {
  return Boolean(MONGO_URI && MONGO_URI.trim().length > 0);
}

async function ensureMongoIndexes(client: MongoClient): Promise<void> {
  if (indexesEnsured) return;
  try {
    const db = client.db();
    await Promise.allSettled([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('users').createIndex({ id: 1 }, { unique: true }),
      db.collection('ratings').createIndex({ id: 1 }, { unique: true }),
      db.collection('ratings').createIndex({ schoolSlug: 1, status: 1 }),
      db.collection('ratings').createIndex({ userId: 1 }),
      db.collection('reminders').createIndex({ id: 1 }, { unique: true }),
      db.collection('reminders').createIndex({ userId: 1 }),
      db.collection('reminders').createIndex({ email: 1 }),
      db.collection('promotions').createIndex({ id: 1 }, { unique: true }),
      db.collection('activity_events').createIndex({ timestamp: -1 }),
      db.collection('activity_events').createIndex({ schoolSlug: 1, type: 1 }),
      db.collection('activity_events').createIndex({ userId: 1 }),
      db.collection('audit_logs').createIndex({ timestamp: -1 }),
      db.collection('school_views').createIndex({ slug: 1 }, { unique: true }),
      db.collection('otps').createIndex({ email: 1 }, { unique: true }),
      db.collection('otps').createIndex({ expiresAt: 1 }),
      db.collection('rate_limits').createIndex({ key: 1 }, { unique: true }),
      db.collection('rate_limits').createIndex({ resetAt: 1 }),
      db.collection('school_submissions').createIndex({ id: 1 }, { unique: true }),
      db.collection('school_submissions').createIndex({ createdAt: -1 }),
    ]);
    indexesEnsured = true;
  } catch (idxErr) {
    console.warn('[MONGO_INDEX_WARN]', idxErr);
  }
}

export function getMongoClientPromise(): Promise<MongoClient> | null {
  if (!isMongoConfigured()) {
    return null;
  }

  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 20,
      minPoolSize: 1,
    });

    clientPromise = client.connect().then(connectedClient => {
      // Run index creation in background non-blocking
      ensureMongoIndexes(connectedClient).catch(err => {
        console.warn('[MONGO_INDEX_WARN]', err);
      });
      return connectedClient;
    });

    global._mongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getMongoDb(required = false): Promise<Db | null> {
  const promise = getMongoClientPromise();
  if (!promise) {
    if (required && isMongoConfigured()) {
      throw new Error('Database connection configuration failed');
    }
    return null;
  }
  try {
    const client = await promise;
    return client.db();
  } catch (err) {
    console.error('[MONGO_CONN_ERROR]', err);
    if (required || isMongoConfigured()) {
      throw new Error(`Database connection failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return null;
  }
}

export async function requireMongoDb(): Promise<Db> {
  const db = await getMongoDb(true);
  if (!db) {
    throw new Error('Database is currently unreachable');
  }
  return db;
}

// Typed collection getters
export async function getUsersCollection(required = false): Promise<Collection<ParentUser> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<ParentUser>('users') : null;
}

export async function getRatingsCollection(required = false): Promise<Collection<SchoolRating> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<SchoolRating>('ratings') : null;
}

export async function getRemindersCollection(required = false): Promise<Collection<AdmissionReminder> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<AdmissionReminder>('reminders') : null;
}

export async function getActivityCollection(required = false): Promise<Collection<ActivityEvent> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<ActivityEvent>('activity_events') : null;
}

export async function getAuditLogsCollection(required = false): Promise<Collection<AdminAuditLog> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<AdminAuditLog>('audit_logs') : null;
}

export async function getPromotionsCollection(required = false): Promise<Collection<SchoolPromotionCampaign> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<SchoolPromotionCampaign>('promotions') : null;
}

export async function getSchoolViewsCollection(required = false): Promise<Collection<SchoolViewDoc> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<SchoolViewDoc>('school_views') : null;
}

export async function getSchoolSavesCollection(required = false): Promise<Collection<{ slug: string; count: number; lastSavedAt: string }> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<{ slug: string; count: number; lastSavedAt: string }>('school_saves') : null;
}

export async function getOtpsCollection(required = false): Promise<Collection<OtpDoc> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<OtpDoc>('otps') : null;
}

export async function getRateLimitsCollection(required = false): Promise<Collection<RateLimitDoc> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<RateLimitDoc>('rate_limits') : null;
}

export async function getSubmissionsCollection(required = false): Promise<Collection<SchoolSubmission> | null> {
  const db = await getMongoDb(required);
  return db ? db.collection<SchoolSubmission>('school_submissions') : null;
}
