export type R2Asset = { key: string; url: string; contentType: string; size: number };
export type PetalUser = { id: string; email: string; role: 'admin' | 'customer'; name?: string };

export const cloudflareConfig = {
  r2Bucket: process.env.CLOUDFLARE_R2_BUCKET ?? 'petal-drift-media',
  r2PublicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '',
  authIssuer: process.env.CLOUDFLARE_AUTH_ISSUER ?? '',
  authAudience: process.env.CLOUDFLARE_AUTH_AUDIENCE ?? '',
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? ''
};

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function assetUrl(key: string) {
  const base = cloudflareConfig.r2PublicUrl.replace(/\/$/, '');
  return base ? `${base}/${key.replace(/^\//, '')}` : `/media/${key.replace(/^\//, '')}`;
}

export async function createSignedUploadUrl(filename: string, contentType: string) {
  return {
    uploadUrl: `/api/admin/r2/upload?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`,
    publicUrl: assetUrl(`uploads/${filename}`)
  };
}

export async function getCurrentUser(headers?: Headers): Promise<PetalUser | null> {
  const accessEmail = headers?.get('cf-access-authenticated-user-email')?.trim().toLowerCase();
  if (accessEmail) {
    return {
      id: accessEmail,
      email: accessEmail,
      role: adminEmails.includes(accessEmail) ? 'admin' : 'customer',
      name: headers?.get('cf-access-authenticated-user-name') ?? undefined
    };
  }
  return null;
}
