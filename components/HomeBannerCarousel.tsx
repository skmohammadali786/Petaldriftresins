'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Banner } from '@/lib/site-content';

export function HomeBannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (index >= banners.length) {
      setIndex(0);
    }
  }, [banners.length, index]);

  if (banners.length === 0) {
    return <div className="rounded-3xl border border-gold/25 bg-white/70 p-4 text-sm text-charcoal/70">No published banners. Enable banners from the admin panel.</div>;
  }

  const banner = banners[index];

  return (
    <div className="rounded-[2rem] border border-gold/25 bg-white/80 p-5 shadow-sm backdrop-blur">
      <p className="font-button text-xs uppercase tracking-[.35em] text-gold">Featured banner {index + 1}/{banners.length}</p>
      <h3 className="mt-2 font-heading text-3xl md:text-4xl">{banner.title}</h3>
      <p className="mt-2 text-charcoal/65">{banner.subtitle}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link href={banner.ctaHref} className="rounded-full bg-charcoal px-5 py-2 text-sm text-white">{banner.ctaLabel}</Link>
        <div className="flex gap-2">
          {banners.map((item, itemIndex) => (
            <button
              key={item.id}
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show banner ${itemIndex + 1}`}
              className={`h-2.5 w-7 rounded-full transition ${itemIndex === index ? 'bg-charcoal' : 'bg-charcoal/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
