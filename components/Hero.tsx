'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useStore } from './StoreProvider';
import { HomeBannerCarousel } from './HomeBannerCarousel';

export function Hero() {
  const { cms, activeBanners } = useStore();

  return (
    <section className="premium-gradient relative overflow-hidden pt-28 text-charcoal">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-rose/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-[28rem] w-[28rem] rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-80 w-80 rounded-full bg-sage/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-8 px-6 pb-16 lg:grid-cols-[1.02fr_.98fr] lg:pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <p className="font-button text-xs uppercase tracking-[.45em] text-gold">{cms.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-heading text-6xl leading-[.92] text-balance md:text-8xl lg:text-9xl">{cms.hero.title}</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-charcoal/70 md:text-xl md:leading-9">{cms.hero.description}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link className="magnetic ripple rounded-full bg-gold px-8 py-4 font-button text-charcoal" href={cms.hero.primaryCtaHref}>{cms.hero.primaryCtaLabel}</Link>
            <Link className="magnetic ripple rounded-full border border-gold/40 bg-white/80 px-8 py-4 font-button text-charcoal backdrop-blur" href={cms.hero.secondaryCtaHref}>{cms.hero.secondaryCtaLabel}</Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <HomeBannerCarousel banners={activeBanners} />
          </div>
        </motion.div>

        <motion.div
          className="lux-panel relative overflow-hidden rounded-[2.5rem] p-5 md:p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <div className="relative grid min-h-[520px] place-items-center rounded-[2rem] bg-white/78 p-8 text-center shadow-inner">
            <Sparkles className="text-gold" size={44} />
            <div>
              <p className="font-button text-xs uppercase tracking-[.35em] text-gold">Handmade in India</p>
              <h2 className="mt-3 font-heading text-5xl leading-none md:text-7xl">Preserved flowers, ocean textures, and keepsakes in clear resin.</h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-charcoal/65 md:text-base">Browse ready-to-ship gifts or request a custom design with names, dates, flowers, colours, and premium packing.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
