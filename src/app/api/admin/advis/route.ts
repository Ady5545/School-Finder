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
import { ADVIS_TOOL_DECLARATIONS, executeAdvisAdminTool } from '@/lib/advisAdminTools';


const MODEL = process.env.ADVIS_MODEL || 'gemini-3.8-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

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

function buildFallbackAnswer(question: string, intelligence: any, overview: any, todayOverview: any): string {
  const q = question.toLowerCase();

  const todayViews = todayOverview?.schools?.totalViewsCount ?? todayOverview?.schools?.viewsInRange ?? 0;
  const todayUnique = todayOverview?.schools?.uniqueViewersInRange ?? 0;
  const currentShortlistCount = Number(intelligence?.users?.withWishlist || 0);
  const currentShortlistedSchools = Array.isArray(intelligence?.currentWishlist) ? intelligence.currentWishlist : [];

  if (/how many .*views.*today|total views.*today|views.*today/.test(q)) {
    return `ADVIS: Today there are ${todayViews} total school-profile views from ${todayUnique} unique visitors in the current Admin analytics window.`;
  }

  if (/wishlist|shortlist|saved schools|schools.*saved/.test(q)) {
    if (currentShortlistCount === 0) {
      return 'ADVIS: There are currently no active parent shortlists. No eligible parent account currently has a school in its wishlist. Historical wishlist events do not count as current shortlists.';
    }
    return `ADVIS: There are ${currentShortlistCount} active shortlisted schools across current parent accounts. Current shortlist state: ${currentShortlistedSchools.map((row: any) => `${row.slug} (${row.count})`).join(', ')}.`;
  }

  if (/how many (users|parents)|registered parents|parent accounts/.test(q)) {
    return `ADVIS: Admission Pitara currently has ${intelligence.users.total} eligible parent accounts, with ${intelligence.users.active} active and ${intelligence.users.verifiedEmail} email-verified.`;
  }

  if (/review/.test(q)) {
    return `ADVIS: The current review dataset contains ${intelligence.reviews.published} published reviews and ${intelligence.reviews.deleted} deleted records. The published average is ${intelligence.reviews.averagePublishedScore || 'not available'}.`;
  }

  if (/school/.test(q) && /how many|total|count/.test(q)) {
    return `ADVIS: The current Admission Pitara directory contains ${intelligence.schools.total} canonical schools; ${intelligence.schools.admissionsOpen} are in a recognised open-admissions state.`;
  }

  const lines = [
    'ADVIS PLATFORM BRIEFING',
    '',
    `System state: ${intelligence.health.status.toUpperCase()} • ${intelligence.health.issueCount} issue signals`,
    `Today: ${todayViews} school-profile views • ${todayUnique} unique visitors`,
    `Schools: ${intelligence.schools.total} total • ${intelligence.schools.admissionsOpen} open admissions • ${intelligence.schools.admissionsUnknown} unknown`,
    `Parents: ${intelligence.users.total} current parent accounts • ${intelligence.users.withWishlist} currently maintaining a shortlist`,
    `Reviews: ${intelligence.reviews.published} published • ${intelligence.reviews.deleted} deleted`,
    `Activity: ${intelligence.activity.loadedEvents} recent events loaded`,
    '',
    'WHAT DESERVES ATTENTION',
  ];

  if (intelligence.anomalies.length) {
    for (const item of intelligence.anomalies) lines.push(`[${item.severity.toUpperCase()}] ${item.issue} — ${item.evidence}`);
  } else {
    lines.push('No deterministic anomaly signals detected in the current snapshot.');
  }

  lines.push('', 'CURRENT SHORTLIST STATE');
  if (!currentShortlistedSchools.length) lines.push('• No current parent shortlists.');
  else currentShortlistedSchools.slice(0, 10).forEach((row: any) => lines.push(`• ${row.slug}: ${row.count}`));

  lines.push('', 'MODE: deterministic Admission Pitara diagnostics.');
  return lines.join('\n');
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

    const [overview, todayOverview, users, activity, reviews, wishlists, comparisons, searches, audit] = await Promise.all([
      getAdminOverviewMetricsAsync('30d'),
      getAdminOverviewMetricsAsync('today'),
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

    const parentUsers = (users as any[]).filter(u => u?.role !== 'admin' && u?.status !== 'disabled');
    const currentWishlistSchools = new Map<string, { count: number; users: string[] }>();
    for (const user of parentUsers) {
      for (const slug of Array.isArray(user.wishlist) ? user.wishlist : []) {
        const row = currentWishlistSchools.get(slug) || { count: 0, users: [] };
        row.count += 1;
        row.users.push(user.id);
        currentWishlistSchools.set(slug, row);
      }
    }

    const datasetSummary = {
      canonicalSchoolCount: schools.length,
      parentUserCount: parentUsers.length,
      activeParentUserCount: usersActive.filter((u: any) => u?.role !== 'admin' && u?.status !== 'disabled').length,
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
      currentWishlist: [...currentWishlistSchools.entries()].map(([slug, row]) => ({ slug, count: row.count, userCount: row.users.length })),
      today: {
        views: todayOverview.schools?.totalViewsCount ?? todayOverview.schools?.viewsInRange ?? 0,
        uniqueViewers: todayOverview.schools?.uniqueViewersInRange ?? 0,
        saves: todayOverview.schools?.savesInRange ?? 0,
      },
      datasets: datasetSummary,
    };

    const safeUsers = (users as any[]).slice(0, 50).map(u => ({
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

    const baseContext = {
      generatedAt: intelligence.generatedAt,
      authenticatedAdmin: { id: auth.user.id, email: auth.user.email },
      overview,
      todayOverview,
      intelligence,
      schoolDirectory: schools.slice(0, 40),
      recentUsers: safeUsers,
      recentActivity: (activity as any[]).slice(0, 60),
      recentReviews: (reviews as any[]).slice(0, 40),
      shortlistSummary: (wishlists as any[]).slice(0, 40),
      comparisons,
      searches,
      recentAudit: (audit as any[]).slice(0, 50),
    };

    const history = Array.isArray(body?.history)
      ? body.history
          .filter((item: any) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
          .slice(-8)
      : [];

    const prompt = `ADMISSION PITARA ADMIN COMMAND:
${question}

You have a base live snapshot below. Do not assume it is exhaustive. Use your tools to fetch more specific or deeper information whenever the question requires it.

BASE LIVE SNAPSHOT:
${JSON.stringify(baseContext)}

Previous conversation:
${history.length ? JSON.stringify(history) : 'None'}

Work as the Admission Pitara intelligence core. Investigate before concluding. You may call multiple tools, including different tools for the same entity when cross-checking is useful. After tool results are returned, synthesize one clear answer for the administrator. If the requested operation would mutate data, explain the exact proposed action and use propose_admin_action; never execute mutations from the model.`;

    const fallbackAnswer = buildFallbackAnswer(question, intelligence, overview, todayOverview);

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        answer: fallbackAnswer,
        model: 'deterministic-advis',
        mode: 'deterministic',
        generatedAt: intelligence.generatedAt,
        intelligence,
        toolTrace: [],
        notice: 'No Gemini API key is configured; ADVIS is running in deterministic platform-diagnostics mode.',
      });
    }

    const contents: any[] = [];
    for (const item of history) {
      contents.push({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(item.content).slice(0, 8000) }],
      });
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const toolTrace: Array<{ name: string; status: 'ok' | 'error'; summary?: string }> = [];
    let finalText = '';
    const maxToolRounds = 6;

    for (let round = 0; round < maxToolRounds; round += 1) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM }] },
            contents,
            tools: [{ functionDeclarations: ADVIS_TOOL_DECLARATIONS }],
            toolConfig: {
              functionCallingConfig: { mode: 'AUTO' },
            },
            generationConfig: {
              responseMimeType: 'text/plain',
              temperature: 0.2,
            },
          }),
          cache: 'no-store',
        }
      );

      const json = await response.json();
      if (!response.ok) {
        console.error('[ADVIS] Gemini error:', json?.error?.message || response.statusText);
        return NextResponse.json({
          success: true,
          answer: fallbackAnswer,
          model: 'deterministic-advis',
          mode: 'deterministic-fallback',
          generatedAt: intelligence.generatedAt,
          intelligence,
          toolTrace,
          notice: 'The model layer was unavailable, so ADVIS returned its deterministic platform diagnostics.',
        });
      }

      const candidate = json?.candidates?.[0];
      const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
      const functionCalls = parts
        .map((part: any) => part?.functionCall)
        .filter((call: any) => call && typeof call.name === 'string');

      if (!functionCalls.length) {
        finalText = parts
          .map((part: any) => typeof part?.text === 'string' ? part.text : '')
          .join('')
          .trim();
        break;
      }

      if (candidate?.content) {
        contents.push(candidate.content);
      }

      const functionResponses = [];
      for (const call of functionCalls.slice(0, 4)) {
        const name = String(call.name);
        const args = call.args && typeof call.args === 'object' ? call.args : {};
        try {
          const result = await executeAdvisAdminTool(name, args);
          const raw = JSON.stringify(result);
          const trimmed = raw.length > 30000 ? raw.slice(0, 30000) + '…[truncated]' : raw;
          toolTrace.push({ name, status: 'ok', summary: `Tool returned ${raw.length} characters.` });
          const responsePayload = raw.length > 30000
            ? { truncated: true, preview: raw.slice(0, 29500) }
            : result;
          functionResponses.push({
            functionResponse: {
              id: call.id,
              name,
              response: { result: responsePayload },
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Tool execution failed.';
          toolTrace.push({ name, status: 'error', summary: message });
          functionResponses.push({
            functionResponse: {
              id: call.id,
              name,
              response: { error: message },
            },
          });
        }
      }

      contents.push({ role: 'user', parts: functionResponses });
    }

    if (!finalText) finalText = fallbackAnswer;

    return NextResponse.json({
      success: true,
      answer: finalText,
      model: MODEL,
      mode: 'agentic',
      generatedAt: intelligence.generatedAt,
      intelligence,
      toolTrace,
    });
  } catch (error) {
    console.error('[ADVIS] Admin copilot error:', error);
    return NextResponse.json({ success: false, message: 'ADVIS could not complete the analysis.' }, { status: 500 });
  }
}
