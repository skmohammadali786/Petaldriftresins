import { NextRequest, NextResponse } from 'next/server';
import { createSignedUploadUrl } from '@/lib/cloudflare';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request.headers);
    const payload = await request.json() as { filename?: string; contentType?: string };
    const filename = payload.filename ?? 'petal-drift-upload.jpg';
    const contentType = payload.contentType ?? 'image/jpeg';
    const upload = await createSignedUploadUrl(filename, contentType);
    return NextResponse.json(upload);
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('Admin access required') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
