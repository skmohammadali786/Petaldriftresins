import { getCurrentUser } from '@/lib/cloudflare';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_PANEL_COOKIE_NAME = 'petal_admin_session';

function createSessionToken(password: string) {
  return createHmac('sha256', password).update('petal-admin-session').digest('hex');
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return '';
  }
  const token = `${name}=`;
  for (const part of cookieHeader.split(';')) {
    const cookie = part.trim();
    if (cookie.startsWith(token)) {
      return decodeURIComponent(cookie.slice(token.length));
    }
  }
  return '';
}

export function isValidAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD ?? '';
  if (!configuredPassword || !password) {
    return false;
  }
  return safeEqual(password, configuredPassword);
}

export function hasAdminPasswordSession(headers: Headers) {
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD ?? '';
  if (!configuredPassword) {
    return false;
  }
  const cookieValue = getCookieValue(headers.get('cookie'), ADMIN_PANEL_COOKIE_NAME);
  if (!cookieValue) {
    return false;
  }
  return safeEqual(cookieValue, createSessionToken(configuredPassword));
}

export function createAdminSessionCookieValue() {
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD ?? '';
  if (!configuredPassword) {
    throw new Error('ADMIN_PANEL_PASSWORD is not configured.');
  }
  return createSessionToken(configuredPassword);
}

export async function requireAdmin(headers: Headers) {
  const user = await getCurrentUser(headers);
  if (user?.role === 'admin') {
    return user;
  }

  if (hasAdminPasswordSession(headers)) {
    return { id: 'admin-password', email: 'admin@local', role: 'admin' as const, name: 'Admin Password Session' };
  }

  throw new Error('Admin access required. Configure Cloudflare Access/ADMIN_EMAILS or ADMIN_PANEL_PASSWORD.');
}
