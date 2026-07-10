import { getCurrentUser } from '@/lib/cloudflare';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_PANEL_COOKIE_NAME = 'petal_admin_session';

function createSessionToken(password: string) {
  return createHmac('sha256', password).update('petal-admin-session').digest('hex');
}

function getSessionSecret() {
  return configuredPasswordHash() || process.env.ADMIN_PANEL_PASSWORD || '';
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

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function isSha256Hash(value: string) {
  return /^[a-f0-9]{64}$/i.test(value.trim());
}

function configuredPasswordHash() {
  const explicitHash = process.env.ADMIN_PANEL_PASSWORD_SHA256?.trim().toLowerCase();
  if (explicitHash) return explicitHash;
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD ?? '';
  return /^[a-f0-9]{64}$/i.test(configuredPassword) ? configuredPassword.toLowerCase() : '';
}

export function isValidAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD ?? '';
  const passwordHash = configuredPasswordHash();
  if (!password) return false;
  if (passwordHash) {
    const normalizedPassword = password.trim().toLowerCase();
    if (isSha256Hash(normalizedPassword) && safeEqual(normalizedPassword, passwordHash)) {
      return true;
    }
    return safeEqual(sha256(password), passwordHash);
  }
  if (!configuredPassword) return false;
  return safeEqual(password, configuredPassword);
}

export function hasAdminPasswordSession(headers: Headers) {
  const configuredPassword = getSessionSecret();
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
  const configuredPassword = getSessionSecret();
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
