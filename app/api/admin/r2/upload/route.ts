import { NextRequest, NextResponse } from 'next/server';
import { createSignedUploadUrl, uploadObject } from '@/lib/cloudflare';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request.headers);
    const contentTypeHeader = request.headers.get('content-type') ?? '';
    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'File is required.' }, { status: 400 });
      }
      const upload = await uploadObject(file.name || 'mahis-art-upload.jpg', file.type || 'application/octet-stream', Buffer.from(await file.arrayBuffer()));
      return NextResponse.json(upload);
    }

    const payload = await request.json() as { filename?: string; contentType?: string };
    const filename = payload.filename ?? 'mahis-art-upload.jpg';
    const contentType = payload.contentType ?? 'image/jpeg';
    const upload = await createSignedUploadUrl(filename, contentType);
    return NextResponse.json(upload);
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('Admin access required') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
