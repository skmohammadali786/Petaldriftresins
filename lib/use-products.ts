'use client';

import { useEffect, useState } from 'react';
import { products as fallbackProducts, type Product } from '@/lib/petal-data';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch('/api/products', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json() as { products?: Product[] };
        if (active && payload.products?.length) {
          setProducts(payload.products);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
