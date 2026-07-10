'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';
import { useProducts } from '@/lib/use-products';

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9.]/g, '')) || 0;
}

export default function CheckoutPage() {
  const { cart, account, clearCart } = useStore();
  const { products } = useProducts();
  const [name, setName] = useState(account?.name ?? '');
  const [email, setEmail] = useState(account?.email ?? '');
  const [address, setAddress] = useState('');
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');

  const total = useMemo(() => cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    if (!product) return sum;
    return sum + priceToNumber(product.price) * item.quantity;
  }, 0), [cart, products]);

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !address || cart.length === 0) return;
    setStatus('Saving your order…');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, address, items: cart })
    });
    const data = await response.json() as { order?: { id: string }; error?: string };
    if (!response.ok || !data.order) {
      setStatus(data.error ?? 'Could not place order.');
      return;
    }
    clearCart();
    setOrderId(data.order.id);
    setStatus('');
    setPlaced(true);
  };

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36"><div className="mx-auto max-w-7xl"><h1 className="font-heading text-6xl">Checkout</h1>{status && <p className="mt-4 rounded-full bg-white px-5 py-3 text-sm text-charcoal/70 shadow-sm">{status}</p>}{placed ? <div className="mt-8 rounded-boutique bg-white p-8 shadow-sm"><p className="text-lg">Order placed successfully. Thank you for shopping with Petal Drift.</p>{orderId && <p className="mt-2 text-sm text-charcoal/60">Order ID: {orderId}</p>}<Link href="/shop" className="mt-4 inline-block rounded-full bg-charcoal px-6 py-3 text-sm text-white">Continue shopping</Link></div> : cart.length === 0 ? <div className="mt-8 rounded-boutique bg-white p-8 shadow-sm"><p className="text-charcoal/70">Your cart is empty. Add products before checkout.</p><Link href="/shop" className="mt-4 inline-block rounded-full bg-charcoal px-6 py-3 text-sm text-white">Go to shop</Link></div> : <form onSubmit={submitOrder} className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-boutique bg-white p-8 shadow-sm"><h2 className="font-heading text-4xl">Shipping details</h2><div className="mt-6 grid gap-4"><input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" className="rounded-full border px-5 py-3" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email address" className="rounded-full border px-5 py-3" /><textarea value={address} onChange={(event) => setAddress(event.target.value)} required placeholder="Shipping address" className="min-h-32 rounded-3xl border px-5 py-3" /></div></div><aside className="h-fit rounded-boutique bg-white p-8 shadow-sm"><h3 className="font-heading text-4xl">Order summary</h3><p className="mt-6 text-charcoal/70">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p><div className="mt-3 flex items-center justify-between"><span>Total</span><strong>${total.toFixed(2)}</strong></div><button type="submit" className="mt-8 w-full rounded-full bg-charcoal px-6 py-3 text-sm text-white">Place Order</button></aside></form>}</div></section></SiteChrome>;
}
