import { getCurrentUser } from '@/lib/cloudflare';

export async function requireAdmin(headers: Headers) {
  const user = await getCurrentUser(headers);
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required. Configure Cloudflare Access and ADMIN_EMAILS.');
  }
  return user;
}
