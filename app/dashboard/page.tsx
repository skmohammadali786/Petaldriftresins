'use client';

import { FormEvent, useEffect, useState } from 'react';
import { SiteChrome } from '@/components/SiteChrome';
import { useStore } from '@/components/StoreProvider';

type CloudflareSession = {
  user: { name?: string; email: string } | null;
  provider: string;
  authenticated: boolean;
};

export default function DashboardPage() {
  const { account, loginOrSignup, logout } = useStore();
  const [name, setName] = useState(account?.name ?? '');
  const [email, setEmail] = useState(account?.email ?? '');
  const [cloudflareSession, setCloudflareSession] = useState<CloudflareSession | null>(null);

  useEffect(() => {
    async function loadSession() {
      const response = await fetch('/api/auth/session');
      if (!response.ok) return;
      const data = await response.json() as CloudflareSession;
      setCloudflareSession(data);
    }
    loadSession();
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email) return;
    loginOrSignup(name, email);
  };

  const signedInName = account?.name ?? cloudflareSession?.user?.name ?? 'Customer';
  const signedInEmail = account?.email ?? cloudflareSession?.user?.email;
  const hasSession = Boolean(account || cloudflareSession?.authenticated);

  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36 text-charcoal"><div className="mx-auto max-w-7xl"><p className="font-button text-xs uppercase tracking-[.45em] text-gold">Cloudflare Access</p><h1 className="mt-3 font-heading text-6xl text-charcoal">Account</h1><p className="mt-4 max-w-2xl text-charcoal/70">Customer sessions can use local checkout details while admin access is authenticated by Cloudflare Access headers when your domain is protected by Zero Trust.</p>{hasSession ? <div className="mt-8 lux-panel rounded-boutique p-8 shadow-sm"><h2 className="font-heading text-4xl text-charcoal">Welcome, {signedInName}</h2><p className="mt-3 text-charcoal/70">{signedInEmail}</p><p className="mt-3 text-sm text-charcoal/60">Cloudflare Access: {cloudflareSession?.authenticated ? 'Connected' : 'Not detected on this domain'}</p><button onClick={logout} className="mt-6 rounded-full border px-6 py-3 text-sm">Log out local session</button></div> : <form onSubmit={submit} className="mt-8 max-w-xl lux-panel rounded-boutique p-8 shadow-sm"><h2 className="font-heading text-4xl text-charcoal">Login / Signup</h2><p className="mt-3 text-charcoal/65">Use Cloudflare Access for protected admin access. Storefront account is available here for checkout convenience.</p><div className="mt-6 grid gap-4"><input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" className="rounded-full border px-5 py-3" /><input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="Email address" className="rounded-full border px-5 py-3" /></div><button type="submit" className="mt-6 rounded-full bg-gold px-6 py-3 text-sm text-charcoal">Continue</button></form>}</div></section></SiteChrome>;
}
