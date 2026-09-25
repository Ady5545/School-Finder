import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { getAllUsersSanitizedAsync, getActivityEventsAsync } from '../../../../lib/authStore';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'users:manage');
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get('q') || '').trim().toLowerCase();
  const statusFilter = searchParams.get('status') || 'all'; // 'all', 'active', 'disabled'
  const verifiedFilter = searchParams.get('verified') || 'all'; // 'all', 'verified', 'unverified'
  const roleFilter = searchParams.get('role') || 'all'; // 'all', 'parent', 'admin'
  const sortBy = searchParams.get('sortBy') || 'createdAt'; // 'createdAt', 'lastActivityAt', 'name', 'views', 'wishlist'
  const sortOrder = searchParams.get('sortOrder') || 'desc'; // 'asc', 'desc'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '25', 10)));

  const allUsers = await getAllUsersSanitizedAsync();

  // Fetch telemetry once and aggregate in memory instead of issuing one
  // database query per user. This removes the admin Users-tab N+1 waterfall.
  const activityEvents = await getActivityEventsAsync(100000);
  const engagementByUser = new Map<string, {
    schoolsViewedCount: number;
    searchesPerformedCount: number;
    comparisonsCount: number;
    reviewsSubmittedCount: number;
    totalEvents: number;
  }>();

  for (const event of activityEvents) {
    if (!event.userId) continue;
    const summary = engagementByUser.get(event.userId) || {
      schoolsViewedCount: 0,
      searchesPerformedCount: 0,
      comparisonsCount: 0,
      reviewsSubmittedCount: 0,
      totalEvents: 0,
    };
    summary.totalEvents += 1;
    if (event.type === 'school_view') summary.schoolsViewedCount += 1;
    if (event.type === 'search_performed') summary.searchesPerformedCount += 1;
    if (event.type === 'compare_view') summary.comparisonsCount += 1;
    if (event.type === 'rating_submitted') summary.reviewsSubmittedCount += 1;
    engagementByUser.set(event.userId, summary);
  }

  const augmentedUsers = allUsers.map(u => {
    const activity = engagementByUser.get(u.id);
    return {
      ...u,
      engagement: {
        schoolsViewedCount: activity?.schoolsViewedCount || 0,
        searchesPerformedCount: activity?.searchesPerformedCount || 0,
        comparisonsCount: activity?.comparisonsCount || 0,
        shortlistedCount: Array.isArray(u.wishlist) ? u.wishlist.length : 0,
        reviewsSubmittedCount: activity?.reviewsSubmittedCount || 0,
        totalEvents: activity?.totalEvents || 0,
      },
    };
  });

  // Filter
  let filtered = augmentedUsers.filter(u => {
    if (search) {
      const matchName = u.name?.toLowerCase().includes(search);
      const matchEmail = u.email?.toLowerCase().includes(search);
      const matchId = u.id?.toLowerCase().includes(search);
      const matchLoc = u.preferredSchoolLocality?.toLowerCase().includes(search);
      if (!matchName && !matchEmail && !matchId && !matchLoc) return false;
    }

    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (verifiedFilter === 'verified' && !u.emailVerified) return false;
    if (verifiedFilter === 'unverified' && u.emailVerified) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    let comp = 0;
    if (sortBy === 'name') {
      comp = (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'lastActivityAt') {
      const tA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
      const tB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      comp = tA - tB;
    } else if (sortBy === 'views') {
      comp = a.engagement.schoolsViewedCount - b.engagement.schoolsViewedCount;
    } else if (sortBy === 'wishlist') {
      comp = a.engagement.shortlistedCount - b.engagement.shortlistedCount;
    } else {
      // createdAt default
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      comp = tA - tB;
    }

    return sortOrder === 'asc' ? comp : -comp;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    users: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    summaryCounts: {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.status === 'active').length,
      disabledUsers: allUsers.filter(u => u.status === 'disabled').length,
      verifiedUsers: allUsers.filter(u => u.emailVerified).length,
    },
  });
}
