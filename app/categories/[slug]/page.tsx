import { ProductGrid, SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
import { categories } from '@/lib/petal-data';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  const products = await getProducts();
  const categoryName = category?.name ?? slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  const categoryProducts = products.filter((product) => product.category === categoryName);

  return <SiteChrome><section className="premium-gradient px-6 pb-8 pt-36"><SectionTitle eyebrow="Category" title={categoryName} text="Browse every unique product in this category." /></section><ProductGrid productsList={categoryProducts} activeCategory={categoryName} /></SiteChrome>;
}
