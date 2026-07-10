import type { MetadataRoute } from 'next';
import { products } from '@/lib/petal-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://petaldriftresins.com';

const publicRoutes = [
  '/',
  '/about',
  '/blog',
  '/collections',
  '/contact',
  '/custom-orders',
  '/faq',
  '/gallery',
  '/privacy-policy',
  '/reviews',
  '/search',
  '/shop'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routeEntries = publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8
  })) satisfies MetadataRoute.Sitemap;

  const productEntries = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7
  })) satisfies MetadataRoute.Sitemap;

  return [...routeEntries, ...productEntries];
}
