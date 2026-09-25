import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getCanonicalSchools, getArchivedSchools } from '@data/schoolsData';
import { getAllParentUsersAsync, getAllRatingsAsync, getAdminAuditLogs } from '@/lib/authStore';
import { getEmailCredentials } from '@/lib/emailService';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'system:health');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const activeSchools = getCanonicalSchools();
  const archivedSchools = getArchivedSchools();
  const users = await getAllParentUsersAsync();
  const ratings = await getAllRatingsAsync();
  const creds = getEmailCredentials();
  const auditLogs = getAdminAuditLogs(1);

  let databaseStatus: 'healthy' | 'unconfigured' | 'unavailable' = 'unconfigured';
  let databaseError: string | undefined;
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb(true);
      if (!db) {
        databaseStatus = 'unavailable';
        databaseError = 'MongoDB connection is unavailable.';
      } else {
        await db.command({ ping: 1 });
        databaseStatus = 'healthy';
      }
    } catch (error) {
      databaseStatus = 'unavailable';
      databaseError = error instanceof Error ? error.message : 'MongoDB health probe failed.';
    }
  }

  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  return NextResponse.json({
    success: true,
    system: {
      status: databaseStatus === 'unavailable' ? 'degraded' : 'operational',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      memory: memoryUsage ? {
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      } : null,
    },
    database: {
      status: databaseStatus,
      ...(databaseError ? { error: databaseError } : {}),
      activeCanonicalSchools: activeSchools.length,
      archivedSchools: archivedSchools.length,
      registeredParentUsers: users.length,
      verifiedParentUsers: users.filter(u => u.emailVerified).length,
      totalReviews: ratings.length,
      latestAuditLogAt: auditLogs[0]?.timestamp || null,
    },
    integrations: {
      smtpService: {
        configured: creds.hasUser && creds.hasPass,
        host: creds.smtpHost,
        port: creds.smtpPort,
      },
      telemetry: {
        status: databaseStatus === 'healthy' ? 'active' : databaseStatus === 'unconfigured' ? 'memory_fallback' : 'degraded',
        storage: databaseStatus === 'healthy' ? 'mongodb' : 'memory_fallback',
      },
      securityMiddleware: {
        status: 'enforced',
        rbac: 'active',
      },
    },
  });
}
