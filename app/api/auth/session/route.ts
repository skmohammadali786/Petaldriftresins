import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/cloudflare';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user, provider: 'Cloudflare Access / Auth integration placeholder' });
}
