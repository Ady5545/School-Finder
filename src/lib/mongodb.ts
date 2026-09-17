import { MongoClient, Db, Collection } from 'mongodb';
import type {
  ParentUser,
  SchoolRating,
  AdmissionReminder,
  ActivityEvent,
  AdminAuditLog,
  SchoolPromotionCampaign,
} from './authStore';

// Global cache for MongoClient promise in serverless / development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || '';

let clientPromise: Promise<MongoClient> | null = null;

export function isMongoConfigured(): boolean {
  return Boolean(MONGO_URI && MONGO_URI.trim().length > 0);
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

    clientPromise = client.connect().then(async connectedClient => {
      // Ensure essential indexes on first connection
      try {
        const db = connectedClient.db();
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
          db.collection('audit_logs').createIndex({ timestamp: -1 }),
        ]);
      } catch (idxErr) {
        console.warn('[MONGO_INDEX_WARN]', idxErr);
      }
      return connectedClient;
    });

    global._mongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getMongoDb(): Promise<Db | null> {
  const promise = getMongoClientPromise();
  if (!promise) return null;
  try {
    const client = await promise;
    return client.db();
  } catch (err) {
    console.warn('[MONGO_CONN_ERROR] Falling back to memory/file store:', err);
    return null;
  }
}

// Typed collection getters
export async function getUsersCollection(): Promise<Collection<ParentUser> | null> {
  const db = await getMongoDb();
  return db ? db.collection<ParentUser>('users') : null;
}

export async function getRatingsCollection(): Promise<Collection<SchoolRating> | null> {
  const db = await getMongoDb();
  return db ? db.collection<SchoolRating>('ratings') : null;
}

export async function getRemindersCollection(): Promise<Collection<AdmissionReminder> | null> {
  const db = await getMongoDb();
  return db ? db.collection<AdmissionReminder>('reminders') : null;
}

export async function getActivityCollection(): Promise<Collection<ActivityEvent> | null> {
  const db = await getMongoDb();
  return db ? db.collection<ActivityEvent>('activity_events') : null;
}

export async function getAuditLogsCollection(): Promise<Collection<AdminAuditLog> | null> {
  const db = await getMongoDb();
  return db ? db.collection<AdminAuditLog>('audit_logs') : null;
}

export async function getPromotionsCollection(): Promise<Collection<SchoolPromotionCampaign> | null> {
  const db = await getMongoDb();
  return db ? db.collection<SchoolPromotionCampaign>('promotions') : null;
}

export async function getSchoolViewsCollection(): Promise<Collection<{ slug: string; count: number; lastViewedAt: string }> | null> {
  const db = await getMongoDb();
  return db ? db.collection<{ slug: string; count: number; lastViewedAt: string }>('school_views') : null;
}

export async function getSchoolSavesCollection(): Promise<Collection<{ slug: string; count: number; lastSavedAt: string }> | null> {
  const db = await getMongoDb();
  return db ? db.collection<{ slug: string; count: number; lastSavedAt: string }>('school_saves') : null;
}
