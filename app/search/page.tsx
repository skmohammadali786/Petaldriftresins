'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';
import { useProducts } from '@/lib/use-products';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const { products } = useProducts();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => `${product.name} ${product.material} ${product.badge}`.toLowerCase().includes(term));
  }, [query, products]);

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36"><div className="mx-auto max-w-7xl"><h1 className="font-heading text-6xl">Search</h1><p className="mt-3 text-charcoal/65">Find products instantly and add them to cart or wishlist.</p><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product, material, or collection..." className="mt-6 w-full rounded-full border bg-white px-6 py-4 md:w-[540px]" /><div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{results.map((product) => { const wished = isInWishlist(product.slug); return <article key={product.slug} className="rounded-boutique bg-white p-6 shadow-sm"><h2 className="font-heading text-4xl">{product.name}</h2><p className="mt-2 text-sm text-charcoal/60">{product.material} · {product.price}</p><div className="mt-6 flex items-center gap-3"><button onClick={() => addToCart(product.slug)} className="rounded-full bg-charcoal px-5 py-3 font-button text-sm text-white">Add to Cart</button><button onClick={() => toggleWishlist(product.slug)} className={`rounded-full border px-4 py-3 text-sm ${wished ? 'border-rose/40 bg-rose/20 text-rose' : ''}`}>{wished ? 'Wishlisted' : 'Wishlist'}</button><Link href={`/products/${product.slug}`} className="ml-auto text-sm underline">View</Link></div></article>; })}</div>{results.length === 0 && <p className="mt-10 text-charcoal/60">No products found. Try a different keyword.</p>}</div></section></SiteChrome>;
}
