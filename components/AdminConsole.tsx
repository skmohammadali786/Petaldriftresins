'use client';
import { motion } from 'framer-motion';
import { BarChart3, Box, FileText, Image, Lock, Megaphone, Package, Settings, ShoppingBag, TicketPercent, Users } from 'lucide-react';
import { adminModules } from '@/lib/petal-data';

const metrics = [
  ['Revenue', '$18.4k', '+18%'], ['Orders', '126', '+12%'], ['Custom Requests', '34', '+22%'], ['Media Assets', '842', '+96']
];
const workflow = ['New request', 'Design approved', 'Flowers received', 'Resin poured', 'Polishing', 'Packed', 'Shipped'];
const icons = [Package, ShoppingBag, Users, Image, Lock, TicketPercent, FileText, BarChart3, Megaphone, Settings, Box, Package];

export function AdminConsole() {
  return <section className="bg-ivory px-6 py-28"><div className="mx-auto max-w-7xl"><div data-reveal className="glass rounded-[3rem] p-6 md:p-10"><div className="grid gap-5 md:grid-cols-4">{metrics.map(([label, value, change]) => <motion.div whileHover={{ y: -6 }} key={label} className="rounded-boutique bg-white p-6 shadow-sm"><p className="text-sm text-charcoal/55">{label}</p><strong className="mt-2 block font-heading text-5xl">{value}</strong><span className="text-sm text-sage">{change}</span></motion.div>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><aside className="rounded-boutique bg-charcoal p-6 text-white"><h3 className="font-heading text-4xl">Admin controls</h3><div className="mt-6 grid gap-3">{adminModules.map((module, index) => { const Icon = icons[index] ?? Package; return <button key={module} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-left transition hover:bg-white/20"><Icon size={18} className="text-gold" />{module}</button>; })}</div></aside><div className="rounded-boutique bg-white p-6"><h3 className="font-heading text-4xl">Custom order workflow</h3><div className="mt-6 grid gap-3">{workflow.map((step, index) => <div key={step} className="flex items-center gap-4 rounded-2xl border p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-sand font-button text-sm">{index + 1}</span><div><strong>{step}</strong><p className="text-sm text-charcoal/55">Assign owner, attach R2 files, notify customer, and write audit log.</p></div></div>)}</div></div></div></div></div></section>;
}
