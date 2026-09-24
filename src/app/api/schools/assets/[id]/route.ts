import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { getMongoDb } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return new NextResponse('Not found', { status: 404 });
    }

    const db = await getMongoDb(false);
    if (!db) return new NextResponse('Not found', { status: 404 });

    const bucket = new GridFSBucket(db, { bucketName: 'school_assets' });
    const files = db.collection('school_assets.files');
    const file = await files.findOne({ _id: new ObjectId(id) });

    if (!file) return new NextResponse('Not found', { status: 404 });

    const chunks: Buffer[] = [];
    const stream = bucket.openDownloadStream(new ObjectId(id));
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return new NextResponse(Buffer.concat(chunks), {
      status: 200,
      headers: {
        'Content-Type': String(file.contentType || file.metadata?.contentType || 'application/octet-stream'),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[SCHOOL_ASSET_GET]', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
