import { d1Query, isD1Configured } from '@/lib/d1';
import { products as fallbackProducts, type Product } from '@/lib/petal-data';

type ProductRow = Product & { updated_at?: string };

let setupPromise: Promise<void> | null = null;

async function setupProductTable() {
  await d1Query(`CREATE TABLE IF NOT EXISTS products (slug TEXT PRIMARY KEY, name TEXT NOT NULL, price TEXT NOT NULL, rating INTEGER NOT NULL DEFAULT 5, stock TEXT NOT NULL, material TEXT NOT NULL, badge TEXT NOT NULL, category TEXT NOT NULL DEFAULT '', image_urls TEXT NOT NULL DEFAULT '[]', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
  await d1Query("ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT ''").catch(() => undefined);
  await d1Query("ALTER TABLE products ADD COLUMN image_urls TEXT NOT NULL DEFAULT '[]'").catch(() => undefined);
  const existing = await d1Query<{ count: number }>('SELECT COUNT(*) as count FROM products');
  const count = Number(existing[0]?.count ?? 0);

  if (count === 0) {
    for (const product of fallbackProducts) {
      await d1Query(
        'INSERT INTO products (slug, name, price, rating, stock, material, badge, category, image_urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product.slug, product.name, product.price, product.rating, product.stock, product.material, product.badge, product.category, JSON.stringify(product.imageUrls ?? [])]
      );
    }
  }
}

async function ensureProductsReady() {
  if (!setupPromise) {
    setupPromise = setupProductTable();
  }
  await setupPromise;
}

function normalizeProduct(product: ProductRow): Product {
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    rating: Number(product.rating) || 5,
    stock: product.stock,
    material: product.material,
    badge: product.badge,
    category: product.category || '',
    imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls.slice(0, 3) : JSON.parse(String((product as ProductRow & { image_urls?: string }).image_urls ?? '[]')).slice(0, 3)
  };
}

function assertValidProduct(product: Product) {
  const fields: Array<keyof Product> = ['slug', 'name', 'price', 'stock', 'material', 'badge', 'category'];
  for (const field of fields) {
    if (!product[field]?.toString().trim()) {
      throw new Error(`${field} is required.`);
    }
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!isD1Configured()) {
    return fallbackProducts;
  }

  await ensureProductsReady();
  const rows = await d1Query<ProductRow>('SELECT slug, name, price, rating, stock, material, badge, category, image_urls, updated_at FROM products ORDER BY updated_at DESC');
  return rows.map(normalizeProduct);
}

export async function upsertProduct(product: Product): Promise<void> {
  if (!isD1Configured()) {
    throw new Error('Cloudflare D1 is required to edit products from admin.');
  }

  assertValidProduct(product);
  await ensureProductsReady();
  await d1Query(
    `INSERT INTO products (slug, name, price, rating, stock, material, badge, category, image_urls, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      price = excluded.price,
      rating = excluded.rating,
      stock = excluded.stock,
      material = excluded.material,
      badge = excluded.badge,
      category = excluded.category,
      image_urls = excluded.image_urls,
      updated_at = CURRENT_TIMESTAMP`,
    [product.slug, product.name, product.price, product.rating, product.stock, product.material, product.badge, product.category, JSON.stringify(product.imageUrls ?? [])]
  );
}

export async function deleteProduct(slug: string): Promise<void> {
  if (!isD1Configured()) {
    throw new Error('Cloudflare D1 is required to edit products from admin.');
  }

  await ensureProductsReady();
  await d1Query('DELETE FROM products WHERE slug = ?', [slug]);
}
