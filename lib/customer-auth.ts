import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { d1Query, isD1Configured } from '@/lib/d1';

export type CustomerAccount = { id: string; name: string; email: string; mobile: string };

export const CUSTOMER_COOKIE_NAME = 'petal_customer_session';
const SESSION_DAYS = 30;
const memoryCustomers = new Map<string, CustomerAccount & { passwordHash: string }>();

function authSecret() {
  return process.env.CUSTOMER_AUTH_SECRET || process.env.ADMIN_PANEL_PASSWORD || 'petal-drift-dev-secret';
}

function normalizeEmail(email: string) { return email.trim().toLowerCase(); }
function normalizeMobile(mobile: string) { return mobile.replace(/[^0-9+]/g, '').trim(); }
function idFor(email: string) { return createHmac('sha256', authSecret()).update(normalizeEmail(email)).digest('hex').slice(0, 24); }
function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(hash, 'hex'), candidate);
}
function signSession(account: CustomerAccount) {
  const payload = Buffer.from(JSON.stringify({ id: account.id, email: account.email, exp: Date.now() + SESSION_DAYS * 86400000 })).toString('base64url');
  const sig = createHmac('sha256', authSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
function readSession(token?: string) {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = createHmac('sha256', authSecret()).update(payload).digest('base64url');
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { id: string; email: string; exp: number };
  return data.exp > Date.now() ? data : null;
}

async function ensureCustomerTable() {
  if (!isD1Configured()) return;
  await d1Query('CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, mobile TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
}

export async function signupCustomer(input: { name: string; email: string; mobile: string; password: string }) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const mobile = normalizeMobile(input.mobile);
  if (!name || !email || !mobile || input.password.length < 8) throw new Error('Name, email, mobile number, and an 8+ character password are required.');
  const account: CustomerAccount = { id: idFor(email), name, email, mobile };
  const passwordHash = hashPassword(input.password);
  if (isD1Configured()) {
    await ensureCustomerTable();
    await d1Query('INSERT INTO customers (id, name, email, mobile, password_hash, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', [account.id, name, email, mobile, passwordHash]);
  } else {
    if (memoryCustomers.has(email)) throw new Error('An account with this email already exists.');
    memoryCustomers.set(email, { ...account, passwordHash });
  }
  return account;
}

export async function loginCustomer(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  if (isD1Configured()) {
    await ensureCustomerTable();
    const rows = await d1Query<CustomerAccount & { password_hash: string }>('SELECT id, name, email, mobile, password_hash FROM customers WHERE email = ? LIMIT 1', [email]);
    const row = rows[0];
    if (!row || !verifyPassword(input.password, row.password_hash)) throw new Error('Invalid email or password.');
    return { id: row.id, name: row.name, email: row.email, mobile: row.mobile };
  }
  const row = memoryCustomers.get(email);
  if (!row || !verifyPassword(input.password, row.passwordHash)) throw new Error('Invalid email or password.');
  return { id: row.id, name: row.name, email: row.email, mobile: row.mobile };
}

export async function getCustomerFromCookie(token?: string): Promise<CustomerAccount | null> {
  const session = readSession(token);
  if (!session) return null;
  if (isD1Configured()) {
    await ensureCustomerTable();
    const rows = await d1Query<CustomerAccount>('SELECT id, name, email, mobile FROM customers WHERE email = ? LIMIT 1', [session.email]);
    return rows[0] ?? null;
  }
  const row = memoryCustomers.get(session.email);
  return row ? { id: row.id, name: row.name, email: row.email, mobile: row.mobile } : null;
}

export async function setCustomerSession(account: CustomerAccount) {
  const store = await cookies();
  store.set(CUSTOMER_COOKIE_NAME, signSession(account), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_DAYS * 86400 });
}

export async function clearCustomerSession() {
  const store = await cookies();
  store.delete(CUSTOMER_COOKIE_NAME);
}
