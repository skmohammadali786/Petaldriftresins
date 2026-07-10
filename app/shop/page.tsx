import { CategoryGrid, ProductGrid, SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();
  return <SiteChrome><section className="px-6 pb-10 pt-36"><SectionTitle eyebrow="Shop" title="A calm boutique catalogue" text="Filter by price, category, color, material, occasion, gift type, availability, and sorting. Grid and list views are prepared for product data." /></section><ProductGrid withFilters productsList={products} /><CategoryGrid /></SiteChrome>;
}
