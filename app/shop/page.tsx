import { CategoryGrid, ProductGrid, SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
export default function ShopPage() { return <SiteChrome><section className="px-6 pb-10 pt-36"><SectionTitle eyebrow="Shop" title="A calm boutique catalogue" text="Filter by price, category, color, material, occasion, gift type, availability, and sorting. Grid and list views are prepared for product data." /></section><ProductGrid withFilters /><CategoryGrid /></SiteChrome>; }
