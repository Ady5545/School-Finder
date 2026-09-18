import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { updateAdminSchool, getAdminSchoolBySlug } from '@/lib/schoolAdminService';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { schoolSlug, type, url } = body;

    if (!schoolSlug || !url) {
      return NextResponse.json({ success: false, message: 'School slug and image URL are required.' }, { status: 400 });
    }

    const school = getAdminSchoolBySlug(schoolSlug);
    if (!school) {
      return NextResponse.json({ success: false, message: `School '${schoolSlug}' not found.` }, { status: 404 });
    }

    const currentAssets = school.assets || { featured: null, hero: null, gallery: [] };
    const adminUser = { id: auth.user.id, email: auth.user.email, name: auth.user.name };

    if (type === 'featured') {
      currentAssets.featured = url;
    } else if (type === 'hero') {
      currentAssets.hero = url;
    } else if (type === 'gallery') {
      currentAssets.gallery = currentAssets.gallery || [];
      if (!currentAssets.gallery.includes(url)) {
        currentAssets.gallery.push(url);
      }
    }

    const res = updateAdminSchool(
      schoolSlug,
      { assets: currentAssets },
      adminUser,
      `Media asset updated (${type}: ${url})`
    );

    if (!res.success) {
      return NextResponse.json({ success: false, message: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      assets: currentAssets,
      message: `Media asset attached to school '${school.name}' successfully.`,
    });
  } catch (error) {
    console.error('Error in media upload:', error);
    return NextResponse.json({ success: false, message: 'Failed to update media asset.' }, { status: 500 });
  }
}
