import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import {
  getAdminOverviewMetricsAsync,
  getAllUsersSanitizedAsync,
  getActivityEventsAsync,
  getAllRatingsAsync,
  getWishlistAnalyticsAsync,
  getComparisonAnalyticsAsync,
  getSearchAnalyticsAsync,
  getAdminAuditLogsAsync,
} from '@/lib/authStore';
import { getCanonicalSchools } from '@/lib/schools';

const MODEL = process.env.ADVIS_MODEL || 'gemini-3.8-flash';

const SYSTEM = `You are ADVIS, the private intelligence and operations core for Admission Pitara's authenticated administrator.

Your entire purpose is to understand Admission Pitara itself. You are not a general-purpose chatbot.

Your scope:
- platform health and operational state
- school directory and individual school data
- school CMS/data quality
- fees and fee verification
- admissions status, sessions and funnel activity
- parent/user behaviour and account health
- shortlists/wishlists
- reviews and ratings
- school discovery, searches and comparisons
- promotions/campaigns
- activity/event patterns
- audit/security signals
- reports, data consistency, stale/duplicate/missing records
- product UX and conversion signals when the supplied data supports them
- concrete investigations and operational next steps

Rules:
- Treat live supplied data as the source of truth. Never invent facts.
- Distinguish observed facts, likely explanations, and recommendations.
- Connect signals across datasets instead of answering from only one table.
- When asked for "everything", produce a structured executive briefing: system state, important changes/signals, anomalies, funnel, school intelligence, user intelligence, data integrity, security/audit, and next actions.
- Back important conclusions with the exact observed records, counts, fields, or examples available in the supplied context.
- Never expose secrets, tokens, passwords, API keys, session data, or credentials.
- Never perform destructive mutations from natural-language chat. Deletions, archival, restoration, account changes, review removal, promotion changes and other mutations require an explicit authenticated admin action.
- Do not answer unrelated science, maths, homework, entertainment or general-knowledge questions. Briefly state that your scope is Admission Pitara operations and redirect to a platform question.
- Do not speculate about facts outside the supplied live context.
- Respect admin privacy: use only information already exposed to the authenticated admin context and avoid unnecessary personal detail.
`;

function cleanText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function admissionState(status: unknown): string {
  const value = cleanText(status).toLowerCase();
  if (!value) return 'unknown';
  if (['open', 'ongoing', 'active'].includes(value)) return 'open';
  if (['closed', 'ended', 'inactive'].includes(value)) return 'closed';
  return value;
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, message: 'Administrator authorization required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (!question) {
      return NextResponse.json({ success: false, message: 'Question is required.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: 'ADVIS is not configured: GEMINI_API_KEY is missing.' }, { status: 503 });
    }

    const [overview, users, activity, reviews, wishlists, comparisons, searches, audit] = await Promise.all([
      getAdminOverviewMetricsAsync('30d'),
      getAllUsersSanitizedAsync(),
      getActivityEventsAsync(300),
      getAllRatingsAsync(),
      getWishlistAnalyticsAsync(),
      getComparisonAnalyticsAsync(),
      getSearchAnalyticsAsync(),
      getAdminAuditLogsAsync(150),
    ]);

    const canonicalSchools = getCanonicalSchools();
    const schools = canonicalSchools.map(s => ({
      slug: s.slug,
      name: s.name,
      sector: s.location?.sector || '',
      area: s.location?.area || '',
      city: s.location?.city || '',
      board: s.board || '',
      fee: s.fees?.annualDisplay ?? s.fees?.feeDisplayOverride ?? s.fees?.rangeText ?? s.fees?.tuitionAnnual ?? '',
      feeVerified: s.fees?.isVerified === true,
      feeSession: s.fees?.academicSession || s.fees?.academicYear || '',
      admissions: s.admissions?.status || '',
      admissionsSession: s.admissions?.session || s.admissions?.academicYear || '',
      rating: s.rating?.score || 0,
      ratingCount: s.rating?.reviewsCount || 0,
      coordinateVerified: s.location?.coordinates?.isVerified === true,
      slugStatus: s.status || 'active',
    }));

    const schoolFeeMissing = schools.filter(s => !cleanText(s.fee));
    const schoolFeeUnverified = schools.filter(s => !s.feeVerified);
    const schoolCoordsUnverified = schools.filter(s => !s.coordinateVerified);
    const schoolAdmissionUnknown = schools.filter(s => admissionState(s.admissions) === 'unknown');
    const schoolAdmissionOpen = schools.filter(s => admissionState(s.admissions) === 'open');
    const schoolAdmissionClosed = schools.filter(s => admissionState(s.admissions) === 'closed');

    const publishedReviews = (reviews as any[]).filter(r => r?.status === 'published');
    const deletedReviews = (reviews as any[]).filter(r => r?.status === 'deleted');
    const reviewAverage = publishedReviews.length
      ? publishedReviews.reduce((sum, r) => sum + Number(r?.score || 0), 0) / publishedReviews.length
      : 0;

    const usersActive = (users as any[]).filter(u => u?.status === 'active');
    const usersVerified = (users as any[]).filter(u => u?.emailVerified === true);
    const usersWithWishlist = (users as any[]).filter(u => Array.isArray(u?.wishlist) && u.wishlist.length > 0);

    const eventCounts = new Map<string, number>();
    for (const event of activity as any[]) {
      const type = cleanText(event?.type) || 'unknown';
      eventCounts.set(type, (eventCounts.get(type) || 0) + 1);
    }
    const topEventTypes = [...eventCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([type, count]) => ({ type, count }));

    const schoolAttention = new Map<string, { name: string; views: number; saves: number; events: number }>();
    for (const event of activity as any[]) {
      const slug = cleanText(event?.schoolSlug);
      if (!slug) continue;
      const current = schoolAttention.get(slug) || { name: cleanText(event?.schoolName) || slug, views: 0, saves: 0, events: 0 };
      current.events += 1;
      if (cleanText(event?.type).toLowerCase().includes('view')) current.views += 1;
      if (cleanText(event?.type).toLowerCase().includes('save') || cleanText(event?.type).toLowerCase().includes('wishlist') || cleanText(event?.type).toLowerCase().includes('shortlist')) current.saves += 1;
      schoolAttention.set(slug, current);
    }
    const topAttentionSchools = [...schoolAttention.entries()]
      .sort((a, b) => b[1].events - a[1].events)
      .slice(0, 12)
      .map(([slug, value]) => ({ slug, ...value }));

    const suspiciousPatterns: Array<{ severity: 'high' | 'medium' | 'low'; issue: string; evidence: string }> = [];
    if (schoolFeeMissing.length) suspiciousPatterns.push({
      severity: 'medium',
      issue: 'Schools with no fee display value',
      evidence: `${schoolFeeMissing.length} of ${schools.length} canonical schools have no fee display field.`,
    });
    if (schoolFeeUnverified.length) suspiciousPatterns.push({
      severity: 'low',
      issue: 'Schools with unverified fee data',
      evidence: `${schoolFeeUnverified.length} of ${schools.length} schools are not marked fee-verified.`,
    });
    if (schoolCoordsUnverified.length) suspiciousPatterns.push({
      severity: 'low',
      issue: 'Schools with unverified coordinates',
      evidence: `${schoolCoordsUnverified.length} of ${schools.length} canonical schools are missing verified coordinates.`,
    });
    if (schoolAdmissionUnknown.length) suspiciousPatterns.push({
      severity: 'medium',
      issue: 'Schools with unknown admission status',
      evidence: `${schoolAdmissionUnknown.length} schools have no recognised open/closed admission state.`,
    });
    if (deletedReviews.length > publishedReviews.length && deletedReviews.length > 0) suspiciousPatterns.push({
      severity: 'medium',
      issue: 'Deleted reviews exceed published reviews',
      evidence: `${deletedReviews.length} deleted review records vs ${publishedReviews.length} published records in the loaded review set.`,
    });

    const datasetSummary = {
      canonicalSchoolCount: schools.length,
      parentUserCount: users.length,
      activeParentUserCount: usersActive.length,
      verifiedParentEmailCount: usersVerified.length,
      usersWithWishlistCount: usersWithWishlist.length,
      activityEventCount: (activity as any[]).length,
      reviewRecordCount: (reviews as any[]).length,
      publishedReviewCount: publishedReviews.length,
      deletedReviewCount: deletedReviews.length,
      wishlistRecordCount: (wishlists as any[]).length,
      auditRecordCount: (audit as any[]).length,
    };

    const intelligence = {
      generatedAt: new Date().toISOString(),
      health: {
        status: suspiciousPatterns.some(x => x.severity === 'high') ? 'attention' : suspiciousPatterns.length >= 3 ? 'watch' : 'stable',
        issueCount: suspiciousPatterns.length,
        high: suspiciousPatterns.filter(x => x.severity === 'high').length,
        medium: suspiciousPatterns.filter(x => x.severity === 'medium').length,
        low: suspiciousPatterns.filter(x => x.severity === 'low').length,
      },
      schools: {
        total: schools.length,
        admissionsOpen: schoolAdmissionOpen.length,
        admissionsClosed: schoolAdmissionClosed.length,
        admissionsUnknown: schoolAdmissionUnknown.length,
        missingFee: schoolFeeMissing.length,
        unverifiedFee: schoolFeeUnverified.length,
        unverifiedCoordinates: schoolCoordsUnverified.length,
        topAttentionSchools,
      },
      users: {
        total: users.length,
        active: usersActive.length,
        verifiedEmail: usersVerified.length,
        withWishlist: usersWithWishlist.length,
      },
      reviews: {
        total: (reviews as any[]).length,
        published: publishedReviews.length,
        deleted: deletedReviews.length,
        averagePublishedScore: Number(reviewAverage.toFixed(2)),
      },
      activity: {
        loadedEvents: (activity as any[]).length,
        topEventTypes,
      },
      anomalies: suspiciousPatterns,
      datasets: datasetSummary,
    };

    const safeUsers = (users as any[]).slice(0, 150).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      emailVerified: u.emailVerified,
      residentialSociety: u.residentialSociety,
      preferredSchoolLocality: u.preferredSchoolLocality,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      lastActivityAt: u.lastActivityAt,
      wishlist: u.wishlist,
    }));

    const context = {
      generatedAt: intelligence.generatedAt,
      authenticatedAdmin: { id: auth.user.id, email: auth.user.email },
      overview,
      intelligence,
      schools,
      users: safeUsers,
      activity: (activity as any[]).slice(0, 300),
      reviews: (reviews as any[]).slice(0, 150),
      wishlists: (wishlists as any[]).slice(0, 150),
      comparisons,
      searches,
      audit: (audit as any[]).slice(0, 150),
    };

    const prompt = `ADMIN COMMAND:
${question}

ADVIS DETERMINISTIC INTELLIGENCE:
${JSON.stringify(intelligence)}

LIVE ADMIN DATA:
${JSON.stringify(context)}

Answer as the Admission Pitara intelligence core. Prefer concrete evidence over generic advice. When something needs investigation, state exactly what should be checked and why. For mutation requests, describe the exact action proposal but do not execute it.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'text/plain', temperature: 0.2 },
        }),
        cache: 'no-store',
      }
    );

    const json = await response.json();
    if (!response.ok) {
      console.error('[ADVIS] Gemini error:', json?.error?.message || response.statusText);
      return NextResponse.json({ success: false, message: 'ADVIS model request failed.' }, { status: 502 });
    }

    const answer = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('').trim();
    if (!answer) return NextResponse.json({ success: false, message: 'ADVIS returned no answer.' }, { status: 502 });

    return NextResponse.json({
      success: true,
      answer,
      model: MODEL,
      generatedAt: intelligence.generatedAt,
      intelligence,
    });
  } catch (error) {
    console.error('[ADVIS] Admin copilot error:', error);
    return NextResponse.json({ success: false, message: 'ADVIS could not complete the analysis.' }, { status: 500 });
  }
}
