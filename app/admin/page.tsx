import { AdminConsole } from '@/components/AdminConsole';
import { AdminPanel, SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';

export default function AdminPage() {
  return <SiteChrome><section className="px-6 pt-36"><SectionTitle eyebrow="Admin" title="Command center for Petal Drift" text="Manage catalogue, orders, customers, custom requests, Cloudflare R2 media, Cloudflare Access users, analytics, content, coupons, SEO, policies, homepage sections, and store settings." /></section><AdminConsole /><AdminPanel /></SiteChrome>;
}
