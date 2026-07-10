import { headers } from 'next/headers';
import { AdminConsole } from '@/components/AdminConsole';
import { SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
import { getCurrentUser } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser(await headers());
  const isAdmin = user?.role === 'admin';

  return <SiteChrome><section className="px-6 pt-36"><SectionTitle eyebrow="Admin" title="Command center for Petal Drift" text="Manage catalogue updates, Cloudflare R2 media uploads, and secure admin access through Cloudflare Access." /></section>{isAdmin ? <AdminConsole /> : <section className="bg-ivory px-6 pb-28"><div className="mx-auto max-w-3xl rounded-boutique bg-white p-8 shadow-sm"><h2 className="font-heading text-4xl">Admin login required</h2><p className="mt-4 text-charcoal/70">This page is protected by Cloudflare Access. Sign in through your Cloudflare Access policy and ensure your email is listed in ADMIN_EMAILS.</p></div></section>}</SiteChrome>;
}
