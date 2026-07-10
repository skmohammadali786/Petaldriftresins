export type R2Asset = { key: string; url: string; contentType: string; size: number };
export type PetalUser = { id: string; email: string; role: 'admin' | 'customer'; name?: string };

export const cloudflareConfig = {
  r2Bucket: process.env.CLOUDFLARE_R2_BUCKET ?? 'petal-drift-media',
  r2PublicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '',
  authIssuer: process.env.CLOUDFLARE_AUTH_ISSUER ?? '',
  authAudience: process.env.CLOUDFLARE_AUTH_AUDIENCE ?? '',
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? ''
};

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

export async function getCurrentUser(): Promise<PetalUser | null> {
  return { id: 'demo-admin', email: 'artist@petaldrift.com', role: 'admin', name: 'Petal Drift Studio' };
}
