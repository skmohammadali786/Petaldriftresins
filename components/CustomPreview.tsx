'use client';
import { Leaf, Upload } from 'lucide-react';
import { useState } from 'react';
import { SectionTitle } from './Sections';
import { useStore } from './StoreProvider';

export function CustomPreview() {
  const { account } = useStore();
  const [custom, setCustom] = useState({ flower: 'Rose', name: 'Amara', color: 'Dusty Rose', flakes: true, shape: 'Oval', budget: '₹2,000 - ₹5,000', timeline: '3 weeks', email: account?.email ?? '', address: '', notes: '' });
  const [status, setStatus] = useState('');

  const submitCustomOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    const details = `Flower: ${custom.flower}; Name: ${custom.name}; Color: ${custom.color}; Shape: ${custom.shape}; Budget: ${custom.budget}; Timeline: ${custom.timeline}; Gold flakes: ${custom.flakes ? 'Yes' : 'No'}; Notes: ${custom.notes || 'None'}`;
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: account?.name ?? custom.name,
        email: account?.email ?? custom.email,
        address: custom.address,
        items: [{ slug: 'custom-resin-order', name: `Custom resin keepsake for ${custom.name}`, quantity: 1, unitPrice: 0, customDetails: details }]
      })
    });
    const data = await response.json() as { order?: { id: string }; error?: string };
    if (!response.ok || !data.order) {
      setStatus(data.error ?? 'Could not submit custom order.');
      return;
    }
    setStatus(`Custom order ${data.order.id} submitted. It is now available in admin orders and your account history.`);
  };

  return <section className="bg-ivory px-4 py-16 sm:px-6 sm:py-28"><SectionTitle eyebrow="Personal atelier" title="Design a keepsake in real time" text="Choose product, flowers, names, colors, gold flakes, shape, budget, timeline, notes, and upload inspiration images." /><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2"><form data-reveal onSubmit={submitCustomOrder} className="glass rounded-[2rem] p-5 sm:rounded-[3rem] sm:p-8"><div className="mb-7 flex items-center gap-2"><span className="h-2 flex-1 rounded-full bg-gold" /><span className="h-2 flex-1 rounded-full bg-sage" /><span className="h-2 flex-1 rounded-full bg-rose" /></div><div className="grid gap-4 md:grid-cols-2">{(['flower', 'name', 'color', 'shape', 'budget', 'timeline'] as const).map((key) => <label key={key} className="text-sm font-semibold capitalize">{key}<input className="mt-2 w-full rounded-2xl border bg-white p-4" value={custom[key] as string} onChange={(event) => setCustom({ ...custom, [key]: event.target.value })} /></label>)}<label className="text-sm font-semibold">Email<input required type="email" className="mt-2 w-full rounded-2xl border bg-white p-4" value={custom.email} onChange={(event) => setCustom({ ...custom, email: event.target.value })} /></label><label className="text-sm font-semibold">Shipping address<input required className="mt-2 w-full rounded-2xl border bg-white p-4" value={custom.address} onChange={(event) => setCustom({ ...custom, address: event.target.value })} /></label><label className="flex items-center gap-3 rounded-2xl bg-white p-4 md:col-span-2"><input type="checkbox" checked={custom.flakes} onChange={(event) => setCustom({ ...custom, flakes: event.target.checked })} /> Add champagne gold flakes</label><textarea value={custom.notes} onChange={(event) => setCustom({ ...custom, notes: event.target.value })} className="min-h-32 rounded-2xl border bg-white p-4 md:col-span-2" placeholder="Notes, occasion, recipient, flower preservation details" /><label className="rounded-2xl border border-dashed bg-white p-6 text-center md:col-span-2"><Upload className="mx-auto mb-2 text-gold" />Upload inspiration images</label><button type="submit" className="rounded-full bg-charcoal px-6 py-3 text-sm text-white md:col-span-2">Submit custom order</button></div>{status && <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-charcoal/70">{status}</p>}</form><div data-reveal className="rounded-[2rem] bg-white p-5 shadow-boutique sm:rounded-[3rem] sm:p-10"><div className="mx-auto grid h-72 w-full max-w-64 place-items-center rounded-[50%] bg-gradient-to-br from-rose/50 via-white to-sage/40 shadow-glow sm:h-80"><div className="px-4 text-center"><Leaf className="mx-auto text-sage" size={44} /><h3 className="font-heading text-4xl sm:text-5xl">{custom.name}</h3><p>{custom.flower} · {custom.color} · {custom.shape}</p>{custom.flakes && <p className="mt-2 text-gold">Champagne gold flakes</p>}<p className="mt-4 text-xs uppercase tracking-[.25em] text-charcoal/50">{custom.budget} · {custom.timeline}</p></div></div></div></div></section>;
}
