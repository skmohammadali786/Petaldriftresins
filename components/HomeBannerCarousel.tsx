'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Banner } from '@/lib/site-content';

export function HomeBannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % banners.length), 3800);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [banners.length, index]);

  if (banners.length === 0) {
    return <div className="lux-panel rounded-[2rem] p-5 text-sm text-charcoal/70">No published banners. Enable banners from the admin panel.</div>;
  }

  const banner = banners[index];

  return (
    <div className="lux-panel group relative overflow-hidden rounded-[2.2rem] p-6 text-charcoal shadow-boutique">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(216,179,106,.30),transparent_32%),linear-gradient(135deg,rgba(255,255,255,.94),rgba(250,248,245,.82))]" />
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/25 blur-3xl transition duration-700 group-hover:scale-125" />
      <div className="relative">
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-charcoal/10">
          <div key={banner.id} className="h-full origin-left animate-banner-progress rounded-full bg-gold" />
        </div>
        <h3 className="font-heading text-4xl leading-none md:text-5xl">{banner.title}</h3>
        <p className="mt-3 max-w-lg text-sm leading-7 text-charcoal/65 md:text-base">{banner.subtitle}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={banner.ctaHref} className="rounded-full bg-gold px-6 py-3 font-button text-xs uppercase tracking-[.25em] text-charcoal">{banner.ctaLabel}</Link>
          <div className="flex gap-2" aria-label="Banner selector">
            {banners.map((item, itemIndex) => (
              <button
                key={item.id}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Show banner ${itemIndex + 1}`}
                className={`h-2.5 rounded-full transition-all ${itemIndex === index ? 'w-9 bg-gold' : 'w-2.5 bg-charcoal/20 hover:bg-charcoal/45'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
