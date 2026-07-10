import { NextRequest, NextResponse } from 'next/server';
import { createSignedUploadUrl } from '@/lib/cloudflare';

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get('filename') ?? 'petal-drift-upload.jpg';
  const contentType = request.nextUrl.searchParams.get('contentType') ?? 'image/jpeg';
  const upload = await createSignedUploadUrl(filename, contentType);
  return NextResponse.json({ ...upload, note: 'Replace this demo endpoint with an R2 presigned PUT URL using the Cloudflare/S3 SDK in production.' });
}
