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

const SYSTEM = `You are ADVIS, the private intelligence and operations copilot for Admission Pitara's authenticated administrator.
You are NOT the public website assistant. You operate only inside the Admin Control Center.
Your job is to reason over live platform data, detect inconsistencies, explain causes, surface important trends, and propose precise operational next steps.

Rules:
- Treat the supplied data as the source of truth. Never invent database facts.
- Distinguish observed facts, likely explanations, and recommendations.
- Be concise but highly analytical. Use headings/bullets when useful.
- Never expose secrets, tokens, passwords, API keys, session data, or internal credentials.
- Never make destructive changes yourself from chat. For any deletion, archival, restoration, account change, review removal, promotion change, or other mutation, explain the exact proposed action and say it requires explicit admin confirmation through a dedicated action control.
- If the data appears inconsistent, call out the inconsistency and identify the exact records/fields that should be reconciled.
- You can answer questions about users, schools, reviews, wishlists, comparisons, searches, activity, promotions, audits, admissions funnel health, data quality, and operational priorities.
- For user privacy, only use information already exposed to the authenticated admin context and avoid unnecessary personal details.`;

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, message: 'Administrator authorization required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (!question) return NextResponse.json({ success: false, message: 'Question is required.' }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: 'ADVIS is not configured: GEMINI_API_KEY is missing.' }, { status: 503 });
    }

    const [overview, users, activity, reviews, wishlists, comparisons, searches, audit] = await Promise.all([
      getAdminOverviewMetricsAsync('30d'),
      getAllUsersSanitizedAsync(),
      getActivityEventsAsync(150),
      getAllRatingsAsync(),
      getWishlistAnalyticsAsync(),
      getComparisonAnalyticsAsync(),
      getSearchAnalyticsAsync(),
      getAdminAuditLogsAsync(100),
    ]);

    const schools = getCanonicalSchools().map(s => ({
      slug: s.slug,
      name: s.name,
      sector: s.location?.sector || '',
      area: s.location?.area || '',
      board: s.board || '',
      fee: s.fees?.amount ?? s.fees?.tuition ?? s.fees?.range ?? s.fees?.description ?? '',
      admissions: s.admissions?.status || '',
      rating: s.rating?.score || 0,
    }));

    const safeUsers = users.slice(0, 100).map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, status: u.status,
      emailVerified: u.emailVerified, residentialSociety: u.residentialSociety,
      preferredSchoolLocality: u.preferredSchoolLocality, createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt, lastActivityAt: u.lastActivityAt,
      wishlist: u.wishlist,
    }));

    const context = {
      generatedAt: new Date().toISOString(),
      authenticatedAdmin: { id: auth.user.id, email: auth.user.email },
      overview,
      schools,
      users: safeUsers,
      activity: activity.slice(0, 150),
      reviews: reviews.slice(0, 100),
      wishlists: wishlists.slice(0, 100),
      comparisons,
      searches,
      audit: audit.slice(0, 100),
    };

    const prompt = `ADMIN QUESTION:
${question}

LIVE ADMIN DATA:
${JSON.stringify(context)}

Return the most useful answer for the administrator. If you detect a data-integrity problem, show the evidence and the safest reconciliation path.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'text/plain' },
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

    return NextResponse.json({ success: true, answer, model: MODEL, generatedAt: context.generatedAt });
  } catch (error) {
    console.error('[ADVIS] Admin copilot error:', error);
    return NextResponse.json({ success: false, message: 'ADVIS could not complete the analysis.' }, { status: 500 });
  }
}
