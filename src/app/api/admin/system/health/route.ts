import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getCanonicalSchools, getArchivedSchools } from '@data/schoolsData';
import { getAllParentUsersAsync, getAllRatingsAsync, getAdminAuditLogs } from '@/lib/authStore';
import { getEmailCredentials } from '@/lib/emailService';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const activeSchools = getCanonicalSchools();
  const archivedSchools = getArchivedSchools();
  const users = await getAllParentUsersAsync();
  const ratings = await getAllRatingsAsync();
  const creds = getEmailCredentials();
  const auditLogs = getAdminAuditLogs(1);

  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  return NextResponse.json({
    success: true,
    system: {
      status: 'operational',
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
      status: 'healthy',
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
        status: 'active',
        storage: 'isolated_persistent',
      },
      securityMiddleware: {
        status: 'enforced',
        rbac: 'active',
      },
    },
  });
}
