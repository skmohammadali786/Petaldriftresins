'use client';

import { useState } from 'react';

export function AdminPasswordGate() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) {
        setStatus(payload.error ?? 'Login failed.');
        return;
      }
      setStatus('Admin access granted. Reloading…');
      window.location.reload();
    } catch {
      setStatus('Could not reach admin auth endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return <section className="bg-ivory px-6 pb-28"><div className="mx-auto max-w-3xl rounded-boutique bg-white p-8 shadow-sm"><h2 className="font-heading text-4xl">Admin login required</h2><p className="mt-4 text-charcoal/70">Use Cloudflare Access admin email or enter the configured admin panel password.</p><form onSubmit={submit} className="mt-6 space-y-4"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" required className="w-full rounded-full border px-5 py-3" /><button type="submit" disabled={loading} className="rounded-full bg-charcoal px-6 py-3 text-sm text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in to admin'}</button></form>{status && <p className="mt-4 text-sm text-charcoal/70">{status}</p>}</div></section>;
}
