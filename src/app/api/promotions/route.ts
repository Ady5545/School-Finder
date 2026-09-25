import { NextRequest, NextResponse } from 'next/server';
import {
  getActivePromotionsAsync,
  getPromotionByIdAsync,
  recordPromotionImpressionAsync,
  recordPromotionClickAsync,
  checkRateLimitAsync,
  getClientIp,
} from '../../../lib/authStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement') || undefined;

    const campaigns = await getActivePromotionsAsync(placement);

    return NextResponse.json(
      {
        success: true,
        promotions: campaigns.map(c => ({
          id: c.id,
          schoolSlug: c.schoolSlug,
          campaignName: c.campaignName,
          placementType: c.placementType,
          title: c.title,
          description: c.description,
          badgeLabel: c.badgeLabel || 'Sponsored',
          ctaText: c.ctaText,
          ctaLink: c.ctaLink,
          priority: c.priority,
        })),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error in public promotions GET:', error);
    return NextResponse.json({ success: false, promotions: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const campaignId = typeof body?.campaignId === 'string' ? body.campaignId.trim() : '';
    const action = body?.action;

    if (!campaignId || (action !== 'impression' && action !== 'click')) {
      return NextResponse.json(
        { success: false, message: 'Valid campaign interaction is required.' },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const maxRequests = action === 'impression' ? 30 : 10;
    if (!(await checkRateLimitAsync(`promotion_${action}_${campaignId}_${ip}`, maxRequests, 60 * 1000))) {
      return NextResponse.json(
        { success: false, message: 'Too many promotion interactions. Please try again shortly.' },
        { status: 429 }
      );
    }

    const campaign = await getPromotionByIdAsync(campaignId);
    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Promotion campaign not found.' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const active = campaign.status === 'active' &&
      (!campaign.startDate || campaign.startDate <= now) &&
      (!campaign.endDate || campaign.endDate >= now);
    if (!active) {
      return NextResponse.json({ success: false, message: 'Promotion campaign is not active.' }, { status: 409 });
    }

    const recorded = action === 'impression'
      ? await recordPromotionImpressionAsync(campaignId)
      : await recordPromotionClickAsync(campaignId);

    if (!recorded) {
      return NextResponse.json({ success: false, message: 'Promotion interaction could not be recorded.' }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking promotion interaction:', error);
    return NextResponse.json({ success: false, message: 'Promotion telemetry could not be recorded.' }, { status: 500 });
  }
}
