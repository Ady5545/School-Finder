import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'node:stream';
import { requireAdminAuth, hasAdminPermission } from '@/lib/adminAuth';
import { getMongoDb } from '@/lib/mongodb';

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized || !auth.user) {
    return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  if (!hasAdminPermission(auth.user, 'schools:write')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const slug = String(form.get('slug') || '').trim();
    const kind = String(form.get('kind') || 'gallery').trim();
    const file = form.get('file');

    if (!slug) {
      return NextResponse.json({ success: false, message: 'School slug is required.' }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'Please choose an image file.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: 'Supported images: JPG, PNG, WebP, AVIF, or GIF.' }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ success: false, message: 'Image must be between 1 byte and 8 MB.' }, { status: 400 });
    }

    const db = await getMongoDb(true);
    if (!db) {
      return NextResponse.json({ success: false, message: 'Persistent storage is not configured.' }, { status: 503 });
    }

    const bucket = new GridFSBucket(db, { bucketName: 'school_assets' });
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 120) || 'school-image';
    const upload = bucket.openUploadStream(safeName, {
      metadata: {
        schoolSlug: slug,
        kind,
        contentType: file.type,
        uploadedBy: auth.user.email,
        uploadedAt: new Date().toISOString(),
      },
      contentType: file.type,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    await new Promise<void>((resolve, reject) => {
      const readable = Readable.from(buffer);
      readable.on('error', reject);
      upload.on('error', reject);
      upload.on('finish', () => resolve());
      readable.pipe(upload);
    });

    const id = String(upload.id);
    return NextResponse.json({
      success: true,
      id,
      url: '/api/schools/assets/' + id,
      filename: safeName,
      contentType: file.type,
      kind,
    });
  } catch (error) {
    console.error('[ADMIN_ASSET_UPLOAD]', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Image upload failed.' },
      { status: 500 },
    );
  }
}
