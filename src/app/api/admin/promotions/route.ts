import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import {
  getAllPromotions,
  createPromotionCampaign,
  updatePromotionCampaign,
  deletePromotionCampaign,
} from '../../../../lib/authStore';
import { getSchoolBySlug } from '../../../../lib/schools';

export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const campaigns = getAllPromotions();

  const enriched = campaigns.map(c => {
    const school = getSchoolBySlug(c.schoolSlug);
    const ctr = c.impressions > 0 ? Math.round((c.clicks / c.impressions) * 1000) / 10 : 0;
    return {
      ...c,
      schoolName: school?.name || c.schoolSlug,
      ctr,
    };
  });

  return NextResponse.json({
    success: true,
    campaigns: enriched,
  });
}

export async function POST(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const { schoolSlug, campaignName, placementType, title, description, badgeLabel, ctaText, ctaLink, startDate, endDate, priority, status } = body;

  if (!schoolSlug || !campaignName || !title) {
    return NextResponse.json({ success: false, message: 'School, campaign name, and title are required' }, { status: 400 });
  }

  const school = getSchoolBySlug(schoolSlug);
  if (!school) {
    return NextResponse.json({ success: false, message: 'Canonical school not found' }, { status: 404 });
  }

  const campaign = createPromotionCampaign(
    {
      schoolSlug,
      campaignName: String(campaignName).trim(),
      placementType: placementType || 'homepage_hero',
      title: String(title).trim(),
      description: String(description || '').trim(),
      badgeLabel: String(badgeLabel || 'Sponsored').trim(),
      ctaText: String(ctaText || 'Explore Admissions').trim(),
      ctaLink: String(ctaLink || `/schools/${schoolSlug}`).trim(),
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: status || 'active',
      priority: Number(priority) || 1,
    },
    auth.user.id
  );

  return NextResponse.json({
    success: true,
    message: 'School promotion campaign created successfully.',
    campaign,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ success: false, message: 'Campaign ID required' }, { status: 400 });
  }

  const updated = updatePromotionCampaign(id, updates, auth.user.id);
  if (!updated) {
    return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Campaign updated successfully.',
    campaign: updated,
  });
}

export async function DELETE(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'Campaign ID required' }, { status: 400 });
  }

  const deleted = deletePromotionCampaign(id, auth.user.id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Campaign removed successfully.',
  });
}
