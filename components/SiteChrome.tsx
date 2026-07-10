'use client';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Globe2, Heart, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categories, navItems } from '@/lib/petal-data';
import { MotionOrnaments } from './MotionOrnaments';
import { useStore } from './StoreProvider';

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setShow(false), 1800); return () => clearTimeout(timer); }, []);
  return <AnimatePresence>{show && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-white" exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.75 }}><div className="text-center"><div className="relative mx-auto mb-8 h-28 w-28">{[...Array(12)].map((_, i) => <motion.span key={i} className="absolute left-1/2 top-1/2 h-10 w-6 origin-bottom rounded-full bg-rose/80" initial={{ opacity: 0, rotate: 0, y: 0 }} animate={{ opacity: 1, rotate: i * 30, y: -30 }} transition={{ delay: i * 0.055, duration: 0.72 }} />)}<span className="absolute inset-8 rounded-full bg-gold/75 shadow-glow" /></div><h1 className="font-heading text-5xl text-charcoal">Petal Drift</h1><p className="mt-3 text-sm uppercase tracking-[.45em] text-charcoal/60">Crafted with Love...</p><div className="mt-8 flex w-72 gap-1 overflow-hidden rounded-full bg-sand p-1">{[...Array(14)].map((_, i) => <motion.span key={i} className="h-3 flex-1 rounded-full bg-sage" initial={{ scaleY: 0.2, opacity: 0.2 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.18 + i * 0.055 }} />)}</div></div></motion.div>}</AnimatePresence>;
}

export function Navbar() {
  const { scrollY } = useScroll();
  const { cartCount, wishlistCount, account } = useStore();
  const bg = useTransform(scrollY, [0, 90], ['rgba(255,255,255,.30)', 'rgba(255,255,255,.92)']);
  return <motion.header style={{ backgroundColor: bg }} className="fixed inset-x-0 top-0 z-40 border-b border-white/60 px-4 backdrop-blur-2xl"><nav className="mx-auto flex max-w-7xl items-center justify-between py-4 text-sm"><div className="hidden gap-5 xl:flex">{navItems.slice(0, 6).map(([label, href]) => <Link key={label} className="group relative" href={href}>{label}{label === 'Shop' && <div className="invisible absolute left-0 top-8 grid w-[680px] grid-cols-3 gap-3 rounded-boutique bg-white/95 p-5 opacity-0 shadow-boutique transition group-hover:visible group-hover:opacity-100">{categories.slice(0, 9).map((category) => <span key={category} className="rounded-2xl bg-ivory p-4 font-medium"><span className="mb-3 block h-20 rounded-xl bg-gradient-to-br from-rose/45 to-sage/35" />{category}</span>)}</div>}</Link>)}</div><Link href="/" className="font-heading text-3xl font-semibold tracking-wide">Petal Drift</Link><div className="flex items-center gap-4"><Link aria-label="Search" href="/search"><Search size={18} /></Link><Link aria-label="Wishlist" href="/wishlist" className="relative"><Heart size={18} />{wishlistCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-rose text-[10px] text-white">{wishlistCount}</span>}</Link><Link aria-label="Cart" href="/cart" className="relative"><ShoppingBag size={18} />{cartCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-charcoal text-[10px] text-white">{cartCount}</span>}</Link><Link aria-label="Profile" href="/dashboard" className="relative"><User size={18} />{account && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sage" />}</Link><Globe2 size={18} /></div></nav></motion.header>;
}

export function SiteChrome({ children, loading = false }: { children: React.ReactNode; loading?: boolean }) {
  return <main className="ambient min-h-screen overflow-hidden bg-white"><>{loading && <LoadingScreen />}<MotionOrnaments /><Navbar />{children}<Footer /></></main>;
}

export function Footer() {
  const links = {
    'Quick Links': [['Shop', '/shop'], ['Custom Orders', '/custom-orders'], ['FAQ', '/faq'], ['Contact', '/contact'], ['Search', '/search']],
    Collections: [['Wedding Collection', '/collections'], ['Ocean Collection', '/collections'], ['Botanical Collection', '/collections'], ['Gift Collection', '/collections'], ['Luxury Collection', '/collections']],
    Policies: [['Shipping', '/faq'], ['Returns', '/faq'], ['Checkout', '/checkout'], ['Account', '/dashboard'], ['Admin', '/admin']]
  } as const;
  return <footer className="bg-charcoal px-6 py-16 text-white"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4"><div><h2 className="font-heading text-5xl">Petal Drift</h2><p className="mt-4 text-white/65">Luxury resin art, preserved flowers, ocean pieces, gifts, décor, jewelry, and memories.</p><div className="mt-6 flex gap-3 text-white/70"><Link href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</Link><Link href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</Link><Link href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</Link></div></div>{Object.entries(links).map(([col, items]) => <div key={col}><h3 className="font-button uppercase tracking-[.25em] text-gold">{col}</h3><div className="mt-4 grid gap-1 text-white/65">{items.map(([label, href]) => <Link key={label} className="hover:text-white" href={href}>{label}</Link>)}</div></div>)}<div><h3 className="font-button uppercase tracking-[.25em] text-gold">Contact</h3><p className="mt-4 leading-8 text-white/65">WhatsApp · Email<br />Studio appointments<br />Secure payments accepted</p><input className="mt-5 w-full rounded-full border border-white/10 bg-white/10 px-5 py-3" placeholder="Email for new blooms" /></div></div><p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-sm text-white/50">© 2026 Petal Drift. Crafted with love.</p></footer>;
}
