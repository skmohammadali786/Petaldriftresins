# Petal Drift deployment guide

This repository is prepared for two Vercel deployments from the same codebase:

1. **Storefront**: public customer website at `petaldrift.com`.
2. **Admin**: protected dashboard at `admin.petaldrift.com`, using the `/admin` route.

## 1. Cloudflare D1 (live product data)

The admin panel now writes products to Cloudflare D1, and storefront pages read from the same table, so product edits are visible immediately.

1. In Cloudflare, create a D1 database (for example `petal-drift-db`).
2. Create this table in D1:
   ```sql
   CREATE TABLE IF NOT EXISTS products (
     slug TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     price TEXT NOT NULL,
     rating INTEGER NOT NULL DEFAULT 5,
     stock TEXT NOT NULL,
     material TEXT NOT NULL,
     badge TEXT NOT NULL,
     updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
   );
   ```
3. Create a Cloudflare API token with D1 edit/query permissions for this database.
4. Add these Vercel environment variables:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_D1_DATABASE_ID`
   - `CLOUDFLARE_API_TOKEN`

> If D1 is empty on first run, the app seeds the table with the existing default products.

## 2. Cloudflare R2 media storage

1. In Cloudflare, create an R2 bucket named `petal-drift-media`.
2. Create an R2 API token with Object Read and Object Write permissions for that bucket.
3. Add a custom public domain such as `media.petaldrift.com` to the bucket.
4. Add these Vercel environment variables:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_R2_BUCKET`
   - `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
   - `NEXT_PUBLIC_R2_PUBLIC_URL`
5. In admin panel, use **Cloudflare R2 upload** to upload files; uploads are signed server-side and saved to `uploads/` keys.

## 3. Cloudflare Access authentication for admin login

Cloudflare Access is the primary auth layer for `/admin` and all `/api/admin/*` routes.

1. In Cloudflare Zero Trust, create an Access application for `admin.petaldrift.com`.
2. Add allowed identities (your email and your team emails).
3. Add Vercel environment variables:
   - `CLOUDFLARE_AUTH_ISSUER`
   - `CLOUDFLARE_AUTH_AUDIENCE`
   - `ADMIN_EMAILS` (comma-separated, must include admin users)
   - `ADMIN_PANEL_PASSWORD` (optional fallback password for admin panel login form)
4. (Optional local dev) set `DEV_ADMIN_EMAIL` for development without Cloudflare headers.
5. Keep Cloudflare Access policy enabled for admin domain.

## 4. Vercel storefront deployment

1. Import this GitHub repository into Vercel.
2. Set Framework Preset to **Next.js**.
3. Build command: `npm run build`.
4. Output directory: leave default (`.next`).
5. Add required env vars from `.env.example`.
6. Add production domain `petaldrift.com`.

## 5. Vercel admin deployment

Option A (single project):

1. Use the same Vercel project.
2. Add `admin.petaldrift.com` domain.
3. Route admin users to `/admin`.
4. Protect domain with Cloudflare Access.

Option B (separate admin Vercel project):

1. Import the same repository a second time.
2. Keep build settings the same (`npm run build`, output `.next`).
3. Add `admin.petaldrift.com` domain.
4. Protect domain with Cloudflare Access.

## 6. Admin panel usage process

1. Login to `admin.petaldrift.com` through Cloudflare Access.
2. Open `/admin`.
3. Add/edit/delete product entries in **Admin product** form.
4. Click save — data is written to D1.
5. Refresh storefront pages (`/`, `/shop`, `/products/[slug]`, `/search`, `/cart`, `/wishlist`, `/checkout`) to see updated products immediately.
6. Upload images in **Cloudflare R2 upload** and copy returned URL into product/content data.

## Cloudflare Access login setup

This storefront reads Cloudflare Access identity from the `cf-access-authenticated-user-email` request header. Cloudflare's Access docs also note that authenticated requests include a `Cf-Access-Jwt-Assertion` header and browser requests include a `CF_Authorization` cookie for JWT validation.

1. In Cloudflare Zero Trust, create an **Access application** for the site hostname (for example `petaldriftresins.com/*`).
2. Choose your login method such as One-time PIN, Google, GitHub, or another identity provider.
3. Add an Access policy that allows your customer/admin users to reach the website.
4. Add admin emails to the deployment variable `ADMIN_EMAILS` as a comma-separated list. Any authenticated Cloudflare Access email in this list becomes an admin.
5. Deploy behind Cloudflare so the origin receives the `cf-access-authenticated-user-email` header. The app uses `/api/auth/session` and `/dashboard` to show whether Cloudflare Access is connected.

## Admin password hash setup

You can use a plaintext admin password or a SHA-256 password hash:

- Plaintext option: set `ADMIN_PANEL_PASSWORD` to the exact password you want to type.
- Hash option: set `ADMIN_PANEL_PASSWORD_SHA256` to a 64-character SHA-256 hash. For convenience, if `ADMIN_PANEL_PASSWORD` itself is a 64-character hex string, the app treats it as a SHA-256 hash too.

For the hash you provided, set either:

```bash
ADMIN_PANEL_PASSWORD_SHA256=bdf3146833fdae915446a6e87d6a7a135aead3c650d7f843c57abeee22fab95b
```

or set `ADMIN_PANEL_PASSWORD` to that same 64-character value. Then log in by typing the original password whose SHA-256 digest equals that hash, not the hash text itself.
