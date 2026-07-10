import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/cloudflare';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request.headers);
  return NextResponse.json({
    user,
    provider: 'Cloudflare Access',
    authenticated: Boolean(user)
  });
}
