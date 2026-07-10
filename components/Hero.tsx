'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
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
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-gold/25 blur-2xl" />
          <div className="relative rounded-[2rem] bg-white/78 p-6 shadow-inner md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-button text-xs uppercase tracking-[.35em] text-gold">Signature edit</p>
                <h2 className="mt-3 font-heading text-5xl leading-none md:text-6xl">Made to feel collected, not crowded.</h2>
              </div>
              <Sparkles className="shrink-0 text-gold" size={34} />
            </div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-charcoal/65 md:text-base">Explore polished resin pieces grouped by occasion, finish, and memory type so the first fold stays clean and quick to browse.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {cms.collections.slice(0, 4).map((collection) => (
                <Link key={collection.id} href={`/collections#${collection.id}`} className="group rounded-3xl border border-gold/20 bg-ivory/80 p-5 transition hover:-translate-y-1 hover:border-gold/45 hover:bg-white hover:shadow-boutique">
                  <h3 className="font-heading text-3xl">{collection.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal/60">{collection.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-button text-xs uppercase tracking-[.22em] text-gold">View edit <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
