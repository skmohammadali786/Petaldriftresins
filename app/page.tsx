import { CustomPreview } from '@/components/CustomPreview';
import { Hero } from '@/components/Hero';
import { AdminPanel, CategoryGrid, CollectionsShowcase, ProductGrid, ServicesGrid, SocialProof, WhyChoose } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';

export default function Home() {
  return <SiteChrome loading><Hero /><ServicesGrid /><CategoryGrid /><ProductGrid /><CollectionsShowcase /><CustomPreview /><WhyChoose /><SocialProof /><AdminPanel /></SiteChrome>;
}
