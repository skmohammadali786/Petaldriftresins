'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/petal-data';
import { trackingStatuses, type OrderRecord, type TrackingStatus } from '@/lib/site-content';
import { useStore } from './StoreProvider';

type EditableProduct = Product;

const emptyProduct: EditableProduct = {
  slug: '',
  name: '',
  price: '',
  rating: 5,
  stock: '',
  material: '',
  badge: '',
  category: '',
  imageUrls: []
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
  const payload = await response.json() as { products?: Product[]; orders?: OrderRecord[]; error?: string; publicUrl?: string; key?: string };
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
  const [categoryPhotoFile, setCategoryPhotoFile] = useState<File | null>(null);
  const [newCategoryPhotoUrl, setNewCategoryPhotoUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { cms, updateHero, addBanner, updateBanner, removeBanner, addCategory, updateCategory, removeCategory } = useStore();
  const [newCategory, setNewCategory] = useState('');
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, { status: TrackingStatus; note: string; courier: string; trackingNumber: string }>>({});

  const loadProducts = async () => {
    const response = await fetch('/api/admin/products', { cache: 'no-store' });
    const payload = await parseResponse(response);
    return payload.products ?? [];
  };

  const refreshProducts = async () => {
    const nextProducts = await loadProducts();
    setProducts(nextProducts);
  };

  const loadOrders = async () => {
    const response = await fetch('/api/admin/orders', { cache: 'no-store' });
    const payload = await parseResponse(response);
    return payload.orders ?? [];
  };

  const refreshOrders = async () => {
    const nextOrders = await loadOrders();
    setOrders(nextOrders);
    setTrackingDrafts(Object.fromEntries(nextOrders.map((order) => [order.id, { status: order.status, note: '', courier: order.courier, trackingNumber: order.trackingNumber }])));
  };

  useEffect(() => {
    let active = true;

    Promise.all([loadProducts(), loadOrders()])
      .then(([nextProducts, nextOrders]) => {
        if (active) {
          setProducts(nextProducts);
          setOrders(nextOrders);
          setTrackingDrafts(Object.fromEntries(nextOrders.map((order) => [order.id, { status: order.status, note: '', courier: order.courier, trackingNumber: order.trackingNumber }])));
        }
      })
      .catch((error) => {
        if (active) {
          setStatus((error as Error).message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setOrdersLoading(false);
        }
      });

    return () => {
      active = false;
    };
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

  const updateTracking = async (orderId: string) => {
    const draft = trackingDrafts[orderId];
    if (!draft) return;
    const response = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, ...draft })
    });
    const data = await parseResponse(response);
    setOrders(data.orders ?? []);
    setStatus('Order tracking updated and visible to the customer.');
  };

  const uploadFileToR2 = async (file: File, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const response = await fetch('/api/admin/r2/upload', { method: 'POST', body: formData });
    const payload = await parseResponse(response);
    if (!payload.publicUrl) throw new Error('Upload did not return a public URL.');
    return { publicUrl: payload.publicUrl, key: payload.key };
  };

  const uploadMedia = async () => {
    if (!uploadFile) {
      setStatus('Select a file first.');
      return;
    }

    const upload = await uploadFileToR2(uploadFile, 'products');
    setDraft((state) => ({ ...state, imageUrls: [...(state.imageUrls ?? []), upload.publicUrl].slice(0, 3) }));
    setStatus(`Uploaded product photo to R2 (${upload.key}). Save the product to publish it on the storefront.`);
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

  return <section className="bg-ivory px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]"><form onSubmit={onSubmit} className="rounded-boutique bg-white p-6 shadow-sm"><h3 className="font-heading text-4xl">{editingSlug ? 'Edit product' : 'Add product'}</h3><div className="mt-4 grid gap-3"><input value={draft.name} onChange={(event) => setDraft((state) => ({ ...state, name: event.target.value, slug: state.slug || toSlug(event.target.value) }))} placeholder="Name" className="rounded-full border px-4 py-3" required /><input value={draft.slug} onChange={(event) => setDraft((state) => ({ ...state, slug: toSlug(event.target.value) }))} placeholder="Slug" className="rounded-full border px-4 py-3" required /><div className="grid grid-cols-2 gap-3"><input value={draft.price} onChange={(event) => setDraft((state) => ({ ...state, price: event.target.value }))} placeholder="₹1,499" className="rounded-full border px-4 py-3" required /><input value={String(draft.rating)} type="number" min={1} max={5} onChange={(event) => setDraft((state) => ({ ...state, rating: Number(event.target.value) || 5 }))} placeholder="Rating" className="rounded-full border px-4 py-3" required /></div><input value={draft.stock} onChange={(event) => setDraft((state) => ({ ...state, stock: event.target.value }))} placeholder="Stock" className="rounded-full border px-4 py-3" required /><input value={draft.material} onChange={(event) => setDraft((state) => ({ ...state, material: event.target.value }))} placeholder="Material" className="rounded-full border px-4 py-3" required /><input value={draft.badge} onChange={(event) => setDraft((state) => ({ ...state, badge: event.target.value }))} placeholder="Badge" className="rounded-full border px-4 py-3" required /><select value={draft.category} onChange={(event) => setDraft((state) => ({ ...state, category: event.target.value }))} className="rounded-full border px-4 py-3" required><option value="">Choose category</option>{(cms.categories ?? []).map((category) => <option key={category.slug} value={category.name}>{category.name}</option>)}</select><div className="rounded-3xl border p-3"><p className="text-sm text-charcoal/60">Product photos (max 3)</p><div className="mt-2 grid gap-2">{[0, 1, 2].map((index) => <div key={index} className="flex gap-2"><input value={(draft.imageUrls ?? [])[index] ?? ''} onChange={(event) => setDraft((state) => { const nextUrls = [...(state.imageUrls ?? [])]; nextUrls[index] = event.target.value; return { ...state, imageUrls: nextUrls.filter((url) => url.trim()) }; })} placeholder={`Photo ${index + 1} URL`} className="min-w-0 flex-1 rounded-full border px-3 py-2 text-xs" /><button type="button" onClick={() => setDraft((state) => ({ ...state, imageUrls: (state.imageUrls ?? []).filter((_, photoIndex) => photoIndex !== index) }))} className="rounded-full border px-3 py-2 text-xs text-rose">Remove</button></div>)}</div></div></div><div className="mt-4 flex gap-3"><button type="submit" className="rounded-full bg-charcoal px-6 py-3 text-sm text-white">Save product</button>{editingSlug && <button type="button" onClick={() => { setEditingSlug(null); setDraft(emptyProduct); }} className="rounded-full border px-6 py-3 text-sm">Cancel edit</button>}</div></form><div className="rounded-boutique bg-white p-6 shadow-sm"><h3 className="font-heading text-4xl">Upload product photo</h3><div className="mt-4 flex flex-wrap items-center gap-3"><input type="file" accept="image/*" disabled={(draft.imageUrls ?? []).length >= 3} onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} className="text-sm" /><button type="button" onClick={() => uploadMedia().catch((error) => setStatus((error as Error).message))} className="rounded-full bg-charcoal px-6 py-3 text-sm text-white">Upload</button></div></div></div><div className="mx-auto mt-6 max-w-7xl rounded-boutique bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-4xl">Storefront text & banners</h3><button type="button" onClick={addBanner} className="rounded-full bg-charcoal px-5 py-2 text-sm text-white">Add banner</button></div><p className="mt-2 text-sm text-charcoal/60">Change homepage hero text, buttons, and promotional banners shown on the main website.</p><div className="mt-5 grid gap-3 md:grid-cols-2"><input value={cms.hero.eyebrow} onChange={(event) => updateHero({ eyebrow: event.target.value })} className="rounded-full border px-4 py-3" /><input value={cms.hero.title} onChange={(event) => updateHero({ title: event.target.value })} className="rounded-full border px-4 py-3" /><input value={cms.hero.primaryCtaLabel} onChange={(event) => updateHero({ primaryCtaLabel: event.target.value })} className="rounded-full border px-4 py-3" /><input value={cms.hero.primaryCtaHref} onChange={(event) => updateHero({ primaryCtaHref: event.target.value })} className="rounded-full border px-4 py-3" /><input value={cms.hero.secondaryCtaLabel} onChange={(event) => updateHero({ secondaryCtaLabel: event.target.value })} className="rounded-full border px-4 py-3" /><input value={cms.hero.secondaryCtaHref} onChange={(event) => updateHero({ secondaryCtaHref: event.target.value })} className="rounded-full border px-4 py-3" /><textarea value={cms.hero.description} onChange={(event) => updateHero({ description: event.target.value })} className="min-h-24 rounded-3xl border px-4 py-3 md:col-span-2" /></div><div className="mt-6 grid gap-4">{cms.banners.map((banner) => <article key={banner.id} className="rounded-3xl border p-4"><div className="grid gap-3 md:grid-cols-5"><input value={banner.title} onChange={(event) => updateBanner({ id: banner.id, title: event.target.value })} placeholder="Banner title" className="rounded-full border px-4 py-3 md:col-span-2" /><input value={banner.subtitle} onChange={(event) => updateBanner({ id: banner.id, subtitle: event.target.value })} placeholder="Subtitle" className="rounded-full border px-4 py-3 md:col-span-2" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={banner.published} onChange={(event) => updateBanner({ id: banner.id, published: event.target.checked })} /> Published</label><input value={banner.ctaLabel} onChange={(event) => updateBanner({ id: banner.id, ctaLabel: event.target.value })} placeholder="CTA label" className="rounded-full border px-4 py-3" /><input value={banner.ctaHref} onChange={(event) => updateBanner({ id: banner.id, ctaHref: event.target.value })} placeholder="/shop" className="rounded-full border px-4 py-3" /><button type="button" onClick={() => removeBanner(banner.id)} className="rounded-full border px-4 py-3 text-sm text-rose">Remove</button></div></article>)}</div></div><div className="mx-auto mt-6 max-w-7xl rounded-boutique bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-heading text-4xl">Categories</h3><p className="mt-2 text-sm text-charcoal/60">Manage shop category cards and the desktop shop menu from the admin panel.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]"><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="New category name" className="rounded-full border px-4 py-3" /><input value={newCategoryPhotoUrl} onChange={(event) => setNewCategoryPhotoUrl(event.target.value)} placeholder="Category photo URL" className="rounded-full border px-4 py-3" /><input type="file" accept="image/*" onChange={(event) => setCategoryPhotoFile(event.target.files?.[0] ?? null)} className="text-sm" /><button type="button" onClick={async () => { try { const upload = categoryPhotoFile ? await uploadFileToR2(categoryPhotoFile, 'categories') : null; const photoUrl = upload?.publicUrl ?? newCategoryPhotoUrl; addCategory(newCategory, photoUrl); setStatus(upload ? `Category added with R2 photo (${upload.key}).` : 'Category added.'); setNewCategory(''); setNewCategoryPhotoUrl(''); setCategoryPhotoFile(null); } catch (error) { setStatus((error as Error).message); } }} className="rounded-full bg-charcoal px-5 py-3 text-sm text-white">Add category</button></div><div className="mt-5 grid gap-3 md:grid-cols-2">{(cms.categories ?? []).map((category, index) => <div key={`${category.slug}-${index}`} className="grid gap-2 rounded-3xl border p-3"><input value={category.name} onChange={(event) => updateCategory(index, { name: event.target.value })} className="min-w-0 rounded-full border px-4 py-2" /><input value={category.photoUrl} onChange={(event) => updateCategory(index, { photoUrl: event.target.value })} placeholder="Cloudflare photo URL" className="min-w-0 rounded-full border px-4 py-2" /><button type="button" onClick={() => removeCategory(index)} className="rounded-full border px-4 py-2 text-sm text-rose">Remove</button></div>)}</div></div><div className="mx-auto mt-6 max-w-7xl rounded-boutique bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-4xl">Orders</h3><button type="button" onClick={() => refreshOrders().catch((error) => setStatus((error as Error).message))} className="rounded-full border px-5 py-2 text-sm">Refresh orders</button></div>{ordersLoading ? <p className="mt-6 text-charcoal/60">Loading orders…</p> : orders.length === 0 ? <p className="mt-6 text-charcoal/60">No customer orders found.</p> : <div className="mt-6 space-y-5">{orders.map((order) => { const draft = trackingDrafts[order.id] ?? { status: order.status, note: '', courier: order.courier, trackingNumber: order.trackingNumber }; return <article key={order.id} className="rounded-3xl border p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h4 className="font-heading text-3xl">{order.id}</h4><p className="text-sm text-charcoal/60">{order.accountName} · {order.accountEmail}</p><p className="mt-1 text-sm text-charcoal/60">{new Date(order.createdAt).toLocaleString()} · ₹{order.total.toFixed(2)}</p></div><span className="rounded-full bg-sage/15 px-3 py-1 text-sm">{order.status}</span></div><p className="mt-3 text-sm text-charcoal/70">Ship to: {order.shippingAddress}</p><ul className="mt-3 list-disc pl-5 text-sm text-charcoal/65">{order.items.map((item) => <li key={item.slug}>{item.name} × {item.quantity} (₹{item.unitPrice.toFixed(2)}){item.customDetails && <span className="block text-charcoal/50">{item.customDetails}</span>}</li>)}</ul><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><select value={draft.status} onChange={(event) => setTrackingDrafts((state) => ({ ...state, [order.id]: { ...draft, status: event.target.value as TrackingStatus } }))} className="rounded-full border px-4 py-3">{trackingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><input value={draft.courier} onChange={(event) => setTrackingDrafts((state) => ({ ...state, [order.id]: { ...draft, courier: event.target.value } }))} placeholder="Courier" className="rounded-full border px-4 py-3" /><input value={draft.trackingNumber} onChange={(event) => setTrackingDrafts((state) => ({ ...state, [order.id]: { ...draft, trackingNumber: event.target.value } }))} placeholder="Tracking number" className="rounded-full border px-4 py-3" /><input value={draft.note} onChange={(event) => setTrackingDrafts((state) => ({ ...state, [order.id]: { ...draft, note: event.target.value } }))} placeholder="Customer update note" className="rounded-full border px-4 py-3" /><button type="button" onClick={() => updateTracking(order.id).catch((error) => setStatus((error as Error).message))} className="rounded-full bg-charcoal px-5 py-3 text-sm text-white">Update tracking</button></div><div className="mt-4 rounded-2xl bg-ivory p-4"><p className="text-xs uppercase tracking-[.25em] text-charcoal/50">Customer-visible timeline</p>{order.events.map((event) => <p key={event.id} className="mt-2 text-sm text-charcoal/65"><strong>{event.status}</strong> · {event.note} · {new Date(event.timestamp).toLocaleString()}</p>)}</div></article>; })}</div>}</div><div className="mx-auto mt-6 max-w-7xl rounded-boutique bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-4xl">Products</h3><button type="button" onClick={() => refreshProducts().catch((error) => setStatus((error as Error).message))} className="rounded-full border px-5 py-2 text-sm">Refresh</button></div>{status && <p className="mt-3 text-sm text-charcoal/70">{status}</p>}{loading ? <p className="mt-6 text-charcoal/60">Loading products…</p> : products.length === 0 ? <p className="mt-6 text-charcoal/60">No products found.</p> : <div className="mt-6 grid gap-4 sm:grid-cols-2">{products.map((product) => <article key={product.slug} className="rounded-3xl border p-4"><h4 className="font-heading text-3xl">{product.name}</h4><p className="mt-1 text-sm text-charcoal/60">{product.category} · {product.material} · {product.price} · {product.stock}</p><div className="mt-3 flex gap-3"><button type="button" onClick={() => { setEditingSlug(product.slug); setDraft(product); window.scrollTo({ top: 260, behavior: 'smooth' }); }} className="rounded-full border px-4 py-2 text-sm">Edit</button><button type="button" onClick={() => removeProduct(product.slug).catch((error) => setStatus((error as Error).message))} className="rounded-full border px-4 py-2 text-sm text-rose">Delete</button></div></article>)}</div>}</div></section>;
}
