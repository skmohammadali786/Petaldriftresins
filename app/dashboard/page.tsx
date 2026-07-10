'use client';

import { FormEvent, useEffect, useState } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';
import type { OrderRecord } from '@/lib/site-content';

type CustomerSession = {
  user: { name?: string; email: string; mobile?: string } | null;
  provider: string;
  authenticated: boolean;
};

export default function DashboardPage() {
  const { account, loginOrSignup, logout } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState(account?.name ?? '');
  const [email, setEmail] = useState(account?.email ?? '');
  const [mobile, setMobile] = useState(account?.mobile ?? '');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    async function loadSession() {
      const response = await fetch('/api/auth/session', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json() as CustomerSession;
      setSession(data);
      if (data.user) {
        loginOrSignup(data.user.name ?? 'Customer', data.user.email, data.user.mobile);
        const ordersResponse = await fetch('/api/orders', { cache: 'no-store' });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json() as { orders?: OrderRecord[] };
          setOrders(ordersData.orders ?? []);
        }
      }
    }
    loadSession();
  // Runs once to hydrate the storefront account from the HTTP-only session cookie.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, password })
    });
    const data = await response.json() as CustomerSession & { error?: string };
    if (!response.ok || !data.user) {
      setStatus(data.error ?? 'Authentication failed.');
      return;
    }
    loginOrSignup(data.user.name ?? name, data.user.email, data.user.mobile ?? mobile);
    setSession(data);
    setPassword('');
    const ordersResponse = await fetch('/api/orders', { cache: 'no-store' });
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json() as { orders?: OrderRecord[] };
      setOrders(ordersData.orders ?? []);
    }
    setStatus('Signed in successfully.');
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    setSession(null);
    setOrders([]);
    setStatus('Signed out.');
  };

  const signedInName = account?.name ?? session?.user?.name ?? 'Customer';
  const signedInEmail = account?.email ?? session?.user?.email;
  const hasSession = Boolean(account || session?.authenticated);

  return <SiteChrome><section className="premium-gradient px-4 pb-16 pt-32 text-charcoal sm:px-6 sm:pb-20 sm:pt-36"><div className="mx-auto max-w-7xl"><p className="font-button text-xs uppercase tracking-[.45em] text-gold">Customer account</p><h1 className="mt-3 font-heading text-5xl text-charcoal sm:text-6xl">Account</h1>{status && <p className="mt-5 rounded-full bg-white px-5 py-3 text-sm text-charcoal/70 shadow-sm">{status}</p>}{hasSession ? <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="lux-panel rounded-[2rem] p-5 shadow-sm sm:rounded-boutique sm:p-8"><h2 className="font-heading text-4xl text-charcoal">Welcome, {signedInName}</h2><p className="mt-3 text-charcoal/70">{signedInEmail}</p>{account?.mobile && <p className="mt-1 text-charcoal/70">Mobile: {account.mobile}</p>}<p className="mt-3 text-sm text-charcoal/60">Provider: {session?.provider ?? 'Local storefront session'}</p><button onClick={signOut} className="mt-6 rounded-full border px-6 py-3 text-sm">Log out</button></div><div className="lux-panel rounded-[2rem] p-5 shadow-sm sm:rounded-boutique sm:p-8"><h2 className="font-heading text-4xl text-charcoal">Order history</h2>{orders.length === 0 ? <p className="mt-4 text-charcoal/65">No orders yet. Items you place at checkout will appear here with tracking updates.</p> : <div className="mt-5 space-y-4">{orders.map((order) => <article key={order.id} className="rounded-3xl border bg-white/70 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><strong>{order.id}</strong><span className="rounded-full bg-sage/15 px-3 py-1 text-sm text-charcoal/70">{order.status}</span></div><p className="mt-2 text-sm text-charcoal/60">{new Date(order.createdAt).toLocaleString()} · ₹{order.total.toFixed(2)}</p><p className="mt-2 text-sm text-charcoal/70">Courier: {order.courier} · Tracking: {order.trackingNumber}</p><ul className="mt-3 list-disc pl-5 text-sm text-charcoal/65">{order.items.map((item) => <li key={item.slug}>{item.name} × {item.quantity}{item.customDetails && <span className="block text-charcoal/50">{item.customDetails}</span>}</li>)}</ul><div className="mt-4 rounded-2xl bg-ivory p-4"><p className="text-xs uppercase tracking-[.25em] text-charcoal/50">Tracking timeline</p>{order.events.map((event) => <p key={event.id} className="mt-2 text-sm text-charcoal/65"><strong>{event.status}</strong> · {event.note} · {new Date(event.timestamp).toLocaleString()}</p>)}</div></article>)}</div>}</div></div> : <form onSubmit={submit} className="mt-8 max-w-xl lux-panel rounded-boutique p-8 shadow-sm"><h2 className="font-heading text-4xl text-charcoal">{mode === 'signup' ? 'Create account' : 'Login'}</h2><p className="mt-3 text-charcoal/65">Use your email, mobile number, and password to access order history and tracking.</p><div className="mt-6 grid gap-4">{mode === 'signup' && <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" className="rounded-full border px-5 py-3" />}<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="Email address" className="rounded-full border px-5 py-3" />{mode === 'signup' && <input value={mobile} onChange={(event) => setMobile(event.target.value)} required placeholder="Mobile number" className="rounded-full border px-5 py-3" />}<input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" minLength={8} placeholder="Password" className="rounded-full border px-5 py-3" /></div><div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="rounded-full bg-gold px-6 py-3 text-sm text-charcoal">Continue</button><button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="rounded-full border px-6 py-3 text-sm">{mode === 'signup' ? 'Already have an account?' : 'Create new account'}</button></div></form>}</div></section></SiteChrome>;
}
