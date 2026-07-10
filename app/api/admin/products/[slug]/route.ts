import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { deleteProduct, getProducts, upsertProduct } from '@/lib/products';
import type { Product } from '@/lib/petal-data';

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdmin(request.headers);
    const params = await context.params;
    const payload = await request.json() as Partial<Product>;
    await upsertProduct({
      slug: params.slug,
      name: payload.name?.trim() ?? '',
      price: payload.price?.trim() ?? '',
      stock: payload.stock?.trim() ?? '',
      material: payload.material?.trim() ?? '',
      badge: payload.badge?.trim() ?? '',
      category: payload.category?.trim() ?? '',
      imageUrls: (payload.imageUrls ?? []).filter((url): url is string => typeof url === 'string' && Boolean(url.trim())).map((url) => url.trim()).slice(0, 3),
      rating: Number(payload.rating ?? 5)
    });

    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('Admin access required') ? 401 : message.includes('required') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdmin(request.headers);
    const params = await context.params;
    await deleteProduct(params.slug);
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('Admin access required') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
