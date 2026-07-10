import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getProducts, upsertProduct } from '@/lib/products';
import type { Product } from '@/lib/petal-data';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function validateProduct(input: Partial<Product>): Product {
  const name = input.name?.trim();
  const slug = (input.slug ?? toSlug(name ?? '')).trim();
  const price = input.price?.trim();
  const stock = input.stock?.trim();
  const material = input.material?.trim();
  const badge = input.badge?.trim();
  const category = input.category?.trim();
  const imageUrls = (input.imageUrls ?? []).filter((url): url is string => typeof url === 'string' && Boolean(url.trim())).map((url) => url.trim()).slice(0, 3);
  const rating = Number(input.rating ?? 5);

  if (!slug || !name || !price || !stock || !material || !badge || !category) {
    throw new Error('slug, name, price, stock, material, badge, and category are required.');
  }

  return {
    slug,
    name,
    price,
    stock,
    material,
    badge,
    category,
    imageUrls,
    rating: Number.isFinite(rating) && rating > 0 ? Math.min(Math.round(rating), 5) : 5
  };
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request.headers);
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('Admin access required') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request.headers);
    const payload = await request.json() as Partial<Product>;
    const product = validateProduct(payload);
    await upsertProduct(product);
    const products = await getProducts();
    return NextResponse.json({ products, saved: product });
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('Admin access required') ? 401 : message.includes('required') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
