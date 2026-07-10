'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/petal-data';

type EditableProduct = Product;

const emptyProduct: EditableProduct = {
  slug: '',
  name: '',
  price: '',
  rating: 5,
  stock: '',
  material: '',
  badge: ''
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function parseResponse(response: Response) {
  const payload = await response.json() as { products?: Product[]; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? 'Request failed');
  }
  return payload;
}

export function AdminConsole() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<EditableProduct>(emptyProduct);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    const response = await fetch('/api/admin/products', { cache: 'no-store' });
    const payload = await parseResponse(response);
    setProducts(payload.products ?? []);
  };

  useEffect(() => {
    refreshProducts()
      .catch((error) => setStatus((error as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const saveProduct = async () => {
    const payload = {
      ...draft,
      slug: draft.slug.trim() || toSlug(draft.name)
    };

    if (!payload.slug) {
      setStatus('Slug or product name is required.');
      return;
    }

    const url = editingSlug ? `/api/admin/products/${editingSlug}` : '/api/admin/products';
    const method = editingSlug ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await parseResponse(response);
    setProducts(data.products ?? []);
    setDraft(emptyProduct);
    setEditingSlug(null);
    setStatus('Product saved and live on storefront.');
  };

  const removeProduct = async (slug: string) => {
    const response = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' });
    const data = await parseResponse(response);
    setProducts(data.products ?? []);
    if (editingSlug === slug) {
      setDraft(emptyProduct);
      setEditingSlug(null);
    }
    setStatus('Product deleted.');
  };

  const uploadMedia = async () => {
    if (!uploadFile) {
      setStatus('Select a file first.');
      return;
    }

    const signResponse = await fetch('/api/admin/r2/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: uploadFile.name, contentType: uploadFile.type })
    });

    const signPayload = await signResponse.json() as { uploadUrl?: string; publicUrl?: string; error?: string };
    if (!signResponse.ok || !signPayload.uploadUrl || !signPayload.publicUrl) {
      throw new Error(signPayload.error ?? 'Could not generate upload URL');
    }

    const uploadResponse = await fetch(signPayload.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': uploadFile.type || 'application/octet-stream' },
      body: uploadFile
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload to Cloudflare R2 failed.');
    }

    setStatus(`Uploaded: ${signPayload.publicUrl}`);
    setUploadFile(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await saveProduct();
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return <section className="bg-ivory px-6 py-16"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]"><form onSubmit={onSubmit} className="rounded-boutique bg-white p-6 shadow-sm"><h3 className="font-heading text-4xl">{editingSlug ? 'Edit product' : 'Add product'}</h3><div className="mt-4 grid gap-3"><input value={draft.name} onChange={(event) => setDraft((state) => ({ ...state, name: event.target.value, slug: state.slug || toSlug(event.target.value) }))} placeholder="Name" className="rounded-full border px-4 py-3" required /><input value={draft.slug} onChange={(event) => setDraft((state) => ({ ...state, slug: toSlug(event.target.value) }))} placeholder="Slug" className="rounded-full border px-4 py-3" required /><div className="grid grid-cols-2 gap-3"><input value={draft.price} onChange={(event) => setDraft((state) => ({ ...state, price: event.target.value }))} placeholder="$120" className="rounded-full border px-4 py-3" required /><input value={String(draft.rating)} type="number" min={1} max={5} onChange={(event) => setDraft((state) => ({ ...state, rating: Number(event.target.value) || 5 }))} placeholder="Rating" className="rounded-full border px-4 py-3" required /></div><input value={draft.stock} onChange={(event) => setDraft((state) => ({ ...state, stock: event.target.value }))} placeholder="Stock" className="rounded-full border px-4 py-3" required /><input value={draft.material} onChange={(event) => setDraft((state) => ({ ...state, material: event.target.value }))} placeholder="Material" className="rounded-full border px-4 py-3" required /><input value={draft.badge} onChange={(event) => setDraft((state) => ({ ...state, badge: event.target.value }))} placeholder="Badge" className="rounded-full border px-4 py-3" required /></div><div className="mt-4 flex gap-3"><button type="submit" className="rounded-full bg-charcoal px-6 py-3 text-sm text-white">Save product</button>{editingSlug && <button type="button" onClick={() => { setEditingSlug(null); setDraft(emptyProduct); }} className="rounded-full border px-6 py-3 text-sm">Cancel edit</button>}</div></form><div className="rounded-boutique bg-white p-6 shadow-sm"><h3 className="font-heading text-4xl">Cloudflare R2 upload</h3><p className="mt-2 text-sm text-charcoal/60">Upload media and use the returned URL in products, gallery, or blog entries.</p><div className="mt-4 flex flex-wrap items-center gap-3"><input type="file" onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} className="text-sm" /><button type="button" onClick={() => uploadMedia().catch((error) => setStatus((error as Error).message))} className="rounded-full bg-charcoal px-6 py-3 text-sm text-white">Upload</button></div></div></div><div className="mx-auto mt-6 max-w-7xl rounded-boutique bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-4xl">Products</h3><button type="button" onClick={() => refreshProducts().catch((error) => setStatus((error as Error).message))} className="rounded-full border px-5 py-2 text-sm">Refresh</button></div>{status && <p className="mt-3 text-sm text-charcoal/70">{status}</p>}{loading ? <p className="mt-6 text-charcoal/60">Loading products…</p> : products.length === 0 ? <p className="mt-6 text-charcoal/60">No products found.</p> : <div className="mt-6 grid gap-4 md:grid-cols-2">{products.map((product) => <article key={product.slug} className="rounded-3xl border p-4"><h4 className="font-heading text-3xl">{product.name}</h4><p className="mt-1 text-sm text-charcoal/60">{product.material} · {product.price} · {product.stock}</p><div className="mt-3 flex gap-3"><button type="button" onClick={() => { setEditingSlug(product.slug); setDraft(product); window.scrollTo({ top: 260, behavior: 'smooth' }); }} className="rounded-full border px-4 py-2 text-sm">Edit</button><button type="button" onClick={() => removeProduct(product.slug).catch((error) => setStatus((error as Error).message))} className="rounded-full border px-4 py-2 text-sm text-rose">Delete</button></div></article>)}</div>}</div></section>;
}
