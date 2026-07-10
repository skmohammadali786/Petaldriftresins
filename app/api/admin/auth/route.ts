import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_PANEL_COOKIE_NAME, createAdminSessionCookieValue, isValidAdminPassword } from '@/lib/admin-auth';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 12
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json() as { password?: string };
    const password = payload.password?.trim() ?? '';
    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_PANEL_COOKIE_NAME, createAdminSessionCookieValue(), cookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_PANEL_COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
  return response;
}
