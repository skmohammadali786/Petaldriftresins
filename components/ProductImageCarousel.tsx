'use client';

import { useEffect, useState } from 'react';

export function ProductImageCarousel({ imageUrls, name }: { imageUrls: string[]; name: string }) {
  const images = imageUrls.slice(0, 3);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 3000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return <div className="relative min-h-[560px] overflow-hidden rounded-[3rem] bg-gradient-to-br from-rose/40 via-white to-sage/30 shadow-boutique">{images.length > 0 ? images.map((url, index) => <img key={url} src={url} alt={`${name} photo ${index + 1}`} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === active ? 'opacity-100' : 'opacity-0'}`} />) : <div className="absolute inset-0 bg-gradient-to-br from-rose/40 via-white to-sage/30" />}<div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">{images.map((url, index) => <button key={url} type="button" aria-label={`Show photo ${index + 1}`} onClick={() => setActive(index)} className={`h-2.5 w-2.5 rounded-full ${index === active ? 'bg-gold' : 'bg-white/80'}`} />)}</div></div>;
}
