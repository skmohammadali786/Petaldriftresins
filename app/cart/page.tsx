'use client';

import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';
import { products } from '@/lib/petal-data';

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9.]/g, '')) || 0;
}

export default function CartPage() {
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useStore();
  const items = cart.map((item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const subtotal = items.reduce((sum, item) => sum + priceToNumber(item.price) * item.quantity, 0);

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36"><div className="mx-auto max-w-7xl"><h1 className="font-heading text-6xl">Cart</h1><p className="mt-3 text-charcoal/65">Review items and continue to secure checkout.</p>{items.length === 0 ? <div className="mt-10 rounded-boutique bg-white p-8 shadow-sm"><p className="text-charcoal/70">Your cart is empty.</p><Link href="/shop" className="mt-4 inline-block rounded-full bg-charcoal px-6 py-3 text-sm text-white">Start shopping</Link></div> : <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-4">{items.map((item) => <article key={item.slug} className="rounded-boutique bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="font-heading text-4xl">{item.name}</h2><p className="text-sm text-charcoal/60">{item.material} · {item.price}</p></div><button onClick={() => removeFromCart(item.slug)} className="text-sm underline">Remove</button></div><div className="mt-5 flex items-center gap-3"><button onClick={() => decreaseFromCart(item.slug)} className="h-9 w-9 rounded-full border">-</button><span className="min-w-6 text-center">{item.quantity}</span><button onClick={() => addToCart(item.slug)} className="h-9 w-9 rounded-full border">+</button></div></article>)}</div><aside className="h-fit rounded-boutique bg-white p-8 shadow-sm"><h3 className="font-heading text-4xl">Order Summary</h3><div className="mt-6 flex items-center justify-between"><span className="text-charcoal/70">Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><Link href="/checkout" className="mt-8 inline-block w-full rounded-full bg-charcoal px-6 py-3 text-center text-sm text-white">Proceed to Checkout</Link></aside></div>}</div></section></SiteChrome>;
}
