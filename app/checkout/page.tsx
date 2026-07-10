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
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod');
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');

  const subtotal = useMemo(() => cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    if (!product) return sum;
    return sum + priceToNumber(product.price) * item.quantity;
  }, 0), [cart, products]);
  const shippingFee = subtotal >= 3000 ? 0 : 99;
  const total = subtotal + shippingFee;

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = [address1, address2, address3].map((line) => line.trim()).filter(Boolean).join(', ');
    if (!name || !email || !address1 || !address2 || !address3 || cart.length === 0) return;
    setStatus('Saving your order…');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, address, paymentMethod, items: cart })
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

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36"><div className="mx-auto max-w-7xl"><h1 className="font-heading text-6xl">Checkout</h1>{status && <p className="mt-4 rounded-full bg-white px-5 py-3 text-sm text-charcoal/70 shadow-sm">{status}</p>}{placed ? <div className="mt-8 rounded-boutique bg-white p-8 shadow-sm"><p className="text-lg">Order placed successfully. Thank you for shopping with Petal Drift.</p>{orderId && <p className="mt-2 text-sm text-charcoal/60">Order ID: {orderId}</p>}<Link href="/shop" className="mt-4 inline-block rounded-full bg-charcoal px-6 py-3 text-sm text-white">Continue shopping</Link></div> : cart.length === 0 ? <div className="mt-8 rounded-boutique bg-white p-8 shadow-sm"><p className="text-charcoal/70">Your cart is empty. Add products before checkout.</p><Link href="/shop" className="mt-4 inline-block rounded-full bg-charcoal px-6 py-3 text-sm text-white">Go to shop</Link></div> : <form onSubmit={submitOrder} className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-boutique bg-white p-8 shadow-sm"><h2 className="font-heading text-4xl">Shipping details</h2><div className="mt-6 grid gap-4"><input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" className="rounded-full border px-5 py-3" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email address" className="rounded-full border px-5 py-3" /><input value={address1} onChange={(event) => setAddress1(event.target.value)} required placeholder="Address line 1: house / flat / building" className="rounded-full border px-5 py-3" /><input value={address2} onChange={(event) => setAddress2(event.target.value)} required placeholder="Address line 2: street / area / landmark" className="rounded-full border px-5 py-3" /><input value={address3} onChange={(event) => setAddress3(event.target.value)} required placeholder="Address line 3: city, state, PIN code" className="rounded-full border px-5 py-3" /></div></div><aside className="h-fit rounded-boutique bg-white p-8 shadow-sm"><h3 className="font-heading text-4xl">Order summary</h3><p className="mt-6 text-charcoal/70">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p><div className="mt-3 flex items-center justify-between"><span>Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong></div><div className="mt-3 flex items-center justify-between"><span>Shipping</span><strong>{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</strong></div><div className="mt-3 flex items-center justify-between text-lg"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div><div className="mt-6 grid gap-3 rounded-3xl bg-ivory p-4"><label className="flex items-center gap-3"><input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on delivery</label><label className="flex items-center gap-3"><input type="radio" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} /> Online payment</label></div><button type="submit" className="mt-8 w-full rounded-full bg-charcoal px-6 py-3 text-sm text-white">Place Order</button></aside></form>}</div></section></SiteChrome>;
}
