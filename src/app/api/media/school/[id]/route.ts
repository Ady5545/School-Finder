import { NextRequest } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { getMongoDb } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return new Response('Not found', { status: 404 });

    const db = await getMongoDb(true);
    if (!db) return new Response('Media storage unavailable', { status: 503 });

    const objectId = new ObjectId(id);
    const files = await db.collection('school_assets.files').find({ _id: objectId }).limit(1).toArray();
    const file = files[0];
    if (!file) return new Response('Not found', { status: 404 });

    const bucket = new GridFSBucket(db, { bucketName: 'school_assets' });
    const stream = bucket.openDownloadStream(objectId);
    const webStream = new ReadableStream<Uint8Array>({
      start(controller) {
        stream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
        stream.on('end', () => controller.close());
        stream.on('error', (error) => controller.error(error));
      },
      cancel() {
        stream.destroy();
      },
    });

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(file.length ?? ''),
      },
    });
  } catch (error) {
    console.error('Public school media read failed:', error);
    return new Response('Media read failed', { status: 500 });
  }
}
