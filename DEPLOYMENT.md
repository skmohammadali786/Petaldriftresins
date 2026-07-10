# Petal Drift deployment guide

This repository is prepared for two Vercel deployments from the same codebase:

1. **Storefront**: public customer website at `petaldrift.com`.
2. **Admin**: protected dashboard at `admin.petaldrift.com`, using the `/admin` route.

## 1. Cloudflare R2 media storage

1. In Cloudflare, create an R2 bucket named `petal-drift-media`.
2. Create an R2 API token with Object Read and Object Write permissions for that bucket.
3. Add a custom public domain such as `media.petaldrift.com` to the bucket.
4. Add these Vercel environment variables:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_R2_BUCKET`
   - `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
   - `NEXT_PUBLIC_R2_PUBLIC_URL`
5. Store all product, gallery, review, blog, and custom-order upload images under organized prefixes such as `products/`, `gallery/`, `reviews/`, and `custom-orders/`.

## 2. Cloudflare authentication for admin

Cloudflare Access is the recommended Cloudflare auth layer for the admin site.

1. In Cloudflare Zero Trust, create an Access application for `admin.petaldrift.com`.
2. Add allowed identities, for example your email and studio team emails.
3. Add policies for Admin, Manager, and Support roles.
4. Add these variables in Vercel:
   - `CLOUDFLARE_AUTH_ISSUER`
   - `CLOUDFLARE_AUTH_AUDIENCE`
   - `ADMIN_EMAILS`
5. Protect `/admin` with Cloudflare Access at the DNS/application layer, then mirror role checks in the app before write actions.

## 3. Vercel storefront deployment

1. Import this GitHub repository into Vercel.
2. Set Framework Preset to **Next.js**.
3. Build command: `npm run build`.
4. Output directory: leave default (`.next`). Do **not** set output directory to `admin`.
5. Add the environment variables from `.env.example`.
6. Add the production domain `petaldrift.com`.

## 4. Vercel admin deployment

Option A, simplest: use the same Vercel project and point `admin.petaldrift.com` to `/admin` through your navigation and Cloudflare Access.

Option B, separate Vercel project:

1. Import the same repository a second time.
2. Use the same build settings.
3. Keep Vercel output directory at default (`.next`), and route users to `/admin` instead of trying to build from an `admin` folder.
4. Add `NEXT_PUBLIC_ADMIN_MODE=true`.
5. Add only `admin.petaldrift.com` as the domain.
6. Protect it with Cloudflare Access.

## 5. Cloudflare-first data layer

For production, connect this app to **Cloudflare D1** (database) and **Cloudflare R2** (media files) so your full stack stays on Cloudflare-managed services. Recommended D1 tables:

- `products`
- `product_variants`
- `collections`
- `orders`
- `order_items`
- `customers`
- `custom_order_requests`
- `reviews`
- `media_assets`
- `blog_posts`
- `coupons`
- `settings`

The admin panel already exposes management modules that map directly to these tables.
