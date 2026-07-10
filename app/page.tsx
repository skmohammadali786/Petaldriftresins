import { CustomPreview } from '@/components/CustomPreview';
import { Hero } from '@/components/Hero';
import { CategoryGrid, CollectionsShowcase, ProductGrid, ServicesGrid, SocialProof, WhyChoose } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  return <SiteChrome loading><Hero /><ServicesGrid /><CategoryGrid /><ProductGrid productsList={products} /><CollectionsShowcase /><CustomPreview /><WhyChoose /><SocialProof /></SiteChrome>;
}
