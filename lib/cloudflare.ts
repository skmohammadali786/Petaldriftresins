import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type R2Asset = { key: string; url: string; contentType: string; size: number };
export type PetalUser = { id: string; email: string; role: 'admin' | 'customer'; name?: string };

export const cloudflareConfig = {
  r2Bucket: process.env.CLOUDFLARE_R2_BUCKET ?? 'mahis-art-media',
  r2PublicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '',
  authIssuer: process.env.CLOUDFLARE_AUTH_ISSUER ?? '',
  authAudience: process.env.CLOUDFLARE_AUTH_AUDIENCE ?? '',
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? ''
};

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function normalizeFilename(filename: string) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')
    .slice(0, 120) || 'upload.jpg';
}

function getR2Client() {
  const { accountId } = cloudflareConfig;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey || !cloudflareConfig.r2Bucket) {
    throw new Error('Cloudflare R2 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_BUCKET, CLOUDFLARE_R2_ACCESS_KEY_ID, and CLOUDFLARE_R2_SECRET_ACCESS_KEY.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

export function assetUrl(key: string) {
  const base = cloudflareConfig.r2PublicUrl.replace(/\/$/, '');
  return base ? `${base}/${key.replace(/^\//, '')}` : `/media/${key.replace(/^\//, '')}`;
}

function normalizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9/_-]/g, '-').replace(/-+/g, '-').replace(/^\/+|\/+$/g, '') || 'uploads';
}

export async function uploadObject(filename: string, contentType: string, body: Buffer, folder = 'uploads') {
  const client = getR2Client();
  const safeFilename = normalizeFilename(filename);
  const key = `${normalizeFolder(folder)}/${Date.now()}-${safeFilename}`;
  await client.send(new PutObjectCommand({ Bucket: cloudflareConfig.r2Bucket, Key: key, ContentType: contentType || 'application/octet-stream', Body: body }));
  return { publicUrl: assetUrl(key), key };
}

export async function createSignedUploadUrl(filename: string, contentType: string) {
  const client = getR2Client();
  const safeFilename = normalizeFilename(filename);
  const key = `uploads/${Date.now()}-${safeFilename}`;

  const command = new PutObjectCommand({
    Bucket: cloudflareConfig.r2Bucket,
    Key: key,
    ContentType: contentType || 'application/octet-stream'
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 5 });
  return { uploadUrl, publicUrl: assetUrl(key), key };
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

  if (process.env.NODE_ENV !== 'production' && process.env.DEV_ADMIN_EMAIL) {
    const devEmail = process.env.DEV_ADMIN_EMAIL.trim().toLowerCase();
    return { id: devEmail, email: devEmail, role: 'admin', name: 'Local Admin' };
  }

  return null;
}
