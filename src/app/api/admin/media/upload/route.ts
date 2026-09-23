import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getMongoDb } from '@/lib/mongodb';
import { getAdminSchoolBySlugAsync, updateAdminSchoolAsync } from '@/lib/schoolAdminService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    return NextResponse.json(
      { success: false, message: 'Persistent media storage is not configured. Add MONGO_URI/MONGODB_URI to the deployment.' },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const schoolSlug = String(form.get('schoolSlug') || '').trim();
    const type = String(form.get('type') || 'gallery').trim();
    const altText = String(form.get('altText') || '').trim();
    const file = form.get('file');

    if (!schoolSlug || !(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'School and image file are required.' }, { status: 400 });
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: 'Use JPG, PNG, WEBP, or AVIF images.' }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ success: false, message: 'Images must be between 1 byte and 10 MB.' }, { status: 400 });
    }

    const school = await getAdminSchoolBySlugAsync(schoolSlug);
    if (!school) {
      return NextResponse.json({ success: false, message: `School '${schoolSlug}' not found.` }, { status: 404 });
    }

    const db = await getMongoDb(true);
    if (!db) throw new Error('MongoDB is unavailable.');
    const bucket = new GridFSBucket(db, { bucketName: 'school_assets' });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-100) || 'school-image';
    const filename = `${schoolSlug}-${type}-${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileId = await new Promise<import('mongodb').ObjectId>((resolve, reject) => {
      const stream = bucket.openUploadStream(filename, {
        contentType: file.type,
        metadata: {
          schoolSlug,
          assetType: type,
          altText,
          originalName: file.name,
          uploadedBy: auth.user!.email,
        },
      });
      stream.once('error', reject);
      stream.once('finish', () => resolve(stream.id as import('mongodb').ObjectId));
      stream.end(buffer);
    });

    const publicUrl = `/api/media/school/${fileId.toHexString()}`;
    const assets = {
      ...(school.assets || { featured: null, hero: null, gallery: [], legacyPaths: {} }),
      gallery: Array.isArray(school.assets?.gallery) ? [...school.assets.gallery] : [],
    };

    if (type === 'featured') {
      assets.featured = publicUrl;
    } else if (type === 'hero') {
      assets.hero = publicUrl;
    } else {
      if (!assets.gallery.includes(publicUrl)) assets.gallery.push(publicUrl);
    }

    let extraDetails = school.extraDetails;
    if (altText) {
      const currentExtra = (school.extraDetails || {}) as Record<string, unknown>;
      const currentMediaNotes = Array.isArray(currentExtra.mediaNotes)
        ? [...currentExtra.mediaNotes]
        : [];
      currentMediaNotes.push({ url: publicUrl, altText });
      extraDetails = { ...currentExtra, mediaNotes: currentMediaNotes };
    }

    const updated = await updateAdminSchoolAsync(
      schoolSlug,
      {
        assets,
        ...(extraDetails ? { extraDetails } : {}),
      },
      { id: auth.user.id, email: auth.user.email, name: auth.user.name },
      `Uploaded ${type} image ${filename}`
    );

    if (!updated.success) {
      await bucket.delete(fileId).catch(() => {});
      return NextResponse.json({ success: false, message: updated.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      assets: updated.school?.assets,
      message: 'Image uploaded and attached to the school.',
    });
  } catch (error) {
    console.error('Admin media upload failed:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to upload image.' },
      { status: 500 }
    );
  }
}