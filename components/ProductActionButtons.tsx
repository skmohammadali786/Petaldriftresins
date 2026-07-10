'use client';

import { Heart } from 'lucide-react';
import { useStore } from './StoreProvider';

export function ProductActionButtons({ slug, name }: { slug: string; name: string }) {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const wished = isInWishlist(slug);

  return <div className="mt-8 flex items-center gap-3"><button onClick={() => addToCart(slug)} className="magnetic rounded-full bg-charcoal px-9 py-4 font-button text-white">Add to Cart</button><button onClick={() => toggleWishlist(slug)} aria-label={wished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`} className={`rounded-full border p-4 ${wished ? 'bg-rose/20 text-rose border-rose/40' : ''}`}><Heart size={18} fill={wished ? 'currentColor' : 'none'} /></button></div>;
}
