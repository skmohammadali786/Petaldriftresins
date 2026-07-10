import { headers } from 'next/headers';
import { AdminConsole } from '@/components/AdminConsole';
import { AdminPasswordGate } from '@/components/AdminPasswordGate';
import { SectionTitle } from '@/components/Sections';
import { SiteChrome } from '@/components/SiteChrome';
import { getCurrentUser } from '@/lib/cloudflare';
import { hasAdminPasswordSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const requestHeaders = await headers();
  const user = await getCurrentUser(requestHeaders);
  const isAdmin = user?.role === 'admin' || hasAdminPasswordSession(requestHeaders);

  return <SiteChrome><section className="px-6 pt-36"><SectionTitle eyebrow="Admin" title="Command center for Mahi&apos;s Art" /></section>{isAdmin ? <AdminConsole /> : <AdminPasswordGate />}</SiteChrome>;
}
