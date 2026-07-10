import { CategoryGrid, ProductGrid, SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: { searchParams?: Promise<{ category?: string; filter?: string }> }) {
  const products = await getProducts();
  const params = await searchParams;
  const activeCategory = params?.category || params?.filter;

  return <SiteChrome><section className="px-6 pb-10 pt-36"><SectionTitle eyebrow="Shop" title={activeCategory ? `Shop ${activeCategory}` : 'A calm boutique catalogue'} text="Use the streamlined filter bar or category quick-shop cards to get to the right resin pieces faster." /></section><ProductGrid withFilters productsList={products} activeCategory={activeCategory} /><CategoryGrid /></SiteChrome>;
}
