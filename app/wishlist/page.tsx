'use client';

import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';
import { products } from '@/lib/petal-data';

export default function WishlistPage() {
  const { wishlist, addToCart, toggleWishlist } = useStore();
  const items = products.filter((product) => wishlist.includes(product.slug));

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36"><div className="mx-auto max-w-7xl"><h1 className="font-heading text-6xl">Wishlist</h1><p className="mt-3 text-charcoal/65">Save products and move them to cart when ready.</p>{items.length === 0 ? <div className="mt-10 rounded-boutique bg-white p-8 shadow-sm"><p className="text-charcoal/70">Your wishlist is empty.</p><Link href="/shop" className="mt-4 inline-block rounded-full bg-charcoal px-6 py-3 text-sm text-white">Explore shop</Link></div> : <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((product) => <article key={product.slug} className="rounded-boutique bg-white p-6 shadow-sm"><h2 className="font-heading text-4xl">{product.name}</h2><p className="mt-2 text-sm text-charcoal/60">{product.material} · {product.price}</p><div className="mt-6 flex items-center gap-3"><button onClick={() => addToCart(product.slug)} className="rounded-full bg-charcoal px-5 py-3 font-button text-sm text-white">Add to Cart</button><button onClick={() => toggleWishlist(product.slug)} className="rounded-full border px-4 py-3 text-sm">Remove</button><Link href={`/products/${product.slug}`} className="ml-auto text-sm underline">View</Link></div></article>)}</div>}</div></section></SiteChrome>;
}
