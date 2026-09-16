import { NextRequest, NextResponse } from 'next/server';
import {
  getActivePromotions,
  recordPromotionImpression,
  recordPromotionClick,
} from '../../../lib/authStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement') || undefined;

    const campaigns = getActivePromotions(placement);

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error in public promotions GET:', error);
    return NextResponse.json({ success: false, promotions: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, action } = body;

    if (!campaignId || typeof campaignId !== 'string') {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    if (action === 'impression') {
      recordPromotionImpression(campaignId);
    } else if (action === 'click') {
      recordPromotionClick(campaignId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking promotion interaction:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
