const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

type D1Result<T> = {
  results?: T[];
  success?: boolean;
  error?: string;
};

type D1ApiResponse<T> = {
  success?: boolean;
  result?: D1Result<T>[];
  errors?: Array<{ message?: string }>;
};

export function isD1Configured() {
  return Boolean(accountId && databaseId && apiToken);
}

function getD1Url() {
  if (!accountId || !databaseId) {
    throw new Error('Cloudflare D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_D1_DATABASE_ID.');
  }
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
}

export async function d1Query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (!apiToken) {
    throw new Error('Cloudflare D1 is not configured. Set CLOUDFLARE_API_TOKEN.');
  }

  const headers = new Headers({ 'Content-Type': 'application/json' });
  headers.set('Authorization', ['Bearer', apiToken].join(' '));

  const response = await fetch(getD1Url(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ sql, params }),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`D1 API request failed with status ${response.status}`);
  }

  const payload = await response.json() as D1ApiResponse<T>;
  if (!payload.success) {
    const message = payload.errors?.[0]?.message ?? 'Unknown D1 error';
    throw new Error(`D1 query failed: ${message}`);
  }

  const statement = payload.result?.[0];
  if (!statement?.success) {
    throw new Error(statement?.error ?? 'D1 statement execution failed.');
  }

  return statement.results ?? [];
}
