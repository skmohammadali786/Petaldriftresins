'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';

type CustomerSession = {
  user: { name?: string; email: string; mobile?: string } | null;
  provider: string;
  authenticated: boolean;
};

export default function DashboardPage() {
  const { account, loginOrSignup, logout, orders } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState(account?.name ?? '');
  const [email, setEmail] = useState(account?.email ?? '');
  const [mobile, setMobile] = useState(account?.mobile ?? '');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadSession() {
      const response = await fetch('/api/auth/session', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json() as CustomerSession;
      setSession(data);
      if (data.user) loginOrSignup(data.user.name ?? 'Customer', data.user.email, data.user.mobile);
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
    setStatus('Signed in successfully.');
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    setSession(null);
    setStatus('Signed out.');
  };

  const signedInName = account?.name ?? session?.user?.name ?? 'Customer';
  const signedInEmail = account?.email ?? session?.user?.email;
  const hasSession = Boolean(account || session?.authenticated);
  const customerOrders = useMemo(() => orders.filter((order) => order.accountEmail === signedInEmail), [orders, signedInEmail]);

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36 text-charcoal"><div className="mx-auto max-w-7xl"><p className="font-button text-xs uppercase tracking-[.45em] text-gold">Customer account</p><h1 className="mt-3 font-heading text-6xl text-charcoal">Account</h1><p className="mt-4 max-w-2xl text-charcoal/70">Customers sign up and log in with email, mobile number, and password. Sessions are stored in secure HTTP-only cookies and can use Cloudflare D1 when configured.</p>{status && <p className="mt-5 rounded-full bg-white px-5 py-3 text-sm text-charcoal/70 shadow-sm">{status}</p>}{hasSession ? <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="lux-panel rounded-boutique p-8 shadow-sm"><h2 className="font-heading text-4xl text-charcoal">Welcome, {signedInName}</h2><p className="mt-3 text-charcoal/70">{signedInEmail}</p>{account?.mobile && <p className="mt-1 text-charcoal/70">Mobile: {account.mobile}</p>}<p className="mt-3 text-sm text-charcoal/60">Provider: {session?.provider ?? 'Local storefront session'}</p><button onClick={signOut} className="mt-6 rounded-full border px-6 py-3 text-sm">Log out</button></div><div className="lux-panel rounded-boutique p-8 shadow-sm"><h2 className="font-heading text-4xl text-charcoal">Order history</h2>{customerOrders.length === 0 ? <p className="mt-4 text-charcoal/65">No orders yet. Items you place at checkout will appear here with tracking updates.</p> : <div className="mt-5 space-y-4">{customerOrders.map((order) => <article key={order.id} className="rounded-3xl border bg-white/70 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><strong>{order.id}</strong><span className="rounded-full bg-sage/15 px-3 py-1 text-sm text-charcoal/70">{order.status}</span></div><p className="mt-2 text-sm text-charcoal/60">{new Date(order.createdAt).toLocaleString()} · ${order.total.toFixed(2)}</p><p className="mt-2 text-sm text-charcoal/70">Courier: {order.courier} · Tracking: {order.trackingNumber}</p><ul className="mt-3 list-disc pl-5 text-sm text-charcoal/65">{order.items.map((item) => <li key={item.slug}>{item.name} × {item.quantity}</li>)}</ul></article>)}</div>}</div></div> : <form onSubmit={submit} className="mt-8 max-w-xl lux-panel rounded-boutique p-8 shadow-sm"><h2 className="font-heading text-4xl text-charcoal">{mode === 'signup' ? 'Create account' : 'Login'}</h2><p className="mt-3 text-charcoal/65">No Cloudflare login button is shown. Use your customer email, mobile number, and password.</p><div className="mt-6 grid gap-4">{mode === 'signup' && <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" className="rounded-full border px-5 py-3" />}<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="Email address" className="rounded-full border px-5 py-3" />{mode === 'signup' && <input value={mobile} onChange={(event) => setMobile(event.target.value)} required placeholder="Mobile number" className="rounded-full border px-5 py-3" />}<input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" minLength={8} placeholder="Password" className="rounded-full border px-5 py-3" /></div><div className="mt-6 flex flex-wrap gap-3"><button type="submit" className="rounded-full bg-gold px-6 py-3 text-sm text-charcoal">Continue</button><button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="rounded-full border px-6 py-3 text-sm">{mode === 'signup' ? 'Already have an account?' : 'Create new account'}</button></div></form>}</div></section></SiteChrome>;
}
